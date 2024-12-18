import Navigation from "../components/Navigation";
// import SearchSection from ""
// import PokemonList from "../components/PokemonList"
import "../globals.css";


export const metadata = {
    title: 'Search pokemon',
    description: 'Pokemon list',
};

export default function PokemonLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <header>
                    <Navigation />
                </header>
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}