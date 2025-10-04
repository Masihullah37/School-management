

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
    // A. Perform the asynchronous server call FIRST.
    //    We don't need to await it, as we will reload anyway.
    UserApi.logout().catch(error => {
        console.error("Backend logout failed:", error);
    });
    
    // B. Synchronous Cleanup: Must execute immediately and fully.
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("AUTHENTICATED");
    
    // C. Reset State (Necessary for any component that renders before the refresh)
    setUser({});
    setAuthenticated(false);
    
    // D. CRITICAL: FORCE PAGE RELOAD
    //    This must be the LAST step to guarantee a clean state.
    //    Execution stops here.
    window.location.reload(); 
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
