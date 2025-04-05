import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import DisplayMangas from "../display-mangas/DisplayMangas";
import "./SearchPage.css";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const title = searchParams.get("title");
  const [titleInput, setTitleInput] = useState("");
  const [mangas, setMangas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearchParams({ title: titleInput });
  };

  useEffect(() => {
    if (title) fetchMangas();
  }, [title]);

  const fetchMangas = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:5000/search?title=${title}`
      );

      const mangasData = response.data.data;

      // fetch cover images and assign manga info to each manga
      const coverPromises = mangasData.map(async (manga) => {
        const coverId = manga.relationships.find(
          (relationship) => relationship.type === "cover_art"
        )?.id;

        const authorId = manga.relationships.find(
          (relationship) => relationship.type === "author"
        )?.id;

        if (coverId) {
          const coverResponse = await axios.get(
            `http://localhost:5000/covers/${coverId}`
          );

          return {
            id: manga.id,
            title: manga.attributes.title.en,
            author: authorId,
            image: coverResponse.data,
            description: manga.attributes.description.en,
          };
        }

        return {
          id: manga.id,
          title: manga.attributes.title.en,
          image: null,
          description: manga.attributes.description.en,
        };
      });

      const coversArray = await Promise.all(coverPromises);
      setMangas(coversArray);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching API:", error);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setTitleInput(e.target.value);
  };

  return (
    <div className="search-page-container">
      <div className="search-wrapper                                                                                           ">
        <h1>Search Your Manga</h1>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search a MangaDex Title"
            onChange={handleChange}
            value={titleInput || ""}
            required
          ></input>
          <button>Submit</button>
        </form>
      </div>
      {isLoading ? (
        <div className="loading-container">Loading...</div>
      ) : mangas.length > 0 ? (
        <DisplayMangas mangas={mangas} />
      ) : (
        title !== null && <div className="no-results-container">No results</div>
      )}
    </div>
  );
};

export default SearchPage;
