import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import MangaDexSearchPage from "./components/mangadex/search-page/SearchPage";
import DisplayMangasPage from "./components/mangadex/display-mangas/DisplayMangasPage";
import DisplayChapters from "./components/mangadex/display-chapters/DisplayChapters";
import ReaderLayout from "./components/mangadex/reader/ReaderLayout";
import HorizontalReader from "./components/mangadex/reader/HorizontalReader";
import VerticalReader from "./components/mangadex/reader/VerticalReader";
import SignUpPage from "./components/auth/signup-page/SignUpPage";
import LoginPage from "./components/auth/login-page/LoginPage";
import Navbar from "./components/navbar/Navbar";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<MangaDexSearchPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mangadex" element={<DisplayMangasPage />} />
        <Route path="/mangadex/title/:id" element={<DisplayChapters />} />
        <Route path="/mangadex/chapter/:id" element={<ReaderLayout />}>
          <Route path="horizontal" element={<HorizontalReader />} />
          <Route path="vertical" element={<VerticalReader />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
