import express from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';
import { auth } from '../services/authMiddleware.js';

const router = express.Router();

// Rejestracja
router.post('/register', register);

// Logowanie
router.post('/login', login);

// Wylogowywanie
router.post('/logout', auth, logout);

export default router;
