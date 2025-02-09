'use client'

import React, { useReducer, useEffect } from 'react';
import StatsContext from './StatsContext';
import statsReducer from '../reducers/statsReducer';

export const StatsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(statsReducer, {
    data: [],
    stats: {},
    preferences: JSON.parse(localStorage.getItem('preferences')) || {
      numberFormat: 'percentage',
      sortBy: 'date',
      viewType: 'table'
    }
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = JSON.parse(localStorage.getItem('pokemonData')) || [];
        dispatch({ type: 'LOAD_DATA', payload: data });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadInitialData();
  }, []);

  const updatePreferences = (newPreferences) => {
    localStorage.setItem('preferences', JSON.stringify(newPreferences));
    dispatch({ type: 'UPDATE_PREFERENCES', payload: newPreferences });
  };

  return (
    <StatsContext.Provider value={{
      ...state,
      updatePreferences,
      dispatch
    }}>
      {children}
    </StatsContext.Provider>
  );
};

export default StatsProvider;