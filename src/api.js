const BASE = "https://jsonplaceholder.typicode.com";

export async function fetchUser(userId = 1) {
  const res = await fetch(`${BASE}/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function fetchPostsByUser(userId = 1) {
  const res = await fetch(`${BASE}/posts?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function fetchComments(page = 1, limit = 10) {
  const start = (page - 1) * limit;
  const res = await fetch(`${BASE}/comments?_start=${start}&_limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function searchCommentsByBody(q) {
  const res = await fetch(`${BASE}/comments`);
  if (!res.ok) throw new Error("Failed to fetch comments for search");
  const all = await res.json();
  return all.filter((c) => c.body.toLowerCase().includes(q.toLowerCase()));
}
