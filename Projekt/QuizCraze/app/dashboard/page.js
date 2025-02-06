'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

export default function Dashboard() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchQuizzes = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/login');
        return;
      }
      
      const response = await axios.get(`/quiz/get/${userId}`);
      if (response.data.success) {
        setQuizzes(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load quizzes');
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleEdit = (quizId) => {
    router.push(`/dashboard/${quizId}`);
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }
  
    try {
      setDeletingId(quizId);
      setDeleteError(null);
  
      const response = await axios.delete(`/quiz/${quizId}`);
      if (response.status === 200) {
        // Immediately update the local state
        setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz._id !== quizId));
        setDeleteError(null);
      } else {
        throw new Error(response.data.message || 'Failed to delete quiz');
      }
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setDeleteError(err.response?.data?.message || 'Failed to delete quiz');
    } finally {
      setDeletingId(null);
      // Clear any error message after 3 seconds
      setTimeout(() => setDeleteError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-nav-primary" />
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
          <button
            onClick={() => router.push('/create-quiz')}
            className="px-4 py-2 bg-nav-primary text-white rounded-lg hover:bg-nav-primary/90 transition-colors"
          >
            Create New Quiz
          </button>
        </div>

        {deleteError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {deleteError}
          </div>
        )}

        {(!quizzes || quizzes.length === 0) ? (
          <div className="text-center py-12">
            <p className="text-gray-500">You haven't created any quizzes yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {quiz.name}
                  </h2>
                  <div className="flex gap-2">
                    <button 
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      onClick={() => handleEdit(quiz._id)}
                      title="Edit quiz"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      onClick={() => handleDelete(quiz._id)}
                      disabled={deletingId === quiz._id}
                      title="Delete quiz"
                    >
                      {deletingId === quiz._id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600">{quiz.category?.name}</p>
                  <p className="text-sm text-gray-500">
                    Difficulty: {quiz.difficulty}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Questions: {quiz.questions?.length || 0}</span>
                  <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}