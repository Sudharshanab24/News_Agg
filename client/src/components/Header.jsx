import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import Login from "./Login";

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

  const categoryRef = useRef(null);
  const stateRef = useRef(null);
  const profileRef = useRef(null);

  const apiKey = 'AIzaSyCP8DPLtL3Nhs-uKBGiAEmdD_cLAkkOVBA'; // Replace with your actual API key

  const categories = ["business", "entertainment", "general", "health", "science", "sports", "technology", "politics"];
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
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

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
      } catch (error) {
        console.error("Invalid JSON data:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target)) {
        setShowStates(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    navigate(`/search/${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
  };

  const isLoggedIn = user !== null;

  return (
    <header>
      <nav className="fixed top-0 left-0 w-full h-auto bg-black z-10 flex items-center justify-around">
        <h3 className="relative heading font-bold md:basis-1/6 text-2xl xs:basis-4/12 z-50 mb-5 mt-5">
          News Aggregator Hosting
        </h3>

        <ul className={active ? "nav-ul flex gap-5 md:gap-12 xs:gap-12 lg:basis-3/6 md:basis-4/6 md:justify-end active" : "nav-ul flex gap-10 lg:basis-3/6 md:basis-4/6 justify-end"}>
          <li>
            <Link className="no-underline font-semibold font-white" to="/" onClick={() => setActive(!active)}>
              Home
            </Link>
          </li>

          <li className="dropdown-li" ref={categoryRef}>
            <div className="no-underline font-semibold flex items-center gap-2 cursor-pointer" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
              CategoryNews <FontAwesomeIcon className={showCategoryDropdown ? "down-arrow-icon down-arrow-icon-active" : "down-arrow-icon"} icon={faCircleArrowDown} />
            </div>

            <ul className={showCategoryDropdown ? "dropdown p-2 show-dropdown" : "dropdown p-2"} style={{ display: showCategoryDropdown ? 'block' : 'none' }}>
              {categories.map((element, index) => (
                <li key={index} onClick={() => setShowCategoryDropdown(false)}>
                  <Link to={`/top-headlines/${element}`} className="flex gap-3 capitalize" onClick={() => setActive(false)}>
                    {element}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className="dropdown-li" ref={stateRef}>
            <div className="no-underline font-semibold flex items-center gap-2 cursor-pointer" onClick={() => setShowStates(!showStates)}>
              StateNews <FontAwesomeIcon className={showStates ? "down-arrow-icon down-arrow-icon-active" : "down-arrow-icon"} icon={faCircleArrowDown} />
            </div>

            <ul className={showStates ? "dropdown p-2 show-dropdown" : "dropdown p-2"}>
              {states.map((state, index) => (
                <li key={index} onClick={() => handleStateSelection(state)}>
                  <Link to="#" className="flex gap-3 capitalize cursor-pointer">
                    {state}
                  </Link>
                </li>
              ))}
            </ul>
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
            <div
              className="no-underline font-semibold flex items-center gap-2 cursor-pointer"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
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
                  <Link
                    to="#"
                    className="no-underline font-semibold"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {showLogin && <Login onClose={() => setShowLogin(false)} onLogin={handleLogin} />}

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
