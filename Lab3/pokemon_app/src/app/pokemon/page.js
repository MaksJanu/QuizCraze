import Image from "next/image"
import PokemonList from "../components/PokemonList"


export default function PokemonListPage() {
    return (
        <div id="pokemon-list-section">
            <div id="search-section">
                <h3 id="search-name">Search for Pokemon:</h3>
                <div id="search-bar">
                    <input id="search-input" type="text"/>
                    <button>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            </div>
            <PokemonList />
        </div>
    )
}