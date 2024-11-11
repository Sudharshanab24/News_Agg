import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import Login from "./Login";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function Header() {
  const [active, setActive] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStates, setShowStates] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [theme, setTheme] = useState("light-theme");
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [showMap, setShowMap] = useState(false); // Added state for showing map

  const categoryRef = useRef(null);
  const stateRef = useRef(null);
  const profileRef = useRef(null);

  const apiKey = 'AIzaSyCP8DPLtL3Nhs-uKBGiAEmdD_cLAkkOVBA'; // Replace with your actual API key

  const countries = [
    { name: "India", lat: 20.5937, lon: 78.9629 },
    { name: "USA", lat: 37.0902, lon: -95.7129 },
    { name: "Canada", lat: 56.1304, lon: -106.3468 },
    { name: "Australia", lat: -25.2744, lon: 133.7751 },
    { name: "UK", lat: 51.5074, lon: -0.1278 },
    // Add more countries and their lat, lon as needed
  ];

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setShowLogin(false);
    navigate('/profile');
  };

  const handleStateSelection = (state) => {
    navigate(`/state-news/${encodeURIComponent(state)}`);
    setShowStates(false);
    setActive(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    navigate(`/search/${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleMapClick = (country) => {
    // Handle click on country, navigate to news page for the country
    navigate(`/country-news/${encodeURIComponent(country.name)}`);
    setShowMap(false); // Close map after clicking
  };

  const isLoggedIn = user !== null;

  return (
    <header>
      <nav className="fixed top-0 left-0 w-full h-auto bg-black z-10 flex items-center justify-around">
        <h3 className="relative heading font-bold md:basis-1/6 text-2xl xs:basis-4/12 z-50 mb-5 mt-5">
          News Aggregator
        </h3>

        <ul className={active ? "nav-ul flex gap-5 md:gap-12 xs:gap-12 lg:basis-3/6 md:basis-4/6 md:justify-end active" : "nav-ul flex gap-10 lg:basis-3/6 md:basis-4/6 justify-end"}>
          <li>
            <Link className="no-underline font-semibold font-white" to="/" onClick={() => setActive(!active)}>
              Home
            </Link>
          </li>

          {/* New Map Dropdown */}
          <li>
            <div className="no-underline font-semibold flex items-center gap-2 cursor-pointer" onClick={() => setShowMap(!showMap)}>
              Map
            </div>
          </li>

          <li>
            <div className="search-container flex items-center">
              <input
                type="text"
                className="search-bar"
                placeholder="Search News"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="cursor-pointer" onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} className="text-white" />
              </span>
            </div>
          </li>

          <li className="dropdown-li" ref={profileRef}>
            <div className="no-underline font-semibold flex items-center gap-2 cursor-pointer" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
              {isLoggedIn ? (
                <>
                  Profile <FontAwesomeIcon icon={faCircleArrowDown} className={showProfileDropdown ? "down-arrow-icon-active" : "down-arrow-icon"} />
                </>
              ) : (
                <button className="no-underline font-semibold" onClick={() => setShowLogin(true)}>
                  Login
                </button>
              )}
            </div>
            {showProfileDropdown && isLoggedIn && (
              <ul className="dropdown p-2 show-dropdown">
                <li className="p-2">
                  <Link to="/profile" className="no-underline font-semibold">View Profile</Link>
                </li>
                <li className="p-2">
                  <Link to="#" className="no-underline font-semibold" onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}>
                    Logout
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {showLogin && <Login onClose={() => setShowLogin(false)} onLogin={handleLogin} />}

        {showMap && (
          <div style={{ width: "100%", height: "500px" }}>
            <MapContainer center={[20.5937, 78.9629]} zoom={3} style={{ width: "100%", height: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {countries.map((country, index) => (
                <Marker key={index} position={[country.lat, country.lon]}>
                  <Popup>
                    <span onClick={() => handleMapClick(country)}>{country.name}</span>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        <div className={active ? "ham-burger z-index-100 ham-open" : "ham-burger z-index-100"} onClick={() => setActive(!active)}>
          <span className="lines line-1"></span>
          <span className="lines line-2"></span>
          <span className="lines line-3"></span>
        </div>
      </nav>
    </header>
  );
}

export default Header;
