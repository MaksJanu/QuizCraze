'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import "./Navigation.scss";

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Set axios defaults only on client side
    axios.defaults.baseURL = 'http://localhost:4000/api';
    axios.defaults.withCredentials = true;

    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      const userId = localStorage.getItem('userId');
      const rootAccess = localStorage.getItem('rootAccess') === 'true';
      setIsAuthenticated(authStatus && userId);
      setIsAdmin(rootAccess);

      // Protected routes check
      const protectedRoutes = ['/explore', '/leaderboard', '/admin'];
      if ((!authStatus || !userId) && protectedRoutes.some(route => pathname.startsWith(route))) {
        router.push('/auth/login');
      }

      // Admin routes check
      if (pathname.startsWith('/admin') && !rootAccess) {
        router.push('/');
      }
    };

    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authStateChange', handleAuthChange);

    return () => {
      window.removeEventListener('authStateChange', handleAuthChange);
    };
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      // First clear local storage and state
      localStorage.removeItem('userId');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('rootAccess');

      setIsAuthenticated(false);
      setIsAdmin(false);
      
      // Try to logout from server
      await axios.post('/auth/logout').catch(error => {
        console.warn('Server logout failed, but local logout succeeded:', error);
      });

      // Always trigger these regardless of server response
      window.dispatchEvent(new Event('authStateChange'));
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Ensure user is logged out locally even if there's an error
      setIsAuthenticated(false);
      setIsAdmin(false);
      router.push('/');
    }
  };

  const handleProtectedLink = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push('/auth/login');
    }
  };

  return (
    <nav className="backdrop-blur-md bg-opacity-70 bg-nav-primary border-b border-gray-800/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo and primary navigation */}
          <div className="flex items-center gap-10">
            <Link 
              href="/"
              className="flex items-center group"
            >
              <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#A7D129] to-[#8CB122] group-hover:from-[#BDE942] group-hover:to-[#A7D129] transition-all duration-500 ease-out"
                style={{ 
                  textShadow: '0 0 20px rgba(167, 209, 41, 0.3)',
                  letterSpacing: '0.05em'
                }}>
                QuizCraze
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link 
                href="/explore" 
                onClick={(e) => handleProtectedLink(e, '/explore')}
                className="relative text-sm font-medium opacity-85 hover:opacity-100 transition-all duration-300 hover:text-[#A7D129] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#A7D129] after:transition-all after:duration-300"
              >
                Explore
              </Link>
              <Link 
                href="/leaderboard"
                onClick={(e) => handleProtectedLink(e, '/leaderboard')}
                className="relative text-sm font-medium opacity-85 hover:opacity-100 transition-all duration-300 hover:text-[#A7D129] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#A7D129] after:transition-all after:duration-300"
              >
                Leaderboard
              </Link>
            </div>
          </div>

          {/* Auth navigation */}
          <div className="flex items-center gap-6">
            {!isAuthenticated ? (
              <Link
                href="/auth/login"
                className="relative inline-flex items-center px-6 py-2.5 border-2 border-[#A7D129] text-sm font-semibold rounded-lg text-[#A7D129] bg-transparent overflow-hidden transition-all duration-300 hover:text-white group"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-[#A7D129] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </Link>
            ) : (
              <>
                <Link 
                  href="/create-quiz"
                  className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-[#A7D129] hover:bg-[#A7D129]/10 transition-all duration-300"
                >
                  Create Quiz
                </Link>
                <div className="h-6 w-px bg-gray-200 opacity-20" />
                <div className="flex items-center gap-6">
                  <Link 
                    href="/profile"
                    className="relative text-sm font-medium opacity-85 hover:opacity-100 transition-all duration-300 hover:text-[#A7D129] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#A7D129] after:transition-all after:duration-300"
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/dashboard"
                    className="relative text-sm font-medium opacity-85 hover:opacity-100 transition-all duration-300 hover:text-[#A7D129] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#A7D129] after:transition-all after:duration-300"
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link 
                      href="/admin"
                      className="relative text-sm font-medium opacity-85 hover:opacity-100 transition-all duration-300 hover:text-[#A7D129] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#A7D129] after:transition-all after:duration-300"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-500 hover:text-red-400 transition-all duration-300 hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}