import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./components/home/Home";
import MangaDexSearchPage from "./components/MangaDexSearchPage/MangaDexSearchPage";
import DisplayChapters from "./components/MangaDexSearchPage/DisplayChapters/DisplayChapters";
import Reader from "./components/reader/Reader";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mangadex" element={<MangaDexSearchPage />} />
        <Route path="/mangadex/:id" element={<DisplayChapters />} />
        <Route path="/reader/:id" element={<Reader />} />
      </Routes>
    </Router>
  );
}

export default App;
