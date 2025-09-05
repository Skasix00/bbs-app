export default async function handler(req, res) {
  const apiUrl = process.env.NODE_ENV == 'development' ? 'http://localhost:5050' : '/api';
  const path = req.query.path.join('/');
  const url = `${apiUrl}/uploads/${path}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return res.status(response.status).end();
    }

    // Set appropriate headers
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    // Stream the response
    response.body.pipe(res);
  } catch (error) {
    console.error('Error proxying upload:', error);
    res.status(500).end();
  }
}
