'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Question from '@/app/components/Question/Question';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

export default function EditQuiz() {
  const params = useParams();
  const quizId = params.id;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/quiz/${quizId}/questions`);
      setQuestions(response.data.questions || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err.response?.data?.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  const handleSubmitQuestion = async (values) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (selectedQuestion) {
        const response = await axios.patch(
          `/quiz/${quizId}/questions/${selectedQuestion._id}`,
          values
        );
        if (response.data.success) {
          await fetchQuestions();
          setSelectedQuestion(null);
          alert('Question updated successfully!');
        }
      } else {
        const response = await axios.post(`/quiz/${quizId}/questions`, values);
        if (response.data.success) {
          await fetchQuestions();
          alert('Question added successfully!');
        }
      }
    } catch (error) {
      console.error('Error handling question:', error);
      setError(error.response?.data?.message || 'Failed to handle question');
      alert(error.response?.data?.message || 'Failed to handle question');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const response = await axios.delete(`/quiz/${quizId}/questions/${questionId}`);
      if (response.data.success) {
        await fetchQuestions();
        if (selectedQuestion?._id === questionId) {
          setSelectedQuestion(null);
        }
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      setError(error.response?.data?.message || 'Failed to delete question');
    }
  };

  const handleChangeQuestion = (question) => {
    if (selectedQuestion?._id === question._id) {
      setSelectedQuestion(null);
    } else {
      setSelectedQuestion(question);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-nav-third via-white to-nav-third p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedQuestion ? 'Edit Question' : 'Add Question'}
            </h1>
            <p className="text-sm text-gray-600">
              {selectedQuestion 
                ? 'Update the selected question below' 
                : 'Add questions to your quiz'}
            </p>
          </div>
          <Question 
            onSubmit={handleSubmitQuestion}
            existingQuestion={selectedQuestion}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="md:w-1/2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Questions List</h2>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-600">Loading questions...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600">No questions added yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div 
                  key={question._id}
                  className={`bg-white rounded-lg shadow-lg p-4 transition-all hover:shadow-xl
                    ${selectedQuestion?._id === question._id ? 'ring-2 ring-[#A7D129]' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Question: {question.content || 'No content'}
                      </h3>
                      <div className="space-y-2 border-t border-gray-100 pt-2">
                        <div className="grid grid-cols-2 gap-2">
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Type:</span> {question.type}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Time Limit:</span> {question.timeLimit || 30} seconds
                          </p>
                        </div>
                        
                        {question.hint && (
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Hint:</span> {question.hint}
                          </p>
                        )}

                        <div className="border-t border-gray-100 pt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Answers:</p>
                          <ul className="space-y-1">
                            {question.answers?.map((answer, index) => (
                              <li 
                                key={index}
                                className={`text-sm pl-4 ${answer.isCorrect ? 'text-green-600' : 'text-gray-500'}`}
                              >
                                {answer.content} {answer.isCorrect && '✓'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className={`p-2 text-sm ${
                          selectedQuestion?._id === question._id 
                            ? 'text-red-500 hover:text-red-700' 
                            : 'text-blue-500 hover:text-blue-700'
                        } hover:bg-gray-50 rounded transition-colors`}
                        onClick={() => handleChangeQuestion(question)}
                      >
                        {selectedQuestion?._id === question._id ? 'Cancel' : 'Edit'}
                      </button>
                      <button
                        className="p-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        onClick={() => handleDeleteQuestion(question._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}