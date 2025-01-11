import Navigation from "../components/Navigation";
import "../globals.css";

export const metadata = {
    title: 'Favorites',
    description: 'Favorite Pokemons',
};

export default function FavouriteLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <header>
                    <Navigation />
                </header>
                <main className="favourites-main">
                    {children}
                </main>
            </body>
        </html>
    );
}