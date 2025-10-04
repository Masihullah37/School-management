

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

  // const logout = () => {

  //   setUser({});
  //   setAuthenticated(false);
  // };

  // StudentContext.jsx

const logout = async () => {
    try {
        // 1. Invalidate the token on the backend
        await UserApi.logout(); 
    } catch (error) {
        // Log the error but continue with client-side cleanup
        console.error("Backend logout failed:", error); 
    }
    
    // 2. Clear the user object
    setUser({});

    // 3. Update the authenticated status
    setAuthenticated(false);
    
    // 4.CRITICAL FIX: Remove the token from Local Storage
    window.localStorage.removeItem("token"); 
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
