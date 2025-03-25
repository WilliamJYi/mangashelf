import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./DisplayChapters.css";

const DisplayChapters = () => {
  const [chapters, setChapters] = useState([]); // Store fetched data
  const { id } = useParams();
  const [details, setDetails] = useState({
    chapters: [],
    title: "",
    cover: "",
    description: "",
  });

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/chapters/${id}`
        );
        setChapters(response.data.data);
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

  const displayChapters = () => {
    return chapters
      .filter(({ attributes }) => attributes.translatedLanguage === "en")
      .map(({ id: chapterId, attributes }) => (
        <tr className="chapter-container" key={chapterId}>
          <td>{attributes.chapter}</td>
          {attributes.pages ? (
            <td>
              <Link
                to={`/mangadex/chapter/${chapterId}/horizontal`}
                state={{ id: id }}
              >
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
      {!chapters || chapters.length === 0 || !details.cover ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>{details?.title || ""}</h1>
          <div className="manga-details">
            <img src={details?.cover} alt="Manga Cover" />
            <div className="manga-description">
              <p>{details?.description || ""}</p>
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
