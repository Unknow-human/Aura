import "dotenv/config";
import express from "express";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import pg from "pg";
import dns from "dns";

// Force IPv4 resolution to avoid ECONNREFUSED issues with Supabase IPv6
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Starting server...");
console.log("Environment:", process.env.NODE_ENV);

let connectionString = process.env.DATABASE_URL?.trim();

if (connectionString && connectionString.includes(" ")) {
  console.log("Detected spaces in DATABASE_URL, attempting to fix encoding...");
  try {
    // Try to isolate the password part more robustly
    const atIndex = connectionString.lastIndexOf('@');
    if (atIndex !== -1) {
      const authPart = connectionString.substring(0, atIndex);
      const hostPart = connectionString.substring(atIndex + 1);
      
      const firstColonIndex = authPart.indexOf(':');
      const lastColonIndex = authPart.lastIndexOf(':');
      
      if (lastColonIndex > firstColonIndex) {
        const protocolAndUser = authPart.substring(0, lastColonIndex);
        const password = authPart.substring(lastColonIndex + 1);
        connectionString = `${protocolAndUser}:${encodeURIComponent(password)}@${hostPart}`;
      }
    }
  } catch (e) {
    console.error("Failed to auto-fix DATABASE_URL encoding:", e);
  }
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

if (!process.env.DATABASE_URL) {
  console.error("CRITICAL: DATABASE_URL is not defined in environment variables!");
} else {
  // Mask password for logging
  const maskedUrl = connectionString ? connectionString.replace(/:([^:@]+)@/, ":****@") : "undefined";
  console.log("Final Connection string used (masked):", maskedUrl);
}

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
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Migration: Ensure sort_order column exists if table was created before this feature
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='sort_order') THEN
          ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 0;
        END IF;
      END $$;

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
          title: 'AURA v2.2 - Votre Allié Économie',
          shortDescription: 'La prise magique qui réduit vos factures d\'électricité sans effort.',
          fullDescription: 'AURA est bien plus qu\'une simple prise. Elle protège vos appareils précieux (TV, frigo, ventilo) contre les coupures de courant brutales. Son intelligence intégrée éteint tout seul ce que vous oubliez d\'éteindre, vous faisant économiser de l\'argent chaque mois.',
          type: 'domotique',
          image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
          poster: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
          features: JSON.stringify([
            'Protège vos appareils contre les chocs électriques',
            'Éteint la télé automatiquement quand vous dormez',
            'Se contrôle avec votre voix ou votre téléphone',
            'Fonctionne même sans internet à la maison',
            'Se rallume tout seul après une coupure'
          ]),
          benefits: JSON.stringify([
            'Moins d\'argent gaspillé en électricité',
            'Vos appareils durent beaucoup plus longtemps',
            'Plus besoin de se lever pour éteindre les lumières'
          ])
        },
        {
          id: 'smart-lighting',
          title: 'Lumières Intelligentes',
          shortDescription: 'Changez l\'ambiance de votre salon depuis votre canapé.',
          fullDescription: 'Imaginez vos lumières qui s\'allument toutes seules quand vous rentrez le soir. Nos solutions simples vous permettent de tout contrôler depuis votre téléphone, tout en évitant de laisser les lampes allumées inutilement dans les pièces vides.',
          type: 'domotique',
          image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
          poster: null,
          features: JSON.stringify([
            'S\'allume quand vous entrez dans une pièce',
            'Se contrôle avec un simple bouton sur votre téléphone',
            'Changez l\'intensité pour une soirée cinéma',
            'Parlez à votre maison pour allumer la lumière'
          ]),
          benefits: JSON.stringify([
            'Fini les lampes oubliées allumées',
            'Une maison qui vous accueille chaleureusement',
            'Sécurité : simule votre présence quand vous voyagez'
          ])
        },
        {
          id: 'industrial-automation',
          title: 'Solutions pour Entreprises',
          shortDescription: 'Modernisez votre atelier ou votre boutique simplement.',
          fullDescription: 'Nous aidons les entreprises à devenir plus efficaces. Que ce soit pour automatiser une machine ou sécuriser votre installation électrique, nous apportons des solutions simples qui marchent.',
          type: 'industrie',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
          poster: null,
          features: JSON.stringify([
            'Machines qui travaillent plus intelligemment',
            'Écrans de contrôle faciles à utiliser',
            'Surveillance de vos équipements à distance',
            'Installations électriques aux normes et sûres'
          ]),
          benefits: JSON.stringify([
            'Produisez plus avec moins d\'efforts',
            'Moins de pannes et d\'arrêts de travail',
            'Sécurité maximale pour vos employés'
          ])
        },
        {
          id: 'custom-pcb',
          title: 'Création d\'Appareils Sur Mesure',
          shortDescription: 'Vous avez une idée ? Nous fabriquons l\'appareil électronique pour vous.',
          fullDescription: 'Vous rêvez d\'un appareil qui n\'existe pas encore ? Nous dessinons et fabriquons les circuits électroniques au Bénin pour donner vie à vos projets personnels ou professionnels.',
          type: 'electronique',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
          poster: null,
          features: JSON.stringify([
            'Dessin de vos circuits électroniques',
            'Fabrication de prototypes rapides',
            'Programmation personnalisée',
            'Tests rigoureux pour garantir la qualité'
          ]),
          benefits: JSON.stringify([
            'Un produit unique fait pour vous',
            'Coût réduit grâce à la fabrication locale',
            'Support technique direct et rapide'
          ])
        },
        {
          id: 'smart-security',
          title: 'Sécurité pour la Famille',
          shortDescription: 'Gardez un œil sur votre maison, même à l\'autre bout du monde.',
          fullDescription: 'Dormez sur vos deux oreilles avec nos caméras et alarmes intelligentes. Recevez une notification immédiate sur votre téléphone si quelqu\'un s\'approche de votre porte.',
          type: 'domotique',
          image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
          poster: null,
          features: JSON.stringify([
            'Caméras qui voient clair même la nuit',
            'Alertes directes sur votre smartphone',
            'Sirènes puissantes pour faire fuir les intrus',
            'Enregistrement vidéo sécurisé'
          ]),
          benefits: JSON.stringify([
            'Tranquillité d\'esprit pour toute la famille',
            'Réagissez vite en cas de problème',
            'Protégez vos biens efficacement'
          ])
        }
      ];

      for (let i = 0; i < initialProducts.length; i++) {
        const p = initialProducts[i];
        await client.query(`
          INSERT INTO products (id, title, short_description, full_description, type, image, poster, features, benefits, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [p.id, p.title, p.shortDescription, p.fullDescription, p.type, p.image, p.poster, p.features, p.benefits, i]);
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
}
console.log("Upload directory initialized at:", uploadDir);

// Cloudinary configuration
const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

const isCloudinaryConfigured = !!(
  cloudName && 
  cloudName.toLowerCase() !== "root" &&
  cloudName.toLowerCase() !== "your_cloud_name" &&
  cloudName !== "" &&
  apiKey &&
  apiSecret
);

console.log("Cloudinary check:", { 
  hasCloudName: !!cloudName, 
  cloudNameValue: cloudName,
  isCloudinaryConfigured 
});

if (isCloudinaryConfigured) {
  console.log("Cloudinary configured with cloud name:", cloudName);
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
} else {
  if (cloudName && cloudName.toLowerCase() === "root") {
    console.warn("WARNING: Cloudinary CLOUD_NAME is set to 'Root' or similar. Using local storage fallback.");
  } else {
    console.warn("Cloudinary not fully configured or invalid cloud name. Using local storage fallback.");
  }
}

const storage = isCloudinaryConfigured ? new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aura-products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any,
}) : multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// API Routes
app.get("/api/ping", (req, res) => {
  res.json({ status: "alive", timestamp: new Date().toISOString() });
});

app.get("/api/config-status", (req, res) => {
  res.json({ 
    cloudinaryConfigured: isCloudinaryConfigured,
    cloudName: isCloudinaryConfigured ? cloudName : "Non configuré (Mode temporaire)"
  });
});

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY sort_order ASC, created_at DESC");
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
    console.log("POST /api/products received body:", req.body);
    console.log("POST /api/products received file:", req.file);
    
    const { id, title, shortDescription, fullDescription, type, features, benefits } = req.body;
    
    if (!id) {
      console.error("Missing product ID");
      return res.status(400).json({ error: "L'identifiant du produit est manquant" });
    }

    const image = req.file ? 
      (isCloudinaryConfigured ? ((req.file as any).path || (req.file as any).secure_url) : `/uploads/${req.file.filename}`) 
      : req.body.image;
    
    console.log("Final image path to save:", image);
    
    if (req.file && !isCloudinaryConfigured) {
      const fullPath = path.join(__dirname, "public", image);
      console.log("Checking if file exists at:", fullPath);
      if (fs.existsSync(fullPath)) {
        console.log("File exists on disk!");
      } else {
        console.error("FILE DOES NOT EXIST ON DISK AFTER UPLOAD!");
      }
    }
    
    // Check if product exists
    const existing = await pool.query("SELECT id FROM products WHERE id = $1", [id]);
    console.log("Existing product check result:", existing.rowCount);
    
    if (existing.rowCount && existing.rowCount > 0) {
      // Update existing product
      console.log("Updating existing product...");
      await pool.query(`
        UPDATE products 
        SET title = $1, short_description = $2, full_description = $3, type = $4, image = $5, features = $6, benefits = $7
        WHERE id = $8
      `, [title, shortDescription, fullDescription, type, image, features, benefits, id]);
    } else {
      // Insert new product
      console.log("Inserting new product...");
      await pool.query(`
        INSERT INTO products (id, title, short_description, full_description, type, image, features, benefits)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [id, title, shortDescription, fullDescription, type, image, features, benefits]);
    }
    
    console.log("Product saved successfully");
    res.json({ success: true });
  } catch (error: any) {
    console.error("CRITICAL ERROR in POST /api/products:", error);
    res.status(500).json({ 
      error: "Erreur serveur lors de l'enregistrement", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/api/products/reorder", async (req, res) => {
  const { productIds } = req.body;
  if (!Array.isArray(productIds)) {
    return res.status(400).json({ error: "productIds must be an array" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (let i = 0; i < productIds.length; i++) {
      await client.query("UPDATE products SET sort_order = $1 WHERE id = $2", [i, productIds[i]]);
    }
    await client.query("COMMIT");
    res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Reorder error:", error);
    res.status(500).json({ error: "Failed to reorder products" });
  } finally {
    client.release();
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
      const imageUrl = isCloudinaryConfigured ? ((req.file as any).path || (req.file as any).secure_url) : `/uploads/${req.file.filename}`;
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

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("GLOBAL ERROR HANDLER:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    
    // Check for Multer errors
    if (err.name === 'MulterError') {
      return res.status(400).json({
        error: "Erreur lors du téléchargement du fichier",
        details: err.message,
        code: err.code
      });
    }

    res.status(err.status || 500).json({
      error: "Une erreur inattendue est survenue sur le serveur",
      details: err.message,
      code: err.code
    });
  });

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
import "dotenv/config";
import express from "express";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import pg from "pg";
import dns from "dns";

// Force IPv4 resolution to avoid ECONNREFUSED issues with Supabase IPv6
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Starting server...");
console.log("Environment:", process.env.NODE_ENV);

let connectionString = process.env.DATABASE_URL?.trim();

if (connectionString && connectionString.includes(" ")) {
  console.log("Detected spaces in DATABASE_URL, attempting to fix encoding...");
  try {
    // Try to isolate the password part more robustly
    const atIndex = connectionString.lastIndexOf('@');
    if (atIndex !== -1) {
      const authPart = connectionString.substring(0, atIndex);
      const hostPart = connectionString.substring(atIndex + 1);
      
      const firstColonIndex = authPart.indexOf(':');
      const lastColonIndex = authPart.lastIndexOf(':');
      
      if (lastColonIndex > firstColonIndex) {
        const protocolAndUser = authPart.substring(0, lastColonIndex);
        const password = authPart.substring(lastColonIndex + 1);
        connectionString = `${protocolAndUser}:${encodeURIComponent(password)}@${hostPart}`;
      }
    }
  } catch (e) {
    console.error("Failed to auto-fix DATABASE_URL encoding:", e);
  }
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

if (!process.env.DATABASE_URL) {
  console.error("CRITICAL: DATABASE_URL is not defined in environment variables!");
} else {
  // Mask password for logging
  const maskedUrl = connectionString ? connectionString.replace(/:([^:@]+)@/, ":****@") : "undefined";
  console.log("Final Connection string used (masked):", maskedUrl);
}

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
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Migration: Ensure sort_order column exists if table was created before this feature
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='sort_order') THEN
          ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 0;
        END IF;
      END $$;

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
          title: 'AURA v2.2 - Votre Allié Économie',
          shortDescription: 'La prise magique qui réduit vos factures d\'électricité sans effort.',
          fullDescription: 'AURA est bien plus qu\'une simple prise. Elle protège vos appareils précieux (TV, frigo, ventilo) contre les coupures de courant brutales. Son intelligence intégrée éteint tout seul ce que vous oubliez d\'éteindre, vous faisant économiser de l\'argent chaque mois.',
          type: 'domotique',
          image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
          poster: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
          features: JSON.stringify([
            'Protège vos appareils contre les chocs électriques',
            'Éteint la télé automatiquement quand vous dormez',
            'Se contrôle avec votre voix ou votre téléphone',
            'Fonctionne même sans internet à la maison',
            'Se rallume tout seul après une coupure'
          ]),
          benefits: JSON.stringify([
            'Moins d\'argent gaspillé en électricité',
            'Vos appareils durent beaucoup plus longtemps',
            'Plus besoin de se lever pour éteindre les lumières'
          ])
        },
        {
          id: 'smart-lighting',
          title: 'Lumières Intelligentes',
          shortDescription: 'Changez l\'ambiance de votre salon depuis votre canapé.',
          fullDescription: 'Imaginez vos lumières qui s\'allument toutes seules quand vous rentrez le soir. Nos solutions simples vous permettent de tout contrôler depuis votre téléphone, tout en évitant de laisser les lampes allumées inutilement dans les pièces vides.',
          type: 'domotique',
          image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
          poster: null,
          features: JSON.stringify([
            'S\'allume quand vous entrez dans une pièce',
            'Se contrôle avec un simple bouton sur votre téléphone',
            'Changez l\'intensité pour une soirée cinéma',
            'Parlez à votre maison pour allumer la lumière'
          ]),
          benefits: JSON.stringify([
            'Fini les lampes oubliées allumées',
            'Une maison qui vous accueille chaleureusement',
            'Sécurité : simule votre présence quand vous voyagez'
          ])
        },
        {
          id: 'industrial-automation',
          title: 'Solutions pour Entreprises',
          shortDescription: 'Modernisez votre atelier ou votre boutique simplement.',
          fullDescription: 'Nous aidons les entreprises à devenir plus efficaces. Que ce soit pour automatiser une machine ou sécuriser votre installation électrique, nous apportons des solutions simples qui marchent.',
          type: 'industrie',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
          poster: null,
          features: JSON.stringify([
            'Machines qui travaillent plus intelligemment',
            'Écrans de contrôle faciles à utiliser',
            'Surveillance de vos équipements à distance',
            'Installations électriques aux normes et sûres'
          ]),
          benefits: JSON.stringify([
            'Produisez plus avec moins d\'efforts',
            'Moins de pannes et d\'arrêts de travail',
            'Sécurité maximale pour vos employés'
          ])
        },
        {
          id: 'custom-pcb',
          title: 'Création d\'Appareils Sur Mesure',
          shortDescription: 'Vous avez une idée ? Nous fabriquons l\'appareil électronique pour vous.',
          fullDescription: 'Vous rêvez d\'un appareil qui n\'existe pas encore ? Nous dessinons et fabriquons les circuits électroniques au Bénin pour donner vie à vos projets personnels ou professionnels.',
          type: 'electronique',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
          poster: null,
          features: JSON.stringify([
            'Dessin de vos circuits électroniques',
            'Fabrication de prototypes rapides',
            'Programmation personnalisée',
            'Tests rigoureux pour garantir la qualité'
          ]),
          benefits: JSON.stringify([
            'Un produit unique fait pour vous',
            'Coût réduit grâce à la fabrication locale',
            'Support technique direct et rapide'
          ])
        },
        {
          id: 'smart-security',
          title: 'Sécurité pour la Famille',
          shortDescription: 'Gardez un œil sur votre maison, même à l\'autre bout du monde.',
          fullDescription: 'Dormez sur vos deux oreilles avec nos caméras et alarmes intelligentes. Recevez une notification immédiate sur votre téléphone si quelqu\'un s\'approche de votre porte.',
          type: 'domotique',
          image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
          poster: null,
          features: JSON.stringify([
            'Caméras qui voient clair même la nuit',
            'Alertes directes sur votre smartphone',
            'Sirènes puissantes pour faire fuir les intrus',
            'Enregistrement vidéo sécurisé'
          ]),
          benefits: JSON.stringify([
            'Tranquillité d\'esprit pour toute la famille',
            'Réagissez vite en cas de problème',
            'Protégez vos biens efficacement'
          ])
        }
      ];

      for (let i = 0; i < initialProducts.length; i++) {
        const p = initialProducts[i];
        await client.query(`
          INSERT INTO products (id, title, short_description, full_description, type, image, poster, features, benefits, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [p.id, p.title, p.shortDescription, p.fullDescription, p.type, p.image, p.poster, p.features, p.benefits, i]);
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
}
console.log("Upload directory initialized at:", uploadDir);

// Cloudinary configuration
const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

const isCloudinaryConfigured = !!(
  cloudName && 
  cloudName.toLowerCase() !== "root" &&
  cloudName.toLowerCase() !== "your_cloud_name" &&
  cloudName !== "" &&
  apiKey &&
  apiSecret
);

console.log("Cloudinary check:", { 
  hasCloudName: !!cloudName, 
  cloudNameValue: cloudName,
  isCloudinaryConfigured 
});

if (isCloudinaryConfigured) {
  console.log("Cloudinary configured with cloud name:", cloudName);
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
} else {
  if (cloudName && cloudName.toLowerCase() === "root") {
    console.warn("WARNING: Cloudinary CLOUD_NAME is set to 'Root' or similar. Using local storage fallback.");
  } else {
    console.warn("Cloudinary not fully configured or invalid cloud name. Using local storage fallback.");
  }
}

const storage = isCloudinaryConfigured ? new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aura-products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any,
}) : multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// API Routes
app.get("/api/ping", (req, res) => {
  res.json({ status: "alive", timestamp: new Date().toISOString() });
});

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY sort_order ASC, created_at DESC");
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
    console.log("POST /api/products received body:", req.body);
    console.log("POST /api/products received file:", req.file);
    
    const { id, title, shortDescription, fullDescription, type, features, benefits } = req.body;
    
    if (!id) {
      console.error("Missing product ID");
      return res.status(400).json({ error: "L'identifiant du produit est manquant" });
    }

    const image = req.file ? 
      (isCloudinaryConfigured ? ((req.file as any).path || (req.file as any).secure_url) : `/uploads/${req.file.filename}`) 
      : req.body.image;
    
    console.log("Final image path to save:", image);
    
    if (req.file && !isCloudinaryConfigured) {
      const fullPath = path.join(__dirname, "public", image);
      console.log("Checking if file exists at:", fullPath);
      if (fs.existsSync(fullPath)) {
        console.log("File exists on disk!");
      } else {
        console.error("FILE DOES NOT EXIST ON DISK AFTER UPLOAD!");
      }
    }
    
    // Check if product exists
    const existing = await pool.query("SELECT id FROM products WHERE id = $1", [id]);
    console.log("Existing product check result:", existing.rowCount);
    
    if (existing.rowCount && existing.rowCount > 0) {
      // Update existing product
      console.log("Updating existing product...");
      await pool.query(`
        UPDATE products 
        SET title = $1, short_description = $2, full_description = $3, type = $4, image = $5, features = $6, benefits = $7
        WHERE id = $8
      `, [title, shortDescription, fullDescription, type, image, features, benefits, id]);
    } else {
      // Insert new product
      console.log("Inserting new product...");
      await pool.query(`
        INSERT INTO products (id, title, short_description, full_description, type, image, features, benefits)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [id, title, shortDescription, fullDescription, type, image, features, benefits]);
    }
    
    console.log("Product saved successfully");
    res.json({ success: true });
  } catch (error: any) {
    console.error("CRITICAL ERROR in POST /api/products:", error);
    res.status(500).json({ 
      error: "Erreur serveur lors de l'enregistrement", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/api/products/reorder", async (req, res) => {
  const { productIds } = req.body;
  if (!Array.isArray(productIds)) {
    return res.status(400).json({ error: "productIds must be an array" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (let i = 0; i < productIds.length; i++) {
      await client.query("UPDATE products SET sort_order = $1 WHERE id = $2", [i, productIds[i]]);
    }
    await client.query("COMMIT");
    res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Reorder error:", error);
    res.status(500).json({ error: "Failed to reorder products" });
  } finally {
    client.release();
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
      const imageUrl = isCloudinaryConfigured ? ((req.file as any).path || (req.file as any).secure_url) : `/uploads/${req.file.filename}`;
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

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("GLOBAL ERROR HANDLER:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    
    // Check for Multer errors
    if (err.name === 'MulterError') {
      return res.status(400).json({
        error: "Erreur lors du téléchargement du fichier",
        details: err.message,
        code: err.code
      });
    }

    res.status(err.status || 500).json({
      error: "Une erreur inattendue est survenue sur le serveur",
      details: err.message,
      code: err.code
    });
  });

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
