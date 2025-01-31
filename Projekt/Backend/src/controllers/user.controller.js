import User from '../models/User.js';
import Verification from '../models/Verification.js';
import Quiz from '../models/Quiz.js';
import Stats from '../models/Stats.js';
import Comment from '../models/Comment.js';
import Achievement from '../models/Achievement.js';



const checkAndUpdateAchievements = async (userId) => {
	const check = (achievement, user) => {
		if (achievement.criteria === 'quizzesCompleted') {
			return user.stats.length >= achievement.targetValue;
		}
		if (achievement.criteria === 'quizzesCreated') {
			return user.quizzes.length >= achievement.targetValue;
		}
		if (achievement.criteria === 'accuracy') {
			const stats = user.stats;
			const correctAnswersPercentage = stats.reduce(
				(acc, stat) => acc + stat.correctAnswersPercentage,
				0
			);
			return correctAnswersPercentage / stats.length >= achievement.targetValue;
		}
		return false;
	};

	const user = await User.findById(userId)
		.populate('achievements')
		.populate('stats');
	const achievementsToAchieve = (await Achievement.find({})).filter(
		(achievement) => !user.achievements.includes(achievement._id)
	);

	achievementsToAchieve.forEach((achievement) => {
		if (check(achievement, user)) {
			user.achievements.push(achievement);
		}
	});
};


const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};


const updateUser = async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
			new: true, // return the updated data
		});
		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};


const deleteUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
		}

		await Promise.all([
			Verification.findByIdAndDelete(user.verification),
			Quiz.deleteMany({ _id: { $in: user.quizzes } }),
			Stats.deleteMany({ userId: user._id }),
			Comment.deleteMany({ userId: user._id }),
			Achievement.deleteMany({ _id: { $in: user.achievements } }),
			User.findByIdAndDelete(user._id),
		]);
		res.status(200).json({ message: 'User deleted' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


const getUserStatistics = async (req, res) => {
	try {
		const stats = await Stats.find({ userId: req.params.userId }).populate(
			'quizId',
			'name category difficulty'
		);

		if (!stats) {
			return res
				.status(404)
				.json({ message: 'No statistics found for this user' });
		}

		res.status(200).json({
			success: true,
			data: stats,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching statistics',
			error: error.message,
		});
	}
};


const quizCompleted = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        const userId = req.params.userId;

        const quiz = await Quiz.findById(quizId).populate(
            'questions',
            'correctAnswers type'
        );

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        if (quiz.questions.length === 0) {
            return res.status(400).json({ message: 'Quiz has no questions' });
        }

        if (!answers || answers.length !== quiz.questions.length) {
            return res.status(400).json({ message: 'Invalid answers array' });
        }

        // Obliczanie statystyk
        let correctAnswersCount = 0;
        quiz.questions.forEach((question, index) => {
            const userAnswer = answers[index];

            if (question.type === 'Multiple Choice') {
                const isCorrect =
                    question.correctAnswers.every((answer) =>
                        userAnswer.includes(answer)
                    ) && userAnswer.length === question.correctAnswers.length;
                if (isCorrect) correctAnswersCount++;
            } else {
                if (question.correctAnswers.includes(userAnswer)) {
                    correctAnswersCount++;
                }
            }
        });

        const correctAnswersPercentage =
            (correctAnswersCount / quiz.questions.length) * 100;

        const difficultyMultiplier = {
            Easy: 1,
            Medium: 1.5,
            Hard: 2,
        };

        const score = Math.round(
            correctAnswersPercentage * difficultyMultiplier[quiz.difficulty]
        );

        // Sprawdzanie czy już kiedyś grał w ten quiz
        const existingStats = await Stats.findOne({ userId, quizId });

        if (existingStats) {
            // Podmienianie statystyk jeśli nowe są lepsze
            if (score > existingStats.score) {
                existingStats.correctAnswersCount = correctAnswersCount;
                existingStats.correctAnswersPercentage = correctAnswersPercentage;
                existingStats.score = score;
                await existingStats.save();

                return res.status(200).json({
                    success: true,
                    message: 'Statistics updated with better score',
                    data: existingStats,
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Previous score was better',
                data: existingStats,
            });
        }

        // Tworzenie nowych statystyk
        const newStats = new Stats({
            userId,
            quizId,
            correctAnswersCount,
            correctAnswersPercentage,
            score,
        });

        await newStats.save();

        await User.findByIdAndUpdate(userId, { $push: { stats: newStats._id } });

        await checkAndUpdateAchievements(userId);

        res.status(201).json({
            success: true,
            message: 'New statistics created',
            data: newStats,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing quiz completion',
            error: error.message,
        });
    }
};


const getUserStatisticsByQuizId = async (req, res) => {
	try {
		const { userId, quizId } = req.params;
		const stats = await Stats.findOne({
			userId,
			quizId,
		}).populate('quizId', 'name category difficulty');

		if (!stats) {
			return res.status(404).json({
				success: false,
				message: 'No statistics found for this quiz',
			});
		}

		res.status(200).json({
			success: true,
			message: 'Statistics found',
			data: stats,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching quiz statistics',
			error: error.message,
		});
	}
};


const getUserAchievements = async (req, res) => {
	try {
		const user = await User.findById(req.params.userId).populate('achievements');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json(user.achievements);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


const addAchievemnt = async (req, res) => {
	try {
		const { name, description, icon, criteria, targetValue } = req.body;
		const newAchievement = new Achievement({
			name,
			description,
			icon,
			criteria,
			targetValue,
		});
		await newAchievement.save();
		res.status(201).json(newAchievement);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}




export {
	getUser,
	updateUser,
	deleteUser,
	getUserStatistics,
	getUserStatisticsByQuizId,
	quizCompleted,
	getUserAchievements,
	addAchievemnt
};
