let pokemons = [];
let selectedPokemon = null;
let searchedValue = null


const App = () => {

    const fetchData = async () => {
        try {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
            if (!response.ok) {
                throw new Error("Network response was not ok!");
            }
            const data = await response.json();
            const pokemonPromises = data.results.map(async (pokemon) => {
                const detailsResponse = await fetch(pokemon.url);
                return await detailsResponse.json();
            });
            const fetchedPokemons = await Promise.all(pokemonPromises);
            pokemons = fetchedPokemons.map(pokemon => ({
                name: pokemon.name,
                image1: pokemon.sprites.front_default,
                image2: pokemon.sprites.front_shiny,
                number: pokemon.order,
                types: pokemon.types,
                stats: pokemon.stats.map(stat => ({
                    base_stat: stat.base_stat,
                    effort: stat.effort,
                    stat: stat.stat.name
                })),
                height: pokemon.height,
                weight: pokemon.weight,
            }));
            render();
        } catch (error) {
            console.error(`Something went wrong with your fetch: ${error}`);
        }
    };

    const handlePokemonClick = (pokemon) => {
        selectedPokemon = pokemon;
        render();
    };

    const render = () => {
        ReactDOM.render(
            <div>
                <SearchSection />
                <PokemonList pokemons={pokemons} onPokemonClick={handlePokemonClick} />
                {selectedPokemon && <PokemonDetails pokemon={selectedPokemon} />}
            </div>,
            document.getElementById("root")
        );
    };

    fetchData();

    return null;
};

const SearchSection = () => {
    return (
        <div id="search-section">
            <img id="pokemon-logo" src="../assets/poke_img.png" alt="pokemon-logo-pic" />
            <h3>Search for Pokemon:</h3>
            <div id="search-bar">
                <input id="search-input" type="text" onChange={event => {
                    searchedValue = event.target.value
                    if (event.target.value === "") {
                        searchedValue = null
                    }
                    root.render(<App />)
                }}/>
                <button>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>
        </div>
    );
};

const PokemonList = ({ pokemons, onPokemonClick }) => {
    const pokemonsList = searchedValue !== null ? pokemons.filter(p => p.name.toLowerCase().includes(searchedValue.toLowerCase())) : pokemons
    return (
        <div id="pokemon-list">
            {pokemonsList.map(pokemon => (
                <div key={pokemon.name} className="pokemon-card" onClick={() => onPokemonClick(pokemon)}>
                    <img src={pokemon.image1} alt={pokemon.name} />
                    <h3>{pokemon.name}</h3>
                    <h4>Nr: {pokemon.number}</h4>
                </div>
            ))}
        </div>
    );
};

const PokemonDetails = ({ pokemon }) => {
    return (
        <div id="pokemon-details" onClick={() => {
            document.getElementById("pokemon-details").style.display = "none"
            console.log(pokemon)
            }}>
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
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);