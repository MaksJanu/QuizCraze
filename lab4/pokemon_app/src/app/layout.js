import Navigation from "./components/Navigation"
import Image from "next/image";
import "./globals.css";


export const metadata = {
  title: "Pokemon wiki",
  description: "Pokemon app",
};

export default function RootLayout({ children }) {
  return (
      <html lang='en'>
          <body>
              <header>
                <Navigation />
              </header>
              <main>
                <Image src="/images/poke_img.png" alt="Pokemon logo" width={320} height={160} id="pokemon-logo" />
                {children}
              </main>
          </body>
      </html>
  );
}
