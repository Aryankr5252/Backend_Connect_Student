// src/models/marketplaceItemModel.js

const mongoose = require('mongoose');

const marketplaceItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    sellerName: {
      type: String,
      required: [true, 'Seller name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['buy', 'sell'],
    },
    image: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MarketplaceItem = mongoose.model('MarketplaceItem', marketplaceItemSchema);

module.exports = MarketplaceItem;
