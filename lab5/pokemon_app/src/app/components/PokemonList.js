'use client';

import fetchData from "@/lib/FetchPokemons";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function PokemonList({ onPokemonSelect, onCompareSelect, searchQuery, selectedType, limit, comparison }) {
    const [pokemonsList, setPokemonsList] = useState([]);

    useEffect(() => {
        const fetchPokemons = async () => {
            const pokemons = await fetchData(limit);
            setPokemonsList(pokemons);
        };
        fetchPokemons();
    }, [limit]);

    const filteredPokemons = pokemonsList.filter(pokemon => {
        const matchesSearch = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' || selectedType === '' 
            ? true 
            : pokemon.types.some(t => t.type.name === selectedType);
        return matchesSearch && matchesType;
    });

    const scrollToTop = () => {
        window.scrollTo({ top: 100, behavior: 'smooth' });
    };

    useEffect(() => {
        if (comparison.length === 2) {
            scrollToTop();
        }
    }, [comparison]);

    return (
        <div id="pokemon-list">
            {filteredPokemons.map(pokemon => (
                <div key={pokemon.name} className="pokemon-card" onClick={() => {
                    onPokemonSelect(pokemon);
                }}>
                    <Image src={pokemon.image1} alt={pokemon.name} width={96} height={96} priority />
                    <h3>{pokemon.name}</h3>
                    <h4>Nr: {pokemon.number}</h4>
                    <button onClick={(e) => {
                        e.stopPropagation();
                        onCompareSelect(pokemon);
                    }}>Porównaj</button>
                </div>
            ))}
        </div>
    );
}