'use client';

import { useState } from "react";

const PokemonComparison = ({ pokemon1, pokemon2, onClearComparison }) => {
    if (!pokemon1 || !pokemon2) return null;

    return (
        <div id="pokemon-comparison">
            <button onClick={onClearComparison}>Wyczyść porównanie</button>
            <div className="comparison-container">
                <div className="pokemon-details">
                    <h2>{pokemon1.name}</h2>
                    <img src={pokemon1.image2} alt={pokemon1.name} />
                    <div className="detail-types">
                        <h3>Types:</h3>
                        <p>{pokemon1.types.map(type => type.type.name).join(', ')}</p>
                    </div>
                    <div className="detail-stats">
                        <h3>Statistics:</h3>
                        <ul>
                            {pokemon1.stats.map(stat => (
                                <li key={stat.stat}>{stat.stat}: {stat.base_stat} (effort: {stat.effort})</li>
                            ))}
                        </ul>
                    </div>
                    <div className="detail-parameters">
                        <h3>Parameters:</h3>
                        <p>Height: {pokemon1.height} m</p>
                        <p>Weight: {pokemon1.weight} kg</p>
                    </div>
                </div>
                <div className="pokemon-details">
                    <h2>{pokemon2.name}</h2>
                    <img src={pokemon2.image2} alt={pokemon2.name} />
                    <div className="detail-types">
                        <h3>Types:</h3>
                        <p>{pokemon2.types.map(type => type.type.name).join(', ')}</p>
                    </div>
                    <div className="detail-stats">
                        <h3>Statistics:</h3>
                        <ul>
                            {pokemon2.stats.map(stat => (
                                <li key={stat.stat}>{stat.stat}: {stat.base_stat} (effort: {stat.effort})</li>
                            ))}
                        </ul>
                    </div>
                    <div className="detail-parameters">
                        <h3>Parameters:</h3>
                        <p>Height: {pokemon2.height} m</p>
                        <p>Weight: {pokemon2.weight} kg</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonComparison;