'use client'

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const QuestionSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(['Single Choice', 'Multiple Choice', 'Open'])
    .required('Question type is required'),
  content: Yup.string().required('Question content is required'),
  answers: Yup.array().of(
    Yup.object().shape({
      content: Yup.string().required('Answer content is required'),
      isCorrect: Yup.boolean().required()
    })
  ).min(1, 'At least one answer is required'),
  hint: Yup.string(),
  timeLimit: Yup.number()
    .min(5, 'Time limit must be at least 5 seconds')
    .max(300, 'Time limit cannot exceed 300 seconds')
});

const defaultValues = {
  type: 'Single Choice',
  content: '',
  answers: [
    { content: '', isCorrect: false },
    { content: '', isCorrect: false }
  ],
  hint: '',
  timeLimit: 30
};

export default function Question({ onSubmit, existingQuestion = null }) {
  const [questionType, setQuestionType] = useState(
    existingQuestion?.type || defaultValues.type
  );

  const formik = useFormik({
    initialValues: existingQuestion || defaultValues,
    validationSchema: QuestionSchema,
    onSubmit,
    enableReinitialize: true
  });

  const addAnswerOption = () => {
    const currentAnswers = formik.values.answers || [];
    formik.setFieldValue('answers', [
      ...currentAnswers,
      { content: '', isCorrect: false }
    ]);
  };

  const removeAnswerOption = (index) => {
    const currentAnswers = formik.values.answers || [];
    const newAnswers = currentAnswers.filter((_, i) => i !== index);
    formik.setFieldValue('answers', newAnswers);
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setQuestionType(newType);
    const newAnswers =
      newType === 'Open'
        ? [{ content: '', isCorrect: true }]
        : [{ content: '', isCorrect: false }, { content: '', isCorrect: false }];
    formik.setFieldValue('type', newType);
    formik.setFieldValue('answers', newAnswers);
  };

  const handleAnswerSelect = (index) => {
    const currentAnswers = [...formik.values.answers];
    if (questionType === 'Single Choice') {
      // For Single Choice: only one answer is correct
      currentAnswers.forEach((answer, i) => {
        answer.isCorrect = i === index;
      });
    } else {
      // For Multiple Choice: toggle current answer
      currentAnswers[index].isCorrect = !currentAnswers[index].isCorrect;
    }
    formik.setFieldValue('answers', currentAnswers);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 bg-white/90 backdrop-blur-sm py-6 px-5 shadow-lg rounded-xl ring-1 ring-gray-100/20 transition-all duration-300 hover:shadow-xl">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Question Type
        </label>
        <select
          name="type"
          value={formik.values.type}
          onChange={handleTypeChange}
          onBlur={formik.handleBlur}
          className="mt-1 block w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm text-gray-900 focus:border-[#A7D129] focus:outline-none focus:ring-1 focus:ring-[#A7D129]/20 transition-colors"
        >
          <option value="Single Choice">Single Choice</option>
          <option value="Multiple Choice">Multiple Choice</option>
          <option value="Open">Open</option>
        </select>
        {formik.touched.type && formik.errors.type && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.type}</div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Question Content
        </label>
        <textarea
          name="content"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.content || ''}
          className="mt-1 block w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm text-gray-900 focus:border-[#A7D129] focus:outline-none focus:ring-1 focus:ring-[#A7D129]/20 transition-colors min-h-[100px]"
        />
        {formik.touched.content && formik.errors.content && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.content}</div>
        )}
      </div>

      <div className="space-y-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {questionType === 'Open' ? 'Correct Answer' : 'Answer Options'}
        </label>
        
        {(formik.values.answers || []).map((answer, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-grow">
              <input
                type="text"
                name={`answers.${index}.content`}
                value={answer.content || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={
                  questionType === 'Open'
                    ? 'Enter correct answer'
                    : `Answer option ${index + 1}`
                }
                className="mt-1 block w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm text-gray-900 focus:border-[#A7D129] focus:outline-none focus:ring-1 focus:ring-[#A7D129]/20 transition-colors"
              />
              {formik.touched.answers?.[index]?.content && 
               formik.errors.answers?.[index]?.content && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.answers[index].content}
                </div>
              )}
            </div>

            {(questionType === 'Single Choice' || questionType === 'Multiple Choice') && (
              <div className="flex items-center">
                <input
                  type={questionType === 'Multiple Choice' ? 'checkbox' : 'radio'}
                  name={`answers.${index}.isCorrect`}
                  checked={answer.isCorrect || false}
                  onChange={() => handleAnswerSelect(index)}
                  className="h-4 w-4 text-[#A7D129] focus:ring-[#A7D129]/20 border-gray-300 transition-colors"
                />
              </div>
            )}

            {(questionType === 'Single Choice' || questionType === 'Multiple Choice') && 
             formik.values.answers.length > 2 && (
              <button
                type="button"
                onClick={() => removeAnswerOption(index)}
                className="text-red-400 hover:text-red-600 transition-colors text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {(questionType === 'Single Choice' || questionType === 'Multiple Choice') && (
          <button
            type="button"
            onClick={addAnswerOption}
            className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#A7D129] to-[#8CB122] hover:from-[#96BC24] hover:to-[#7BA01E] shadow-sm hover:shadow-md transform hover:scale-[1.01] focus:outline-none focus:ring-1 focus:ring-[#A7D129] focus:ring-offset-2 transition-all duration-300"
          >
            Add Answer Option
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Hint (Optional)
        </label>
        <input
          type="text"
          name="hint"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.hint || ''}
          className="mt-1 block w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm text-gray-900 focus:border-[#A7D129] focus:outline-none focus:ring-1 focus:ring-[#A7D129]/20 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Time Limit (seconds)
        </label>
        <input
          type="number"
          name="timeLimit"
          min="5"
          max="300"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.timeLimit || 30}
          className="mt-1 block w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm text-gray-900 focus:border-[#A7D129] focus:outline-none focus:ring-1 focus:ring-[#A7D129]/20 transition-colors"
        />
        {formik.touched.timeLimit && formik.errors.timeLimit && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.timeLimit}</div>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-[#A7D129] to-[#8CB122] hover:from-[#96BC24] hover:to-[#7BA01E] shadow-sm hover:shadow-md transform hover:scale-[1.01] focus:outline-none focus:ring-1 focus:ring-[#A7D129] focus:ring-offset-2 transition-all duration-300"
        >
          {existingQuestion ? 'Update Question' : 'Add Question'}
        </button>
      </div>
    </form>
  );
}