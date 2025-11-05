/**
 * AuthRouter Component
 * -----------------------------------------------------------
 * Protects private routes by verifying the 'authenticated' cookie.
 * 
 * If the cookie value is "true", the user can access the protected
 * component (children). Otherwise, the user is redirected to /login.
 * 
 * Commonly used to wrap dashboard or user-only pages.
 * -----------------------------------------------------------
 */

import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthRouter = ({ children }) => {
  const isAuthenticated = Cookies.get("authenticated") === "true";

  // Prevent flash of protected content before redirect
  if (isAuthenticated === undefined) return null;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};


export default AuthRouter;
