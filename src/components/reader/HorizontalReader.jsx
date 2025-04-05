import React from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import "./HorizontalReader.css";

const HorizontalReader = () => {
  const { pagesData } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const displayPages = () => {
    return (
      <img
        className="horizontal-page"
        src={pagesData[currentPage - 1]}
        alt={`Page ${currentPage}`}
      />
    );
  };

  const handleScreenClick = (e) => {
    const screenWidth = window.innerWidth;
    const clickX = e.clientX;

    if (clickX < screenWidth / 2) {
      if (currentPage > 1) {
        navigateToPage(currentPage - 1);
      }
    } else {
      if (currentPage < pagesData.length) {
        navigateToPage(currentPage + 1);
      }
    }
  };

  const navigateToPage = (targetPage) => {
    setSearchParams({ page: targetPage });
  };

  return (
    <div
      className="horizontal-reader-container"
      onClick={(e) => handleScreenClick(e)}
    >
      {pagesData ? (
        <div>{displayPages()}</div>
      ) : (
        <div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default HorizontalReader;
