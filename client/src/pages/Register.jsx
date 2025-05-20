import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../axios"; // Adjust path as necessary

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
       const BASE_URL = import.meta.env.PROD
  ? "https://chatroom-backend.onrender.com/api/v1" // Replace with your actual Render backend URL
  : "http://localhost:5000/api/v1";

const res = await axios.post(`${BASE_URL}/register`, {
  username,
  password,
}, {
  withCredentials: true,
});

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="background">
      <form onSubmit={handleSubmit} className="form-card" autoComplete="off">
        <div className="form-title">Welcome</div>
        <div className="form-subtitle">Register</div>

        <div className="auth">
          <div className="input-elm">
            <div className="auth-label">Username</div>
            <input
              className="auth-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-elm">
            <div className="auth-label">Password</div>
            <div className="input-container">
              <input
                className="auth-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="auth-button" type="submit">
            Register
          </button>
        </div>

        {error && (
          <p className="text-center mt-4" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <p>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </form>
    </div>
  );
};
