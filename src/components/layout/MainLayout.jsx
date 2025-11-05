import { Outlet } from "react-router-dom";
import Navbar from "@components/layout/Navbar";
import Sidebar from "@components/layout/Sidebar";
import Footer from "@components/layout/Footer";
import MessagesModal from "@components/layout/MessagesModal";

/**
 * MainLayout
 * ------------------------------------------------------------------
 * Defines the main page structure:
 * Sidebar (desktop), Navbar, Footer (mobile), and Messages modal.
 * ------------------------------------------------------------------
 */
const MainLayout = () => {
  return (
    <div className="bg-gray-50 min-h-screen relative">
      {/* ------------------------------------------------------------
         * Sidebar – visible on large screens
         * ------------------------------------------------------------ */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-72 border-r border-gray-200 bg-white z-30">
        <Sidebar />
      </aside>

      {/* ------------------------------------------------------------
         * Navbar – fixed at the top
         * ------------------------------------------------------------ */}
      <header className="fixed top-0 left-0 lg:left-64 right-0 h-14 bg-white border-b border-gray-200 z-40 flex items-center">
        <Navbar />
      </header>

      {/* ------------------------------------------------------------
         * Main Content
         * ------------------------------------------------------------ */}
      <main
        className="pt-14 bg-gray-50 overflow-y-auto min-h-screen transition-all"
        style={{ paddingLeft: "calc(100vw >= 1024px ? 256px : 0)" }}
      >
        <div className="p-6 lg:pl-64">
          <Outlet />
        </div>
      </main>

      {/* ------------------------------------------------------------
         * Footer – visible on smaller screens
         * ------------------------------------------------------------ */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 shadow-sm">
        <Footer />
      </div>

      {/* ------------------------------------------------------------
         * Floating Messages Modal
         * ------------------------------------------------------------ */}
      <MessagesModal />
    </div>
  );
};

export default MainLayout;
