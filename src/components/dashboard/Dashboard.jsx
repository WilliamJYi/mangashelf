import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import supabase from "../../supabase-client/SupabaseClient";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userInfo, userFavourites, userHistory, setUserHistory } =
    useContext(AuthContext);
  const [startingIndex, setStartingIndex] = useState(0);

  const displayHistory = () => {
    if (!userHistory) {
      return <div>Loading...</div>;
    }

    const userHistoryToDisplay = userHistory.slice(
      startingIndex,
      startingIndex + 10
    );

    return userHistoryToDisplay.map(
      ({ id, manga_title, chapter_title, chapter, chapter_id, created_at }) => (
        <tr
          key={id}
          className="chapter-details-container"
          onClick={() => navigate(`/chapter/${chapter_id}/horizontal`)}
        >
          <td>{manga_title}</td>
          <td>
            Ch.{chapter} {chapter_title}
          </td>
          <td>{new Date(created_at).toLocaleString()}</td>
          <td>
            <button
              className="delete-from-history-button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteHistoryItem(id);
              }}
            >
              🗑
            </button>
          </td>
        </tr>
      )
    );
  };

  const displayListCount = () => {
    if (!userHistory || userHistory.length === 0) {
      return <p>No history items</p>;
    }

    const total = userHistory.length;
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
    if (startingIndex + 10 >= userHistory.length) return;
    setStartingIndex((prev) => prev + 10);
  };

  const handleDeleteHistoryItem = async (id) => {
    const { error } = await supabase.from("history").delete().eq("id", id);
    if (error) {
      console.log(error);
      return;
    }

    const updatedHistory = userHistory.filter((item) => item.id !== id);

    console.log(`History item ${id} deleted!`);
    setUserHistory(updatedHistory);
  };

  const handleClearAllHistory = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your history?"
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from("history")
      .delete()
      .eq("user_id", userInfo.id);

    if (error) {
      console.log(error);
      return;
    }
    console.log("History cleared!");
    setUserHistory([]);
  };

  return (
    <div className="profile-container">
      <div className="profile-content-container">
        <h1>Welcome {userInfo.username}</h1>
        <div className="favourites-container">
          <p className="favourites-title">
            📘 FAVOURITES {`(${userFavourites.length})`}
          </p>
          <div className="favourites-list">
            {userFavourites ? (
              userFavourites.map(({ id, manga_id, cover_url, title }) => (
                <Link to={`/title/${manga_id}`} key={id}>
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
          <div className="history-header-container">
            {" "}
            <p className="history-title">📚 HISTORY</p>
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
                disabled={startingIndex + 10 >= userHistory.length}
              >
                Next
              </button>
            </div>
            <button
              onClick={handleClearAllHistory}
              className="clear-all-history-button"
            >
              Clear History
            </button>
          </div>
          {}
          <table className="chapters-table">
            <thead>
              <tr>
                <th>Manga</th>
                <th>Chapter</th>
                <th>Last Read</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{displayHistory()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
