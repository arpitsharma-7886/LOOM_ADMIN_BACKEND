// routes/seedNavItems.js
import express from 'express';
const router = express.Router();
import NavItem from '../models/navItems.js';

router.post('/seed-nav-items', async (req, res) => {
  const items = [
    { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
    { label: 'Orders', path: '/orders', icon: 'ShoppingCart' },
    { label: 'Users', path: '/users', icon: 'Users' },
    { label: 'Sub-Admins', path: '/sub-admins', icon: 'RiAdminLine' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ];

  try {
    await NavItem.deleteMany({});
    await NavItem.insertMany(items);
    res.status(200).json({ message: 'Nav items seeded' });
  } catch (err) {
    res.status(500).json({ message: 'Error seeding nav items' });
  }
});


router.get('/nav-items', async (req, res) => {
    try {
      const items = await NavItem.find();
      res.status(200).json({ navItems: items });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch nav items' });
    }
});

export default router;
