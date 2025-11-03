// libraries
import { Outlet } from "react-router-dom";

// components
import Navbar from "@components/layout/Navbar";
import Sidebar from "@components/layout/Sidebar";
import Footer from "@components/layout/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col md:flex-row">
      {/* Sidebar (Visible on large screens only) */}
      <aside className="hidden md:flex md:w-1/5 lg:w-1/6 xl:w-1/5 border-r border-gray-200 bg-white p-4 sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:h-screen overflow-y-auto bg-gray-50">
        {/* Navbar (Visible on small to medium screens only) */}
        <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm">
          <Navbar />
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 mt-14 md:mt-0 mb-16 md:mb-0 overflow-y-auto px-4">
          <Outlet />{" "}
          {/* ✅ This is where your child page (e.g., Home) renders */}
        </div>

        {/* Footer Menu (Visible on small to medium screens only) */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 shadow-sm">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
