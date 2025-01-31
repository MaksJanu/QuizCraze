import {
	getUser,
	deleteUser,
	updateUser,
	getUserStatistics,
	getUserStatisticsByQuizId,
	quizCompleted,
	getUserAchievements,
	addAchievemnt
} from '../controllers/user.controller.js';
import { auth, isRoot } from '../services/authMiddleware.js';
import express from 'express';

const router = express.Router();

//get user by id
router.get('/:userId', getUser);
//update user by id
router.put('/:userId', auth, updateUser);
//delete user by id
router.delete('/:userId', auth, deleteUser);



// Get all user statistics
router.get('/:userId/stats', auth, getUserStatistics);

// Add stats on quiz completion
router.post('/:userId/stats', auth, quizCompleted);

// Get user statistics by quizID
router.get('/:userId/stats/:quizId', auth, getUserStatisticsByQuizId);




// Get all user achievements
router.get('/:userId/achievements', auth, getUserAchievements);

// Only root can add achievements to users
router.post('/achievements', isRoot, addAchievemnt);



export default router;
