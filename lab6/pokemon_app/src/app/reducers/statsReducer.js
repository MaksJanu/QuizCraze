const getMostCommonType = (data) => {
    const typeCounts = data.reduce((acc, pokemon) => {
      acc[pokemon.type] = (acc[pokemon.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  };
  
  const getTop3Pokemons = (data) => {
    return data
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
      .map(pokemon => pokemon.name);
  };
  
  const getTypeDistribution = (data) => {
    const total = data.length;
    const typeCounts = data.reduce((acc, pokemon) => {
      acc[pokemon.type] = (acc[pokemon.type] || 0) + 1;
      return acc;
    }, {});
    return Object.values(typeCounts)
      .map(count => count / total)
      .reduce((a, b) => a + b, 0);
  };
  
  const getActivityHistory = (data) => {
    return data
      .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
      .map(pokemon => `${pokemon.name} (${new Date(pokemon.addedDate).toLocaleDateString()})`)
      .slice(0, 5)
      .join(', ');
  };
  
  const calculateStats = (data) => {
    return {
      favoritesCount: data.filter(pokemon => pokemon.isFavorite).length,
      mostCommonType: getMostCommonType(data),
      averageRating: data.reduce((acc, pokemon) => acc + (pokemon.rating || 0), 0) / data.length,
      top3Pokemons: getTop3Pokemons(data),
      typeDistribution: getTypeDistribution(data),
      activityHistory: getActivityHistory(data)
    };
  };
  
  const statsReducer = (state, action) => {
    switch(action.type) {
      case 'LOAD_DATA':
        return {
          ...state,
          data: action.payload,
          stats: calculateStats(action.payload)
        };
      
      case 'CALCULATE_STATS':
        return {
          ...state,
          stats: calculateStats(state.data)
        };
      
      case 'SORT_DATA':
        const sortedData = [...state.data].sort((a, b) => {
          switch(action.payload.sortBy) {
            case 'name':
              return a.name.localeCompare(b.name);
            case 'type':
              return a.type.localeCompare(b.type);
            case 'date':
              return new Date(b.addedDate) - new Date(a.addedDate);
            default:
              return 0;
          }
        });
        return {
          ...state,
          data: sortedData
        };
      
      case 'FILTER_DATA':
        const filteredData = state.data.filter(pokemon => 
          pokemon.type === action.payload.type
        );
        return {
          ...state,
          filteredData
        };
  
      case 'UPDATE_PREFERENCES':
        return {
          ...state,
          preferences: action.payload
        };
      
      default:
        return state;
    }
  };
  
  export default statsReducer;