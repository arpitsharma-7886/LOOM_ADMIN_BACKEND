// models/NavItem.js
const mongoose = require('mongoose');

const navItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  path: { type: String, required: true },
  icon: { type: String, required: true }, 
});

module.exports = mongoose.model('NavItem', navItemSchema);
