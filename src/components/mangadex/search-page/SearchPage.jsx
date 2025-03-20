import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css";

const SearchPage = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate(`/mangadex/search?title=${encodeURIComponent(title)}`);
  };

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div className="mangadex-search-page-container">
      <h1>MangaDex Search Page</h1>
      <form onSubmit={handleSubmit} className="mangadex-search-form">
        <input
          type="text"
          placeholder="Search a MangaDex Title"
          onChange={handleChange}
          value={title || ""}
          required
        ></input>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default SearchPage;
