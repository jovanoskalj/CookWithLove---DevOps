import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecipesList from "./pages/RecipesList";
import API from "./api";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    API.get("/me")
      .then(res => setCurrentUser(res.data.username))
      .catch(() => setCurrentUser(null));
  }, []);

  const handleLogout = async () => {
    await API.post("/logout");
    setCurrentUser(null);
  };

  return (
    <Router>
      <Navbar user={currentUser} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home user={currentUser} />} />
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login setUser={setCurrentUser} />} />
        <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />
        <Route path="/recipes" element={<RecipesList user={currentUser} />} />
      </Routes>
    </Router>
  );
}

export default App;