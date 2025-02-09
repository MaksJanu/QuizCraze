import Navigation from "./components/Navigation"
import { StatsProvider } from './context/StatsProvider'
import "./globals.css";

export const metadata = {
  title: "Pokemon wiki",
  description: "Pokemon app",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <StatsProvider>
          <header>
            <Navigation />
          </header>
          <main>
            {children}
          </main>
        </StatsProvider>
      </body>
    </html>
  );
}