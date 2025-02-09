export default function LeaderboardLayout({ children }) {
    return (
      <div className="leaderboard-layout min-h-screen bg-gradient-to-b from-nav-third via-white to-nav-third">
        {children}
      </div>
    );
  }