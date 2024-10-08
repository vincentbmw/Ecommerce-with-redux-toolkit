import { Router } from "express";
import tokenVerification from "../security/authentication.js";
import { buyProduct, getProductsByCategory, addToCart, getCart, addToWishlist, getWishlist, removeFromCart, getProducts, getProduct, removeFromWishlist } from "../controllers/access/shopperControl.js";
import { addProduct, updateProduct, deleteProduct, getProducts as getSellerProducts } from "../controllers/access/SellerControl.js";
import { addUser, deleteUser, getUsers, editUser } from "../controllers/access/AdminControl.js";

const authorisationRoute = Router({ mergeParams: true });

// Shopper routes
authorisationRoute.post("/buy", tokenVerification, (req, res) => buyProduct(req, res));
authorisationRoute.post("/cart/add", tokenVerification, (req, res) => addToCart(req, res));
authorisationRoute.delete("/cart/remove/:id", tokenVerification, (req, res) => removeFromCart(req, res));
authorisationRoute.post("/cart", tokenVerification, (req, res) => getCart(req, res));
authorisationRoute.delete("/wishlist/remove/:id", tokenVerification, (req, res) => removeFromWishlist(req, res));
authorisationRoute.post("/wishlist/add", tokenVerification, (req, res) => addToWishlist(req, res));
authorisationRoute.get("/category/:category", (req, res) => getProductsByCategory(req, res));
authorisationRoute.post("/wishlists", tokenVerification, (req, res) => getWishlist(req, res));
authorisationRoute.get("/products", (req, res) => getProducts(req, res));
authorisationRoute.get("/product/:id", (req, res) => getProduct(req, res));

// Seller routes
authorisationRoute.post("/product/add/:sellerId", tokenVerification, (req, res) => addProduct(req, res));
authorisationRoute.put("/product/update/:id/:sellerId", tokenVerification, (req, res) => updateProduct(req, res));
authorisationRoute.delete("/product/delete/:id/:sellerId", tokenVerification, (req, res) => deleteProduct(req, res));
authorisationRoute.get("/seller/products/:sellerId", tokenVerification, (req, res) => getSellerProducts(req, res));

// Admin routes
authorisationRoute.post("/admin/user/add", tokenVerification, (req, res) => addUser(req, res));
authorisationRoute.delete("/admin/user/delete/:userId", tokenVerification, (req, res) => deleteUser(req, res));
authorisationRoute.get("/admin/users", tokenVerification, (req, res) => getUsers(req, res));
authorisationRoute.put("/admin/edit-user/:userId", tokenVerification, (req, res) => editUser(req, res));

export default authorisationRoute;