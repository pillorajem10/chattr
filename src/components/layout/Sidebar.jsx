import {
  Home,
  LogOut,
  Bell,
  MessageCircle,
  PlusSquare,
  User,
} from "lucide-react";
import actions from "@actions";

const Sidebar = () => {
  const handleLogout = async () => {
    await actions.logout();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col justify-between bg-white py-8 px-6">
      {/* Top Section */}
      <div>
        <h1 className="text-3xl font-extrabold mb-6 tracking-tight text-gray-800">
          Chattr
        </h1>

        <nav className="flex flex-col gap-6">
          <button className="flex items-center gap-4 text-lg text-gray-700 hover:text-blue-600 transition-colors">
            <Home size={26} strokeWidth={2} /> Home
          </button>

          <button className="flex items-center gap-4 text-lg text-gray-700 hover:text-blue-600 transition-colors">
            <MessageCircle size={26} strokeWidth={2} /> Messages
          </button>

          <button className="flex items-center gap-4 text-lg text-gray-700 hover:text-blue-600 transition-colors">
            <Bell size={26} strokeWidth={2} /> Notifications
          </button>

          <button className="flex items-center gap-4 text-lg text-gray-700 hover:text-blue-600 transition-colors">
            <PlusSquare size={26} strokeWidth={2} /> Create
          </button>

          <button className="flex items-center gap-4 text-lg text-gray-700 hover:text-blue-600 transition-colors">
            <User size={26} strokeWidth={2} /> Profile
          </button>
        </nav>
      </div>

      {/* Bottom Section */}
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 text-lg text-gray-700 hover:text-red-600 transition-colors"
        >
          <LogOut size={26} strokeWidth={2} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
