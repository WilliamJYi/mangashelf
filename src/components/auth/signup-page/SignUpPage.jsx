import React, { useState } from "react";
import supabase from "../../../supabase-client/SupabaseClient";
import { Link } from "react-router-dom";
import "./SignUpPage.css";
import useRedirectIfLoggedIn from "../../../hooks/useRedirectIfLoggedIn";

const SignUp = () => {
  useRedirectIfLoggedIn();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;
    const { data, error } = await supabase.auth.signUp(
      {
        email,
        password,
      },
      {
        options: {
          emailRedirectTo: `${import.meta.env.VITE_LOCAL_FRONTEND_URL}/login`,
        },
      }
    );

    if (error) {
      alert("Sign-up failed" + error.message);
      setMessage("Sign-up failed" + error.message);
      return;
    }

    const user = data.user;

    if (user) {
      const { error: insertError } = await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        username: username,
      });

      if (insertError) {
        console.error("Failed to insert user row:", insertError.message);
        setMessage("User with this email already exists");
        return;
      } else {
        console.log("User inserted into custom users table!");
      }
    }
    setMessage("Check your email to confirm sign up");
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2>Create Account</h2>
        <p>{message ? message + "!" : ""}</p>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username: </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email: </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password: </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password || ""}
              onChange={handleChange}
              required
            />
          </div>
          {/* <div className="form-group">
            <label htmlFor="password">Confirm Password: </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password || ""}
              onChange={handleChange}
              required
            />
          </div> */}
          <button type="submit">Sign Up</button>
        </form>
        <div>
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
