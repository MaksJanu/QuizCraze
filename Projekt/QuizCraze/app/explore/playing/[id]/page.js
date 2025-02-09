'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { FaSpinner, FaClock } from 'react-icons/fa';
import { shuffle } from 'lodash';


axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;


export default function PlayQuiz() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameState, setGameState] = useState('countdown');
  const [countdown, setCountdown] = useState(5);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [openAnswer, setOpenAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [questionStartTimes, setQuestionStartTimes] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardError, setLeaderboardError] = useState(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);


  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/quiz/${params.id}`);
        const quizData = response.data.data;
        setQuiz(quizData);
        setShuffledQuestions(shuffle(quizData.questions));
      } catch (err) {
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.id]);

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      setGameState('playing');
      setTimeLeft(shuffledQuestions[0]?.timeLimit || 30);
      setQuizStartTime(Date.now());
      setQuestionStartTimes(prev => ({
        ...prev,
        [shuffledQuestions[0]._id]: Date.now()
      }));
    }
  }, [countdown, gameState, shuffledQuestions]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      const currentQuestion = shuffledQuestions[currentQuestionIndex];
      setAnswers(prev => [...prev, {
        questionId: currentQuestion._id,
        answers: [],
        timeTaken: currentQuestion.timeLimit,
        isTimeout: true
      }]);
      handleNextQuestion();
    }
  }, [timeLeft, gameState]);

  const handleOpenAnswer = (e) => {
    e.preventDefault();
    if (isAnswerLocked) return;

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = currentQuestion.answers.some(
      answer => answer.isCorrect && answer.content.toLowerCase() === openAnswer.toLowerCase().trim()
    );

    const timeTaken = Math.round((Date.now() - questionStartTimes[currentQuestion._id]) / 1000);

    setAnswers(prev => [...prev, {
      questionId: currentQuestion._id,
      answers: [openAnswer.trim()],
      timeTaken,
      isCorrect
    }]);

    setIsAnswerLocked(true);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setTimeout(handleNextQuestion, 1500);
  };

  const handleMultiChoiceAnswer = (answer) => {
    if (isAnswerLocked) return;

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const correctAnswers = currentQuestion.answers.filter(a => a.isCorrect);
    const timeTaken = Math.round((Date.now() - questionStartTimes[currentQuestion._id]) / 1000);

    if (currentQuestion.type === 'Single Choice') {
      const isCorrect = answer.isCorrect;
      setSelectedAnswers([answer]);
      setIsAnswerLocked(true);

      setAnswers(prev => [...prev, {
        questionId: currentQuestion._id,
        answers: [answer.content],
        timeTaken,
        isCorrect
      }]);

      if (isCorrect) {
        setScore(prev => prev + 1);
      }
      setTimeout(handleNextQuestion, 1500);
    } else {
      if (!answer.isCorrect) {
        setSelectedAnswers([answer]);
        setIsAnswerLocked(true);

        setAnswers(prev => [...prev, {
          questionId: currentQuestion._id,
          answers: [answer.content],
          timeTaken,
          isCorrect: false
        }]);

        setTimeout(handleNextQuestion, 1500);
        return;
      }

      const newSelectedAnswers = selectedAnswers.includes(answer)
        ? selectedAnswers.filter(a => a !== answer)
        : [...selectedAnswers, answer];
      
      setSelectedAnswers(newSelectedAnswers);

      const allCorrectAnswersSelected = correctAnswers.every(
        correctAns => newSelectedAnswers.some(
          selectedAns => selectedAns.content === correctAns.content
        )
      );

      if (allCorrectAnswersSelected && newSelectedAnswers.length === correctAnswers.length) {
        setIsAnswerLocked(true);
        setScore(prev => prev + 1);

        setAnswers(prev => [...prev, {
          questionId: currentQuestion._id,
          answers: newSelectedAnswers.map(a => a.content),
          timeTaken,
          isCorrect: true
        }]);

        setTimeout(handleNextQuestion, 1500);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 >= shuffledQuestions.length) {
      setGameState('finished');
    } else {
      const nextQuestion = shuffledQuestions[currentQuestionIndex + 1];
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(nextQuestion?.timeLimit || 30);
      setSelectedAnswers([]);
      setOpenAnswer('');
      setIsAnswerLocked(false);
      setShowHint(false); // Reset hint state
      setQuestionStartTimes(prev => ({
        ...prev,
        [nextQuestion._id]: Date.now()
      }));
    }
  };

  const submitQuizResults = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(`/user/${userId}/stats`, {
        quizId: params.id,
        answers: answers.map(answer => ({
          questionId: answer.questionId,
          answers: answer.answers
        }))
      });

      if (response.status !== 201) {
        throw new Error(response.data.message || 'Failed to submit quiz results');
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to submit quiz results');
      console.error('Error submitting quiz results:', error);
    } finally {
      setSubmitting(false);
    }
  };



  const fetchLeaderboard = async () => {
    try {
      setLeaderboardLoading(true);
      const response = await axios.get(`/ranking/${params.id}/10`); // Fetch top 10 players
      setLeaderboard(response.data.data);
    } catch (error) {
      setLeaderboardError(error.response?.data?.message || 'Failed to load leaderboard');
    } finally {
      setLeaderboardLoading(false);
    }
  };




  useEffect(() => {
    if (gameState === 'finished') {
      submitQuizResults();
      fetchLeaderboard();
    }
  }, [gameState]);


  

  const renderQuestion = () => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    if (currentQuestion.type === 'Open') {
      return (
        <form onSubmit={handleOpenAnswer} className="space-y-4">
          <input
            type="text"
            value={openAnswer}
            onChange={(e) => setOpenAnswer(e.target.value)}
            disabled={isAnswerLocked}
            placeholder="Type your answer here..."
            className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-[#A7D129] 
              focus:outline-none transition-colors bg-white"
            autoFocus
          />
          <button
            type="submit"
            disabled={isAnswerLocked || !openAnswer.trim()}
            className="w-full p-4 rounded-lg bg-[#A7D129] hover:bg-[#96BC24] 
              text-white font-medium transition-colors disabled:opacity-50"
          >
            Submit Answer
          </button>
          {isAnswerLocked && (
            <div className={`text-center p-2 rounded ${
              currentQuestion.answers.some(
                answer => answer.isCorrect && answer.content.toLowerCase() === openAnswer.toLowerCase().trim()
              )
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {currentQuestion.answers.some(
                answer => answer.isCorrect && answer.content.toLowerCase() === openAnswer.toLowerCase().trim()
              )
                ? 'Correct!'
                : `Incorrect. The correct answer was: ${currentQuestion.answers.find(a => a.isCorrect).content}`
              }
            </div>
          )}
        </form>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {currentQuestion.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleMultiChoiceAnswer(answer)}
            disabled={isAnswerLocked}
            className={`p-4 rounded-lg text-left transition-all transform hover:scale-[1.01] 
              ${selectedAnswers.includes(answer)
                ? answer.isCorrect
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-red-100 border-2 border-red-500'
                : 'bg-white hover:bg-gray-50 border-2 border-transparent'
              } ${isAnswerLocked && answer.isCorrect && 'bg-green-100 border-2 border-green-500'}`}
          >
            {answer.content}
          </button>
        ))}
        {currentQuestion.type === 'Multiple Choice' && !isAnswerLocked && (
          <p className="text-sm text-gray-500 mt-2">
            Select all correct answers ({currentQuestion.answers.filter(a => a.isCorrect).length} correct answers)
          </p>
        )}
      </div>
    );
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-[#A7D129]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-nav-third via-white to-nav-third p-6">
      <div className="max-w-3xl mx-auto">
        {gameState === 'countdown' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Get Ready!</h2>
            <div className="text-8xl font-bold text-[#A7D129] animate-pulse">
              {countdown}
            </div>
          </div>
        )}

        {gameState === 'playing' && shuffledQuestions[currentQuestionIndex] && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
              </span>
              <div className="flex items-center gap-2 text-[#A7D129]">
                <FaClock />
                <span className="font-bold">{timeLeft}s</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {shuffledQuestions[currentQuestionIndex].content}
            </h2>

            {/* Add hint button and display */}
            {shuffledQuestions[currentQuestionIndex].hint && (
              <div className="mb-6">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-sm text-[#A7D129] hover:text-[#96BC24] transition-colors"
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                {showHint && (
                  <p className="mt-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    💡 {shuffledQuestions[currentQuestionIndex].hint}
                  </p>
                )}
              </div>
            )}

            {renderQuestion()}
          </div>
        )}

      {gameState === 'finished' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
              <p className="text-xl text-gray-600 mb-6">
                Your score: {score} out of {shuffledQuestions.length}
              </p>
              <div className="text-4xl font-bold text-[#A7D129] mb-8">
                {Math.round((score / shuffledQuestions.length) * 100)}%
              </div>
              
              {submitting ? (
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <FaSpinner className="animate-spin" />
                  <span>Saving results...</span>
                </div>
              ) : submitError ? (
                <div className="text-red-500 text-sm mb-4">{submitError}</div>
              ) : (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setGameState('countdown');
                      setCountdown(5);
                      setCurrentQuestionIndex(0);
                      setScore(0);
                      setAnswers([]);
                      setSelectedAnswers([]);
                      setIsAnswerLocked(false);
                      setOpenAnswer('');
                      setShowHint(false);
                      setQuestionStartTimes({});
                      setQuizStartTime(null);
                      setShuffledQuestions(shuffle(quiz.questions));
                    }}
                    className="px-6 py-3 bg-[#A7D129] hover:bg-[#96BC24] text-white 
                      font-medium rounded-lg transition-colors duration-200"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => router.push('/explore')}
                    className="px-6 py-3 border-2 border-[#A7D129] text-[#A7D129] 
                      hover:bg-[#A7D129] hover:text-white font-medium rounded-lg 
                      transition-colors duration-200"
                  >
                    Return to Quizzes
                  </button>
                </div>
              )}
            </div>

            {/* Leaderboard Section */}
            <div className="mt-12 border-t pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Leaderboard</h3>
              {leaderboardLoading ? (
                <div className="flex justify-center">
                  <FaSpinner className="animate-spin text-2xl text-[#A7D129]" />
                </div>
              ) : leaderboardError ? (
                <div className="text-red-500 text-center">{leaderboardError}</div>
              ) : (
                <div className="space-y-4">
                  {leaderboard.map((entry) => (
                    <div 
                      key={entry.userId} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`text-lg font-bold ${
                          entry.rank === 1 ? 'text-yellow-500' :
                          entry.rank === 2 ? 'text-gray-500' :
                          entry.rank === 3 ? 'text-orange-500' :
                          'text-gray-400'
                        }`}>
                          #{entry.rank}
                        </span>
                        <div>
                          <span className="font-medium text-gray-900">
                            {entry.nickname || 'Anonymous'}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            Total Quizzes: {entry.stats.totalQuizzes} | 
                            Avg. Score: {Math.round(entry.stats.averageScore)}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#A7D129]">
                          {Math.round(entry.stats.averageCorrectAnswersPercentage)}%
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Correct Answers: {entry.stats.totalCorrectAnswers}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}