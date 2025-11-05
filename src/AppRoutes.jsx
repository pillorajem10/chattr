import { Routes, Route } from "react-router-dom";

// layouts
import MainLayout from "@components/layout/MainLayout";

// pages
import Home from "@pages/Home";
import Login from "@pages/Login";
import Register from "@pages/Register";
import Default from "@pages/Default";

// routers
import AuthRouter from "@routers/AuthRouter";
import NonAuthRouter from "@routers/NonAuthRouter";

// context
import { PostModalProvider } from "@contexts/PostModalContext";

/**
 * AppRoutes Configuration
 * ------------------------------------------------------------------
 * File: AppRoutes.jsx
 *
 * Centralized route configuration for the application.
 * Handles route segmentation for both authenticated and
 * non-authenticated users.
 *
 * Includes:
 *  - Public routes for Login and Register (wrapped in NonAuthRouter)
 *  - Protected routes under MainLayout (wrapped in AuthRouter)
 *  - Context provider (PostModalProvider) scoped to authenticated views
 *  - Default 404 fallback route
 *
 * Layout:
 *  - MainLayout → includes navbar, sidebar, and nested pages
 *  - Each route defined via React Router v6 structure
 * ------------------------------------------------------------------
 */
const AppRoutes = () => (
  <Routes>
    {/* ------------------------------------------------------------
         Non-Authenticated Routes (Login, Register)
       ------------------------------------------------------------ */}
    {[
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ].map(({ path, element }) => (
      <Route
        key={path}
        path={path}
        element={<NonAuthRouter>{element}</NonAuthRouter>}
      />
    ))}

    {/* ------------------------------------------------------------
         Authenticated Routes (Requires Auth)
       ------------------------------------------------------------ */}
    <Route
      path="/"
      element={
        <AuthRouter>
          <PostModalProvider>
            <MainLayout />
          </PostModalProvider>
        </AuthRouter>
      }
    >
      <Route index element={<Home />} />
    </Route>

    {/* ------------------------------------------------------------
         Fallback Route — 404 Page
       ------------------------------------------------------------ */}
    <Route path="*" element={<Default />} />
  </Routes>
);

export default AppRoutes;
