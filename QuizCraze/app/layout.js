
import Navigation from './components/Navigation/Navigation';
import Breadcrumb from './components/Breadcrumb/Breadcrumb';
import Footer from './components/Footer/Footer';
import './globals.scss';

export const metadata = {
  title: 'Quiz Craze',
  description: 'Quiz app for everyone',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-base-100 text-base-900">
          <header>
            <Navigation />
          </header>
          <main>
            <Breadcrumb />
            {children}
          </main>
          <Footer />
      </body>
    </html>
  );
}