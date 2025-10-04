import React, { useEffect, useState } from "react";
import { fetchComments, searchCommentsByBody } from "./api";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [localComments, setLocalComments] = useState([]); // comments added by user (local only)

  useEffect(() => {
    load(page);
    // eslint-disable-next-line
  }, [page]);

  async function load(pg = 1) {
    try {
      setLoading(true);
      const data = await fetchComments(pg, limit);
      setComments(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    const q = e.target.value;
    setSearch(q);
    if (q.trim() === "") {
      load(1);
      setPage(1);
      return;
    }
    try {
      setLoading(true);
      const results = await searchCommentsByBody(q);
      // show top 50 matches (limit UI)
      setComments(results.slice(0, 50));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function addLocalComment() {
    // mock an added comment locally (not posted to API)
    const newComment = {
      id: Date.now(),
      name: "You (local)",
      email: "you@example.com",
      body: document.getElementById("newCommentBody").value || "No content",
    };
    setLocalComments((prev) => [newComment, ...prev]);
    document.getElementById("newCommentBody").value = "";
  }

  return (
    <section>
      <div className="card">
        <div className="comments-controls">
          <input
            placeholder="Search comments by body (client search)"
            value={search}
            onChange={handleSearch}
            className="input"
          />
          <div>
            <button
              className="btn"
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
              }}
            >
              Prev
            </button>
            <span className="muted page">Page {page}</span>
            <button className="btn" onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Add a comment (local only)</h3>
        <textarea
          id="newCommentBody"
          rows="3"
          placeholder="Write a comment..."
          className="textarea"
        ></textarea>
        <div style={{ marginTop: 8 }}>
          <button className="btn primary" onClick={addLocalComment}>
            Add Comment
          </button>
        </div>
      </div>

      {error && <div className="card error">Error: {error}</div>}

      <div className="card">
        <h3>Comments</h3>
        {loading ? (
          <div className="loader">Loading comments…</div>
        ) : (
          <ul className="comment-list">
            {localComments.map((c) => (
              <li key={c.id} className="comment local">
                <strong>{c.name}</strong>{" "}
                <span className="muted small">{c.email}</span>
                <p>{c.body}</p>
              </li>
            ))}
            {comments.map((c) => (
              <li key={c.id} className="comment">
                <strong>{c.name}</strong>{" "}
                <span className="muted small">{c.email}</span>
                <p>{c.body}</p>
              </li>
            ))}
            {comments.length === 0 && (
              <li className="muted">No comments found</li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
}
