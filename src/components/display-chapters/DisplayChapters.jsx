import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./DisplayChapters.css";
import supabase from "../../supabase-client/SupabaseClient";
import AuthContext from "../auth/AuthContext";

const DisplayChapters = () => {
  const { isLoggedIn, userInfo, userFavourites, setUserFavourites } =
    useContext(AuthContext);
  const [chapters, setChapters] = useState([]); // Store fetched data
  const { id } = useParams();
  const [details, setDetails] = useState({
    chapters: [],
    title: "",
    cover: "",
    description: "",
  });
  const [isFavourited, setIsFavourited] = useState(false);
  const [startingIndex, setStartingIndex] = useState(0);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/chapters/${id}`
        );

        const allChapters = response.data.data;

        // Remove duplicate chapters
        const uniqueChapters = Array.from(
          new Map(
            allChapters
              .filter((ch) => ch.attributes.chapter)
              .map((ch) => [ch.attributes.chapter, ch])
          ).values()
        );

        setChapters(uniqueChapters);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, [id]);

  useEffect(() => {
    const fetchCover = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/search/${id}`);

        const coverId = response.data.data.relationships.find(
          (relationship) => relationship.type === "cover_art"
        ).id;

        const coverResponse = await axios.get(
          `http://localhost:5000/covers/${coverId}`
        );

        const title = response.data.data.attributes.title.en || "";
        const description = response.data.data.attributes.description.en || "";
        setDetails({
          ...details,
          title: title,
          cover: coverResponse.data,
          description: description,
        });
      } catch (error) {
        console.error("Error fetching cover:", error);
      }
    };

    fetchCover();
  }, [id]);

  useEffect(() => {
    if (isLoggedIn && userFavourites) {
      const existsInFavourites = userFavourites.some(
        (favourite) => favourite.manga_id === id
      );
      setIsFavourited(existsInFavourites);
    }
  }, []);

  const handleAddToFavourite = async () => {
    const { data, error } = await supabase
      .from("favorites")
      .insert([
        {
          user_id: userInfo.id,
          manga_id: id,
          title: details.title,
          cover_url: details.cover,
        },
      ])
      .select()
      .single();
    if (error) console.log(error);
    const updatedFavourites = [...userFavourites, data];
    setUserFavourites(updatedFavourites);
    setIsFavourited(true);
  };

  const handleRemoveFromFavourite = async () => {
    const updatedFavourites = userFavourites.filter(
      (favourite) => favourite.manga_id !== id
    );

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("manga_id", id);
    if (error) console.log(error);
    setUserFavourites(updatedFavourites);
    setIsFavourited(false);
  };

  const displayListCount = () => {
    if (!chapters || chapters.length === 0) {
      return <p>No Chapters</p>;
    }
    const total = chapters.length;
    const start = startingIndex + 1;
    const end = Math.min(startingIndex + 10, total);
    return (
      <p>
        Showing <strong>{start}</strong>–<strong>{end}</strong> of{" "}
        <strong>{total}</strong>
      </p>
    );
  };

  const handlePrev = () => {
    if (startingIndex === 0) return;
    setStartingIndex((prev) => prev - 10);
  };

  const handleNext = () => {
    if (startingIndex + 10 >= chapters.length) return;
    setStartingIndex((prev) => prev + 10);
  };

  const displayChapters = () => {
    const chaptersToDisplay = chapters.slice(startingIndex, startingIndex + 10);

    return chaptersToDisplay
      .filter(({ attributes }) => attributes.translatedLanguage === "en")
      .map(({ id: chapterId, attributes }) => (
        <tr className="chapter-container" key={chapterId}>
          <td>{attributes.chapter}</td>
          {attributes.pages ? (
            <td>
              <Link to={`/chapter/${chapterId}/horizontal`} state={{ id: id }}>
                {attributes.title}
              </Link>
            </td>
          ) : (
            <td>
              <a href={attributes.externalUrl}>{attributes.title}</a> — Not On
              Mangadex
            </td>
          )}
        </tr>
      ));
  };

  return (
    <div className="display-chapters-container">
      {!chapters || !details.cover ? (
        <div>Loading...</div>
      ) : (
        <div className="manga-header-container">
          <h1>{details?.title || ""}</h1>
          <div className="manga-details">
            <img src={details?.cover} alt="Manga Cover" />
            <div className="manga-description">
              <p>{details?.description.split("---")[0] || ""}</p>
            </div>
            <button
              className="favourites-button"
              onClick={
                isFavourited ? handleRemoveFromFavourite : handleAddToFavourite
              }
              disabled={!isLoggedIn}
            >
              {!isLoggedIn
                ? "Log in to favourite"
                : isFavourited
                ? "Remove from favourites"
                : "Add to favourites"}
            </button>
          </div>
          <div className="chapters-header-container">
            {" "}
            <p className="chapters-title">📖 CHAPTERS</p>
            <div className="change-page-container">
              <button
                className="change-page-button"
                onClick={handlePrev}
                disabled={startingIndex === 0}
              >
                Back
              </button>

              {displayListCount()}

              <button
                className="change-page-button"
                onClick={handleNext}
                disabled={startingIndex + 10 >= chapters.length}
              >
                Next
              </button>
            </div>
          </div>

          <table className="chapters-table">
            <thead>
              <tr>
                <th>Chapter</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>{displayChapters()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DisplayChapters;
