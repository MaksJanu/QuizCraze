export default function DetailsLayout({ children }) {
    return (
      <div className="explore-layout min-h-screen bg-gradient-to-b from-nav-third via-white to-nav-third">
        {children}
      </div>
    );
  }