import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
	name: { type: String, required: true },
	describtion: { type: String, required: true },
	icon: { type: String, required: true },
	criteria: {
		type: String,
		enum: ['quizzesCompleted', 'quizzesCreated', 'accuracy'],
		required: true,
	},
	targetValue: { type: Number, required: true },
});

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
