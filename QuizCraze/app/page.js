'use client';
import Image from "next/image";
import { FaLightbulb, FaTrophy, FaUsers } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/explore');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-nav-third via-white to-nav-third relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-[40rem] bg-nav-primary/5 transform -skew-y-6"></div>
        <div className="absolute bottom-0 right-0 w-full h-[40rem] bg-nav-primary/5 transform skew-y-6"></div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A7D129] to-[#8CB122]">QuizCraze</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-sm text-gray-500 sm:text-base md:mt-4 md:text-lg md:max-w-3xl">
            Test your knowledge, challenge friends, and learn something new every day.
          </p>
          <div className="mt-4 max-w-md mx-auto sm:flex sm:justify-center md:mt-6">
            <div className="rounded-md shadow-lg">
              <button
                onClick={handleGetStarted}
                className="w-full flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-nav-primary hover:bg-indigo-700 md:py-3 md:text-base md:px-8 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-10 h-10 bg-nav-primary/10 rounded-xl mb-3">
                <FaLightbulb className="h-5 w-5 text-nav-primary" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Learn Anywhere</h3>
              <p className="text-sm text-gray-500">Access quizzes on any device, anytime. Perfect for learning on the go.</p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-10 h-10 bg-nav-primary/10 rounded-xl mb-3">
                <FaUsers className="h-5 w-5 text-nav-primary" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Challenge Friends</h3>
              <p className="text-sm text-gray-500">Compete with friends and see who can achieve the highest score.</p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-10 h-10 bg-nav-primary/10 rounded-xl mb-3">
                <FaTrophy className="h-5 w-5 text-nav-primary" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Earn Rewards</h3>
              <p className="text-sm text-gray-500">Collect points and badges as you progress through different quizzes.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-nav-primary/10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-nav-primary">1000+</p>
              <p className="mt-1 text-sm text-gray-500">Quizzes Available</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-nav-primary">50K+</p>
              <p className="mt-1 text-sm text-gray-500">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-nav-primary">100K+</p>
              <p className="mt-1 text-sm text-gray-500">Questions Answered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}