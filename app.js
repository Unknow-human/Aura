// CONFIGURATION : Remplacez par vos propres liens
const CONFIG = {
    // 1. Publiez votre Google Sheet sur le web au format CSV et mettez l'ID ici
    SHEET_ID: 'e/2PACX-1vSMwc9l4sL1A_peOCszJYVk8uUwxWdeirVR9HHYMLrAYVIt_HtADnZ6RelyYwwCecg7f7EcTbjlVfxQ', 
    // 2. URL de votre Google Form pré-rempli
    FORM_BASE_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSd7pDwU5p3AVrkcsIfypPMg314kb7lZnyZZ4x3NAu6gPLhIKg/viewform?usp=pp_url&entry.123323335=XXXXX&entry.301623353=XXXXXX',
    // 3. IDs des entrées du formulaire (à trouver via "Obtenir le lien pré-rempli")
    FORM_ENTRY_ID_PRODUIT: 'entry.123323335',
    FORM_ENTRY_ID_PRIX: 'entry.301623353',
    // 4. Lien de paiement direct (ex: Paystack, Flutterwave ou lien Wave)
    PAYMENT_LINK: 'https://wa.me/+2290162330710?text=Je%20souhaite%20payer%20mon%20commande'
};

const productGrid = document.getElementById('product-grid');

/**
 * Récupère les données du Google Sheet (CSV Public)
 */
async function fetchProducts() {
    const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv`;
    
    try {
        const response = await fetch(url);
        const data = await response.text();
        const rows = data.split('\n').slice(1); // On saute l'en-tête

        productGrid.innerHTML = ''; // Vide le loader

        rows.forEach(row => {
            const columns = row.split(','); // Format : Nom,ImageURL,Prix,Description
            if (columns.length >= 3) {
                const [nom, image, prix, desc] = columns;
                renderProduct(nom.trim(), image.trim(), prix.trim(), desc.trim());
            }
        });
    } catch (error) {
        console.error("Erreur de chargement:", error);
        productGrid.innerHTML = `<p class="text-red-500 text-center col-span-full">Impossible de charger les produits. Vérifiez la configuration du Google Sheet.</p>`;
    }
}

/**
 * Affiche un produit dans la grille
 */
function renderProduct(nom, image, prix, desc) {
    // Création du lien Google Form pré-rempli
    const orderUrl = `${CONFIG.FORM_BASE_URL}?${CONFIG.FORM_ENTRY_ID_PRODUIT}=${encodeURIComponent(nom)}&${CONFIG.FORM_ENTRY_ID_PRIX}=${encodeURIComponent(prix)}`;

    const card = `
        <div class="product-card bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
            <img src="${image}" alt="${nom}" class="w-full h-48 object-cover bg-gray-200">
            <div class="p-6 flex-grow">
                <h4 class="text-xl font-bold mb-2">${nom}</h4>
                <p class="text-gray-600 text-sm mb-4">${desc}</p>
                <div class="text-2xl font-bold text-blue-900 mb-4">${prix} <small class="text-sm font-medium">FCFA</small></div>
            </div>
            <div class="p-6 pt-0 flex gap-2">
                <a href="${orderUrl}" target="_blank" class="flex-1 text-center bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Commander</a>
                <a href="${CONFIG.PAYMENT_LINK}" target="_blank" class="px-3 flex items-center bg-yellow-400 rounded hover:bg-yellow-500 transition" title="Payer maintenant">
                    <i class="fas fa-credit-card text-blue-900"></i>
                </a>
            </div>
        </div>
    `;
    productGrid.innerHTML += card;
}

// Lancement
document.addEventListener('DOMContentLoaded', fetchProducts);