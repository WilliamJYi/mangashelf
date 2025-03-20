import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import MangaDexSearchPage from "./components/mangadex/search-page/SearchPage";
import DisplayMangasPage from "./components/mangadex/display-mangas/DisplayMangasPage";
import DisplayChapters from "./components/mangadex/display-chapters/DisplayChapters";
import Reader from "./components/mangadex/reader/Reader";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mangadex" element={<MangaDexSearchPage />} />
        <Route path="/mangadex/search" element={<DisplayMangasPage />} />
        <Route path="/mangadex/title/:id" element={<DisplayChapters />} />
        <Route path="/mangadex/chapter/:id" element={<Reader />} />
      </Routes>
    </Router>
  );
}

export default App;
