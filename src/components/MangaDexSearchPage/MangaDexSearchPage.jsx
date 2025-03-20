import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./MangaDexSearchPage.css";

const MangaDexSearchPage = () => {
  const [title, setTitle] = useState("");
  const [mangas, setMangas] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5000/search?title=${title}`
      );

      const mangasData = response.data.data;
      console.log(mangasData);

      // fetch cover images and assign manga info to each manga
      const coverPromises = mangasData.map(async (manga) => {
        const coverId = manga.relationships.find(
          (relationship) => relationship.type === "cover_art"
        )?.id;

        if (coverId) {
          const coverResponse = await axios.get(
            `http://localhost:5000/covers/${coverId}`
          );
          return {
            id: manga.id,
            title: manga.attributes.title.en,
            image: coverResponse.data.image,
          };
        }

        return { id: manga.id, title: manga.attributes.title.en, image: null };
      });

      const coversArray = await Promise.all(coverPromises);
      console.log(coversArray);
      setMangas(coversArray);
    } catch (error) {
      console.error("Error fetching API:", error);
    }
  };

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const displayList = () => {
    return (
      <div className="manga-list">
        {mangas.map(({ id, title, image }) => (
          <Link to={`/mangadex/${id}`}>
            <div className="manga-container" key={id}>
              <div className="manga-image-box">
                <img src={image} alt="cover" />
              </div>
              <div className="manga-title-box">
                <p>{title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
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
      {mangas ? displayList() : <div>Loading...</div>}
    </div>
  );
};

export default MangaDexSearchPage;
