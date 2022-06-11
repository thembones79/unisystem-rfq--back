import express from "express";
import { requireAuth } from "../../middlewares";
import { ErpxlProductRepo } from "../../repos/erpxl-product-repo";

const router = express.Router();

router.get("/erpxlproducts", async (req, res) => {
  const products = await ErpxlProductRepo.find();
  res.send(products);
});

export { router as erpxlProductListRouter };
