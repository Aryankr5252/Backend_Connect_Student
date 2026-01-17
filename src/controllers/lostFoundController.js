// src/controllers/lostFoundController.js

const LostItem = require('../models/lostItemModel');
const { HTTP_STATUS } = require('../utils/constants');

// Create a new lost or found item
const createLostFoundItem = async (req, res) => {
  try {
    const { itemName, description, lostDate, location, contactNumber, type } = req.body;

    // Validate required fields
    if (!itemName || !description || !lostDate || !contactNumber || !type) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Item name, description, lost/found date, contact number, and type are required',
      });
    }

    // Validate type
    if (type !== 'lost' && type !== 'found') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Type must be either "lost" or "found"',
      });
    }

    // Handle image upload
    let imageUrl = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400'; // default image
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const lostItem = await LostItem.create({
      itemName,
      description,
      lostDate,
      location,
      contactNumber,
      type,
      imageUrl,
      createdBy: req.user._id,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Item posted successfully',
      data: lostItem,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error creating item',
      error: error.message,
    });
  }
};

// Get all lost items
const getLostItems = async (req, res) => {
  try {
    const lostItems = await LostItem.find({ type: 'lost' })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: lostItems.length,
      data: lostItems,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching lost items',
      error: error.message,
    });
  }
};

// Get all found items
const getFoundItems = async (req, res) => {
  try {
    const foundItems = await LostItem.find({ type: 'found' })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: foundItems.length,
      data: foundItems,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching found items',
      error: error.message,
    });
  }
};

// Get user's own lost/found items
const getUserLostFoundItems = async (req, res) => {
  try {
    const userItems = await LostItem.find({ createdBy: req.user._id })
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

// Update a lost/found item
const updateLostFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await LostItem.findById(id);

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

    const updatedItem = await LostItem.findByIdAndUpdate(id, req.body, {
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

// Delete a lost/found item
const deleteLostFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await LostItem.findById(id);

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

    await LostItem.findByIdAndDelete(id);

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

// Get single lost/found item by ID
const getLostFoundItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await LostItem.findById(id)
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
  createLostFoundItem,
  getLostItems,
  getFoundItems,
  getUserLostFoundItems,
  updateLostFoundItem,
  deleteLostFoundItem,
  getLostFoundItemById,
};
