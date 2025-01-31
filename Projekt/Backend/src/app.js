import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

// Import routes
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import quizRouter from './routes/quiz.route.js';
import rankingRouter from './routes/ranking.route.js';

// Initialize express
const app = express();

// Configuration of body-parser
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Auth routes
app.use('/api/auth', authRouter);
// User routes
app.use('/api/user', userRouter);
// Quiz routes
app.use('/api/quiz', quizRouter);
// Ranking routes
app.use('/api/ranking', rankingRouter);

app.use('/', (req, res) => {
    res.status(200).send('Quiz app API');
});

mongoose
    .connect(
        'mongodb+srv://admin:oVxXoyYUn56jTFXi@cluster.0yq6a.mongodb.net/?retryWrites=true&w=majority&appName=cluster'
    )
    .then(() => {
        console.log('Connected to MongoDB');
  
        app.listen(4000, () => {
            console.log('App is running on port 4000');
        });

    })
    .catch((err) => console.error('MongoDB connection error:', err));

export default app;