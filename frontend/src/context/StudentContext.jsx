

import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import UserApi from "../services/Api/UserApi.js";

export const StudentStateContext = createContext({
  user: {},
  authenticated: false,
  setUser: () => {},
  logout: () => {},
  login: async () => {},
  setAuthenticated: () => {},
  setToken: () => {},
});

export default function StudentContext({ children }) {
  const [user, setUser] = useState({});
  const [authenticated, _setAuthenticated] = useState(
    window.localStorage.getItem("AUTHENTICATED") === "true"
  );

  const login = async (email, password) => {
    return await UserApi.login(email, password);
  };


// const logout = async () => {
//   console.log('🔄 Logout function started');
  
//   // Debug current storage state
//   console.log('Before removal - Token:', window.localStorage.getItem('token'));
//   console.log('Before removal - Auth:', window.localStorage.getItem('AUTHENTICATED'));
  
//   try {
//     await UserApi.logout();
//     console.log('✅ Backend logout successful');
//   } catch (error) {
//     console.error('❌ Backend logout failed:', error);
//   }
  
//   // Clear storage with force
//   window.localStorage.removeItem('token');
//   window.localStorage.removeItem('AUTHENTICATED');
  
//   // Force storage sync
//   window.localStorage.clear();
  
//   // Debug after removal
//   console.log('After removal - Token:', window.localStorage.getItem('token'));
//   console.log('After removal - Auth:', window.localStorage.getItem('AUTHENTICATED'));
  
//   setUser({});
//   setAuthenticated(false);
  
//   // Add cache busting to reload
//   const timestamp = new Date().getTime();
//   window.location.href = window.location.origin + '?nocache=' + timestamp;
// };

  const logout = async () => {
  console.log("🔄 Logout function started");
  
  // Clear storage FIRST
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("AUTHENTICATED");
  window.localStorage.clear();
  
  console.log("After removal - Token:", window.localStorage.getItem("token"));
  console.log("After removal - Auth:", window.localStorage.getItem("AUTHENTICATED"));
  
  // Reset state
  n({});
  a(false);
  
  // Try backend logout but don't wait for it
  ui.logout().catch(d => {
    console.error("❌ Backend logout failed:", d);
  });
  
  // FORCE complete reload - use location.replace to prevent back button issues
  setTimeout(() => {
    window.location.replace(window.location.origin + '?logout=' + new Date().getTime());
  }, 100);
}

  const setAuthenticated = (isAuthenticated) => {
    _setAuthenticated(isAuthenticated);
    window.localStorage.setItem("AUTHENTICATED", isAuthenticated);
  };

  const setToken = (token) => {
    window.localStorage.setItem("token", token);
  };

  return (
    <StudentStateContext.Provider
      value={{
        user,
        login,
        logout,
        setUser,
        authenticated,
        setAuthenticated,
        setToken,
      }}
    >
      {children}
    </StudentStateContext.Provider>
  );
}

StudentContext.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUserContext = () => useContext(StudentStateContext);
