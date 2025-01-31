import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
	name: { type: String, required: true },
	category: { type: String, required: true },
	difficulty: {
		type: String,
		enum: ['Easy', 'Medium', 'Hard'],
		required: true,
	},
	numberOfQuestions: { type: Number, required: true },
	questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
	popularity: { type: Number, default: 0 },
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
