

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



const logout = async () => {
    // 1. Unconditionally clear the token and authenticated flag from storage
    //    This is the CRITICAL, non-negotiable step to solve the race condition.
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("AUTHENTICATED");
    
    // 2. Clear state variables (optional but good practice)
    setUser({});
    setAuthenticated(false);
    
    // 3. Immediately force a page reload
    //    This stops all current JavaScript execution and prevents rogue re-authentication.
    window.location.reload(); 
    
    // 4. Run the backend token invalidation (optional to await, but good practice to include)
    try {
        await UserApi.logout();  
    } catch (error) {
        // Log the error, but the client is already logged out via reload
        console.error("Backend logout failed:", error);  
    }
};


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
