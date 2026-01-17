// src/models/lostItemModel.js

const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    lostDate: {
      type: Date,
      required: [true, 'Lost/Found date is required'],
    },
    location: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['lost', 'found'],
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400',
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

const LostItem = mongoose.model('LostItem', lostItemSchema);

module.exports = LostItem;
