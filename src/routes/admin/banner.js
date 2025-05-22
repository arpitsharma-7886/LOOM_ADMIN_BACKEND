import { Router } from "express";
import getMulterUploader from '../../middlewares/multer.js'
import { authenticateJWT, authorizeRoles } from '../../middlewares/authMiddleware.js';
import * as bannereController from '../../controllers/admin/banner.js';

const router = Router();
const upload = getMulterUploader('banner')

router.use(authenticateJWT);

router.post('/create-banner', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gif", maxCount: 1 },
]), authorizeRoles('admin', 'sub-admin'), bannereController.createBanner);

router.get('/banners', bannereController.getBanners)

router.patch('/banner/:id', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gif", maxCount: 1 },
]), authorizeRoles('admin', 'sub-admin'), bannereController.updateBanner)

router.delete('/banner/:id', authorizeRoles('admin', 'sub-admin'), bannereController.deleteBanner)

export default router;