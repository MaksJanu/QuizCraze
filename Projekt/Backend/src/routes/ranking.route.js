import express from 'express';
import {
	getGlobalRanking,
	getRankingByQuiz,
} from '../controllers/ranking.controller.js';


const router = express.Router();


// Get routes
router.get('/global/:amount', getGlobalRanking);
router.get('/:quizId/:amount', getRankingByQuiz);



export default router;
