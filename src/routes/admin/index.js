import {Router} from "express"
import banner from "./banner.js"
import subAdmin from './subAdmin.js'
import promoCode from './promocode.js'

const router=Router()

router.use("/banner",banner)
router.use('/sub_admin', subAdmin)
router.use('/promo_code', promoCode)

export default router;