import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const register = async (req, res) => {
	try {
		const user = new User(req.body);

		const searchUser = await User.findOne({ email: user.email });
		if (searchUser) {
			return res.status(400).json({ error: 'User already exists' });
		}

		await user.save();
		const token = jwt.sign(
			{
				id: user._id,
				email: user.email,
				name: user.name,
				surname: user.surname,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '24h' }
		);

		res.cookie('auth_token', token, {
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		});

		res
			.status(201)
			.json({ message: 'User successfully created', userData: user });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		// Szukanie użytkownika przez emial
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ error: 'User not found!' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ error: 'Wrong email or password!' });
		}

		const token = jwt.sign(
			{
				id: user._id,
				email: user.email,
				role: user.role,
				name: user.name,
				surname: user.surname,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '24h' }
		);
		res.cookie('auth_token', token, {
			// secure: process.env.NODE_ENV === 'production',
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		});
		res.status(200).json({ message: 'User logged in', userData: user });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const logout = async (req, res) => {
	try {
		await User.findByIdAndUpdate(req.user.id, { isOnline: false });
		res.clearCookie('auth_token');
		res.status(200).json({ message: 'User logged out' });
	} catch (error) {
		res.status(500).json({ error: 'Błąd podczas wylogowywania' });
	}
};

export { register, login, logout };
