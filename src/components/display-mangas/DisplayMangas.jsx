import React from "react";
import { Link } from "react-router-dom";
import "./DisplayMangas.css";

const DisplayMangas = ({ mangas }) => {
  const listOfMangas = mangas || [];
  return (
    <div className="display-mangas-container">
      <div className="manga-list">
        {listOfMangas.map(({ id, title, image }) => (
          <Link to={`/title/${id}`} key={id}>
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
    </div>
  );
};

export default DisplayMangas;
