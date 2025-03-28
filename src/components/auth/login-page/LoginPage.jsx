import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import supabase from "../../../supabase-client/SupabaseClient";
import "./LoginPage.css";
import AuthContext from "../AuthContext";
import useRedirectIfLoggedIn from "../../../hooks/useRedirectIfLoggedIn";

const SignInPage = () => {
  useRedirectIfLoggedIn();
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error(error.message);
      setMessage(error.message);
    } else {
      if (data) {
        cookies.set("TOKEN", data.session.access_token, {
          path: "/",
          sameSite: "None",
          secure: true,
        });
        setIsLoggedIn(true);
        navigate("/");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login Page</h2>
      <p>{message ? message + "!" : ""}</p>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password: </label>
          <div className="password-container">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button type="submit">Sign In</button>
      </form>
      <div>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default SignInPage;
