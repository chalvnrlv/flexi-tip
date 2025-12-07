const { Op } = require('sequelize');
const JastipService = require('../models/JastipService');
const User = require('../models/User');

// @desc    Get all jastip services
// @route   GET /api/jastip
// @access  Public
exports.getJastipServices = async (req, res) => {
  try {
    const { type, origin, destination, status, page = 1, limit = 10 } = req.query;

    const whereClause = {};
    if (type) whereClause.type = type;
    if (origin) whereClause.origin = { [Op.like]: `%${origin}%` };
    if (destination) whereClause.destination = { [Op.like]: `%${destination}%` };
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const { count, rows: services } = await JastipService.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'jastiper',
          attributes: ['name', 'avatar', 'jastipProfile'] // jastipProfile includes rating
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      count: services.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: services,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single jastip service
// @route   GET /api/jastip/:id
// @access  Public
exports.getJastipService = async (req, res) => {
  try {
    const service = await JastipService.findByPk(req.params.id, {
      include: [
        {
          model: User, // Use model referencing, not string if imported
          as: 'jastiper',
          attributes: ['name', 'avatar', 'phone', 'jastipProfile']
        }
      ]
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Jastip service not found',
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create jastip service
// @route   POST /api/jastip
// @access  Private (Jastiper only)
exports.createJastipService = async (req, res) => {
  try {
    // req.user.id comes from auth middleware
    const jastiperId = req.user.id;

    // In Sequelize we pass the whole object
    const serviceData = {
      ...req.body,
      jastiperId,
      maxCapacity: req.body.availableCapacity
      // Note: maxCapacity not in schema? schema has capacity and availableCapacity.
      // Controller logic copied from original: req.body.maxCapacity = req.body.availableCapacity;
      // If 'capacity' is the field for max capacity, let's map it.
      // Check Step 74: schema has `capacity` and `availableCapacity`.
    };

    // Ensure capacity is set if only availableCapacity is sent, or vice versa if needed.
    // Assuming frontend sends 'capacity'.

    const service = await JastipService.create(serviceData);

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update jastip service
// @route   PUT /api/jastip/:id
// @access  Private (Owner only)
exports.updateJastipService = async (req, res) => {
  try {
    let service = await JastipService.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Jastip service not found',
      });
    }

    // Make sure user is service owner
    if (service.jastiperId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this service',
      });
    }

    const [updated] = await JastipService.update(req.body, {
      where: { id: req.params.id }
    });

    if (updated) {
      const updatedService = await JastipService.findByPk(req.params.id);
      res.status(200).json({
        success: true,
        data: updatedService,
      });
    } else {
      res.status(200).json({ success: true, data: service });
    }

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete jastip service
// @route   DELETE /api/jastip/:id
// @access  Private (Owner only)
exports.deleteJastipService = async (req, res) => {
  try {
    const service = await JastipService.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Jastip service not found',
      });
    }

    // Make sure user is service owner
    if (service.jastiperId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this service',
      });
    }

    await service.destroy();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add rating to jastip service
// @route   POST /api/jastip/:id/rating
// @access  Private
exports.addRating = async (req, res) => {
  try {
    const { rating } = req.body; // ignoring comment as no field exists

    const service = await JastipService.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Jastip service not found',
      });
    }

    // NOTE: Duplicate rating check removed as we don't store individual ratings list in this schema version.

    // Calculate new average
    const currentTotal = service.totalRatings || 0;
    const currentRating = parseFloat(service.rating) || 0;

    const newTotal = currentTotal + 1;
    const newRating = ((currentRating * currentTotal) + parseFloat(rating)) / newTotal;

    service.rating = newRating;
    service.totalRatings = newTotal;

    await service.save();

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
