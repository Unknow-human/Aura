import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bolt, 
  Cpu, 
  Lightbulb, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Zap,
  Factory,
  Microchip,
  ChevronRight,
  Menu,
  Linkedin,
  Facebook,
  Instagram,
  Plus,
  Trash2,
  Edit2,
  Save,
  Image as ImageIcon,
  Lock,
  ArrowUp,
  ArrowDown,
  AlertTriangle
} from 'lucide-react';
import { CONTACT_WHATSAPP, LINKEDIN_URL, FACEBOOK_URL, INSTAGRAM_URL } from './constants';
import { Product, ProductType } from './types';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
      isScrolled || isMenuOpen ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 py-3' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-blue-600 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Bolt size={18} />
          </div>
          <div className="font-black text-lg sm:text-xl tracking-tighter text-slate-900">TECHNO-ENERGIE</div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#solutions" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">Nos Services</a>
          <a href="#domotique" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">C'est quoi ?</a>
          <a href="#catalogue" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">Nos Produits</a>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href={CONTACT_WHATSAPP} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-xl shadow-green-100 hover:bg-[#128C7E] transition flex items-center gap-2"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="hidden sm:inline">CONTACTER FABIO</span>
            <span className="sm:hidden uppercase">Contact</span>
          </a>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              <a href="#solutions" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-900 hover:text-blue-600 transition">Nos Services</a>
              <a href="#domotique" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-900 hover:text-blue-600 transition">C'est quoi ?</a>
              <a href="#catalogue" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-900 hover:text-blue-600 transition">Nos Produits</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  key?: string | number;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => (
  <motion.div 
    layoutId={`card-${product.id}`}
    onClick={onClick}
    className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
    whileHover={{ y: -10 }}
  >
    <div className="relative h-64 overflow-hidden">
      <img 
        src={product.image} 
        alt={product.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="bg-white/90 backdrop-blur-sm text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
          {product.type === 'domotique' ? 'Maison' : product.type === 'industrie' ? 'Entreprise' : 'Électronique'}
        </span>
        {product.id === 'aura-v2-infinity' && (
          <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg animate-pulse">
            Nouveau / Vedette
          </span>
        )}
      </div>
    </div>
    <div className="p-8">
      <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">{product.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
        {product.shortDescription}
      </p>
      <div className="flex items-center text-blue-600 font-bold text-sm gap-2">
        Voir les détails <ChevronRight size={16} />
      </div>
    </div>
  </motion.div>
);

interface ModalProps {
  product: Product | null;
  onClose: () => void;
}

const Modal = ({ product, onClose }: ModalProps) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
      />
      <motion.div 
        layoutId={`card-${product.id}`}
        className="bg-white w-full max-w-4xl rounded-[1.5rem] sm:rounded-[2.5rem] relative z-10 overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/50 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition shadow-lg z-20"
        >
          <X className="text-slate-900" size={20} />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="h-48 sm:h-64 md:h-full relative bg-slate-100">
            <div className="flex flex-col h-full">
              <div className={product.poster ? 'h-1/2' : 'h-full'}>
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {product.poster && (
                <div className="h-1/2 border-t border-white/20">
                  <img 
                    src={product.poster} 
                    alt="Affiche publicitaire" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="p-8 md:p-12 overflow-y-auto">
            <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-4 block">
              {product.type === 'domotique' ? 'Maison' : product.type === 'industrie' ? 'Entreprise' : 'Électronique'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-900 leading-tight">{product.title}</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              {product.fullDescription}
            </p>

            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Caractéristiques</h4>
                <div className="grid gap-3">
                  {(product.features || []).filter(f => f.trim() !== '').map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="text-blue-500 mt-0.5 shrink-0" size={18} />
                      <span className="text-sm text-slate-700 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Avantages</h4>
                <div className="flex flex-wrap gap-2">
                  {(product.benefits || []).filter(b => b.trim() !== '').map((b, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-bold">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100">
              <a 
                href={CONTACT_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-600 transition shadow-xl"
              >
                Demander un devis gratuit <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const LegalModal = ({ type, onClose }: { type: 'legal' | 'privacy' | null, onClose: () => void }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-white w-full max-w-2xl rounded-[2.5rem] relative z-10 overflow-hidden shadow-2xl max-h-[80vh] overflow-y-auto p-8 md:p-12"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition z-20"
        >
          <X size={20} className="text-slate-900" />
        </button>

        {type === 'legal' ? (
          <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-black mb-6">Mentions Légales</h2>
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-3">Éditeur du site</h3>
              <p className="text-slate-600">
                Le site Techno-Energie est édité par <strong>Agboton Fabio</strong>, Technicien Supérieur en Électrotechnique.<br />
                Siège social : Cotonou, Bénin.<br />
                Contact : +229 01 62 33 07 10 / +229 01 40 377 059
              </p>
            </section>
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-3">Hébergement</h3>
              <p className="text-slate-600">
                Ce site est hébergé sur les infrastructures Cloud de Google via AI Studio Preview.
              </p>
            </section>
            <section>
              <h3 className="text-xl font-bold mb-3">Propriété intellectuelle</h3>
              <p className="text-slate-600">
                L'ensemble des contenus (textes, images, logos, codes sources) présents sur ce site est la propriété exclusive de Techno-Energie, sauf mention contraire. Toute reproduction est interdite sans accord préalable.
              </p>
            </section>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-black mb-6">Politique de Confidentialité</h2>
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-3">Collecte des données</h3>
              <p className="text-slate-600">
                Nous ne collectons aucune donnée personnelle via ce site, à l'exception de celles que vous choisissez de nous transmettre volontairement lorsque vous nous contactez via WhatsApp ou téléphone.
              </p>
            </section>
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-3">Utilisation des données</h3>
              <p className="text-slate-600">
                Vos informations de contact sont uniquement utilisées pour répondre à vos demandes de devis ou d'informations techniques concernant nos produits (AURA, Domotique, etc.).
              </p>
            </section>
            <section>
              <h3 className="text-xl font-bold mb-3">Vos droits</h3>
              <p className="text-slate-600">
                Conformément aux lois en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Contactez-nous directement pour toute demande.
              </p>
            </section>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const SmartHomeInteractive = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      title: "Maison Classique",
      desc: "Vous devez tout faire vous-même : éteindre les lumières, fermer le portail, surveiller la clim. C'est fatiguant et on oublie souvent.",
      icon: <Bolt className="text-slate-400" />,
      color: "bg-slate-800",
      visual: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Le Cerveau Intelligent",
      desc: "On installe un petit boîtier magique. Il s'occupe de tout pour vous, 24h/24, sans que vous n'ayez à lever le petit doigt.",
      icon: <Cpu className="text-blue-400" />,
      color: "bg-blue-900/40",
      visual: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Votre Vie Simplifiée",
      desc: "Vous partez ? La clim s'éteint seule. Il pleut ? Le portail se ferme. Vous rentrez ? La lumière s'allume pour vous accueillir. C'est ça, le confort !",
      icon: <Zap className="text-yellow-400" />,
      color: "bg-yellow-900/40",
      visual: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="bg-white/5 rounded-[1.5rem] sm:rounded-[3rem] p-6 sm:p-12 border border-white/10 relative overflow-hidden h-full flex flex-col">
      <div className="relative z-10 flex-1">
        <div className="flex gap-2 mb-6 sm:mb-8">
          {(steps || []).map((_, i) => (
            <button 
              key={i}
              onClick={() => setActiveStep(i)}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i === activeStep ? 'bg-blue-500 w-8' : 'bg-white/10'}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className={`w-16 h-16 rounded-2xl ${steps[activeStep].color} flex items-center justify-center mb-6 border border-white/10 shadow-xl`}>
              {React.cloneElement(steps[activeStep].icon as React.ReactElement, { size: 32 })}
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">{steps[activeStep].title}</h3>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              {steps[activeStep].desc}
            </p>
            
            <div className="pt-8">
              <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl">
                <img 
                  src={steps[activeStep].visual} 
                  alt={steps[activeStep].title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-between items-center relative z-10">
        <button 
          onClick={() => setActiveStep(prev => (prev > 0 ? prev - 1 : steps.length - 1))}
          className="text-slate-400 hover:text-white transition font-bold text-sm uppercase tracking-widest flex items-center gap-2"
        >
          Précédent
        </button>
        <button 
          onClick={() => setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : 0))}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
        >
          {activeStep === steps.length - 1 ? "Recommencer" : "Suivant"} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = ({ products, settings, onUpdate, onClose }: { products: Product[], settings: any, onUpdate: () => void, onClose: () => void }) => {
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [configStatus, setConfigStatus] = useState<{ cloudinaryConfigured: boolean, cloudName: string } | null>(null);

  useEffect(() => {
    fetch('/api/config-status')
      .then(res => res.json())
      .then(data => setConfigStatus(data))
      .catch(err => console.error("Config status error:", err));
  }, []);

  const handleHeroImageUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroImageFile) return;
    setIsSaving(true);
    const formData = new FormData();
    formData.append('hero_image', heroImageFile);
    try {
      await fetch('/api/settings', { method: 'POST', body: formData });
      onUpdate();
      setHeroImageFile(null);
      alert("Image d'accueil mise à jour !");
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet article ?")) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    onUpdate();
  };

  const handleReorder = async (direction: 'up' | 'down', index: number) => {
    const newProducts = [...products];
    if (direction === 'up' && index > 0) {
      [newProducts[index], newProducts[index - 1]] = [newProducts[index - 1], newProducts[index]];
    } else if (direction === 'down' && index < newProducts.length - 1) {
      [newProducts[index], newProducts[index + 1]] = [newProducts[index + 1], newProducts[index]];
    } else {
      return;
    }

    try {
      const res = await fetch('/api/products/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: newProducts.map(p => p.id) }),
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error("Reorder error:", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    console.log("Saving product data:", editingProduct);
    
    const formData = new FormData();
    Object.entries(editingProduct || {}).forEach(([key, value]) => {
      if (key === 'features' || key === 'benefits') {
        const filtered = (value as string[]).filter(v => v.trim() !== '');
        formData.append(key, JSON.stringify(filtered));
      } else if (key === 'imageFile') {
        formData.append('image', value as File);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    if (!editingProduct?.id) {
      formData.set('id', Date.now().toString());
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.details || data.error || `Erreur ${res.status}`);
      }
      setEditingProduct(null);
      onUpdate();
      alert("Produit enregistré avec succès !");
    } catch (error: any) {
      console.error("Save error:", error);
      alert("Erreur lors de l'enregistrement : " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={onClose} />
      <div className="bg-white w-full max-w-5xl rounded-[1.5rem] sm:rounded-[2.5rem] relative z-10 overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
        <div className="p-4 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Gestion du Catalogue</h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">Ajoutez ou modifiez vos produits facilement</p>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <button 
              onClick={() => setEditingProduct({ title: '', shortDescription: '', fullDescription: '', type: 'domotique', features: [], benefits: [] })}
              className="bg-blue-600 text-white p-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <Plus size={20} /> <span className="hidden sm:inline">Nouveau</span>
            </button>
            <button onClick={onClose} className="p-2 sm:p-3 hover:bg-slate-200 rounded-lg sm:rounded-xl transition">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {configStatus && !configStatus.cloudinaryConfigured && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="font-black text-amber-900 text-sm sm:text-base">Attention : Stockage temporaire actif</h4>
                <p className="text-amber-700 text-xs sm:text-sm mt-1 leading-relaxed">
                  Cloudinary n'est pas configuré (Cloud Name: "{configStatus.cloudName}"). 
                  Les images que vous téléchargez seront perdues lors du prochain redémarrage du serveur. 
                  Pour un stockage permanent, veuillez configurer Cloudinary dans les paramètres de l'application.
                </p>
              </div>
            </div>
          )}

          <div className="mb-12 p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Bolt className="text-blue-600" size={20} /> Paramètres Généraux
            </h3>
            <form onSubmit={handleHeroImageUpdate} className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                <img src={settings.hero_image} className="w-full h-full object-cover" alt="Hero actuelle" />
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-sm text-slate-500 font-medium">Changer l'image principale de la page d'accueil</p>
                <div className="flex flex-wrap gap-4">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => setHeroImageFile(e.target.files?.[0] || null)}
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {heroImageFile && (
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition"
                    >
                      {isSaving ? "Mise à jour..." : "Appliquer le changement"}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {editingProduct ? (
            <form onSubmit={handleSave} className="space-y-8 max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Titre du Produit</label>
                  <input 
                    required
                    value={editingProduct.title || ''}
                    onChange={e => setEditingProduct({...editingProduct, title: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Catégorie</label>
                  <select 
                    value={editingProduct.type || 'domotique'}
                    onChange={e => setEditingProduct({...editingProduct, type: e.target.value as ProductType})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="domotique">Maison (Domotique)</option>
                    <option value="industrie">Entreprise (Industrie)</option>
                    <option value="electronique">Électronique (Sur mesure)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Description Courte</label>
                <input 
                  required
                  value={editingProduct.shortDescription || ''}
                  onChange={e => setEditingProduct({...editingProduct, shortDescription: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Description Complète</label>
                <textarea 
                  required
                  rows={4}
                  value={editingProduct.fullDescription || ''}
                  onChange={e => setEditingProduct({...editingProduct, fullDescription: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Image du Produit</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                    {editingProduct.image ? (
                      <img src={editingProduct.image} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-slate-300" />
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) setEditingProduct({...editingProduct, imageFile: file as any});
                    }}
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Caractéristiques (une par ligne)</label>
                <textarea 
                  rows={3}
                  value={(editingProduct.features || []).join('\n')}
                  onChange={e => setEditingProduct({...editingProduct, features: e.target.value.split('\n')})}
                  placeholder="Ex: Sécurité SBEE (15s)"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Avantages (un par ligne)</label>
                <textarea 
                  rows={3}
                  value={(editingProduct.benefits || []).join('\n')}
                  onChange={e => setEditingProduct({...editingProduct, benefits: e.target.value.split('\n')})}
                  placeholder="Ex: Réduction de facture"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Save size={20} /> {isSaving ? "Enregistrement..." : "Enregistrer le Produit"}
                </button>
                <button 
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-8 py-4 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="grid gap-4">
              {(products || []).map((p, index) => (
                <div key={p.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-6 group hover:bg-white hover:shadow-xl transition-all">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => handleReorder('up', index)}
                      disabled={index === 0}
                      className={`p-1 rounded hover:bg-slate-200 transition ${index === 0 ? 'opacity-20 cursor-not-allowed' : 'text-slate-400 hover:text-blue-600'}`}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button 
                      onClick={() => handleReorder('down', index)}
                      disabled={index === products.length - 1}
                      className={`p-1 rounded hover:bg-slate-200 transition ${index === products.length - 1 ? 'opacity-20 cursor-not-allowed' : 'text-slate-400 hover:text-blue-600'}`}
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  <img src={p.image} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900">{p.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">
                      {p.type === 'domotique' ? 'Maison' : p.type === 'industrie' ? 'Entreprise' : 'Électronique'}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingProduct(p)}
                      className="p-3 bg-white text-blue-600 rounded-xl shadow-sm hover:bg-blue-50 transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-3 bg-white text-red-600 rounded-xl shadow-sm hover:bg-red-50 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any>({ 
    hero_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000' 
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [legalType, setLegalType] = useState<'legal' | 'privacy' | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');

  const filterMap: Record<string, string> = {
    'Tous': 'Tous',
    'Maison': 'domotique',
    'Entreprise': 'industrie',
    'Électronique': 'electronique'
  };

  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  console.log("Rendering App with products:", products.length);

  const fetchData = async () => {
    setIsLoading(true);
    setDbError(null);
    try {
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (Array.isArray(prodData)) {
          setProducts(prodData);
        }
      } else {
        const errorData = await prodRes.json().catch(() => ({}));
        setDbError(errorData.error || "Impossible de se connecter à la base de données.");
      }

      // Fetch settings independently
      const setRes = await fetch('/api/settings');
      if (setRes.ok) {
        const setData = await setRes.json();
        if (setData && setData.hero_image) {
          setSettings(setData);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setDbError("Erreur réseau : Vérifiez votre configuration DATABASE_URL.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'fabio2024') {
      setIsAdmin(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      {/* HERO SECTION */}
      <header className="relative pt-24 pb-16 md:pt-56 md:pb-40 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent" />
        <div className="container mx-auto grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 sm:mb-6">
              <Zap size={12} sm:size={14} /> Innovation & Sécurité au Bénin
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black mb-6 sm:mb-8 leading-[0.9] tracking-tighter text-slate-900">
              Vivez dans le <span className="text-blue-600 italic">confort</span> du futur.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 sm:mb-10 leading-relaxed max-w-xl font-medium">
              Agboton Fabio transforme votre quotidien. Nous installons des systèmes intelligents et concevons vos futurs produits électroniques. 
              <span className="text-slate-900 font-bold block mt-2">Simple, fiable et économique.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#catalogue" className="bg-slate-900 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold hover:bg-blue-600 transition shadow-2xl shadow-slate-200 flex items-center justify-center gap-2">
                Découvrir nos solutions <ArrowRight size={20} />
              </a>
              <a href={CONTACT_WHATSAPP} className="bg-white text-slate-900 border border-slate-200 px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold hover:bg-slate-50 transition flex items-center justify-center">
                Parler à un expert
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative mt-10 lg:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="absolute -inset-2 sm:-inset-4 bg-blue-100 rounded-[2rem] sm:rounded-[3rem] blur-2xl sm:blur-3xl opacity-30 animate-pulse" />
            <div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-4 sm:border-8 border-white bg-slate-100">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={settings.hero_image}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={settings.hero_image} 
                  className="w-full h-[300px] sm:h-[500px] object-cover" 
                  alt="Expertise Électronique"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 bg-slate-900/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-600/20">
                    <Microchip size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Expertise Locale</p>
                    <p className="text-sm sm:text-base font-bold text-white leading-tight">Conception de cartes électroniques sur mesure</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* DOMOTIQUE EXPLAINER */}
      <section id="domotique" className="py-20 sm:py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500 rounded-full blur-[80px] sm:blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-500 rounded-full blur-[80px] sm:blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-stretch">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <SmartHomeInteractive />
            </motion.div>

            <div className="flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 sm:mb-10 leading-tight">
                C'est quoi la Domotique ? <br/>
                <span className="text-blue-400 italic">Simplifier votre vie.</span>
              </h2>
              
              <div className="space-y-8 sm:space-y-10">
                {[
                  { icon: <Lightbulb />, title: "Économie d'énergie", desc: "Vos lumières et climatisations s'éteignent seules quand vous quittez une pièce." },
                  { icon: <ShieldCheck />, title: "Sécurité Totale", desc: "Recevez une alerte sur votre téléphone en cas d'intrusion ou de fuite d'eau." },
                  { icon: <Smartphone />, title: "Contrôle à distance", desc: "Ouvrez votre portail ou allumez la télé depuis votre smartphone, où que vous soyez." }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex gap-4 sm:gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-blue-400 shrink-0 border border-white/10 h-fit">
                      {React.cloneElement(item.icon as React.ReactElement, { size: 24 })}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-white">{item.title}</h3>
                      <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS GRID */}
      <section id="solutions" className="py-20 sm:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-4 block">Ce que nous faisons pour vous</span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 tracking-tighter">Des solutions <span className="text-blue-600">simples</span> pour tous.</h2>
            <p className="text-slate-500 text-base sm:text-lg font-medium">De la maison intelligente aux besoins des entreprises, nous rendons la technologie facile à utiliser.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: <Smartphone />, title: "Maison Intelligente", desc: "Contrôlez vos lumières, votre clim et votre sécurité depuis votre téléphone." },
              { icon: <Factory />, title: "Services aux Entreprises", desc: "Nous installons et réparons les machines de votre usine ou boutique." },
              { icon: <Cpu />, title: "Création d'Appareils", desc: "Nous fabriquons des cartes et des appareils électroniques sur mesure pour vos idées." }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                <div className="bg-white p-5 rounded-2xl text-blue-600 w-fit mb-8 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {React.cloneElement(item.icon as React.ReactElement, { size: 32 })}
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOGUE */}
      <section id="catalogue" className="py-20 sm:py-32 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 tracking-tighter uppercase">Nos Produits & Réalisations</h2>
              <p className="text-slate-500 text-base sm:text-lg font-medium italic">Cliquez sur un produit pour voir comment il peut vous aider au quotidien.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Tous', 'Maison', 'Entreprise', 'Électronique'].map((filter) => (
                <button 
                  key={filter} 
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold border transition ${
                    activeFilter === filter 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-600 hover:text-blue-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {isLoading ? (
              <div className="col-span-full py-20 text-center">
                <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-500 font-bold">Chargement du catalogue...</p>
              </div>
            ) : dbError ? (
              <div className="col-span-full py-16 px-8 text-center bg-red-50 rounded-[2rem] border border-red-100">
                <X className="mx-auto text-red-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-red-900 mb-2">Un petit problème technique</h3>
                <p className="text-red-700 mb-6 max-w-md mx-auto">Nous n'arrivons pas à afficher les produits pour le moment. Cela arrive parfois quand la connexion à notre base de données est coupée.</p>
                <div className="bg-white p-4 rounded-xl text-left text-xs font-mono text-slate-600 mb-6 overflow-x-auto">
                  <p className="font-bold mb-1">Note pour l'administrateur :</p>
                  <p>{dbError}</p>
                </div>
                <button 
                  onClick={fetchData}
                  className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition"
                >
                  Essayer de reconnecter
                </button>
              </div>
            ) : (products || []).filter(p => activeFilter === 'Tous' || p.type === filterMap[activeFilter]).length > 0 ? (
              (products || [])
                .filter(p => activeFilter === 'Tous' || p.type === filterMap[activeFilter])
                .map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => setSelectedProduct(product)} 
                  />
                ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                <Factory className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 font-bold text-lg">Aucune réalisation trouvée dans cette catégorie.</p>
                <p className="text-slate-400 text-sm mt-2">Essayez une autre catégorie ou revenez plus tard.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 sm:py-32 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="bg-blue-600 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-200">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full blur-[80px] sm:blur-[100px]" />
              <div className="absolute -bottom-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-900 rounded-full blur-[80px] sm:blur-[100px]" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 sm:mb-8 leading-tight">Prêt à transformer votre quotidien ?</h2>
              <p className="text-blue-100 text-lg sm:text-xl mb-8 sm:mb-12 font-medium">
                Discutons de votre projet. Qu'il s'agisse d'une maison intelligente ou d'un besoin industriel, Agboton Fabio vous accompagne de A à Z.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <a 
                  href={CONTACT_WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-600 px-8 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-slate-50 transition shadow-xl flex items-center gap-3"
                >
                  Démarrer sur WhatsApp <ArrowRight size={20} sm:size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-16 sm:py-24 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 sm:gap-16 mb-16">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                  <Bolt size={20} />
                </div>
                <div className="font-black text-2xl tracking-tighter text-slate-900">TECHNO-ENERGIE</div>
              </div>
              <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
                L'excellence en ingénierie électronique et domotique au service du développement technologique au Bénin.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 sm:mb-8">Contact</h4>
              <p className="text-slate-900 font-bold mb-2">Agboton Fabio</p>
              <p className="text-slate-500 text-sm font-medium mb-4">Technicien Supérieur en Électrotechnique</p>
              <div className="flex flex-col gap-2">
                <a href="tel:+2290162330710" className="text-blue-600 font-bold hover:underline text-sm sm:text-base">+229 01 62 33 07 10</a>
                <a href="tel:+2290140377059" className="text-blue-600 font-bold hover:underline text-sm sm:text-base">+229 01 40 377 059</a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Réseaux</h4>
              <div className="flex gap-4">
                <a 
                  href={CONTACT_WHATSAPP} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#25D366] hover:border-[#25D366] transition cursor-pointer"
                  title="WhatsApp"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a 
                  href={LINKEDIN_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#0077B5] hover:border-[#0077B5] transition cursor-pointer"
                  title="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href={FACEBOOK_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#1877F2] hover:border-[#1877F2] transition cursor-pointer"
                  title="Facebook"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href={INSTAGRAM_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#E4405F] hover:border-[#E4405F] transition cursor-pointer"
                  title="Instagram"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.584.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.584-.071 4.85c-.055 1.17-.249 1.805-.415 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.584-.015-4.85-.071c-1.17-.055-1.805-.249-2.227-.415-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.015-3.584.071-4.85c.055-1.17.249-1.805.415-2.227.217-.562.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.057-.36 2.227-.413 1.266-.057 1.646-.07 4.85-.07zm0 3.678c-3.405 0-6.162 2.757-6.162 6.162 0 3.405 2.757 6.162 6.162 6.162 3.405 0 6.162-2.757 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.645-1.44-1.44 0-.794.645-1.439 1.44-1.439.794 0 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                © {new Date().getFullYear()} Techno-Energie. Tous droits réservés.
              </p>
              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                <button 
                  onClick={() => setLegalType('legal')}
                  className="text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition"
                >
                  Mentions Légales
                </button>
                <button 
                  onClick={() => setLegalType('privacy')}
                  className="text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition"
                >
                  Confidentialité
                </button>
                <button 
                  onClick={() => setShowAdmin(true)}
                  className="text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition flex items-center gap-2"
                >
                  <Lock size={12} /> Admin
                </button>
              </div>
            </div>
          </div>
        </footer>

      <AnimatePresence>
        {selectedProduct && (
          <Modal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
        {legalType && (
          <LegalModal 
            type={legalType} 
            onClose={() => setLegalType(null)} 
          />
        )}
        {showAdmin && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setShowAdmin(false)} />
            {isAdmin ? (
              <AdminDashboard 
                products={products} 
                settings={settings}
                onUpdate={fetchData} 
                onClose={() => setShowAdmin(false)} 
              />
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-10 rounded-[2.5rem] relative z-10 w-full max-w-md shadow-2xl"
              >
                <h3 className="text-2xl font-black mb-6 text-slate-900">Accès Administrateur</h3>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <input 
                    type="password" 
                    placeholder="Mot de passe"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition">
                    Se connecter
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
