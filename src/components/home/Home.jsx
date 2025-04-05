import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to MangaShelf</h1>
      <div>
        {/* Add route to imgur pages later */}
        <Link to="/search">
          <button>Read from MangaDex</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
