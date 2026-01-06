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

    const lostItem = await LostItem.create({
      itemName,
      description,
      lostDate,
      location,
      contactNumber,
      type,
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

module.exports = {
  createLostFoundItem,
  getLostItems,
  getFoundItems,
};
