'use client'

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

const ErrorMessage = ({ error }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [error]);

  if (!isVisible) return null;

  return (
    <p className="absolute text-xs text-red-600 transition-opacity duration-300">
      {error}
    </p>
  );
};

const QuizSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  category: Yup.string().required('Category is required'),
  difficulty: Yup.string().oneOf(['Easy', 'Medium', 'Hard'], 'Invalid difficulty').required('Difficulty is required')
});

export default function Quiz() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/quiz/categories');
        setCategories(response.data.data);
      } catch (error) {
        setCategoriesError('Failed to load categories');
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
      difficulty: ''
    },
    validationSchema: QuizSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/quiz', values);
        if (response.data) {
          router.push('/dashboard');
        }
      } catch (error) {
        setSubmitError(error.response?.data?.message || 'Failed to create quiz');
        console.error('Error creating quiz:', error);
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-nav-third via-white to-nav-third relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-[40rem] bg-nav-primary/5 transform -skew-y-6"></div>
        <div className="absolute bottom-0 right-0 w-full h-[40rem] bg-nav-primary/5 transform skew-y-6"></div>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Create New Quiz
          </h1>
          <p className="text-sm text-gray-600">
            Fill in the details below to create your custom quiz
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm py-6 px-5 shadow-lg rounded-xl 
          ring-1 ring-gray-100/20 transition-all duration-300 hover:shadow-xl">
          <form onSubmit={formik.handleSubmit} className="space-y-4 max-w-sm mx-auto">
            <div className="relative">
              <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                Quiz Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter quiz name"
                  className="block w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm
                    text-gray-900 placeholder-gray-400 focus:border-[#A7D129] focus:outline-none 
                    focus:ring-1 focus:ring-[#A7D129]/20 transition-colors"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name && (
                  <ErrorMessage error={formik.errors.name} />
                )}
              </div>
            </div>

            <div className="relative">
              <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                {loadingCategories ? (
                  <p>Loading categories...</p>
                ) : categoriesError ? (
                  <ErrorMessage error={categoriesError} />
                ) : (
                  <select
                    id="category"
                    name="category"
                    className="block w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm
                      text-gray-900 focus:border-[#A7D129] focus:outline-none focus:ring-1 
                      focus:ring-[#A7D129]/20 transition-colors appearance-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.category}
                  >
                    <option value="" label="Select category" />
                    {categories.map((category) => (
                      <option key={category.name} value={category.name} label={category.name} />
                    ))}
                  </select>
                )}
                {formik.touched.category && formik.errors.category && (
                  <ErrorMessage error={formik.errors.category} />
                )}
              </div>
            </div>

            <div className="relative">
              <label htmlFor="difficulty" className="block text-xs font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <select
                  id="difficulty"
                  name="difficulty"
                  className="block w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm
                    text-gray-900 focus:border-[#A7D129] focus:outline-none focus:ring-1 
                    focus:ring-[#A7D129]/20 transition-colors appearance-none"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.difficulty}
                >
                  <option value="" label="Select difficulty level" />
                  <option value="Easy" label="Easy" />
                  <option value="Medium" label="Medium" />
                  <option value="Hard" label="Hard" />
                </select>
                {formik.touched.difficulty && formik.errors.difficulty && (
                  <ErrorMessage error={formik.errors.difficulty} />
                )}
              </div>
            </div>

            {submitError && <ErrorMessage error={submitError} />}

            <div className="pt-3">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 rounded-lg text-white text-sm
                  font-medium bg-gradient-to-r from-[#A7D129] to-[#8CB122] hover:from-[#96BC24] 
                  hover:to-[#7BA01E] shadow-sm hover:shadow-md transform hover:scale-[1.01] 
                  focus:outline-none focus:ring-1 focus:ring-[#A7D129] focus:ring-offset-2 
                  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}