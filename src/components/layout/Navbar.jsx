import { Search, Bell } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <h1 className="text-xl font-bold">Chattr</h1>
      <div className="flex items-center gap-4">
        <Search size={20} />
        <Bell size={20} />
      </div>
    </div>
  );
};

export default Navbar;
