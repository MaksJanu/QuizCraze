'use client'

import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { motion } from 'framer-motion';


axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

const validationSchema = Yup.object().shape({
  nickname: Yup.string()
    .min(3, 'Nickname must be at least 3 characters')
    .max(20, 'Nickname must not exceed 20 characters'),
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
});

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  

  const fetchUserData = useCallback(async (userId) => {
    try {
      const response = await axios.get(`/user/${userId}`);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, []);

  const fetchAchievements = useCallback(async (userId) => {
    try {
      const response = await axios.get(`/user/${userId}/achievements`);
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  }, []);

  const handleSettingsChange = async (setting, value) => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.patch(`/user/${userId}`, { [setting]: value });
      await fetchUserData(userId);
      setSuccessMessage('Settings updated successfully');
    } catch (error) {
      setErrorMessage('Failed to update settings');
    }
  };

  const handleSubmit = useCallback(async (values) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userId = localStorage.getItem('userId');
      const updateData = {};

      if (values.nickname && values.nickname !== user?.nickname) {
        updateData.nickname = values.nickname;
      }
      if (values.firstName && values.firstName !== user?.firstName) {
        updateData.firstName = values.firstName;
      }
      if (values.lastName && values.lastName !== user?.lastName) {
        updateData.lastName = values.lastName;
      }

      if (Object.keys(updateData).length === 0) {
        setErrorMessage('No changes to update');
        setIsLoading(false);
        return;
      }

      await axios.patch(`/user/${userId}`, updateData);
      await fetchUserData(userId);
      
      setSuccessMessage('Profile updated successfully');
      setIsEditingNickname(false);
      setIsEditingPersonalInfo(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchUserData]);

  const handleCancelNickname = useCallback(() => {
    setIsEditingNickname(false);
    formik.setFieldValue('nickname', user?.nickname || '');
    formik.setFieldTouched('nickname', false);
  }, [user]);

  const handleCancelPersonalInfo = useCallback(() => {
    setIsEditingPersonalInfo(false);
    formik.setFieldValue('firstName', user?.firstName || '');
    formik.setFieldValue('lastName', user?.lastName || '');
    formik.setFieldTouched('firstName', false);
    formik.setFieldTouched('lastName', false);
  }, [user]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUserData(userId);
      fetchAchievements(userId);
    }
  }, [fetchUserData, fetchAchievements]);

  const formik = useFormik({
    initialValues: {
      nickname: user?.nickname || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmit
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse flex justify-center items-center text-xs">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-gray-600">
                      {user.nickname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{user.nickname}</h2>
                  <p className="text-sm text-gray-600 mb-4">{user.email}</p>
                  <div className="w-full space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member since:</span>
                      <span className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quizzes created:</span>
                      <span className="font-medium">{user.quizzes?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Achievements:</span>
                      <span className="font-medium">{user.achievements?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Cards */}
          <div className="md:col-span-2 space-y-6">
            {/* Form Container */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Profile Settings</h2>
                  <p className="text-xs text-gray-600">Manage your account settings</p>
                </div>

                {successMessage && (
                  <div className="mb-3 p-2 bg-green-50 text-green-700 rounded-md text-xs">
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-3 p-2 bg-red-50 text-red-700 rounded-md text-xs">
                    {errorMessage}
                  </div>
                )}


                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    {/* Email Section */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Email Address</h3>
                            <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                        </div>
                    </div>

                    {/* Nickname Section */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Nickname</h3>
                            {!isEditingNickname && (
                            <p className="text-xs text-gray-600">{user.nickname}</p>
                            )}
                        </div>
                        {!isEditingNickname ? (
                            <button
                            type="button"
                            onClick={() => setIsEditingNickname(true)}
                            className="text-xs text-[#A7D129] hover:text-[#8fb122] font-medium"
                            >
                            Edit
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={handleCancelNickname}
                                className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="text-xs text-[#A7D129] hover:text-[#8fb122] font-medium"
                            >
                                Save
                            </button>
                            </div>
                        )}
                        </div>
                        {isEditingNickname && (
                        <div>
                            <input
                            type="text"
                            id="nickname"
                            name="nickname"
                            value={formik.values.nickname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white px-4 py-2.5
                                focus:border-[#A7D129] focus:ring-[#A7D129] sm:text-sm"
                            />
                            {formik.touched.nickname && formik.errors.nickname && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.nickname}</div>
                            )}
                        </div>
                        )}
                    </div>

                    {/* Personal Info Section */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Personal Information</h3>
                            {!isEditingPersonalInfo && (
                            <p className="text-xs text-gray-600">
                                {user.firstName} {user.lastName}
                            </p>
                            )}
                        </div>
                        {!isEditingPersonalInfo ? (
                            <button
                            type="button"
                            onClick={() => setIsEditingPersonalInfo(true)}
                            className="text-xs text-[#A7D129] hover:text-[#8fb122] font-medium"
                            >
                            Edit
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={handleCancelPersonalInfo}
                                className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="text-xs text-[#A7D129] hover:text-[#8fb122] font-medium"
                            >
                                Save
                            </button>
                            </div>
                        )}
                        </div>
                        {isEditingPersonalInfo && (
                        <div className="space-y-3">
                            <div>
                                <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                placeholder="First Name"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white px-4 py-2.5
                                    focus:border-[#A7D129] focus:ring-[#A7D129] sm:text-sm"
                                />
                                {formik.touched.firstName && formik.errors.firstName && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.firstName}</div>
                                )}
                            </div>
                            <div>
                                <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder="Last Name"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white px-4 py-2.5
                                    focus:border-[#A7D129] focus:ring-[#A7D129] sm:text-sm"
                                />
                                {formik.touched.lastName && formik.errors.lastName && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.lastName}</div>
                                )}
                            </div>
                        </div>
                        )}
                    </div>
                </form>
              </div>
            </div>

            {/* Privacy & Notifications Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Profile Privacy</h4>
                      <p className="text-xs text-gray-600">Make your profile private</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user.privacy}
                        onChange={(e) => handleSettingsChange('privacy', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 
                        peer-focus:ring-[#A7D129] rounded-full peer peer-checked:after:translate-x-full 
                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                        after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                        after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A7D129]">
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Notifications</h4>
                      <p className="text-xs text-gray-600">Receive email notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user.wantNotifications}
                        onChange={(e) => handleSettingsChange('wantNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 
                        peer-focus:ring-[#A7D129] rounded-full peer peer-checked:after:translate-x-full 
                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                        after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                        after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A7D129]">
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="space-y-4">
                  {achievements.length > 0 ? (
                    achievements.map((achievement) => (
                      <div key={achievement._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[#A7D129]/10">
                          <i className={`${achievement.icon} text-[#A7D129] text-xl`}>{achievement.icon}</i>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{achievement.name}</h4>
                          <p className="text-xs text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center p-6 text-center">
                      <div>
                        <i className="fas fa-trophy text-gray-300 text-4xl mb-2"></i>
                        <p className="text-sm text-gray-600">No achievements yet.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;