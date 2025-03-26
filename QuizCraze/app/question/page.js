'use client';
import React from 'react';
import Question from '../components/Question/Question';

export default function TestQuestionPage() {
  const handleSubmit = (values) => {
    // Test handler
    console.log('Question submitted:', values);
    alert('Question submitted successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Question</h1>
      <Question onSubmit={handleSubmit} />
    </div>
  );
}