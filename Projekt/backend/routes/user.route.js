import express from "express";
import { register, login, logout,}  from "../controllers/user.controller.js";
import upload from '../middlewares/uploadFile.middleware.js';
import { verifyToken } from "../middlewares/verify.middleware.js";

const router = express.Router()

//Post methods
router.post("/register", upload.single('image'), register);
router.post("/login", login)

//Get methods
router.get("/logout", verifyToken, logout)



export default router;