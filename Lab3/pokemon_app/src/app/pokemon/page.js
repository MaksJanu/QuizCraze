'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import PokemonList from "../components/PokemonList";
import PokemonDetails from "../components/PokemonDetails";
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

    const pokemonTypes = [
        'all', 'normal', 'fire', 'water', 'grass', 'electric', 'ice', 
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
        'rock', 'ghost', 'dark', 'dragon', 'steel', 'fairy'
    ];

    useEffect(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (selectedType && selectedType !== 'all') params.set('type', selectedType);
        if (limit !== '20') params.set('limit', limit);
        router.push(`/pokemon?${params.toString()}`);
    }, [searchQuery, selectedType, limit]);

    const handlePokemonDeselect = () => {
        setSelectedPokemon(null);
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
            <PokemonList 
                onPokemonSelect={setSelectedPokemon} 
                searchQuery={searchQuery}
                selectedType={selectedType}
                limit={parseInt(limit)}
            />
        </div>
    );
}