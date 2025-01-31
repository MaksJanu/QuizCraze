'use client'

import Link from 'next/link';
import React, { useState } from 'react';
import "./Navigation.scss";

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="navbar bg-nav-primary text-nav-third shadow-lg">
      <div className="flex-1">
        <Link 
          href="/"
          className="btn btn-ghost normal-case text-lg font-extrabold tracking-wider"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A7D129] to-[#8CB122] 
            hover:from-[#96BC24] hover:to-[#7BA01E] transition-all duration-300 text-stroke-white inline-block"
            style={{ textShadow: '0 0 2px #a4cd28' }}>
            QuizCraze
          </span>
        </Link>
        
        <div className="hidden md:flex ml-6 gap-4">
          <Link href="/quizzes" className="link link-hover opacity-75 hover:opacity-100 transition-opacity text-sm">
            Explore
          </Link>
          <Link href="/leaderboard" className="link link-hover opacity-75 hover:opacity-100 transition-opacity text-sm">
            Leaderboard
          </Link>
        </div>
      </div>

      <div className="flex-none gap-3">
        <Link 
          href="/create-quiz"
          className="btn btn-sm btn-outline text-xs hover:bg-[#A7D129] hover:border-[#A7D129] hidden sm:flex border-2"
        >
          Create Quiz
        </Link>
        <div className="dropdown dropdown-end">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost btn-circle avatar ring-2 ring-offset-1 ring-[#A7D129] ring-opacity-50"
          >
            <div className="w-8 rounded-full">
              <img
                src={isAuthenticated ? "/avatar-placeholder.png" : "/guest-avatar.png"}
                alt="User avatar"
                className="object-cover"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-48 p-2 shadow text-sm">
            {!isAuthenticated ? (
              <>
                <li>
                  <Link href="/auth/login" className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/profile" className="justify-between text-sm">
                    Profile
                    <span className="badge badge-xs badge-success">New</span>
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="text-sm">Dashboard</Link>
                </li>
                <li className="mt-2 pt-2 border-t border-base-200">
                  <Link href="/" onClick={() => setIsAuthenticated(false)} className="text-error text-sm">
                    Logout
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}