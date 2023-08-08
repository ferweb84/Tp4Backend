// import ProductManager from '../dao/fileManagers/ProductManager.js';
import { Router } from "express";
import { uploader } from '../dirname.js';
import { getProducts,getProductsbyId,addProducts,updateProducts,deleteProducts} from "../controllers/products.controller.js";
//import { createProductpremium } from "../../middlewares/auth.js";
const router = Router();


router.get("/", getProducts);
router.get("/:pid", getProductsbyId);
// router.post("/",createProductpremium,uploader.array("thumbnails"),addProducts);
router.post("/",uploader.array("thumbnails"),addProducts);
// router.put("/:pid",createProductpremium,uploader.array("thumbnails"),updateProducts);
// router.delete("/:pid",createProductpremium, deleteProducts);
router.put("/:pid",uploader.array("thumbnails"),updateProducts);
router.delete("/:pid", deleteProducts);
export default router;