import fetchData from "@/lib/FetchPokemons"
import Image from "next/image"


export default async function PokemonList() {
    const pokemonsList = await fetchData()
    return (
        <div id="pokemon-list">
            {pokemonsList.map(pokemon => (
                <div key={pokemon.name} className="pokemon-card">
                    <Image src={pokemon.image1} alt={pokemon.name} width={96} height={96} priority/>
                    <h3>{pokemon.name}</h3>
                    <h4>Nr: {pokemon.number}</h4>
                </div>
            ))}
        </div>
    )
}