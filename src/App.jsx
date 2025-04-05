import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import SearchPage from "./components/search-page/SearchPage";
import DisplayChapters from "./components/display-chapters/DisplayChapters";
import ReaderLayout from "./components/reader/ReaderLayout";
import HorizontalReader from "./components/reader/HorizontalReader";
import VerticalReader from "./components/reader/VerticalReader";
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
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/title/:id" element={<DisplayChapters />} />
        <Route path="/chapter/:id" element={<ReaderLayout />}>
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
