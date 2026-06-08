import React, { useContext, useEffect, useRef, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = () => {

  const { getTotalCartAmount, token, setToken, setShowLogin, food_list, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const isHomePage = location.pathname === '/';

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/')
  }

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setShowProfileDropdown(false);
  }, [location.pathname]);

  // Handle click outside for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSearch = food_list.filter(item =>
    searchQuery && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/menu?search=${searchQuery.trim()}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  }

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return "active";
    if (path === '/menu' && location.pathname.startsWith('/menu')) return "active";
    if (path === '/mobile-app' && location.pathname === '/mobile-app') return "active";
    if (path === '/contact-us' && location.pathname === '/contact-us') return "active";
    if (path === '/about' && location.pathname === '/about') return "active";
    return "";
  }

  return (
    <div className='navbar'>
      <div className="navbar-left">
        {!isHomePage && (
          <div className="navbar-back" onClick={() => navigate(-1)} title="Go Back">
            <div className="wide-back-arrow"></div>
          </div>
        )}
        <Link to='/' className='logo'>Eatzy<span>.</span></Link>
      </div>

      {/* Mobile overlay */}
      {menuOpen && <div className="navbar-overlay" onClick={() => setMenuOpen(false)} />}

      <ul className={`navbar-menu ${menuOpen ? "navbar-menu-open" : ""}`}>
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/menu" className={isActive('/menu')}>Menu</Link>
        <Link to="/about" className={isActive('/about')}>About</Link>
        <Link to="/mobile-app" className={isActive('/mobile-app')}>Mobile App</Link>
        <Link to="/contact-us" className={isActive('/contact-us')}>Contact Us</Link>
        <a href={import.meta.env.VITE_ADMIN_URL || "http://localhost:5174"} target='_blank' rel='noreferrer' className="navbar-admin-btn">Admin Panel</a>
      </ul>

      <div className="navbar-right">
        <div className={`navbar-search-container ${showSearch ? "active" : ""}`}>
          <input
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <img src={assets.search_icon} onClick={() => navigate('/menu')} alt="" />

          {searchQuery && (
            <div className="search-results-dropdown">
              {filteredSearch.slice(0, 5).map((item, index) => (
                <div key={index} className="search-result-item" onClick={() => {
                  navigate(`/menu?search=${item.name}`);
                  setSearchQuery("");
                  setShowSearch(false);
                }}>
                  <img src={item.image.startsWith("http") ? item.image : url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                </div>
              ))}
              {filteredSearch.length > 5 && (
                <div className="search-view-all" onClick={() => {
                  navigate(`/menu?search=${searchQuery}`);
                  setSearchQuery("");
                  setShowSearch(false);
                }}>
                  View all ({filteredSearch.length} results)
                </div>
              )}
              {filteredSearch.length === 0 && (
                <div className="no-search-results">No dishes found</div>
              )}
            </div>
          )}
        </div>
        <Link to='/cart' className='navbar-search-icon'>
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        {!token ? <button onClick={() => setShowLogin(true)}>sign in</button>
          : <div className='navbar-profile' ref={profileRef}>
            <img 
              src={assets.profile_icon} 
              alt="" 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{cursor: 'pointer'}}
            />
            <ul className={`navbar-profile-dropdown ${showProfileDropdown ? 'active' : ''}`}>
              <li onClick={() => {navigate('/profile'); setShowProfileDropdown(false)}}> <img src={assets.profile_icon} alt="" /> <p>Profile</p></li>
              <hr />
              <li onClick={() => {navigate('/myorders'); setShowProfileDropdown(false)}}> <img src={assets.bag_icon} alt="" /> <p>Orders</p></li>
              <hr />
              <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li>
            </ul>
          </div>
        }
      </div>

      {/* Hamburger button – visible only on mobile */}
      <button
        className={`navbar-hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  )
}

export default Navbar
