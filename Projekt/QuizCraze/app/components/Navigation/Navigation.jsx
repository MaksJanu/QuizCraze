'use client'

import React, { useState, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:4000/api';
    axios.defaults.withCredentials = true;

    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      const userId = localStorage.getItem('userId');
      const rootAccess = localStorage.getItem('rootAccess') === 'true';
      setIsAuthenticated(authStatus && userId);
      setIsAdmin(rootAccess);

      const protectedRoutes = ['/explore', '/leaderboard', '/admin'];
      if ((!authStatus || !userId) && protectedRoutes.some(route => pathname.startsWith(route))) {
        router.push('/auth/login');
      }

      if (pathname.startsWith('/admin') && !rootAccess) {
        router.push('/');
      }
    };

    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authStateChange', handleAuthChange);
    return () => window.removeEventListener('authStateChange', handleAuthChange);
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('userId');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('rootAccess');

      setIsAuthenticated(false);
      setIsAdmin(false);
      
      await axios.post('/auth/logout').catch(error => {
        console.warn('Server logout failed, but local logout succeeded:', error);
      });

      window.dispatchEvent(new Event('authStateChange'));
      setIsMobileMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
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
    setIsMobileMenuOpen(false);
  };

  const NavLinks = ({ isMobile }) => (
    <>
      {isAuthenticated && (
        <Link 
          href="/create-quiz"
          className="relative inline-flex items-center px-4 py-2 border-2 border-[#A7D129] text-sm font-semibold rounded-lg text-[#A7D129] bg-transparent overflow-hidden transition-all duration-300 hover:text-white group"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="relative z-10">Create Quiz</span>
          <div className="absolute inset-0 bg-[#A7D129] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
        </Link>
      )}
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
      {isAuthenticated && (
        <>
          <Link 
            href="/profile"
            className="text-sm font-medium opacity-85 hover:opacity-100 transition-all duration-300 hover:text-[#A7D129]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Profile
          </Link>
          <Link 
            href="/dashboard"
            className="text-sm font-medium opacity-85 hover:opacity-100 transition-all duration-300 hover:text-[#A7D129]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          {isAdmin && (
            <Link 
              href="/admin"
              className="text-sm font-medium opacity-85 hover:opacity-100 transition-all duration-300 hover:text-[#A7D129]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin Panel
            </Link>
          )}
        </>
      )}
    </>
  );

  return (
    <nav className="backdrop-blur-md bg-opacity-70 bg-nav-primary border-b border-gray-800/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex flex-1 justify-center mx-10">
            <div className="flex items-center gap-8">
              <NavLinks isMobile={false} />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-[#A7D129] transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center">
            {!isAuthenticated ? (
              <Link
                href="/auth/login"
                className="relative inline-flex items-center px-6 py-2.5 border-2 border-[#A7D129] text-sm font-semibold rounded-lg text-[#A7D129] bg-transparent overflow-hidden transition-all duration-300 hover:text-white group"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-[#A7D129] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-500 hover:text-red-400 transition-all duration-300 hover:scale-105"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-20 left-0 right-0 bottom-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg overflow-y-auto">
            <div className="flex flex-col gap-6 p-6">
              <NavLinks isMobile={true} />
              {!isAuthenticated ? (
                <Link
                  href="/auth/login"
                  className="text-center py-3 px-6 bg-[#A7D129] text-white rounded-lg text-sm font-medium hover:bg-[#96BC24] transition-colors w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-center py-3 px-6 text-sm font-medium text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500 rounded-lg w-full"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
