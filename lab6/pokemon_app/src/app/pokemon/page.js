'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import PokemonList from "../components/PokemonList";
import PokemonDetails from "../components/PokemonDetails";
import PokemonComparison from "../components/PokemonComparison";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from "react";

export default function PokemonListPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [selectedType, setSelectedType] = useState(searchParams.get('type') || "");
    const [limit, setLimit] = useState(searchParams.get('limit') || "20");
    const [comparison, setComparison] = useState([]);

    const pokemonTypes = [
        'all', 'normal', 'fire', 'water', 'grass', 'electric', 'ice', 
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
        'rock', 'ghost', 'dark', 'dragon', 'steel', 'fairy'
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 160, behavior: 'smooth' });
    };

    const handlePokemonSelect = (pokemon) => {
        setSelectedPokemon(pokemon);
        scrollToTop();
    };

    const handlePokemonDeselect = () => {
        setSelectedPokemon(null);
    };

    const handleCompareSelect = (pokemon) => {
        setComparison([...comparison, pokemon]);
    };

    const handleClearComparison = () => {
        setComparison([]);
    };

    return (
        <div id="pokemon-list-section">
            <div id="search-section">
                <h3 id="search-name">Search for Pokemon:</h3>
                <div id="search-bar">
                    <input
                        id="search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Pokemon's name...."
                    />
                    <button>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
                <div id="filter-section">
                    <select 
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        {pokemonTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                    />
                </div>
            </div>
            {selectedPokemon && <PokemonDetails pokemon={selectedPokemon} onDeselect={handlePokemonDeselect} />}
            {comparison.length === 2 && <PokemonComparison pokemon1={comparison[0]} pokemon2={comparison[1]} onClearComparison={handleClearComparison} />}
            <PokemonList 
                onPokemonSelect={handlePokemonSelect} 
                onCompareSelect={handleCompareSelect}
                searchQuery={searchQuery}
                selectedType={selectedType}
                limit={parseInt(limit)}
                comparison={comparison}
            />
        </div>
    );
}