export default async function handler(req, res) {
  const api = process.env.NODE_ENV == 'development' ? 'http://localhost:5050' : '/api';
  const url = `${api}/photos`;
  const r = await fetch(url);
  const j = await r.json();
  res.status(r.status).json(j);
}
