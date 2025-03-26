'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaTrophy, FaSpinner, FaMedal, FaStar, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { generatePDF } from '@react-pdf/renderer';


axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;


export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const leaderboardRef = useRef();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`/ranking/global/${25}`);
        setLeaderboard(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankStyles = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-[#FFD700]';
      case 2:
        return 'bg-[#C0C0C0]';
      case 3:
        return 'bg-[#d49757]';
      default:
        return 'bg-gray-200';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="text-[#FFD700] text-2xl" />;
      case 2:
        return <FaMedal className="text-[#C0C0C0] text-2xl" />;
      case 3:
        return <FaMedal className="text-[#d49757] text-2xl" />;
      default:
        return null;
    }
  };

  const handleDownloadPDF = async () => {
    const content = `
    QuizCraze Global Leaderboard
    Generated on ${new Date().toLocaleDateString()}
    
    ${leaderboard.map((player, index) => `
    Rank #${player.rank}
    Player: ${player.nickname || 'Anonymous'}
    Quizzes Completed: ${player.stats.totalQuizzes}
    Average Score: ${Math.round(player.stats.averageScore)}%
    Accuracy: ${Math.round(player.stats.averageCorrectAnswersPercentage)}%
    -------------------
    `).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leaderboard-${new Date().toISOString().split('T')[0]}.txt`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-[#A7D129]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Oops! Something went wrong</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Export Button */}
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Global Leaderboard
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Top players showcasing their quiz mastery
          </p>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-4 py-2 bg-[#A7D129] text-white rounded-lg hover:bg-[#96BC24] transition-colors"
          >
            <FaDownload className="mr-2" />
            Export Leaderboard
          </button>
        </div>

        {/* Rest of your existing code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Your existing top 3 players code */}
          {leaderboard.slice(0, 3).map((player, index) => (
            <motion.div
              key={player.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-white rounded-xl shadow-lg p-6 flex flex-col items-center"
            >
              <div className={`absolute -top-4 w-12 h-12 rounded-full flex items-center justify-center ${getRankStyles(player.rank)}`}>
                <span className="text-white font-bold text-xl">#{player.rank}</span>
              </div>
              <div className="mt-4">{getRankIcon(player.rank)}</div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {player.nickname || 'Anonymous'}
              </h3>
              <div className="mt-4 text-center">
                <p className="text-[#A7D129] font-bold text-2xl">
                  {Math.round(player.stats.averageCorrectAnswersPercentage)}%
                </p>
                <p className="text-gray-500 text-sm">Accuracy</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="font-semibold text-gray-900">{player.stats.totalQuizzes}</p>
                  <p className="text-gray-500 text-sm">Quizzes</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {Math.round(player.stats.averageScore)}
                  </p>
                  <p className="text-gray-500 text-sm">Average Score</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Player</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quizzes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Accuracy</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Avg. Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.slice(3).map((player) => (
                  <motion.tr
                    key={player.userId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900 font-medium">#{player.rank}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-gray-900 font-medium">
                          {player.nickname || 'Anonymous'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {player.stats.totalQuizzes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[#A7D129] font-semibold">
                      {Math.round(player.stats.averageCorrectAnswersPercentage)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {Math.round(player.stats.averageScore)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}