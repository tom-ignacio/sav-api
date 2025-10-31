import express from "express";
import * as clothesController from "../controllers/clothesController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Public endpoint for landing
router.get('/clothes', clothesController.getAllClothes);

// Admin endpoints
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/clothes', clothesController.createClothes);
router.delete('/clothes/:id', clothesController.deleteClothes);


export default router;