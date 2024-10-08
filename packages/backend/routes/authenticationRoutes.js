import { Router } from "express";
import login from "../controllers/authentication/login.js";
import logout from "../controllers/authentication/logout.js";
import register from "../controllers/authentication/register.js";

const authRoute = Router();

authRoute.post("/register", (req, res) => register(req, res));
authRoute.post("/login", (req, res) => login(req, res));
authRoute.post("/logout", (req, res) => logout(req, res));

export default authRoute;
