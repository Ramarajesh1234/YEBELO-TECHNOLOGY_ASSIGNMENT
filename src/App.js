import React from "react";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import Profile from "./Profile";
import Comments from "./Comments";

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <h1 className="brand">Yebelo Tech — Candidate Assignment</h1>
        <nav>
          <NavLink to="/" className={({isActive}) => "navlink " + (isActive ? "active" : "")} end>Profile</NavLink>
          <NavLink to="/comments" className={({isActive}) => "navlink " + (isActive ? "active" : "")}>Comments</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="*" element={
            <div style={{padding:40}}>Page not found — <Link to="/">Go home</Link></div>
          }/>
        </Routes>
      </main>

      <footer className="footer">
        <div className="container">
          <small>Built for Yebelo Technology assignment — uses jsonplaceholder.typicode.com</small>
        </div>
      </footer>
    </div>
  );
}
