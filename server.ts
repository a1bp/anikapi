import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Proxy to bypass CORS
  app.all("/api/proxy/:path(*)", async (req, res) => {
    // Extract the path after /api/proxy/
    const targetPath = req.params.path;
    const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    const targetUrl = `http://in.astryxtech.online:19136/${targetPath}${query}`;
    
    console.log(`[Proxy] ${req.method} ${req.url} -> ${targetUrl}`);
    
    try {
      const options: RequestInit = {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        options.body = JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, options);
      const contentType = response.headers.get('content-type');
      
      res.status(response.status);
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        res.json(data);
      } else {
        const buffer = await response.arrayBuffer();
        res.setHeader('Content-Type', contentType || 'application/octet-stream');
        res.send(Buffer.from(buffer));
      }
    } catch (error: any) {
      console.error('Proxy Error:', error);
      res.status(500).json({ error: 'Failed to proxy request', message: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
