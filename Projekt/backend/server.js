//Importing required modules
import express from "express";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bodyParser from "body-parser";
import _ from 'lodash';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

//Importing middlewares
import { verifyToken } from './middlewares/verify.middleware.js';

//Importing routes
import userRoutes from './routes/user.route.js';




//Creating express app
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(bodyParser.urlencoded( { extended: true }))
app.use(cookieParser());

// Function to generate a token
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};


app.use("/auth", userRoutes);





mongoose.connect(process.env.MONGODB_URL, {  
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 45000
    })
    .then(() => {
      console.log("Connected to MongoDB database!");
      app.listen(PORT, () => {
        console.log(`HTTP server started at port ${PORT}`);
      });
    })
    .catch((error) => {
      console.log(`Connection failed, error: ${error}`);
  });