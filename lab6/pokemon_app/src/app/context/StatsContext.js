import { createContext } from 'react';

const StatsContext = createContext({
  data: [],
  stats: {},
  numberFormat: 'percentage',
  sortBy: 'date',
  viewType: 'table',
  preferences: {
    numberFormat: 'percentage',
    sortBy: 'date',
    viewType: 'table'
  },
  updatePreferences: () => {}
});

export default StatsContext;