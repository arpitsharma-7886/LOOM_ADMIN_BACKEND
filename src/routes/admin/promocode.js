import { Router } from "express";
import * as promoCode from '../../controllers/admin/promocode.controller.js'
// import { authenticateJWT, authorizeRoles } from '../../middlewares/authMiddleware.js';

const router = Router();

// router.use(authenticateJWT);

router.post('/create', promoCode.createPromoCode)
router.put('/update/:id', promoCode.updatePromoCode);
router.get('/codes', promoCode.getPromoCodes);
router.delete('/:id', promoCode.deleteCode);
router.post('/active_inactive', promoCode.activeInactive)

export default router;