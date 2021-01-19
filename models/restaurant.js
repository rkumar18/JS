const { string } = require("joi");
const mongoose = require("mongoose");
const Restaurant = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
    },
    restaurantPhoto: {
      type: String,
      required: false,
    },
    GSTnumber: {
      type: String,
      required: true,
    },
    restaurantEmail: {
      type: String,
      required: true,
    },
    restaurantPhone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const restaurant = mongoose.model("restaurant", Restaurant);
module.exports = restaurant;
