import dotenv from "dotenv";
import db from "../../database/db.js";

dotenv.config();

export const addProduct = async (req, res) => {
    try {
        const { title, price, description, category, image, quantity } = req.body;
        const { sellerId } = req.params;

        if (!title || !price || !category || !sellerId) {
            return res.status(400).json({
                error: "Missing required fields",
                message: "Title, price, category, and sellerId are required",
                status: 400,
                ok: false
            });
        }

        const products = db.getProducts();

        const newProduct = {
            id: products.length + 1,
            sellerId: parseInt(sellerId),
            title,
            price: parseFloat(price),
            description,
            category,
            image,
            rating: { rate: 0, count: 0 },
            quantity: parseInt(quantity)
        };

        products.push(newProduct);

        db.saveProducts(products);

        return res.status(201).json({
            message: "Product added successfully",
            product: newProduct,
            status: 201,
            ok: true
        });
    } catch (error) {
        return res.status(503).json({
            error: "Internal server error",
            message: error.message,
            status: 503,
            ok: false
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id, sellerId } = req.params;
        const { title, price, description, category, image, quantity } = req.body;

        const products = db.getProducts();
        const productIndex = products.findIndex((product) => product.id == id && product.sellerId == sellerId);

        if (productIndex === -1) {
            return res.status(404).json({
                error: "Product not found",
                message: "The product you are trying to update does not exist or you do not own it",
                status: 404,
                ok: false
            });
        }

        const updatedProduct = {
            ...products[productIndex],
            title: title || products[productIndex].title,
            price: price !== undefined ? parseFloat(price) : products[productIndex].price,
            description: description || products[productIndex].description,
            category: category || products[productIndex].category,
            image: image || products[productIndex].image,
            quantity: quantity !== undefined ? parseInt(quantity) : products[productIndex].quantity
        };

        products[productIndex] = updatedProduct;

        db.saveProducts(products);

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
            status: 200,
            ok: true
        });
    } catch (error) {
        return res.status(503).json({
            error: "Internal server error",
            message: error.message,
            status: 503,
            ok: false
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id, sellerId } = req.params;

        const products = db.getProducts();
        const productIndex = products.findIndex((product) => product.id == id && product.sellerId == sellerId);

        if (productIndex === -1) {
            return res.status(404).json({
                error: "Product not found",
                message: "The product you are trying to delete does not exist or you do not own it",
                status: 404,
                ok: false
            });
        }

        products.splice(productIndex, 1);

        db.saveProducts(products);

        return res.status(200).json({
            message: "Product deleted successfully",
            status: 200,
            ok: true
        });
    } catch (error) {
        return res.status(503).json({
            error: "Internal server error",
            message: error.message,
            status: 503,
            ok: false
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const products = db.getProducts().filter((product) => product.sellerId == sellerId);

        return res.status(200).json({
            message: "Products fetched successfully",
            products,
            status: 200,
            ok: true
        });
    } catch (error) {
        return res.status(503).json({
            error: "Internal server error",
            message: error.message,
            status: 503,
            ok: false
        });
    }
};
