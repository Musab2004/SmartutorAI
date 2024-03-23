// UserContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Function to set user data
  const setUser = (user) => {
    setUserData(user);
    setLoggedIn(true);
    localStorage.setItem('userData', JSON.stringify(user)); // Store user data in localStorage
  };

  useEffect(() => {
    // Check if user data exists in localStorage on component mount (app initialization)
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setLoggedIn(true);
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Function to clear user data
  const clearUser = () => {
    setUserData(null);
    setLoggedIn(false);
    localStorage.removeItem('userData'); // Remove user data from localStorage
  };

  return (
    <UserContext.Provider value={{ loggedIn, userData, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
