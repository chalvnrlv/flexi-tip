const { Op } = require('sequelize');
const Order = require('../models/Order');
const JastipService = require('../models/JastipService');
const User = require('../models/User');

// @desc    Create order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      jastipService,
      items,
      shippingAddress,
      shippingMethod,
      pricing,
      paymentMethod,
      notes,
    } = req.body;

    // Get jastip service and jastiper
    const service = await JastipService.findByPk(jastipService);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Jastip service not found',
      });
    }

    // Calculate total weight
    const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);

    // Check if capacity is available
    if (totalWeight > service.availableCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient capacity available',
      });
    }

    const order = await Order.create({
      customerId: req.user.id,
      jastiperId: service.jastiperId,
      jastipServiceId: jastipService,
      orderNumber: 'ORD-' + Date.now() + Math.floor(Math.random() * 1000), // Check if schema requires this or auto-generates
      items,
      shippingAddress,
      shippingMethod,
      pricing,
      paymentMethod,
      notes,
    });

    // Update jastip service capacity
    service.availableCapacity -= totalWeight;
    if (service.availableCapacity <= 0) { // Changed to <= 0 for safety
      service.availableCapacity = 0;
      service.status = 'full';
    }
    await service.save();

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const whereClause = {};

    // If user is customer, show their orders
    if (req.user.role === 'user' && !req.user.isJastiper) {
      // Assuming role 'user' means customer primarily
      // But logic should probably check ID match
      whereClause.customerId = req.user.id;
    }

    // Logic from original code:
    if (req.user.role === 'user') {
      whereClause.customerId = req.user.id;
    }
    else if (req.user.isJastiper) {
      // Original logic was ambiguous: if both user and jastiper?
      // Let's assume Jastipers want to see orders they HANDLE.
      // But they can also be customers. 
      // Better logic: Show orders where user is customer OR jastiper.
      whereClause[Op.or] = [
        { customerId: req.user.id },
        { jastiperId: req.user.id }
      ];
    } else {
      // Fallback for strict customer
      whereClause.customerId = req.user.id;
    }

    if (status) whereClause.orderStatus = status;

    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'customer', attributes: ['name', 'phone', 'avatar'] },
        { model: User, as: 'jastiper', attributes: ['name', 'phone', 'avatar'] },
        { model: JastipService, as: 'jastipService', attributes: ['origin', 'destination', 'type'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      total: count,
      data: orders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'customer', attributes: ['name', 'phone', 'email', 'avatar'] },
        { model: User, as: 'jastiper', attributes: ['name', 'phone', 'email', 'avatar'] },
        { model: JastipService, as: 'jastipService' }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Make sure user is order owner or jastiper
    // Check IDs
    if (
      order.customerId !== req.user.id &&
      order.jastiperId !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this order',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Jastiper/Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Make sure user is jastiper or admin
    if (order.jastiperId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this order',
      });
    }

    order.orderStatus = status;

    // Update JSON history
    const history = order.statusHistory || [];
    history.push({
      status,
      note,
      timestamp: Date.now(),
    });
    order.statusHistory = history;

    // Explicitly mark JSON field as changed for Sequelize
    order.changed('statusHistory', true);

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentProof } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.paymentStatus = paymentStatus;
    if (paymentProof) {
      order.paymentProof = paymentProof;
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Only customer can cancel pending orders
    if (order.customerId !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    if (order.orderStatus !== 'pending' && order.orderStatus !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order at this stage',
      });
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = reason;

    // Return capacity to jastip service
    const service = await JastipService.findByPk(order.jastipServiceId);
    if (service) {
      // items is JSON array, ensure parsing if needed (Sequelize auto-parses)
      const totalWeight = (order.items || []).reduce((sum, item) => sum + (item.weight * item.quantity), 0);
      service.availableCapacity = parseFloat(service.availableCapacity) + totalWeight;
      service.status = 'active';
      await service.save();
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add rating to order
// @route   POST /api/orders/:id/rating
// @access  Private
exports.addRating = async (req, res) => {
  try {
    const { score, comment } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Only customer can rate
    if (order.customerId !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to rate this order',
      });
    }

    // Can only rate completed orders
    if (order.orderStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed orders',
      });
    }

    order.rating = {
      score,
      comment,
      createdAt: Date.now(),
    };

    // Note: rating is JSON, might need changed() call or reassign
    order.changed('rating', true);

    await order.save();

    // Update jastiper rating
    const jastiper = await User.findByPk(order.jastiperId);
    if (jastiper) {
      // Calculation using Javascript to avoid DB JSON dialect issues
      const allOrders = await Order.findAll({
        where: { jastiperId: jastiper.id },
        attributes: ['rating']
      });

      let totalScore = 0;
      let count = 0;

      allOrders.forEach(o => {
        if (o.rating && o.rating.score !== undefined) {
          totalScore += o.rating.score;
          count++;
        }
      });

      if (count > 0) {
        // Update deep JSON property in User
        const profile = jastiper.jastipProfile || {};
        profile.rating = totalScore / count;
        jastiper.jastipProfile = profile;
        jastiper.changed('jastipProfile', true);
        await jastiper.save();
      }
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
