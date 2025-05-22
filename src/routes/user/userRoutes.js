import { Router } from "express";
import * as promoCode from '../../controllers/admin/promocode.controller.js'
import * as bannereController from '../../controllers/admin/banner.js';


const router = Router();

router.post('/apply_cupon', promoCode.applyCode)
router.get('/codes', promoCode.getPromoCodes);
router.get('/banners', bannereController.getBanners)

export default router;