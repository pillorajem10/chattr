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

const AppRoutes = () => (
  <Routes>
    {/* Non-Authenticated Routes */}
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

    {/* Authenticated Routes */}
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

    {/* 404 Fallback */}
    <Route path="*" element={<Default />} />
  </Routes>
);

export default AppRoutes;
