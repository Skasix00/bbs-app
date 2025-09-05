export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://skaklaud.ddns.net/api';  
  const userId = req.query.userId;
  const url = `${apiUrl}/photos?userId=${encodeURIComponent(userId)}`;

  const proxyRes = await fetch(url, {
    method: 'POST',
    headers: req.headers,
    body: req
  });
  res.status(proxyRes.status);
  proxyRes.body.pipe(res);
}
