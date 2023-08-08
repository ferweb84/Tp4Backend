import mongoose from "mongoose";
import { productService } from "../dao/services/product.service.js";
import { userService } from "../dao/services/user.service.js";
export async function getAll(req, res) {
    try {
        const productsAll = await productService.getAllproducts()
        return res.send({ status: "Success", payload: productsAll })
    } catch (error) {
        req.logger.error(`Cannot get the products with mongoose ${error}`);

        return res.status(500).send({
            status: "error",
            error: "Failed to get products",
        });
    }
}
export async function getProducts(req, res) {
    try {
        const { limit = 10, page = 1, category = null, available = null, sort = null } = req.query
        let consulta = await productService.getProductsfilterPage(page, limit, category, available, sort);

        return res.send({ status: "Success", payload: consulta });

    } catch (error) {
        req.logger.error(`Cannot get the products filtered with mongoose ${error}`);

        return res.status(500).send({
            status: "error",
            error: "Failed to make the filter of products",
        });
    }
}
export async function getProductsbyId(req, res) {
    try {

        const pid = new mongoose.Types.ObjectId(req.params.pid);


        const consultaId = await productService.getProductsbyitsId({ _id: pid });
        if (!consultaId) {

            req.logger.error(`The product with the id ${pid} does not exist`);
            return res
                .status(400)
                .send({ status: "error", error: "The product does not exist" });

        }
        return res.send({ status: "success", payload: consultaId });
    } catch (error) {
        req.logger.error(`Cannot get products with mongoose ${error}`);

        return res.status(500).send({
            status: "error",
            error: "Failed to get products",
        });
    }
}
export async function addProducts(req, res) {
    try {
        let product = req.body;


        let userVal = req.session.user;

        const filesToUpdate = req.files
        product.thumbnails = [];
        // console.log(userVal)
        // let val = await userService.findbyuserid({email:userVal.email})
        // console.log(userVal)
        // if (req.session.user.role === "premium" || req.session.user.role === "admin") {
        //     if (product.owner=== undefined) {
        //         product.owner = "admin"
        //     } else {
        //         product.owner = val.email
        //     }
           
        //     if (!createProduct || typeof createProduct === "string") {

        //         return res
        //             .status(400)
        //             .send({ status: "error", error: createProduct });
        //     }
        // } else {
        //     return res
        //         .status(401)
        //         .send({ status: "error", error: "You don't have enough permissions" });
        // }
        if (filesToUpdate) {

            filesToUpdate.forEach(files => {
                const imgUrlUpdate = `http://localhost:8080/images/${files.filename}`;

                product.thumbnails.push(imgUrlUpdate)
                
            });
        }
        console.log(product)
        const createProduct = await productService.createProduct(product);
        return res.send({ status: "success", payload: createProduct });
    } catch (error) {
        req.logger.error(`Cannot add products with mongoose ${error}`);

        return res.status(500).send({
            status: "error",
            error: "Failed to add products",
        });
    }


}
export async function updateProducts(req, res) {
    try {
        let userVal = req.session.user;
        console.log(req.user)
        let val = await userService.findbyuserid(userVal._id)
        let id= await getIdofadminoruser(val)
        console.log(id)
        const product = req.body;
        const result = await productService.updateProduct(product, id);
        if (!result) {
            req.logger.error(`The product with the id ${pid} cannot be updated`);
            return res.send({ status: "error", error: "Incomplete values" });
        }

        return res.send({ status: "product successfully updated", payload: result });
    } catch (error) {
    console.log(error)
        // req.logger.error(`Cannot update products with mongoose ${error}`);
        // return res.status(500).send({
        //     status: "error",
        //     error: "Failed to update products",
        // });
    }
}
export async function deleteProducts(req,res) {
    try {

        let userVal = req.user;
        let val = await userService.findbyuserid(userVal._id)
       let id= await getIdofadminoruser(val)
        let result = await productService.deleteProduct(id);

        if (!result) {
            req.logger.error(`The product with the id ${pid} cannot be deleted`)
            return res.status(404).send({
                status: "error",
                error: "Could not delete this product. No products founded with this ID in the database",
            });
        }
       return res.send({ status: "Product successfully eliminated", payload: result});
    } catch (error) {
      
        req.logger.error(`Cannot delete products with mongoose ${error}`);
        return res.status(500).send({
            status: "error",
            error: "Failed to delete products",
        });
    }
}

async function getIdofadminoruser(val){
    let pid=""
    if (val.role === "admin") {
        pid = new mongoose.Types.ObjectId(req.params.pid);
    } else {
        let productUser = await productService.getProductsbyitsId({ owner: val.email })
        pid = productUser._id
    }
    return pid;
}