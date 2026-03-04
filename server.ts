import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("techno_energie.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    shortDescription TEXT,
    fullDescription TEXT,
    type TEXT,
    image TEXT,
    poster TEXT,
    features TEXT, -- JSON string
    benefits TEXT  -- JSON string
  )
`);

// Seed initial data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (count.count === 0) {
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

  const insert = db.prepare(`
    INSERT INTO products (id, title, shortDescription, fullDescription, type, image, poster, features, benefits)
    VALUES (@id, @title, @shortDescription, @fullDescription, @type, @image, @poster, @features, @benefits)
  `);

  for (const p of initialProducts) {
    insert.run(p);
  }
}

const app = express();
app.use(express.json());

// Multer setup
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
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
app.get("/api/products", (req, res) => {
  try {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products.map((p: any) => ({
      ...p,
      features: p.features ? JSON.parse(p.features) : [],
      benefits: p.benefits ? JSON.parse(p.benefits) : []
    })));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", upload.single("image"), (req, res) => {
  try {
    const { id, title, shortDescription, fullDescription, type, features, benefits } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO products (id, title, shortDescription, fullDescription, type, image, features, benefits)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, title, shortDescription, fullDescription, type, image, features, benefits);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save product" });
  }
});

app.delete("/api/products/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Serve uploads
app.use("/uploads", express.static(uploadDir));

// Vite middleware
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
}

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on http://localhost:3000");
});
