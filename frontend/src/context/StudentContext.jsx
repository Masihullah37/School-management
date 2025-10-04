

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
    // 1. Unconditionally clear local storage *before* the async call
    //    This is the fastest client-side assurance.
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("AUTHENTICATED"); // Best practice to remove this too

    // 2. Clear state variables
    setUser({});
    _setAuthenticated(false); // Call the internal setter directly if possible, or use setAuthenticated(false)

    // 3. Immediately force a page reload to kill all remaining state
    //    This prevents any rogue app initialization code from running.
    window.location.reload(); 
    
    // 4. Run the backend call (optional to await, but good practice to include)
    try {
        await UserApi.logout();  
    } catch (error) {
        // Log the error but continue—client is already logged out via reload
        console.error("Backend logout failed:", error);  
    }
};

// NOTE: Since you are calling window.location.reload(), the lines below 
// setUser({}) and setAuthenticated(false) are technically not strictly necessary 
// but are kept for good practice, though they won't execute if the reload is fast.

// Be sure to use the public setAuthenticated wrapper for consistency:
/*
const logout = async () => {
    // 1. Clean up client-side storage first
    window.localStorage.removeItem("token");
    setAuthenticated(false); // This removes AUTHENTICATED key
    setUser({});

    // 2. Immediately reload to clear app state
    window.location.reload(); 

    // 3. Run backend call
    try {
        await UserApi.logout();  
    } catch (error) {
        console.error("Backend logout failed:", error);  
    }
};
*/
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
