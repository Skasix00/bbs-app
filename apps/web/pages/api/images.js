export default async function handler(req, res) {
  const api = '/api';  
  const url = `${api}/photos`;
  const r = await fetch(url);
  const j = await r.json();
  res.status(r.status).json(j);
}
