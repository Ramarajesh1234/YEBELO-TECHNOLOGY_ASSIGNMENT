import React, { useEffect, useState } from "react";
import { fetchUser, fetchPostsByUser } from "./api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoadingUser(true);
        const u = await fetchUser(1);
        if (cancelled) return;
        setUser(u);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUser(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadPosts() {
      try {
        setLoadingPosts(true);
        const p = await fetchPostsByUser(1);
        if (cancelled) return;
        setPosts(p.slice(0, 5)); // show first 5
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingPosts(false);
      }
    }
    loadPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <div className="card error">Error: {error}</div>;

  return (
    <section className="grid">
      <div className="card profile-card">
        {loadingUser ? (
          <div className="loader">Loading user…</div>
        ) : user ? (
          <>
            <div className="avatar">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <h2>{user.name}</h2>
            <p className="muted">
              @{user.username} · {user.email}
            </p>
            <p>
              <strong>Company:</strong> {user.company?.name}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={`http://${user.website}`}
                target="_blank"
                rel="noreferrer"
              >
                {user.website}
              </a>
            </p>
            <p className="muted">
              {user.address?.city}, {user.address?.street}
            </p>
          </>
        ) : (
          <div>No user found</div>
        )}
      </div>

      <div className="card posts-card">
        <h3>Recent posts</h3>
        {loadingPosts ? (
          <div className="loader">Loading posts…</div>
        ) : (
          <>
            {posts.length === 0 ? (
              <p className="muted">No posts found.</p>
            ) : (
              <ul className="post-list">
                {posts.map((p) => (
                  <li key={p.id}>
                    <strong>{p.title}</strong>
                    <p className="muted small">
                      {p.body.slice(0, 120)}
                      {p.body.length > 120 ? "…" : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}
