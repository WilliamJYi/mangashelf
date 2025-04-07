import React, { useContext, useEffect, useState } from "react";
import {
  Outlet,
  useNavigate,
  useParams,
  useLocation,
  Link,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import supabase from "../../supabase-client/SupabaseClient";
import AuthContext from "../auth/AuthContext";
import "./ReaderLayout.css";

const ReaderLayout = () => {
  const { isLoggedIn, userInfo, setUserHistory } = useContext(AuthContext);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [chapterInfo, setChapterInfo] = useState({
    pagesData: [],
    mangaId: "",
    chapterNumber: null,
    chapterTitle: "",
  });
  const [chapters, setChapters] = useState([]);
  const [isHorizontal, setIsHorizontal] = useState(
    location.pathname.includes("/horizontal")
  );

  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    setSearchParams({ page: 1 });
  }, [id]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/chapter/${id}`
        );

        const pagesResponse = response.data.server.chapter;
        const chapterResponse = response.data.chapter;

        if (!pagesResponse || !chapterResponse) return;

        const { hash, data: pages } = pagesResponse;

        const { chapter, title: chapterTitle } =
          chapterResponse.data.attributes;

        const pagesArray = pages.map(
          (page) => `https://uploads.mangadex.org/data/${hash}/${page}`
        );

        const mangaId = chapterResponse.data.relationships.find(
          (relationship) => relationship.type === "manga"
        ).id;

        if (isLoggedIn) {
          addToHistory(mangaId, chapterTitle, chapter);
        }

        setChapterInfo({
          pagesData: pagesArray,
          mangaId: mangaId,
          chapterNumber: chapter,
          chapterTitle: chapterTitle,
        });

        fetchChapters(mangaId);
      } catch (err) {
        console.error("Error fetching pages:", err);
      }
    };
    fetchPages();
  }, [id]);

  // Add manga and chapter details to history
  const addToHistory = async (mangaId, chapterTitle, chapter) => {
    const mangaResponse = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/search/${mangaId}`
    );
    const mangaTitle = mangaResponse.data.data.attributes.title.en || "";

    const chapterDetails = {
      manga_id: mangaId,
      chapter_id: id,
      chapter: chapter,
      chapter_title: chapterTitle,
      manga_title: mangaTitle,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("history")
      .upsert(
        { ...chapterDetails, user_id: userInfo.id },
        {
          onConflict: ["chapter_id"],
        }
      )
      .select()
      .single();
    if (error) console.log(error);
    if (data) {
      setUserHistory((prev) => {
        const filtered = prev.filter(
          (item) => item.chapter_id !== data.chapter_id
        );
        return [data, ...filtered];
      });
    }
  };

  const fetchChapters = async (mangaId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/chapters/${mangaId}`
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
      console.error("Error fetching chatpers:", error);
    }
  };

  // Preload pages so that in horizontal view mode it doesn't slow down on each flip
  useEffect(() => {
    if (!chapterInfo.pagesData) return;

    chapterInfo.pagesData.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      if (index === 0) img.loading = "eager";
    });
  }, [chapterInfo.pagesData]);

  // Using Arrow keys to select page
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!chapterInfo.pagesData) return;

      const totalPages = chapterInfo.pagesData.length;
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
  }, [chapterInfo.pagesData, searchParams, setSearchParams]);

  const handleChangeChapter = (e) => {
    if (!chapters || chapters.length === 0) return;

    setChapterInfo({
      pagesData: [],
      mangaId: "",
      chapterNumber: null,
      chapterTitle: "",
    });

    const currentIndex = chapters.findIndex((chapter) => chapter.id === id);

    let chapterToGoTo;

    if (e.target.name === "next") {
      if (currentIndex === chapters.length - 1) {
        alert("You're on the last chapter!");
        return;
      }
      chapterToGoTo = chapters[currentIndex + 1];
    } else {
      if (currentIndex === 0) {
        alert("You're on the first chapter!");
        return;
      }
      chapterToGoTo = chapters[currentIndex - 1];
    }

    navigate(
      `/chapter/${chapterToGoTo.id}/${isHorizontal ? "horizontal" : "vertical"}`
    );
  };

  // Handle dropdown page change
  const handleChangePage = (e) => {
    const pageSelected = parseInt(e.target.value);
    navigate(
      `/chapter/${id}/${
        isHorizontal ? "horizontal" : "vertical"
      }?page=${pageSelected}`
    );
  };

  // Handle switching mode
  const handleChangeMode = (e) => {
    const viewMode = e.target.value;
    setIsHorizontal(viewMode === "horizontal");
    navigate(`/chapter/${id}/${viewMode}?page=${currentPage}`);
  };

  return (
    <div className="reader-layout-container">
      <button
        className={`reader-toggle-button ${isOpen ? "open" : "collapsed"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "←" : "≡"}
      </button>

      <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        {isOpen && (
          <ul>
            <li>
              Ch.{chapterInfo.chapterNumber} {chapterInfo.chapterTitle}
            </li>
            <li>
              <Link to={`/title/${chapterInfo.mangaId}`}>
                <button>Go back to chapters</button>
              </Link>
            </li>
            <li>
              <button
                id="prev"
                name="prev"
                onClick={handleChangeChapter}
                disabled={
                  chapters.findIndex((chapter) => chapter.id === id) === 0
                }
              >
                Go to previous chapter
              </button>
            </li>
            <li>
              <button
                id="next"
                name="next"
                onClick={handleChangeChapter}
                disabled={
                  chapters.findIndex((chapter) => chapter.id === id) ===
                  chapters.length - 1
                }
              >
                Go to next chapter
              </button>
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
              {chapterInfo.pagesData && (
                <div className="select-mode-dropdown">
                  <select value={currentPage} onChange={handleChangePage}>
                    {chapterInfo.pagesData.map((_, index) => (
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
      {chapterInfo.chapterNumber === null ? (
        <div className="reader-loading-container">Loading...</div>
      ) : chapterInfo.pagesData.length === 0 ? (
        <div className="reader-no-pages-container">No pages</div>
      ) : (
        <Outlet
          context={{
            pagesData: chapterInfo.pagesData,
          }}
        />
      )}
    </div>
  );
};

export default ReaderLayout;
