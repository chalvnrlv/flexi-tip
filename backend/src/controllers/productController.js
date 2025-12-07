const Product = require('../models/Product');
const JastipService = require('../models/JastipService');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { jastipService, category, status, page = 1, limit = 20 } = req.query;

    const whereClause = {};
    if (jastipService) whereClause.jastipServiceId = jastipService;
    if (category) whereClause.category = category;
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: JastipService,
          as: 'jastipService',
          attributes: ['origin', 'destination', 'jastiperId']
          // Note: jastipService.jastiper is also populated in original code.
          // In Sequelize nested include is needed if we want jastiper details inside jastipService
          // Original: .populate('jastipService', 'jastiper origin destination')
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total: count,
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: JastipService,
          as: 'jastipService'
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Jastiper only)
exports.createProduct = async (req, res) => {
  try {
    // Note: Validation of user ownership of jastipService should ideally be here or in middleware
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Ideally check ownership here too

    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id }
    });

    if (updated) {
      product = await Product.findByPk(req.params.id);
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.destroy();

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
