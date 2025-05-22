import express from 'express';
import * as subAdminController from '../../controllers/admin/subAdmin.js';
import { authenticateJWT, authorizeRoles } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Apply JWT authentication middleware to all admin routes
router.use(authenticateJWT);

// Apply role-based authorization for specific routes
router.post('/create-subadmin', authorizeRoles('admin'), subAdminController.createSubAdmin);
router.patch('/sub-admin/edit/:id', authorizeRoles('admin', 'sub-admin'), subAdminController.updateSubAdmin);
router.get('/sub-admin/:id', authorizeRoles('admin', 'sub-admin'), subAdminController.getSubAdminById);
router.get('/sub-admins', authorizeRoles('admin', 'sub-admin'), subAdminController.getAllSubAdmins);
router.delete('/sub-admin/delete/:id', authorizeRoles('admin', 'sub-admin'), subAdminController.deleteSubAdmin);
router.put('/sub-admin/block-unblock/:id', authorizeRoles('admin'), subAdminController.blockAndUnblockSubAdmin);
router.get('/get-nav-items', authorizeRoles('admin', 'sub-admin'), subAdminController.getNavItems);


export default router;