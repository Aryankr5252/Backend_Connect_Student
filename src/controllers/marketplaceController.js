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

    // Handle image upload
    let imageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'; // default image
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const marketplaceItem = await MarketplaceItem.create({
      itemName,
      description,
      price,
      sellerName,
      category,
      imageUrl,
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

// Get user's own marketplace items
const getUserMarketplaceItems = async (req, res) => {
  try {
    const userItems = await MarketplaceItem.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: userItems.length,
      data: userItems,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching user items',
      error: error.message,
    });
  }
};

// Update a marketplace item
const updateMarketplaceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MarketplaceItem.findById(id);

    if (!item) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Check if user owns the item
    if (item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'You do not have permission to update this item',
      });
    }

    const updatedItem = await MarketplaceItem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error updating item',
      error: error.message,
    });
  }
};

// Delete a marketplace item
const deleteMarketplaceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MarketplaceItem.findById(id);

    if (!item) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Check if user owns the item
    if (item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'You do not have permission to delete this item',
      });
    }

    await MarketplaceItem.findByIdAndDelete(id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error deleting item',
      error: error.message,
    });
  }
};

// Get single marketplace item by ID
const getMarketplaceItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await MarketplaceItem.findById(id)
      .populate('createdBy', 'name email');
    
    if (!item) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching item',
      error: error.message,
    });
  }
};

module.exports = {
  createMarketplaceItem,
  getBuyItems,
  getSellItems,
  getUserMarketplaceItems,
  updateMarketplaceItem,
  deleteMarketplaceItem,
  getMarketplaceItemById,
};
