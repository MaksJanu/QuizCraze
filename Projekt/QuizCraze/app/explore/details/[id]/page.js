'use client';
import { useEffect, useReducer } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { FaPlay, FaSpinner, FaTrash } from 'react-icons/fa';

// Define action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_QUIZ: 'SET_QUIZ',
  SET_USER_ID: 'SET_USER_ID',
  SET_NEW_COMMENT: 'SET_NEW_COMMENT',
  SET_IS_SUBMITTING: 'SET_IS_SUBMITTING',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT'
};

// Initial state
const initialState = {
  quiz: null,
  loading: true,
  error: null,
  newComment: '',
  isSubmitting: false,
  userId: null
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_QUIZ:
      return { ...state, quiz: action.payload };
    case ACTIONS.SET_USER_ID:
      return { ...state, userId: action.payload };
    case ACTIONS.SET_NEW_COMMENT:
      return { ...state, newComment: action.payload };
    case ACTIONS.SET_IS_SUBMITTING:
      return { ...state, isSubmitting: action.payload };
    case ACTIONS.ADD_COMMENT:
      return {
        ...state,
        quiz: {
          ...state.quiz,
          comments: [...(state.quiz.comments || []), action.payload]
        }
      };
    case ACTIONS.DELETE_COMMENT:
      return {
        ...state,
        quiz: {
          ...state.quiz,
          comments: state.quiz.comments.filter(comment => comment._id !== action.payload)
        }
      };
    default:
      return state;
  }
}

export default function QuizDetails() {
  const params = useParams();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const currentUserId = localStorage.getItem('userId');
        dispatch({ type: ACTIONS.SET_USER_ID, payload: currentUserId });
        const response = await axios.get(`/quiz/${params.id}`);
        dispatch({ type: ACTIONS.SET_QUIZ, payload: response.data.data });
      } catch (err) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: err.message || 'Error loading quiz' });
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };

    fetchData();
  }, [params.id]);

  const handleStartQuiz = () => {
    router.push(`/explore/playing/${params.id}`);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!state.newComment.trim() || state.isSubmitting) return;

    try {
      dispatch({ type: ACTIONS.SET_IS_SUBMITTING, payload: true });
      const response = await axios.post(`/quiz/${params.id}/comment`, {
        content: state.newComment,
      });

      if (response.data.success) {
        dispatch({ type: ACTIONS.ADD_COMMENT, payload: response.data.data });
        dispatch({ type: ACTIONS.SET_NEW_COMMENT, payload: '' });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add comment';
      alert(errorMessage);
    } finally {
      dispatch({ type: ACTIONS.SET_IS_SUBMITTING, payload: false });
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/quiz/${params.id}/comment/${commentId}`);
      dispatch({ type: ACTIONS.DELETE_COMMENT, payload: commentId });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete comment';
      alert(errorMessage);
    }
  };

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-[#A7D129]" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{state.error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Quiz Details Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{state.quiz?.name}</h1>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <span className={`px-3 py-1 rounded-full text-sm ${
            state.quiz?.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
            state.quiz?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {state.quiz?.difficulty}
          </span>
          <span className="text-sm text-gray-600">
            {state.quiz?.questions?.length || 0} Questions
          </span>
        </div>

        <button
          onClick={handleStartQuiz}
          className="w-full sm:w-auto px-6 py-3 bg-[#A7D129] hover:bg-[#96BC24] 
            text-white font-medium rounded-lg transition-colors duration-200"
        >
          <FaPlay className="inline mr-2" /> Start Quiz
        </button>
      </div>

      {/* Comments Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Comments</h2>
        
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={state.newComment}
              onChange={(e) => dispatch({ 
                type: ACTIONS.SET_NEW_COMMENT, 
                payload: e.target.value 
              })}
              placeholder="Add a comment..."
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm bg-white
                  focus:border-[#A7D129] focus:outline-none focus:ring-1 focus:ring-[#A7D129]/20"
            />
            <button
              type="submit"
              disabled={state.isSubmitting}
              className="px-4 py-2 bg-[#A7D129] text-white rounded-lg text-sm font-medium
                hover:bg-[#96BC24] transition-colors disabled:opacity-50"
            >
              {state.isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {state.quiz?.comments?.map((comment) => (
            <div key={comment._id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.userId?.nickname || comment.userId?.firstName || 'User'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
              {comment.userId?._id === state.userId && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}