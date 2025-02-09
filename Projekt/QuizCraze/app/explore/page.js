'use client';

import { useReducer, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaSpinner, FaUndo } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;


const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_QUIZZES: 'SET_QUIZZES',
  SET_FILTERED_QUIZZES: 'SET_FILTERED_QUIZZES',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_SELECTED_CATEGORY: 'SET_SELECTED_CATEGORY',
  SET_SELECTED_DIFFICULTY: 'SET_SELECTED_DIFFICULTY',
  SET_SELECTED_POPULARITY: 'SET_SELECTED_POPULARITY',
  RESET_FILTERS: 'RESET_FILTERS'
};


const initialState = {
  quizzes: [],
  filteredQuizzes: [],
  loading: true,
  error: null,
  searchTerm: '',
  categories: [],
  selectedCategory: '',
  selectedDifficulty: '',
  selectedPopularity: '',
};


function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_QUIZZES:
      return { ...state, quizzes: action.payload };
    case ACTIONS.SET_FILTERED_QUIZZES:
      return { ...state, filteredQuizzes: action.payload };
    case ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    case ACTIONS.SET_SELECTED_CATEGORY:
      return { ...state, selectedCategory: action.payload };
    case ACTIONS.SET_SELECTED_DIFFICULTY:
      return { ...state, selectedDifficulty: action.payload };
    case ACTIONS.SET_SELECTED_POPULARITY:
      return { ...state, selectedPopularity: action.payload };
    case ACTIONS.RESET_FILTERS:
      return {
        ...state,
        searchTerm: '',
        selectedCategory: '',
        selectedDifficulty: '',
        selectedPopularity: ''
      };
    default:
      return state;
  }
}

export default function ExplorePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const popularityOptions = ['Most Popular'];

  const resetFilters = () => {
    dispatch({ type: ACTIONS.RESET_FILTERS });
  };

  const isPopular = (quiz, filteredQuizzes, selectedPopularity) => {
    if (selectedPopularity !== 'Most Popular') return false;
    const maxPopularity = Math.max(...filteredQuizzes.map(q => q.popularity));
    return quiz.popularity === maxPopularity && quiz.popularity > 0 && 
           filteredQuizzes.indexOf(quiz) === 0;
  };

  const getDifficultyStyles = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-50 border-green-100 hover:bg-green-50/80';
      case 'Medium':
        return 'bg-orange-50 border-orange-100 hover:bg-orange-50/80';
      case 'Hard':
        return 'bg-red-50 border-red-100 hover:bg-red-50/80';
      default:
        return 'bg-white';
    }
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const [quizzesRes, categoriesRes] = await Promise.all([
          axios.get('/quiz/all'),
          axios.get('/quiz/categories')
        ]);
        dispatch({ type: ACTIONS.SET_QUIZZES, payload: quizzesRes.data.data || [] });
        dispatch({ type: ACTIONS.SET_CATEGORIES, payload: categoriesRes.data.data || [] });
        dispatch({ type: ACTIONS.SET_ERROR, payload: null });
      } catch (err) {
        dispatch({ 
          type: ACTIONS.SET_ERROR, 
          payload: err.response?.data?.message || 'Failed to load quizzes' 
        });
        console.error('Error fetching data:', err);
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    let result = [...state.quizzes];

    if (state.searchTerm) {
      result = result.filter(quiz => 
        quiz.name.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }

    if (state.selectedCategory) {
      result = result.filter(quiz => 
        quiz.category?.name === state.selectedCategory
      );
    }

    if (state.selectedDifficulty) {
      result = result.filter(quiz => 
        quiz.difficulty === state.selectedDifficulty
      );
    }

    if (state.selectedPopularity === 'Most Popular') {
      result.sort((a, b) => b.popularity - a.popularity);
    }

    dispatch({ type: ACTIONS.SET_FILTERED_QUIZZES, payload: result });
  }, [state.quizzes, state.searchTerm, state.selectedCategory, state.selectedDifficulty, state.selectedPopularity]);

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
        <p className="text-red-500 text-xs">{state.error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">Explore Quizzes</h1>
        
        <div className="max-w-xl mx-auto space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 text-xs" />
            </div>
            <input
              type="text"
              placeholder="Search quizzes..."
              className="block w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg 
                focus:ring-[#A7D129] focus:border-[#A7D129] transition-all duration-300
                hover:border-[#A7D129]/20 shadow-sm"
              value={state.searchTerm}
              onChange={(e) => dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: e.target.value })}
            />
          </div>

          <div className="flex gap-3 items-center">
            <div className="grid grid-cols-3 gap-3 flex-1">
              <select
                className="block w-full py-2 px-3 text-sm bg-white border border-gray-200 rounded-lg
                  focus:ring-[#A7D129] focus:border-[#A7D129] transition-all duration-300
                  hover:border-[#A7D129]/20 cursor-pointer shadow-sm"
                value={state.selectedCategory}
                onChange={(e) => dispatch({ type: ACTIONS.SET_SELECTED_CATEGORY, payload: e.target.value })}
              >
                <option value="">All Categories</option>
                {state.categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                className="block w-full py-2 px-3 text-sm bg-white border border-gray-200 rounded-lg
                  focus:ring-[#A7D129] focus:border-[#A7D129] transition-all duration-300
                  hover:border-[#A7D129]/20 cursor-pointer shadow-sm"
                value={state.selectedDifficulty}
                onChange={(e) => dispatch({ type: ACTIONS.SET_SELECTED_DIFFICULTY, payload: e.target.value })}
              >
                <option value="">All Difficulties</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>

              <select
                className="block w-full py-2 px-3 text-sm bg-white border border-gray-200 rounded-lg
                  focus:ring-[#A7D129] focus:border-[#A7D129] transition-all duration-300
                  hover:border-[#A7D129]/20 cursor-pointer shadow-sm"
                value={state.selectedPopularity}
                onChange={(e) => dispatch({ type: ACTIONS.SET_SELECTED_POPULARITY, payload: e.target.value })}
              >
                <option value="">Sort By</option>
                {popularityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={resetFilters}
              className="p-2 text-sm bg-white border border-gray-200 rounded-lg
                hover:bg-gray-50 transition-all duration-300 hover:border-[#A7D129]/20
                focus:ring-[#A7D129] focus:border-[#A7D129] shadow-sm"
              title="Reset filters"
            >
              <FaUndo className="text-gray-500 w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-y-auto max-h-[calc(100vh-250px)]">
          {state.filteredQuizzes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-xs">No quizzes found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.filteredQuizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className={`rounded-lg shadow-sm p-4 transition-all duration-300
                    border hover:shadow-md hover:scale-[1.01] cursor-pointer relative
                    ${getDifficultyStyles(quiz.difficulty)}`}
                  onClick={() => router.push(`/explore/details/${quiz._id}`)}
                >
                  {isPopular(quiz, state.filteredQuizzes, state.selectedPopularity) && (
                    <div className="absolute top-2 right-2 bg-orange-100 
                      text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                      🔥 Popular
                    </div>
                  )}
                  <h2 className="text-sm font-semibold text-gray-900 mb-2">{quiz.name}</h2>
                  <div className="mb-2">
                    <p className="text-xs text-gray-600">{quiz.category?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Difficulty: {quiz.difficulty}</p>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-gray-500">
                    <span>Questions: {quiz.questions?.length || 0}</span>
                    <span>{quiz.popularity} plays</span>
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