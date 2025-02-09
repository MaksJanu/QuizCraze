
'use client'

import React, { useContext } from 'react';
import StatsContext from '../context/StatsContext';


const formatNumber = (value, numberFormat) => {
    if (!value) return '0';
    
    switch (numberFormat) {
      case 'percentage':
        return `${(value * 100).toFixed(1)}%`;
      case 'decimal':
        return value.toFixed(2);
      case 'rounded':
        return Math.round(value);
      default:
        return value;
    }
  };


const StatsPanel = () => {
  const { stats, preferences, updatePreferences } = useContext(StatsContext);
  const { numberFormat, sortBy, viewType } = preferences;



  const handleFormatChange = (format) => {
    updatePreferences({ ...preferences, numberFormat: format });
  };

  const handleSortChange = (sortOption) => {
    updatePreferences({ ...preferences, sortBy: sortOption });
  };

  const handleViewChange = (view) => {
    updatePreferences({ ...preferences, viewType: view });
  };

  const renderStatItem = (label, value, format = true) => (
    <div className="stat-item">
      <span className="stat-label">{label}</span>
      <span className="stat-value">
        {format ? formatNumber(value, numberFormat) : value}
      </span>
    </div>
  );

  const statsContent = (
    <>
      <div className="stats-section">
        <h2>Podstawowe</h2>
        {renderStatItem('Liczba ulubionych', stats.favoritesCount)}
        {renderStatItem('Najczęstszy typ', stats.mostCommonType, false)}
        {renderStatItem('Średnia ocena', stats.averageRating)}
      </div>
      
      <div className="stats-section">
        <h2>Szczegółowe</h2>
        {renderStatItem('Top 3 Pokemony', stats.top3Pokemons?.join(', '), false)}
        {renderStatItem('Rozkład typów', stats.typeDistribution)}
        {renderStatItem('Historia aktywności', stats.activityHistory, false)}
      </div>
    </>
  );

  return (
    <div className="stats-container">
      <div className="preferences-panel">
        <select onChange={(e) => handleFormatChange(e.target.value)} value={numberFormat}>
          <option value="percentage">Percentage</option>
          <option value="decimal">Decimal</option>
          <option value="rounded">Rounded</option>
        </select>

        <select onChange={(e) => handleSortChange(e.target.value)} value={sortBy}>
          <option value="date">Date</option>
          <option value="name">Name</option>
          <option value="type">Type</option>
        </select>

        <select onChange={(e) => handleViewChange(e.target.value)} value={viewType}>
          <option value="table">Table</option>
          <option value="cards">Cards</option>
        </select>
      </div>

      {viewType === 'table' ? (
        <div className="stats-table">
          {statsContent}
        </div>
      ) : (
        <div className="stats-cards">
          <div className="card">
            <h3>Podstawowe statystyki</h3>
            <div className="card-content">
              {renderStatItem('Liczba ulubionych', stats.favoritesCount)}
              {renderStatItem('Najczęstszy typ', stats.mostCommonType, false)}
              {renderStatItem('Średnia ocena', stats.averageRating)}
            </div>
          </div>
          <div className="card">
            <h3>Szczegółowe statystyki</h3>
            <div className="card-content">
              {renderStatItem('Top 3 Pokemony', stats.top3Pokemons?.join(', '), false)}
              {renderStatItem('Rozkład typów', stats.typeDistribution)}
              {renderStatItem('Historia aktywności', stats.activityHistory, false)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPanel;