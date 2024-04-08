const mongoose = require("mongoose");
const UserProducts = require("../models/user-products-model");

// controller for creating a product
module.exports.createProduct = async (req, res) => {
  const { name, price } = req.body;
  const userId = new mongoose.Types.ObjectId(req.userId);
  try {
    if (!name)
      throw { statusCode: 400, message: "Please enter the product name" };
    if (!price)
      throw { statusCode: 400, message: "Please enter the product price" };

    // creating a random Object id for the product
    const productId = new mongoose.Types.ObjectId();

    const newProduct = {
      _id: productId,
      name,
      price,
    };
    // Checking if their is an already existing product for that user
    let userProducts = await UserProducts.findOne({ userId });

    if (userProducts) {
      await UserProducts.updateOne(
        { userId },
        {
          $push: { products: newProduct },
        }
      );
    } else {
      await UserProducts.create({
        userId,
        products: [newProduct],
      });
    }
    return res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    console.log("Error while creating a product: ", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

// controller for fetching the products
module.exports.fetchProducts = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);
  try {
    let userProducts = await UserProducts.findOne({ userId });
    if (!userProducts)
      throw { statusCode: 404, message: "This user has not created a product" };
    return res.status(200).json({ products: userProducts.products });
  } catch (err) {
    console.log("Error while fetching the products: ", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

// controller for fetching a single product by productId
module.exports.fetchProductById = async (req, res) => {
  const userId = req.userId;
  const productId = req.params.id;
  try {
    const userProducts = await UserProducts.findOne({ userId });
    if (!userProducts)
      throw { statusCode: 404, message: "This user has not created a product" };

    let product = userProducts.products.find(
      (product) => product._id.toString() === productId
    );
    if (!product) throw { statusCode: 404, message: "Product not found" };

    return res.status(200).json({ product });
  } catch (err) {
    console.log("Error while fetching the product by id: ", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

// controller for updating a single product by productId
module.exports.updateProductById = async (req, res) => {
  const userId = req.userId;
  const productId = req.params.id;
  const { name, price } = req.body;
  try {
    if (!name)
      throw { statusCode: 400, message: "Please enter the product name" };
    if (!price)
      throw { statusCode: 400, message: "Please enter the product price" };

    const userProducts = await UserProducts.findOne({ userId });
    if (!userProducts)
      throw { statusCode: 404, message: "This user has not created a product" };

    const updatedUserProduct = await UserProducts.findOneAndUpdate(
      {
        userId,
        "products._id": productId,
      },
      {
        $set: {
          "products.$.name": name,
          "products.$.price": price,
        },
      },
      {
        new: true,
      }
    );
    if (!updatedUserProduct)
      throw { statusCode: 404, message: "Product not found" };

    const product = updatedUserProduct.products.find(
      (product) => product._id == productId
    );
    return res
      .status(200)
      .json({ message: "Product updated successfully", product });
  } catch (err) {
    console.log("Error while updating the product by id: ", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

// controller for deleting a product by productId
module.exports.deleteProductById = async (req, res) => {
  const userId = req.userId;
  const productId = req.params.id;
  try {
    const userProducts = await UserProducts.findOne({ userId });
    if (!userProducts)
      throw { statusCode: 404, message: "This user has not created a product" };

    const deletedUserProduct = await UserProducts.findOneAndUpdate(
      { userId, "products._id": productId },
      {
        $pull: {
          products: {
            _id: productId,
          },
        },
      },
      {
        new: true,
      }
    );

    if (!deletedUserProduct)
      throw { statusCode: 404, message: "Product not found" };

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.log("Error while deleting the product by id: ", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
