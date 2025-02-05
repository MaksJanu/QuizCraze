'use client'

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import axios from 'axios';


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

const VerifySchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  hash: Yup.string().required('Verification code is required')
});

export default function Verify() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);



  const formik = useFormik({
    initialValues: {
      email: '',
      hash: ''
    },
    validationSchema: VerifySchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setServerError(null);
        setSuccessMessage(null);
        
        const response = await axios.post('/auth/verify-email', {
          email: values.email,
          hash: values.hash
        });

        if (response.data) {
          setSuccessMessage('User successfully verified');
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setServerError(error.response?.data?.error || 'Verification failed');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#A7D129]/5 via-transparent to-[#8CB122]/5"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0% 100%)' }}
        />
      </div>

      <div className="relative z-10 flex flex-col justify-start pt-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-4">
            Verify Your Email
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/90 backdrop-blur-sm py-6 px-4 shadow-sm ring-1 ring-gray-100/20 
            sm:rounded-lg sm:px-8 transition-all duration-300 hover:shadow-md">
            
            {serverError && <ErrorMessage error={serverError} />}
            {successMessage && (
              <div className="mb-4 p-2 text-sm text-green-600 bg-green-50 rounded">
                {successMessage}
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                <label htmlFor="code" className="block text-xs font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  id="hash"
                  name="hash"
                  type="text"
                  className="block w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm 
                    focus:border-[#A7D129] focus:outline-none focus:ring-1 focus:ring-[#A7D129] transition-colors"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.hash}
                  disabled={isLoading}
                />
                {formik.touched.hash && formik.errors.hash && (
                  <ErrorMessage error={formik.errors.hash} />
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-gradient-to-r from-[#A7D129] to-[#8CB122] 
                  px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-[#96BC24] hover:to-[#7BA01E] 
                  focus:outline-none focus:ring-2 focus:ring-[#A7D129] focus:ring-offset-2 transition-all 
                  duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Verify Email'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}