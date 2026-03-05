import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import pkg from 'pg';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Obligatoire pour se connecter à Supabase depuis Render
  }
});

console.log("Starting server with PostgreSQL...");
console.log("Environment:", process.env.NODE_ENV);

// Initialisation de la base de données
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        shortDescription TEXT,
        fullDescription TEXT,
        type TEXT,
        image TEXT,
        poster TEXT,
        features JSONB, 
        benefits JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
    console.log("Database tables checked/created successfully");
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
};

initDb();

const app = express();
app.use(express.json());

// Configuration Multer pour les uploads temporaires
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// --- ROUTES API ---

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { id, title, shortDescription, fullDescription, type, features, benefits } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const query = `
      INSERT INTO products (id, title, shortDescription, fullDescription, type, image, features, benefits)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        shortDescription = EXCLUDED.shortDescription,
        fullDescription = EXCLUDED.fullDescription,
        type = EXCLUDED.type,
        image = EXCLUDED.image,
        features = EXCLUDED.features,
        benefits = EXCLUDED.benefits;
    `;

    await pool.query(query, [
      id, 
      title, 
      shortDescription, 
      fullDescription, 
      type, 
      image, 
      typeof features === 'string' ? features : JSON.stringify(features), 
      typeof benefits === 'string' ? benefits : JSON.stringify(benefits)
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.get("/api/settings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM settings");
    const settingsObj = result.rows.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

app.post("/api/settings", upload.single("hero_image"), async (req, res) => {
  try {
    const val = req.file ? `/uploads/${req.file.filename}` : req.body.hero_image;
    await pool.query(
      "INSERT INTO settings (key, value) VALUES ('hero_image', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      [val]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

app.use("/uploads", express.static(uploadDir));

// --- VITE MIDDLEWARE ---

async function setupVite() {
  const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(path.join(__dirname, "dist"));
  
  if (isProduction) {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupVite().catch(console.error);
