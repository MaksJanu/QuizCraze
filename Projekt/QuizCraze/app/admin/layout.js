export default function AdminLayout({ children }) {
    return (
      <div className="admin-layout min-h-screen bg-gradient-to-b from-nav-third via-white to-nav-third">
        {children}
      </div>
    );
}