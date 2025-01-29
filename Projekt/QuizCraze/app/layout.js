import Navigation from "./components/Navigation/Navigation"
import "./globals.scss";


export const metadata = {
  title: "Quiz Craze",
  description: "Quiz app for everyone",
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