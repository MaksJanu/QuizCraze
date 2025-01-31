import User from '../models/User.js';



const buildRanking = (users, amount) => {
	const rankedUsers = users.map((user) => {
		if (user.stats.length > 0) {
			const totalPercentage = user.stats.reduce(
				(sum, stat) => sum + stat.correctAnswersPercentage,
				0
			);
			user.averageCorrectAnswersPercentage =
				totalPercentage / user.stats.length;

			const totalCorrectAnswers = user.stats.reduce(
				(sum, stat) => sum + stat.correctAnswers,
				0
			);
			user.totalCorrectAnswers = totalCorrectAnswers;

			const averageScore = user.stats.reduce(
				(acc, stat) => acc + stat.score,
				0
			);
			user.averageScore = averageScore / user.stats.length;
		} else {
			user.averageCorrectAnswersPercentage = 0;
			user.totalCorrectAnswers = 0;
			user.averageScore = 0;
		}
		return user;
	});

	rankedUsers.sort((a, b) => {
		if (
			b.averageCorrectAnswersPercentage !== a.averageCorrectAnswersPercentage
		) {
			return (
				b.averageCorrectAnswersPercentage - a.averageCorrectAnswersPercentage
			);
		}
		if (b.totalCorrectAnswers !== a.totalCorrectAnswers) {
			return b.totalCorrectAnswers - a.totalCorrectAnswers;
		}
		return b.averageScore - a.averageScore;
	});

	return rankedUsers.slice(0, amount).reduce((acc, user, index) => {
		acc[index + 1] = user;
		return acc;
	}, {});
};


const getGlobalRanking = async (req, res) => {
	const { amount } = req.params;
	try {
		const users = await User.find({}).populate('stats');
		const ranking = buildRanking(users, amount);
		res.status(200).json(ranking);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};


const getRankingByQuiz = async (req, res) => {
	const { amount, quizId } = req.params;
	try {
		const users = (await User.find({}).populate('stats')).filter(
			(user) => user.stats.quizId === quizId
		);
		const ranking = buildRanking(users, amount);
		res.status(200).json(ranking);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};



export { getGlobalRanking, getRankingByQuiz };