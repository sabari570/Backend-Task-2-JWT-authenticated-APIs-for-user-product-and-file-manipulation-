const { Router } = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const {
  createProduct,
  fetchProducts,
  fetchProductById,
  updateProductById,
  deleteProductById,
} = require("../controllers/product-controller");

const router = Router();

// route for creating a product
router.post("/create-product", authMiddleware, createProduct);

// route for fetching the user products
router.get("/fetch-products", authMiddleware, fetchProducts);

// route for fetching a single product
router.get("/fetch-product/:id", authMiddleware, fetchProductById);

// route for updating a product
router.put("/update-product/:id", authMiddleware, updateProductById);

// route for deleting a product
router.delete("/delete-product/:id", authMiddleware, deleteProductById);

module.exports = router;
