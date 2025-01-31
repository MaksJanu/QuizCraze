'use client'

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Validation schemas
const RegistrationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'), 
  email: Yup.string().email('Invalid email').required('Email is required'),
  nickname: Yup.string().required('Nickname is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

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

export default function Authorization({ isRegistering }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Configure axios
  axios.defaults.baseURL = 'http://localhost:4000/api';
  axios.defaults.withCredentials = true;

  const handleAuth = async (values) => {
    try {
      setIsLoading(true);
      setServerError(null);
      setSuccessMessage(null);

      if (isRegistering) {
        const response = await axios.post('/auth/register', {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          nickname: values.nickname,
          password: values.password
        });

        if (response.data.userData) {
          setSuccessMessage('User successfully registered and logged in');
          // Update auth state immediately
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
          // Dispatch custom event
          window.dispatchEvent(new Event('authStateChange'));
          router.push('/');
        }
      } else {
        const response = await axios.post('/auth/login', {
          email: values.email,
          password: values.password
        });

        if (response.data.userData) {
          setSuccessMessage('User successfully logged in');
          // Update auth state immediately
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
          // Dispatch custom event
          window.dispatchEvent(new Event('authStateChange'));
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setServerError(error.response?.data?.error || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: isRegistering ? {
      firstName: '',
      lastName: '',
      email: '',
      nickname: '',
      password: '',
    } : {
      email: '',
      password: '', 
    },
    validationSchema: isRegistering ? RegistrationSchema : LoginSchema,
    onSubmit: handleAuth
  });

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#A7D129]/5 via-transparent to-[#8CB122]/5"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0% 100%)' }}
        />
        
        <div className="absolute w-full h-full">
          <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-[#A7D129]/10 blur-sm animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-[#8CB122]/10 blur-sm animate-pulse delay-100" />
          <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-[#96BC24]/10 blur-sm animate-pulse delay-200" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col justify-start pt-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-4">
            {isRegistering ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <div className="text-center text-sm">
            {isRegistering ? (
              <Link href="/auth/login" className="font-medium text-[#A7D129] hover:text-[#8CB122] transition-colors">
                Already have an account? Sign in
              </Link>
            ) : (
              <Link href="/auth/register" className="font-medium text-[#A7D129] hover:text-[#8CB122] transition-colors">
                Don't have an account? Sign up
              </Link>
            )}
          </div>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/90 backdrop-blur-sm py-6 px-4 shadow-sm ring-1 ring-gray-100/20 
            sm:rounded-lg sm:px-8 transition-all duration-300 hover:shadow-md">
            
            {serverError && (
              <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
                {serverError}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-2 text-sm text-green-600 bg-green-50 rounded">
                {successMessage}
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {isRegistering && (
                <>
                  <div className="relative">
                    <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="block w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm 
                        focus:border-[#A7D129] focus:outline-none focus:ring-1 focus:ring-[#A7D129] transition-colors"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstName}
                      disabled={isLoading}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <ErrorMessage error={formik.errors.firstName} />
                    )}
                  </div>

                  <div className="relative">
                    <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName" 
                      type="text"
                      className="block w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm 
                        focus:border-[#A7D129] focus:outline-none focus:ring-1 focus:ring-[#A7D129] transition-colors"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastName}
                      disabled={isLoading}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <ErrorMessage error={formik.errors.lastName} />
                    )}
                  </div>

                  <div className="relative">
                    <label htmlFor="nickname" className="block text-xs font-medium text-gray-700 mb-1">
                      Nickname
                    </label>
                    <input
                      id="nickname"
                      name="nickname"
                      type="text"
                      className="block w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm 
                        focus:border-[#A7D129] focus:outline-none focus:ring-1 focus:ring-[#A7D129] transition-colors"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.nickname}
                      disabled={isLoading}
                    />
                    {formik.touched.nickname && formik.errors.nickname && (
                      <ErrorMessage error={formik.errors.nickname} />
                    )}
                  </div>
                </>
              )}

              <div className="relative">
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="block w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm 
                    focus:border-[#A7D129] focus:outline-none focus:ring-1 focus:ring-[#A7D129] transition-colors"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  disabled={isLoading}
                />
                {formik.touched.email && formik.errors.email && (
                  <ErrorMessage error={formik.errors.email} />
                )}
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="block w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm 
                    focus:border-[#A7D129] focus:outline-none focus:ring-1 focus:ring-[#A7D129] transition-colors"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  disabled={isLoading}
                />
                {formik.touched.password && formik.errors.password && (
                  <ErrorMessage error={formik.errors.password} />
                )}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md bg-gradient-to-r from-[#A7D129] to-[#8CB122] 
                    px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-[#96BC24] hover:to-[#7BA01E] 
                    focus:outline-none focus:ring-2 focus:ring-[#A7D129] focus:ring-offset-2 transition-all 
                    duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    isRegistering ? 'Create Account' : 'Sign in'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}