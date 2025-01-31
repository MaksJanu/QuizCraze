import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['Single Choice', 'Multiple Choice', 'Open', 'Fill in the Blank'],
		required: true,
	},
	questionText: { type: String, required: true },
	answerOptions: [{ type: String }],
	hint: { type: String },
	correctAnswers: [{ type: String, required: true }],
	timeLimit: { type: Number },
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
