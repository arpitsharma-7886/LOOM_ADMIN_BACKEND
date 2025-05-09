const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');
const getMulterUploader = require('../middlewares/multer')

const upload = getMulterUploader('banner')

// Apply JWT authentication middleware to all admin routes
router.use(authenticateJWT);

// Apply role-based authorization for specific routes
router.post('/create-subadmin', authorizeRoles('admin'), adminController.createSubAdmin);
router.patch('/sub-admin/edit/:id', authorizeRoles('admin', 'sub-admin'), adminController.updateSubAdmin);
router.get('/sub-admin/:id', authorizeRoles('admin', 'sub-admin'), adminController.getSubAdminById);
router.get('/sub-admins', authorizeRoles('admin', 'sub-admin'), adminController.getAllSubAdmins);
router.delete('/sub-admin/delete/:id', authorizeRoles('admin', 'sub-admin'), adminController.deleteSubAdmin);
router.put('/sub-admin/block-unblock/:id', authorizeRoles('admin'), adminController.blockAndUnblockSubAdmin);
router.get('/get-nav-items', authorizeRoles('admin', 'sub-admin'), adminController.getNavItems);
router.post('/create-banner', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gif", maxCount: 1 },
]), authorizeRoles('admin', 'sub-admin'), adminController.createBanner);

router.get('/banners', authorizeRoles('admin', 'sub-admin'), adminController.getBanners)
router.patch('/banner/:id', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gif", maxCount: 1 },
]), authorizeRoles('admin', 'sub-admin'), adminController.updateBanner)
router.delete('/banner/:id', authorizeRoles('admin', 'sub-admin'), adminController.deleteBanner)



module.exports = router;