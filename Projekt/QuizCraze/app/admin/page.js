'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaQuora, FaChartLine, FaSpinner, FaTrash } from 'react-icons/fa';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, quizzesRes] = await Promise.all([
          axios.get('/user/all'),
          axios.get('/quiz/all')
        ]);
        setUsers(usersRes.data.data || []);
        setQuizzes(quizzesRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await axios.delete(`/user/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-[#A7D129]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
              <FaUsers className="text-2xl text-[#A7D129]" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
            <p className="text-sm text-gray-500 mt-2">
              {users.filter(u => u.rootAccess).length} administrators
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Quizzes</h3>
              <FaQuora className="text-2xl text-[#A7D129]" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{quizzes.length}</p>
            <p className="text-sm text-gray-500 mt-2">
              Avg. {(quizzes.reduce((acc, quiz) => acc + quiz.popularity, 0) / quizzes.length || 0).toFixed(1)} plays per quiz
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Stats</h3>
              <FaChartLine className="text-2xl text-[#A7D129]" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {quizzes.reduce((acc, quiz) => acc + (quiz.questions?.length || 0), 0)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Total questions created</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Users Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quizzes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600">
                            {user.nickname[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.nickname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.rootAccess ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.rootAccess ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.quizzes?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.privacy ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
                        {user.privacy ? 'Private' : 'Public'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-red-100 transition-colors duration-150"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Error Message */}
        {deleteError && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
            <p>{deleteError}</p>
          </div>
        )}
      </div>
    </div>
  );
}