import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import Stats from '../models/Stats.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';







const getAllQuizzes = async (req, res) => {
	try {
		const quizzes = await Quiz.find({});
		res.status(200).json(quizzes);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};


const getSingleQuiz = async (req, res) => {
	try {
		const quiz = await Quiz.findById(req.params.quizId);
		if (!quiz) {
			res.status(404).json({ message: 'Quiz not found' });
			return;
		}
		res.status(200).json(quiz);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};


const createQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);
        await User.findByIdAndUpdate(
            req.user.id, // Use req.user.id instead of req.body.user.id
            {
                $push: { quizzes: quiz._id },
            },
            { new: true, runValidators: true }
        );
        res.status(201).json(quiz);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const updateQuiz = async (req, res) => {
	try {
		const quiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, {
			new: true,
		});
		if (!quiz) {
			res.status(404).json({ message: 'Quiz not found' });
			return;
		}
		res.status(200).json(quiz);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};


const deleteQuiz = async (req, res) => {
	try {
		const quiz = await Quiz.findById(req.params.quizId);
		if (!quiz) {
			res.status(404).json({ message: 'Quiz not found' });
			return;
		}
		await Promise.all([
			Question.deleteMany({ _id: { $in: quiz.questions } }),
			Stats.deleteMany({ quizId: quiz._id }),
			Comment.deleteMany({ quizId: quiz._id }),
			Quiz.findByIdAndDelete(quiz._id),
		]);
		res.status(200).json({ message: 'Quiz deleted' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};





// QUESTIONS RELATED
const getAllQuizQuestions = async (req, res) => {
	try {
		const quiz = await Quiz.findById(req.params.quizId)
		.populate('questions')
		.select('type questionText answerOptions hint timeLimit')

		if (!quiz) {
			res.status(404).json({message:'Quiz not found'});
			return;
		}

		res.status(200).json({questions:quiz.questions})

	} catch (error) {
		res.status(500).json({erorr: error.message})
	}
}


const addQuizQuestion = async (req, res) => {
	try {
		const quiz = await Quiz.findById(req.params.quizId)
		if (!quiz) {
			res.status(404).json({message:'Quiz not found'});
			return;
		}

		const newQuestion = new Question(req.body)
		await newQuestion.save()

		quiz.questions.push(newQuestion._id)
		quiz.numberOfQuestions += 1
		await quiz.save()

		res.status(201).json({
            success: true,
            message: 'Question added successfully',
            data: newQuestion
        });
		

	} catch (error) {
		res.status(500).json({
            success: false,
            message: 'Error adding question',
            error: error.message
        });
	}
}


const updateQuizQuestion = async (req, res) => {
	try {
		const quiz = await Quiz.findById(req.params.quizId);

		if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

		const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.questionId,
            req.body,
            { new: true }
        );

		if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

		res.status(200).json({
            success: true,
			message: 'Question updated successfully',
            data: updatedQuestion
        });


	} catch (error) {
		res.status(500).json({
            success: false,
            message: 'Error updating question',
            error: error.message
        });
	}
}



const deleteQuizQuestion = async (req, res) => {

	try {
		const quiz = await Quiz.findById(req.params.quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

		const question = await Question.findById(req.params.questionId);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

		// Usuwanie pytania z quizu
		quiz.questions = quiz.questions.filter(
            question => question.toString() !== req.params.questionId
        );
		quiz.numberOfQuestions -= 1;
		await quiz.save();


		await Question.findByIdAndDelete(req.params.questionId);

		res.status(200).json({
            success: true,
            message: 'Question deleted successfully'
        });

	} catch (error) {
		res.status(500).json({
            success: false,
            message: 'Error deleting question',
            error: error.message
        });
	}
}





// Comments related to quiz

const addQuizComment = async (req, res) => {
	try {
		
		const quiz = await Quiz.findById(req.params.quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

		const newComment = new Comment(req.body)
		await newComment.save()

		quiz.comments.push(newComment._id)
		await quiz.save()

		res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: newComment
        });



	} catch (error) {
		res.status(500).json({
            success: false,
            message: 'Error adding comment',
            error: error.message
        });
	}
}


const deleteQuizComment = async (req, res) => {
	try {

		const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

		const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

		quiz.comments = quiz.comments.filter(
            comment => comment.toString() !== req.params.commentId
        );
        await quiz.save();

		await Comment.findByIdAndDelete(req.params.commentId);

		res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });

		
	} catch (error) {
		res.status(500).json({
            success: false,
            message: 'Error deleting comment',
            error: error.message
        });
	}
}




export { getAllQuizzes, getSingleQuiz, createQuiz, updateQuiz, deleteQuiz,
	getAllQuizQuestions, addQuizQuestion, updateQuizQuestion, deleteQuizQuestion,
	addQuizComment, deleteQuizComment,
 };
