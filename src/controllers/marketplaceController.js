// src/controllers/marketplaceController.js

const MarketplaceItem = require('../models/marketplaceItemModel');
const { HTTP_STATUS } = require('../utils/constants');

// Create a new marketplace item
const createMarketplaceItem = async (req, res) => {
  try {
    const { itemName, description, price, sellerName, category } = req.body;

    // Validate required fields
    if (!itemName || price === undefined || !sellerName || !category) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Item name, price, seller name, and category are required',
      });
    }

    // Validate category
    if (!['buy', 'sell'].includes(category)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Category must be "buy" or "sell"',
      });
    }

    // Validate price
    if (price < 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Price cannot be negative',
      });
    }

    // Get image path if uploaded
    const image = req.file ? req.file.path : '';

    const marketplaceItem = await MarketplaceItem.create({
      itemName,
      description,
      price,
      sellerName,
      category,
      image,
      createdBy: req.user._id,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Item posted successfully',
      data: marketplaceItem,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error creating item',
      error: error.message,
    });
  }
};

// Get all items for buy
const getBuyItems = async (req, res) => {
  try {
    const buyItems = await MarketplaceItem.find({ category: 'buy' })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: buyItems.length,
      data: buyItems,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching buy items',
      error: error.message,
    });
  }
};

// Get all items for sell
const getSellItems = async (req, res) => {
  try {
    const sellItems = await MarketplaceItem.find({ category: 'sell' })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: sellItems.length,
      data: sellItems,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching sell items',
      error: error.message,
    });
  }
};

module.exports = {
  createMarketplaceItem,
  getBuyItems,
  getSellItems,
};
