import { Home, PlusSquare, MessageCircle, User, LogOut } from "lucide-react";
import actions from "@actions";

const Footer = () => {
  const handleLogout = async () => {
    await actions.auth.logoutAction();
  };

  return (
    <div className="flex justify-around items-center py-3 border-t border-gray-200 bg-white">
      <button className="hover:text-blue-600 transition-colors">
        <Home size={22} />
      </button>

      <button className="hover:text-blue-600 transition-colors">
        <PlusSquare size={22} />
      </button>

      <button className="hover:text-blue-600 transition-colors">
        <MessageCircle size={22} />
      </button>

      <button className="hover:text-blue-600 transition-colors">
        <User size={22} />
      </button>

      <button
        onClick={handleLogout}
        className="hover:text-red-600 transition-colors"
      >
        <LogOut size={22} />
      </button>
    </div>
  );
};

export default Footer;
