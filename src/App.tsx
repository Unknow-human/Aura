import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'aura-v2-infinity',
    title: 'AURA v2.2 Infinity',
    shortDescription: 'La multiprise intelligente qui vous fait gagner de l\'argent.',
    fullDescription: 'AURA v2.2 Infinity est le fleuron de l\'innovation Techno-Energie. Conçue spécifiquement pour le contexte électrique local, cette multiprise intelligente protège vos équipements (TV, Ventilateur, etc.) grâce à sa sécurité SBEE de 15 secondes. Elle intègre un mode Éco intelligent qui coupe automatiquement les appareils en veille, vous faisant réaliser des économies réelles sur vos factures d\'électricité.',
    type: 'domotique',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800', // Photo du produit physique
    poster: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800', // Affiche publicitaire
    features: [
      'Sécurité SBEE (15s) contre les retours de tension brutaux',
      'Commande vocale simultanée (Alexa, Google Home, SinricPro)',
      'Mode Éco TV (Extinction automatique après 4h)',
      'Contrôle local via aura.local (sans internet)',
      'Restauration automatique de l\'état après coupure'
    ],
    benefits: [
      'Réduction immédiate de la facture d\'électricité',
      'Protection prolongée de vos appareils sensibles',
      'Confort de pilotage à distance et à la voix'
    ]
  },
  {
    id: 'smart-lighting',
    title: 'Éclairage Intelligent',
    shortDescription: 'Contrôlez l\'ambiance de votre maison depuis votre smartphone.',
    fullDescription: 'Une solution complète pour automatiser l\'éclairage de votre domicile. Réduisez votre facture d\'électricité jusqu\'à 30% grâce à la détection de présence et aux scénarios programmés.',
    type: 'domotique',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
    features: [
      'Contrôle à distance via application mobile',
      'Capteurs de mouvement haute précision',
      'Variation d\'intensité automatique selon l\'heure',
      'Intégration avec assistants vocaux (Alexa, Google Home)'
    ],
    benefits: [
      'Économies d\'énergie significatives',
      'Confort accru au quotidien',
      'Sécurité par simulation de présence'
    ]
  },
  {
    id: 'industrial-automation',
    title: 'Automatisme Industriel',
    shortDescription: 'Optimisez vos lignes de production avec nos solutions API.',
    fullDescription: 'Conception et programmation d\'automates programmables industriels (API) pour une production plus fluide et sécurisée. Expertise en maintenance préventive et curative.',
    type: 'industrie',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    features: [
      'Programmation API (Siemens, Schneider, Omron)',
      'Interface Homme-Machine (IHM) intuitive',
      'Télésurveillance des équipements',
      'Armoires électriques certifiées'
    ],
    benefits: [
      'Augmentation de la productivité',
      'Réduction des temps d\'arrêt',
      'Sécurité des opérateurs renforcée'
    ]
  },
  {
    id: 'custom-pcb',
    title: 'Conception Électronique',
    shortDescription: 'De l\'idée au prototype : création de cartes électroniques sur mesure.',
    fullDescription: 'Nous transformons vos concepts en produits réels. Conception de schémas, routage de PCB et prototypage rapide pour vos projets innovants.',
    type: 'electronique',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    features: [
      'Conception de schémas électroniques',
      'Routage PCB multicouches',
      'Programmation de microcontrôleurs (Arduino, STM32, ESP32)',
      'Tests de compatibilité électromagnétique'
    ],
    benefits: [
      'Solution 100% adaptée à votre besoin',
      'Optimisation des coûts de production',
      'Support technique local au Bénin'
    ]
  },
  {
    id: 'smart-security',
    title: 'Sécurité Connectée',
    shortDescription: 'Surveillez votre propriété où que vous soyez dans le monde.',
    fullDescription: 'Systèmes d\'alarme et de vidéosurveillance intelligents. Alertes en temps réel sur smartphone en cas d\'intrusion, d\'incendie ou d\'inondation.',
    type: 'domotique',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    features: [
      'Caméras IP haute définition avec vision nocturne',
      'Détecteurs d\'ouverture et de bris de glace',
      'Sirènes connectées haute puissance',
      'Enregistrement cloud sécurisé'
    ],
    benefits: [
      'Tranquillité d\'esprit totale',
      'Réponse rapide en cas d\'incident',
      'Dissuasion efficace des cambrioleurs'
    ]
  }
];

export const CONTACT_WHATSAPP = "https://wa.me/2290162330710";
export const LINKEDIN_URL = "https://www.linkedin.com/in/fabio-agboton-477863317";
export const FACEBOOK_URL = "https://facebook.com/technoenergie";
export const INSTAGRAM_URL = "https://instagram.com/technoenergie";
