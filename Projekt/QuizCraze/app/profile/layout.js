export default function ProfileLayout({ children }) {
    return (
      <div className="profile-layout min-h-screen bg-gradient-to-b from-nav-third via-white to-nav-third">
        {children}
      </div>
    );
  }