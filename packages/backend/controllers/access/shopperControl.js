import dotenv from "dotenv";
import db from "../../database/db.js";

dotenv.config();

const handleServerError = (res, error) => {
  console.error("Server error:", error);
  return res.status(503).json({
    error: "Internal server error",
    message: error.message,
    status: 503,
    ok: false
  });
};

export const addToCart = async (req, res) => {
  try {
    console.log(req.body);
    
    if (typeof req.body.id_product !== 'number' || typeof req.body.qty !== 'number' || req.body.qty <= 0) {
      return res.status(400).json({
        error: "Invalid input",
        message: "ProductId must be a number and quantity must be a positive number",
        status: 400,
        ok: false
      });
    }

    let carts;
    try {
      carts = db.getCarts();
    } catch (error) {
      console.error("Error reading carts:", error);
      carts = [];
    }

    const products = db.getProducts();

    const product = products.find(p => p.id === req.body.id_product);
    if (!product) {
      return res.status(404).json({
        error: "Product not found",
        message: "The requested product does not exist",
        status: 404,
        ok: false
      });
    }
    if (product.quantity < req.body.qty) {
      return res.status(400).json({
        error: "Insufficient stock",
        message: "The requested quantity is not available",
        status: 400,
        ok: false
      });
    }
    const existingCartItem = carts.find(item => item.userId === req.body.userId && item.productId === req.body.id_product);
    if (existingCartItem) {
      existingCartItem.quantity += req.body.qty;
    } else {
      const newCartItem = {
        id: carts.length + 1,
        userId: req.body.userId,
        productId: req.body.id_product,
        quantity: req.body.qty
      };
      carts.push(newCartItem);
    }
    db.saveCarts(carts);
    return res.status(204).json({
      message: "Product is added to cart",
      status: 200,
      ok: true
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    let carts = db.getCarts();
    carts = carts.filter(item => item.id !== parseInt(id) || item.userId !== req.body.userId);
    db.saveCarts(carts);
    
    return res.status(200).json({
      message: "Item removed from cart",
      status: 200,
      ok: true
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

export const getCart = async (req, res) => {
  try {
    const carts = db.getCarts();
    const products = db.getProducts();
    const userCart = carts.filter(item => item.userId === req.body.userId);
    const cartWithProducts = userCart.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      if (product) {
        const totalPrice = product.price * cartItem.quantity;
        return {
          ...cartItem,
          product: { 
            id: product.id, 
            title: product.title, 
            price: product.price, 
            image: product.image, 
            quantity: product.quantity 
          },
          totalPrice: totalPrice
        };
      }
      return cartItem;
    });
    
    return res.status(200).json({
      cart: cartWithProducts,
      status: 200,
      ok: true
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlists = db.getWishlists();
    const newWishlistItem = {
      id: wishlists.length + 1,
      userId: req.body.userId,
      productId
    };
    wishlists.push(newWishlistItem);
    db.saveWishlists(wishlists);
    
    return res.status(201).json({
      message: "Item added to wishlist",
      wishlistItem: newWishlistItem,
      status: 201,
      ok: true
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    let wishlists = db.getWishlists();
    const indexToRemove = wishlists.findIndex(item => item.productId === parseInt(id) && item.userId === req.body.userId);
    
    if (indexToRemove !== -1) {
      wishlists.splice(indexToRemove, 1);
      wishlists = wishlists.map((item, index) => ({
        ...item,
        id: index + 1
      }));
      db.saveWishlists(wishlists);
      
      return res.status(200).json({
        message: "Item removed from wishlist",
        status: 200,
        ok: true
      });
    } else {
      return res.status(404).json({
        error: "Item not found",
        message: "The specified item was not found in the user's wishlist",
        status: 404,
        ok: false
      });
    }
  } catch (error) {
    return handleServerError(res, error);
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlists = db.getWishlists();
    const products = db.getProducts();
    const userWishlist = wishlists.filter(item => item.userId === req.body.userId);
    const wishlistWithProducts = userWishlist.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product: product ? { id: product.id, title: product.title, price: product.price, image: product.image } : null
      };
    });
    
    return res.status(200).json({
      wishlist: wishlistWithProducts,
      status: 200,
      ok: true
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

export const buyProduct = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const products = db.getProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({
        error: "Product not found",
        message: "The requested product does not exist",
        status: 404,
        ok: false
      });
    }

    const product = products[productIndex];
    if (product.quantity < quantity) {
      return res.status(400).json({
        error: "Insufficient stock",
        message: "The requested quantity is not available",
        status: 400,
        ok: false
      });
    }

    product.quantity -= quantity;
    if (product.quantity <= 0 || product.quantity === undefined) {
      product.quantity = 0;
    }

    db.saveProducts(products);

    return res.status(200).json({
      message: "Product purchased successfully",
      product: product,
      status: 200,
      ok: true
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};


export const getProducts = async (req, res) => {
  try {
    const products = db.getProducts();
    return res.status(200).json({
      products: products,
      status: 200,
      ok: true
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const products = db.getProducts();
    const product = products.find(p => p.id === parseInt(id));
    
    if (!product) {
      return res.status(404).json({
        error: "Product not found",
        message: "The requested product does not exist",
        status: 404,
        ok: false
      });
    }

    return res.status(200).json({
      product: product,
      status: 200,
      ok: true
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = db.getProducts();
    const filteredProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    
    if (filteredProducts.length === 0) {
      return res.status(404).json({
        error: "No products found",
        message: "No products found in the specified category",
        status: 404,
        ok: false
      });
    }

    return res.status(200).json({
      products: filteredProducts,
      status: 200,
      ok: true
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};
