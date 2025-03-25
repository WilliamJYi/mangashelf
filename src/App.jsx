import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import MangaDexSearchPage from "./components/mangadex/search-page/SearchPage";
import DisplayMangasPage from "./components/mangadex/display-mangas/DisplayMangasPage";
import DisplayChapters from "./components/mangadex/display-chapters/DisplayChapters";
import ReaderLayout from "./components/mangadex/reader/ReaderLayout";
import HorizontalReader from "./components/mangadex/reader/HorizontalReader";
import VerticalReader from "./components/mangadex/reader/VerticalReader";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<MangaDexSearchPage />} />
        <Route path="/mangadex" element={<DisplayMangasPage />} />
        <Route path="/mangadex/title/:id" element={<DisplayChapters />} />
        <Route path="/mangadex/chapter/:id" element={<ReaderLayout />}>
          <Route path="horizontal" element={<HorizontalReader />} />
          <Route path="vertical" element={<VerticalReader />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
