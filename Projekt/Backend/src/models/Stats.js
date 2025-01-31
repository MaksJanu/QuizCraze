import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    correctAnswersCount: { type: Number, required: true },
    correctAnswersPercentage: { type: Number, required: true },
    score: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Stats = mongoose.model('Stats', statsSchema);
export default Stats;