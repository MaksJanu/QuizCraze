import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["single-choice", "multiple-choice", "open", "fill-in-the-blank"],
    required: true,
  },

  questionText: {
    type: String,
    required: true,
  },

  options: {
    type: [String],
    required: function () {
      return this.type === "single-choice" || this.type === "multiple-choice";
    },
  },

  correctAnswers: {
    type: [String],
    required: true,
  },
});


const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  questions: [questionSchema],

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  likes: {
    type: Number,
    default: 0,
  },
  
  timesPlayed: {
    type: Number,
    default: 0,
  },

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
});


const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
