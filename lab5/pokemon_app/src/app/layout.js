import Navigation from "./components/Navigation"
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
                {children}
              </main>
          </body>
      </html>
  );
}
