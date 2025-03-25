import React, { useEffect, useState } from "react";
import {
  Outlet,
  useNavigate,
  useParams,
  useLocation,
  Link,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import "./ReaderLayout.css";

const ReaderLayout = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [pagesData, setPagesData] = useState(null);
  const [isHorizontal, setIsHorizontal] = useState(
    location.pathname.includes("/horizontal")
  );

  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/chapter/${id}`);

        const pagesResponse = response.data.chapter;

        if (!pagesResponse) return;

        const { hash, data: pages } = pagesResponse;

        const pagesArray = pages.map(
          (page) => `https://uploads.mangadex.org/data/${hash}/${page}`
        );
        setPagesData(pagesArray);
      } catch (err) {
        console.error("Error fetching pages:", err);
      }
    };
    fetchPages();
  }, [id]);

  // Using Arrow keys to select page
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!pagesData) return;

      const totalPages = pagesData.length;
      if (
        (e.key === "ArrowRight" || e.key === "ArrowDown") &&
        currentPage < totalPages
      ) {
        setSearchParams({ page: currentPage + 1 });
      } else if (
        (e.key === "ArrowLeft" || e.key === "ArrowUp") &&
        currentPage > 1
      ) {
        setSearchParams({ page: currentPage - 1 });
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pagesData, searchParams, setSearchParams]);

  // Handle dropdown page change
  const handleChangePage = (e) => {
    const pageSelected = parseInt(e.target.value);
    navigate(
      `/mangadex/chapter/${id}/${
        isHorizontal ? "horizontal" : "vertical"
      }?page=${pageSelected}`
    );
  };

  // Handle switching mode
  const handleChangeMode = (e) => {
    const viewMode = e.target.value;
    setIsHorizontal(viewMode === "horizontal");
    navigate(`/mangadex/chapter/${id}/${viewMode}?page=${currentPage}`);
  };

  return (
    <div className="reader-layout-container">
      <button
        className={`toggle-button ${isOpen ? "open" : "collapsed"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "←" : "≡"}
      </button>

      <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        {isOpen && (
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link
                to={`/mangadex${
                  location.state?.id ? `/title/${location.state.id}` : ""
                }`}
              >
                Back to Chapters
              </Link>
            </li>
            <li>
              <div className="select-mode-dropdown">
                <select
                  value={isHorizontal ? "horizontal" : "vertical"}
                  onChange={handleChangeMode}
                >
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>
            </li>
            <li>
              {pagesData && (
                <div className="select-mode-dropdown">
                  <select value={currentPage} onChange={handleChangePage}>
                    {pagesData.map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </li>
          </ul>
        )}
      </aside>

      <Outlet
        context={{
          pagesData,
        }}
      />
    </div>
  );
};

export default ReaderLayout;
