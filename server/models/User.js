const mongoose = require('mongoose');
const ROLES = require('../constants');

const UserSchema = mongoose.Schema(
  {
    login: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role_id: {
      type: String,
      default: ROLES.user,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
