// Minimal static server for the Deluxe booking page.
// Railway sets PORT automatically; nothing else is required.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8"
};

http.createServer((req, res) => {
  // index.html is the booking page
  let rel = decodeURIComponent(req.url.split("?")[0]);
  if (rel === "/" || rel === "") rel = "/index.html";

  const file = path.join(ROOT, path.normalize(rel).replace(/^(\.\.[/\\])+/, ""));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end("Forbidden"); return; }

  fs.readFile(file, (err, data) => {
    if (err) {                       // unknown path -> booking page
      fs.readFile(path.join(ROOT, "index.html"), (e2, home) => {
        if (e2) { res.writeHead(404).end("Not found"); return; }
        res.writeHead(200, { "Content-Type": TYPES[".html"] }).end(home);
      });
      return;
    }
    const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": path.extname(file) === ".html" ? "no-cache" : "public, max-age=86400"
    }).end(data);
  });
}).listen(PORT, () => console.log("Deluxe booking running on port " + PORT));
