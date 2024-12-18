

const fetchData = async () => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20`);
        if (!response.ok) {
            throw new Error("Network response was not ok!");
        }
        const data = await response.json();
        const pokemonPromises = data.results.map(async (pokemon) => {
            const detailsResponse = await fetch(pokemon.url);
            return await detailsResponse.json();
        });
        const fetchedPokemons = await Promise.all(pokemonPromises);
        const pokemons = fetchedPokemons.map(pokemon => ({
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
        return pokemons
    } catch (error) {
        console.error(`Something went wrong with your fetch: ${error}`);
    }
};
export default fetchData;