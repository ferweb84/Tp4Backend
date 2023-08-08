import passport from 'passport';
import { getViewProducts,getProductwithitsid , getCartwithitsId,loginView,registerView,productsInformation,chatView,ticket,mailtorecovery,recoverpassword,formproducts} from '../controllers/views.controller.js';
import { Router } from "express";
// import { checkLogged,checkLogin} from '../../middlewares/auth.js';

const router = Router();

router.get("/products",passport.authenticate("jwt", { session: false }), getViewProducts)

router.get("/product/:pid",passport.authenticate("jwt",{session: false}),getProductwithitsid);

router.get("/cart/:cid",getCartwithitsId);
router.get("/cart/:cid/purchase",ticket)

router.get("/",loginView);

router.get("/register", registerView);

router.get("/formemailrecovery", mailtorecovery)
router.get("/recoverypassword/:token",recoverpassword)
router.get("/products", productsInformation);
router.get("/form-products",formproducts)
router.get(
    "/chat",
    
    chatView
  );
export default router;


