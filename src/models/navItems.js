// models/NavItem.js
import mongoose from 'mongoose';

const navItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  path: { type: String, required: true },
  icon: { type: String, required: true }, 
});

const NavItems = mongoose.model('NavItem', navItemSchema);

export default NavItems;
