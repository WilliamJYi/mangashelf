import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import AuthContext from "../auth/AuthContext";
import supabase from "../../supabase-client/SupabaseClient";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {}, [isLoggedIn]);

  const handleLogout = async () => {
    let { error } = await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <div className="navbar-container">
      <button
        className={`navbar-toggle-button ${isOpen ? "open" : "collapsed"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "⋯"}
      </button>

      <aside className={`navbar ${isOpen ? "open" : "collapsed"}`}>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/search">Search</Link>
          <div>
            {isLoggedIn ? (
              <div className="authenticated-nav-links">
                <Link to="/dashboard">Profile</Link>
                <Link to="/" onClick={handleLogout}>
                  Log Out
                </Link>
              </div>
            ) : (
              <Link to="/login">Log In</Link>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Navbar;
