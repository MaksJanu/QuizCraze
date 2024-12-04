const pokemonList = document.getElementById("pokemon-list");
const pokemonDetails = document.getElementById("pokemon-details");



const fetchData = async () => {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
        if (!response.ok) {
            throw new Error("Network response was not ok!");
        }
        const data = await response.json()
    
        const pokemonPromises = data.results.map(async (pokemon) => {
            const detailsResponse = await fetch(pokemon.url)
            return await detailsResponse.json()
        })
        const pokemons = await Promise.all(pokemonPromises)
        const mapped_pokemons = pokemons.map(pokemon => ({
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
        }))
        displayPokemons(mapped_pokemons)
        
    } catch (error) {
        console.error(`Something went wrong with your fetch: ${error}`)
    }
}
fetchData()


const displayPokemons = pokemons => {
    pokemonList.innerHTML = ''
    pokemons.forEach(pokemon => {
        const card = document.createElement("div")
        card.classList.add("pokemon-card")
        card.innerHTML += `
            <img src = "${pokemon.image1}" alt = "${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <h4>Nr: ${pokemon.number}</h4>
            `;

        card.addEventListener("click", () => showPokemonDetails(pokemon))
        pokemonList.appendChild(card)
    })
}


const showPokemonDetails = pokemon => {
    pokemonDetails.innerHTML = `
    <div class = "detail-container">
        <div class = "detail-header">
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.image2}" alt="${pokemon.name}">
        </div>
        <div class = "detail-types">
            <h3>Types:</h3>
            <p>${pokemon.types.map(type => type.type.name).join(', ')}</p>
        </div>
        <div class = "detail-stats">
            <h3>Statistics:</h3>
            <ul>
                ${pokemon.stats.map(stat => `
                    <li>${stat.stat}: ${stat.base_stat} (effort: ${stat.effort})</li>
                `).join('')}
            </ul>
        </div>
        <div class = "detail-parameters">
            <h3>Parameters:</h3>
            <p>Height: ${pokemon.height} m</p>
            <p>Weight: ${pokemon.weight} kg</p>
        </div>
    </div>
    `;
    pokemonDetails.style.display = "flex"
    pokemonDetails.addEventListener("click", () => {
        pokemonDetails.style.display = "none"
    })
}