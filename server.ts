import "dotenv/config";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import pg from "pg";

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Starting server...");
console.log("Environment:", process.env.NODE_ENV);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDb() {
  try {
    const client = await pool.connect();
    console.log("Connected to Supabase PostgreSQL successfully");
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        short_description TEXT,
        full_description TEXT,
        type TEXT,
        image TEXT,
        poster TEXT,
        features TEXT, -- JSON string
        benefits TEXT,  -- JSON string
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    // Seed initial data if empty
    const res = await client.query("SELECT COUNT(*) as count FROM products");
    const count = parseInt(res.rows[0].count);
    console.log("Current product count:", count);
    
    if (count === 0) {
      console.log("Seeding initial products...");
      const initialProducts = [
        {
          id: 'aura-v2-infinity',
          title: 'AURA v2.2 Infinity',
          shortDescription: 'La multiprise intelligente qui vous fait gagner de l\'argent.',
          fullDescription: 'AURA v2.2 Infinity est le fleuron de l\'innovation Techno-Energie. Conçue spécifiquement pour le contexte électrique local, cette multiprise intelligente protège vos équipements (TV, Ventilateur, etc.) grâce à sa sécurité SBEE de 15 secondes. Elle intègre un mode Éco intelligent qui coupe automatiquement les appareils en veille, vous faisant réaliser des économies réelles sur vos factures d\'électricité.',
          type: 'domotique',
          image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
          poster: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
          features: JSON.stringify([
            'Sécurité SBEE (15s) contre les retours de tension brutaux',
            'Commande vocale simultanée (Alexa, Google Home, SinricPro)',
            'Mode Éco TV (Extinction automatique après 4h)',
            'Contrôle local via aura.local (sans internet)',
            'Restauration automatique de l\'état après coupure'
          ]),
          benefits: JSON.stringify([
            'Réduction immédiate de la facture d\'électricité',
            'Protection prolongée de vos appareils sensibles',
            'Confort de pilotage à distance et à la voix'
          ])
        },
        {
          id: 'smart-lighting',
          title: 'Éclairage Intelligent',
          shortDescription: 'Contrôlez l\'ambiance de votre maison depuis votre smartphone.',
          fullDescription: 'Une solution complète pour automatiser l\'éclairage de votre domicile. Réduisez votre facture d\'électricité jusqu\'à 30% grâce à la détection de présence et aux scénarios programmés.',
          type: 'domotique',
          image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
          poster: null,
          features: JSON.stringify([
            'Contrôle à distance via application mobile',
            'Capteurs de mouvement haute précision',
            'Variation d\'intensité automatique selon l\'heure',
            'Intégration avec assistants vocaux (Alexa, Google Home)'
          ]),
          benefits: JSON.stringify([
            'Économies d\'énergie significatives',
            'Confort accru au quotidien',
            'Sécurité par simulation de présence'
          ])
        },
        {
          id: 'industrial-automation',
          title: 'Automatisme Industriel',
          shortDescription: 'Optimisez vos lignes de production avec nos solutions API.',
          fullDescription: 'Conception et programmation d\'automates programmables industriels (API) pour une production plus fluide et sécurisée. Expertise en maintenance préventive et curative.',
          type: 'industrie',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
          poster: null,
          features: JSON.stringify([
            'Programmation API (Siemens, Schneider, Omron)',
            'Interface Homme-Machine (IHM) intuitive',
            'Télésurveillance des équipements',
            'Armoires électriques certifiées'
          ]),
          benefits: JSON.stringify([
            'Augmentation de la productivité',
            'Réduction des temps d\'arrêt',
            'Sécurité des opérateurs renforcée'
          ])
        },
        {
          id: 'custom-pcb',
          title: 'Conception Électronique',
          shortDescription: 'De l\'idée au prototype : création de cartes électroniques sur mesure.',
          fullDescription: 'Nous transformons vos concepts en produits réels. Conception de schémas, routage de PCB et prototypage rapide pour vos projets innovants.',
          type: 'electronique',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
          poster: null,
          features: JSON.stringify([
            'Conception de schémas électroniques',
            'Routage PCB multicouches',
            'Programmation de microcontrôleurs (Arduino, STM32, ESP32)',
            'Tests de compatibilité électromagnétique'
          ]),
          benefits: JSON.stringify([
            'Solution 100% adaptée à votre besoin',
            'Optimisation des coûts de production',
            'Support technique local au Bénin'
          ])
        },
        {
          id: 'smart-security',
          title: 'Sécurité Connectée',
          shortDescription: 'Surveillez votre propriété où que vous soyez dans le monde.',
          fullDescription: 'Systèmes d\'alarme et de vidéosurveillance intelligents. Alertes en temps réel sur smartphone en cas d\'intrusion, d\'incendie ou d\'inondation.',
          type: 'domotique',
          image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
          poster: null,
          features: JSON.stringify([
            'Caméras IP haute définition avec vision nocturne',
            'Détecteurs d\'ouverture et de bris de glace',
            'Sirènes connectées haute puissance',
            'Enregistrement cloud sécurisé'
          ]),
          benefits: JSON.stringify([
            'Tranquillité d\'esprit totale',
            'Réponse rapide en cas d\'incident',
            'Dissuasion efficace des cambrioleurs'
          ])
        }
      ];

      for (const p of initialProducts) {
        await client.query(`
          INSERT INTO products (id, title, short_description, full_description, type, image, poster, features, benefits)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [p.id, p.title, p.shortDescription, p.fullDescription, p.type, p.image, p.poster, p.features, p.benefits]);
      }
      console.log(`Seeded ${initialProducts.length} products successfully.`);
    }

    // Seed settings if empty
    const heroRes = await client.query("SELECT * FROM settings WHERE key = 'hero_image'");
    if (heroRes.rowCount === 0) {
      await client.query("INSERT INTO settings (key, value) VALUES ($1, $2)", ['hero_image', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000']);
    }

    client.release();
  } catch (err) {
    console.error("Database initialization failed:", err);
  }
}

initDb();

const app = express();
app.use(express.json());

// Multer setup
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created upload directory:", uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// API Routes
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(result.rows.map((p: any) => {
      let features = [];
      let benefits = [];
      try {
        features = p.features ? JSON.parse(p.features) : [];
        if (!Array.isArray(features)) features = [];
      } catch (e) {
        features = [];
      }
      try {
        benefits = p.benefits ? JSON.parse(p.benefits) : [];
        if (!Array.isArray(benefits)) benefits = [];
      } catch (e) {
        benefits = [];
      }
      return {
        ...p,
        shortDescription: p.short_description,
        fullDescription: p.full_description,
        features,
        benefits
      };
    }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    console.log("POST /api/products received:", req.body);
    const { id, title, shortDescription, fullDescription, type, features, benefits } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    
    console.log("Saving product:", { id, title, type, image });
    
    // Check if product exists
    const existing = await pool.query("SELECT id FROM products WHERE id = $1", [id]);
    
    if (existing.rowCount && existing.rowCount > 0) {
      // Update existing product
      await pool.query(`
        UPDATE products 
        SET title = $1, short_description = $2, full_description = $3, type = $4, image = $5, features = $6, benefits = $7
        WHERE id = $8
      `, [title, shortDescription, fullDescription, type, image, features, benefits, id]);
    } else {
      // Insert new product
      await pool.query(`
        INSERT INTO products (id, title, short_description, full_description, type, image, features, benefits)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [id, title, shortDescription, fullDescription, type, image, features, benefits]);
    }
    
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

// Settings Routes
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
    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      await pool.query("INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2", ['hero_image', imageUrl]);
    } else if (req.body.hero_image) {
      await pool.query("INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2", ['hero_image', req.body.hero_image]);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// Serve uploads
app.use("/uploads", express.static(uploadDir));

// Vite middleware
async function setupVite() {
  const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(path.join(__dirname, "dist"));
  
  if (isProduction) {
    console.log("Production mode: Serving static files from dist");
    app.use(express.static(path.join(__dirname, "dist")));
    
    // Handle SPA fallback
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
        return next();
      }
      const indexPath = path.join(__dirname, "dist", "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Index file not found. Please run build.");
      }
    });
  } else {
    console.log("Development mode: Using Vite middleware");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite().catch(err => {
  console.error("Failed to setup Vite middleware:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
