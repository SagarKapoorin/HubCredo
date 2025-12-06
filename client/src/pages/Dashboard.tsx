import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-2xl mb-4">
        <div className="rounded-lg bg-emerald-900/50 border border-emerald-700/80 px-4 py-2 text-sm text-emerald-100 shadow-md shadow-emerald-900/40">
          Welcome {user?.name ? `${user.name}` : "back"}, you are signed in as{" "}
          <span className="font-medium">{user?.email}</span>
        </div>
      </div>
      <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-700/60 rounded-2xl shadow-2xl backdrop-blur-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-50">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-200 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            Logout
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-xl font-semibold text-slate-100">Welcome to your HubCredo dashboard</p>
          <p className="text-slate-300">
            Logged in as <span className="font-medium">{user?.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
