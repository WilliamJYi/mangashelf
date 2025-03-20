import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Reader.css";

const DisplayChapters = () => {
  const [pagesData, setPagesData] = useState(); // Store fetched data
  const { id } = useParams();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/chapter/${id}`);
        setPagesData(response.data.chapter); // Update state with fetched data
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, [id]); // Dependency ensures it re-fetches when id changes

  const displayPages = () => {
    const hash = pagesData.hash;
    const pages = pagesData.data;
    return (
      <div className="image-container">
        {pages.map((page, id) => (
          <img
            className="chapter-image"
            key={id}
            src={`https://uploads.mangadex.org/data/${hash}/${page}`}
            alt={`page ${id}`}
          />
        ))}
      </div>
    );
  };

  return <div>{pagesData ? displayPages() : <p>Loading...</p>}</div>;
};

export default DisplayChapters;
