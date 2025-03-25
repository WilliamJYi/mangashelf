import React, { useEffect, useRef } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import "./VerticalReader.css";

const VerticalReader = () => {
  const { pagesData } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const imageRefs = useRef([]);
  const observer = useRef(null);

  // Observe visible page, update URL param
  useEffect(() => {
    if (!pagesData) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setSearchParams({ page: index + 1 });
          }
        });
      },
      { threshold: 0.6 }
    );

    imageRefs.current.forEach((img) => {
      if (img) observer.current.observe(img);
    });

    return () => observer.current.disconnect();
  }, [pagesData, setSearchParams]);

  // Scroll to selected page
  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page"));
    if (!pageParam || isNaN(pageParam) || !pagesData) return;

    let loadedCount = 0;
    const images = imageRefs.current;

    images.forEach((image, index) => {
      if (!image) return;
      if (image.complete) {
        loadedCount++;
      } else {
        image.onLoad = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            const targetImg = imageRefs.current[pageParam - 1];
            if (targetImg) {
              targetImg.scrollIntoView({ behavior: "auto", block: "start" });
            }
          }
        };
      }
    });

    // If all were already loaded
    if (loadedCount === images.length) {
      const targetImg = images[pageParam - 1];
      if (targetImg) {
        targetImg.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }
  }, [searchParams, pagesData]);

  const handleProgressClick = (index) => {
    setSearchParams({ page: index + 1 });

    requestAnimationFrame(() => {
      const targetImg = imageRefs.current[index];
      if (targetImg) {
        targetImg.scrollIntoView({ behavior: "auto", block: "start" });
      }
    });
  };

  const displayPages = () => {
    return (
      <div className="vertical-image-container">
        {pagesData.map((page, index) => (
          <img
            key={index}
            src={page}
            alt={`Page ${index + 1}`}
            ref={(el) => (imageRefs.current[index] = el)}
            data-index={index}
            className="vertical-page"
            loading="lazy"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="vertical-reader-container">
      {pagesData && (
        <div className="progress-bar-wrapper">
          {pagesData.map((_, index) => (
            <div
              key={index}
              className={`progress-segment ${
                index + 1 === currentPage ? "active" : ""
              }`}
              style={{ width: `${100 / pagesData.length}%` }}
              onClick={() => handleProgressClick(index)}
            ></div>
          ))}
        </div>
      )}

      {pagesData ? displayPages() : <p>Loading...</p>}
    </div>
  );
};

export default VerticalReader;
