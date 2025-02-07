export default function PlayLayout({ children }) {
    return (
      <div className="play-layout min-h-screen bg-gradient-to-b from-nav-third via-white to-nav-third">
        {children}
      </div>
    );
  }