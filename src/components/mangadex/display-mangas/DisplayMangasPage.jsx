import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./DisplayMangasPage.css";

const DisplayMangasPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [titleInput, setTitleInput] = useState(searchParams.get("title") || "");
  const title = searchParams.get("title");
  const [mangas, setMangas] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
    if (title) {
      fetchMangas();
    }
  }, [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearchParams({ title: titleInput });
  };

  const handleChange = (e) => {
    setTitleInput(e.target.value);
  };

  const displayList = () => {
    return (
      <div className="manga-list">
        {mangas.map(({ id, title, image }) => (
          <Link to={`/mangadex/title/${id}`} key={id}>
            <div className="manga-container">
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
          value={titleInput || ""}
          required
        ></input>
        <button disabled={isLoading}>Submit</button>
      </form>
      {isLoading ? <div>Loading...</div> : mangas && displayList()}
    </div>
  );
};

export default DisplayMangasPage;
