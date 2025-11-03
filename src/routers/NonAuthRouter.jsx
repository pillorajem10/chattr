/**
 * NonAuthRouter Component
 * -----------------------------------------------------------
 * Restricts access to authentication pages (like login or register)
 * for users who are already logged in.
 * 
 * If the 'authenticated' cookie is "true", the user is redirected
 * to the home page (/). Otherwise, the guest content (children)
 * is rendered normally.
 * 
 * Commonly used to wrap login and registration routes.
 * -----------------------------------------------------------
 */

import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const NonAuthRouter = ({ children }) => {
  const isAuthenticated = Cookies.get('authenticated') === 'true';
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

export default NonAuthRouter;
