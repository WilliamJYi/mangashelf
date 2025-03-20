import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./DisplayChapters.css";

const DisplayChapters = () => {
  const [chapters, setChapters] = useState([]); // Store fetched data
  const { id } = useParams();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/chapters/${id}`
        );
        setChapters(response.data.data); // Update state with fetched data
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, [id]); // Dependency ensures it re-fetches when id changes

  return (
    <div>
      <h1>Chapters:</h1>
      {chapters.length > 0 ? (
        <div className="chapters-container">
          {chapters
            .filter(({ attributes }) => attributes.translatedLanguage === "en")
            .map(({ id, attributes }) => (
              <div>
                <p>Chapter: {attributes.chapter}</p>
                <Link key={id} to={`/reader/${id}`}>
                  {attributes.title}
                </Link>
              </div>
            ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DisplayChapters;
