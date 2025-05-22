import {Router} from "express"
import adminRoutes from "./admin/index.js"
import authRoutes from './auth.js'
import userRoutes from './user/userRoutes.js'

const router=Router()

router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);

export default router;