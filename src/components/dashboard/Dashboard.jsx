import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { userInfo, userFavourites } = useContext(AuthContext);
  return (
    <div className="profile-container">
      <h1>Welcome {userInfo.username}</h1>
      <div className="favourites-container">
        <p className="favourites-title">
          📘 FAVOURITES {`(${userFavourites.length})`}
        </p>
        <div className="favourites-list">
          {userFavourites ? (
            userFavourites.map(({ id, manga_id, cover_url, title }) => (
              <Link to={`/mangadex/title/${manga_id}`} key={id}>
                <div className="manga-container">
                  <div className="manga-image-box">
                    <img src={cover_url} alt="cover" />
                  </div>
                  <div className="manga-title-box">
                    <p>{title}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
      <div className="history-container">
        <p className="history-title">📚 HISTORY</p>
      </div>
    </div>
  );
};

export default Dashboard;
