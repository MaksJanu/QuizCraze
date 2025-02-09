'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Navigation from "../components/Navigation";
import PokemonDetails from "../components/PokemonDetails";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import "../globals.css";

const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
};

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    const handlePokemonDeselect = () => {
        setSelectedPokemon(null);
    };

    const filteredFavorites = favorites.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div id="pokemon-list-section">
            <main className="favourites-main">
                <div id="search-section">
                    <h3 id="search-name">Search for Pokemon:</h3>
                    <div id="search-bar">
                        <input
                            id="search-input"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </div>
                </div>
                {selectedPokemon && <PokemonDetails pokemon={selectedPokemon} onDeselect={handlePokemonDeselect} />}
                <div id="pokemon-list">
                    {filteredFavorites.map(pokemon => (
                        <div key={pokemon.name} className="pokemon-card" onClick={() => setSelectedPokemon(pokemon)}>
                            <Image src={pokemon.image1} alt={pokemon.name} width={96} height={96} priority />
                            <h3>{pokemon.name}</h3>
                            <h4>Nr: {pokemon.number}</h4>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}