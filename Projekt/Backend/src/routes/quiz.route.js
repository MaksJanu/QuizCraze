import {
	getAllQuizzes,
	getSingleQuiz,
	deleteQuiz,
	createQuiz,
	updateQuiz,
	getAllQuizQuestions,
	addQuizQuestion,
	updateQuizQuestion,
	deleteQuizQuestion,
	addQuizComment,
	deleteQuizComment

} from '../controllers/quiz.controller.js';
import { auth } from '../services/authMiddleware.js';
import express from 'express';

const router = express.Router();




// ###### QUIZ #######

// Get all quizzes
router.get('/all', getAllQuizzes);

// Get single quiz
router.get('/:quizId', getSingleQuiz);

// Create quiz
router.post('/', auth, createQuiz);

// Update quiz
router.patch('/:quizId', auth, updateQuiz);

// Delete quiz
router.delete('/:quizId', auth, deleteQuiz);





//  ###### QUESTIONS ######

// Get all questions related to quiz
router.get('/:quizId/questions', getAllQuizQuestions);

// Add quesiton
router.post('/:quizId/questions', auth ,addQuizQuestion);

// Update question
router.patch('/:quizId/questions/:questionId', auth, updateQuizQuestion)

// Delete question
router.delete('/:quizId/questions/:questionId', auth, deleteQuizQuestion)




// ###### COMMENTS ######

// Add new comment
router.post('/:quizId/comment', auth, addQuizComment)

// Remove comment
router.delete('/:quizId/comment/:commentId', auth, deleteQuizComment)


export default router;
