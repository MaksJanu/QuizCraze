import User from "../models/user.model.js";
import { Quiz, Question } from "../models/quiz.model.js";



const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({});
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const createQuiz = async (req, res) => {
    try {
        const { title, description, questions, difficulty } = req.body;

        const loggedAuthor = req.user.nickname
      
        const searchedAuthor = await User.findOne({ nickname: loggedAuthor, role: 'author' });
        if (!searchedArtist) {
            return res.status(404).json({ message: "Artist not found" });
        }
      
        const existingQuiz = await Quiz.findOne({ title, author: loggedAuthor });
        if (existingQuiz) {
          return res.status(400).json({ message: "Quiz with this title already exists for this author!" });
        }
      
        const newQuiz = await Quiz.create({
          ...req.body,
          author: loggedAuthor,
        });
      
        searchedAuthor.quizzesCreated.push(newQuiz._id);
        await searchedAuthor.save();
      
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, questions, difficulty } = req.body;

        const loggedAuthor = req.user.nickname

        const searchedAuthor = await User.findOne({ nickname: loggedAuthor, role: 'author' });
        if (!searchedAuthor) {
            return res.status(404).json({ message: "Author not found" });
        }

        const existingQuiz = await Quiz.findOne({ title, author: loggedAuthor });
        if (!existingQuiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (existingQuiz.author !== loggedAuthor) {
            return res.status(403).json({ message: "You are not authorized to update this quiz" });
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        const loggedAuthor = req.user.nickname

        const searchedAuthor = await User.findOne({ nickname: loggedAuthor, role: 'author' });
        if (!searchedAuthor) {
            return res.status(404).json({ message: "Author not found" });
        }

        const existingQuiz = await Quiz.findOne({ _id: id, author: loggedAuthor });
        if (!existingQuiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (existingQuiz.author !== loggedAuthor) {
            return res.status(403).json({ message: "You are not authorized to delete this quiz" });
        }

        await Quiz.findByIdAndDelete(id);

        res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



export { getQuizzes, createQuiz, updateQuiz, deleteQuiz };