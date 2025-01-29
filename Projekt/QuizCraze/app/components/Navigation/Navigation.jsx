import Link from 'next/link';
import React from 'react';
import "./Navigation.scss";

export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="container">
        <div className="nav-content">
          {/* Logo/Title */}
          <div className="logo">
            <Link href="/" className="title">
              QuizCraze
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="nav-links">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/quizzes" className="nav-link">
              Quizzes
            </Link>
            <Link href="/profile" className="nav-link">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}