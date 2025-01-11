'use client';

import { useState, useEffect } from "react";

const addToFavorites = (pokemon) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.name === pokemon.name)) {
        favorites.push(pokemon);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
};

const removeFromFavorites = (pokemon) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.name !== pokemon.name);
    localStorage.setItem('favorites', JSON.stringify(favorites));
};

const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
};

const PokemonDetails = ({ pokemon, onDeselect  }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const favorites = getFavorites();
        setIsFavorite(favorites.some(fav => fav.name === pokemon.name));
    }, [pokemon]);

    const handleFavoriteToggle = (e) => {
        e.stopPropagation();
        if (isFavorite) {
            removeFromFavorites(pokemon);
        } else {
            addToFavorites(pokemon);
        }
        setIsFavorite(!isFavorite);
    };

    return (
        <div id="pokemon-details" onClick={onDeselect}>
            <div className="detail-container">
                <div className="detail-header">
                    <h2>{pokemon.name}</h2>
                    <img src={pokemon.image2} alt={pokemon.name} />
                </div>
                <div className="detail-types">
                    <h3>Types:</h3>
                    <p>{pokemon.types.map(type => type.type.name).join(', ')}</p>
                </div>
                <div className="detail-stats">
                    <h3>Statistics:</h3>
                    <ul>
                        {pokemon.stats.map(stat => (
                            <li key={stat.stat}>{stat.stat}: {stat.base_stat} (effort: {stat.effort})</li>
                        ))}
                    </ul>
                </div>
                <div className="detail-parameters">
                    <h3>Parameters:</h3>
                    <p>Height: {pokemon.height} m</p>
                    <p>Weight: {pokemon.weight} kg</p>
                </div>
                <button onClick={handleFavoriteToggle}>
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
            </div>
        </div>
    );
};

export default PokemonDetails;