import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import TopHeadlines from "./components/TopHeadlines";
import SearchResults from "./components/SearchResults";
import StateNews from "./components/StateNews";
import Login from "./components/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import Profile from "./components/Profile";
import CountryNews from "./MapNewsComponent";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
  const [user, setUser] = useState(null); // State to store user information

  const handleLogin = (userData) => {
    setIsLoggedIn(true); // Set login state to true
    setUser(userData); // Set the logged-in user data
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Set login state to false
    localStorage.removeItem("token"); // Remove token on logout
    setUser(null); // Clear user data on logout
  };

  return (
    <div className="w-full">
      <BrowserRouter>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news/:countryName" element={<CountryNews />} />
          <Route path="/top-headlines/:category" element={<TopHeadlines />} />
          <Route path="/state-news/:stateName" element={<StateNews />} />
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
