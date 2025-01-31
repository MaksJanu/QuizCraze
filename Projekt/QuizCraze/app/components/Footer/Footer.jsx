'use client'

import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="flex flex-col items-center space-y-2">
            <a 
              href="https://github.com/MaksJanu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <FaGithub className="h-5 w-5" />
            </a>
            <a 
              href="https://github.com/MaksJanu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-nav-primary hover:text-indigo-600 transition-colors duration-200 text-sm font-medium"
            >
              Created by Maksymilian Januszewski
            </a>
          </div>
          
          <div className="text-center">
            <span className="text-gray-500 text-xs">© 2025 QuizCraze. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;