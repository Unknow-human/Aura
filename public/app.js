const CONFIG = {
    // ID de ton Google Sheet publié en CSV
    SHEET_ID: '2PACX-1vSMwc9l4sL1A_peOCszJYVk8uUwxWdeirVR9HHYMLrAYVIt_HtADnZ6RelyYwwCecg7f7EcTbjlVfxQ',
    WHATSAPP: '2290162330710'
};

async function fetchProducts() {
    const grid = document.getElementById('product-grid');
    const featuredRoot = document.getElementById('featured-root');
    const url = `https://docs.google.com/spreadsheets/d/e/${CONFIG.SHEET_ID}/pub?output=csv`;

    try {
        const response = await fetch(url);
        const data = await response.text();
        const rows = data.split('\n').map(r => r.split(',')).slice(1);

        grid.innerHTML = ''; // Clear loader

        rows.forEach(p => {
            if (p.length < 3 || p[0].trim() === "") return;
            const [nom, img, prix, desc, tag, isFeatured] = p;

            // Rendu du produit vedette (Mise en avant)
            if (isFeatured && isFeatured.trim() === "1") {
                featuredRoot.innerHTML = renderFeatured(nom, img, prix, desc);
            } else {
                grid.innerHTML += renderCard(nom, img, prix, desc, tag);
            }
        });
    } catch (e) {
        console.error("Erreur de données:", e);
    }
}

// Fonction pour transformer un lien GitHub standard en lien direct RAW
function getRawImg(url) {
    if (url.includes('github.com') && !url.includes('raw')) {
        return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    }
    return url;
}

function renderFeatured(nom, img, prix, desc) {
    const link = `https://wa.me/${CONFIG.WHATSAPP}?text=Je-veux-commander-la-solution-VEDETTE-*${encodeURIComponent(nom)}*`;
    return `
    <section class="container mx-auto px-6 -mt-10">
        <div class="bg-gray-900 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center border border-white/5 shadow-3xl">
            <img src="${getRawImg(img)}" class="w-full md:w-1/2 h-80 object-cover rounded-[2rem] shadow-2xl">
            <div class="text-white">
                <span class="text-blue-400 font-black tracking-widest text-xs uppercase mb-4 block">🔥 Solution Recommandée</span>
                <h2 class="text-4xl font-extrabold mb-6">${nom}</h2>
                <p class="text-gray-400 mb-8 font-medium">${desc}</p>
                <div class="flex items-center gap-6">
                    <span class="text-4xl font-black text-white">${prix} <small class="text-sm font-bold opacity-50">FCFA</small></span>
                    <a href="${link}" class="bg-blue-600 px-10 py-4 rounded-2xl font-black hover:bg-white hover:text-blue-900 transition-all duration-300 shadow-xl">VITE, JE COMMANDE</a>
                </div>
            </div>
        </div>
    </section>`;
}

function renderCard(nom, img, prix, desc, tag) {
    const waLink = `https://wa.me/${CONFIG.WHATSAPP}?text=Bonjour Fabio, je souhaite commander : *${encodeURIComponent(nom)}* (${prix.fcfa} FCFA)`;
    return `
    <div class="product-card group bg-white rounded-[2.5rem] p-5 shadow-sm border border-gray-50 hover:shadow-2xl transition-all">
        <div class="h-72 rounded-[2rem] overflow-hidden mb-8 relative">
            <img src="${getRawImg(img)}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                ${tag || 'Ingénierie'}
            </div>
        </div>
        <div class="px-2">
            <h4 class="text-2xl font-extrabold text-gray-900 mb-2">${nom}</h4>
            <p class="text-gray-400 text-sm font-medium mb-8 line-clamp-2 italic leading-relaxed">${desc}</p>
            <div class="flex justify-between items-center bg-gray-50 p-4 rounded-3xl">
                <span class="text-2xl font-black text-blue-700">${prix} <small class="text-[10px] opacity-50 uppercase">FCFA</small></span>
                <a href="${waLink}" class="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-green-600 transition shadow-xl transform hover:rotate-6">
                    <i class="fab fa-whatsapp text-2xl"></i>
                </a>
            </div>
        </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', fetchProducts);
