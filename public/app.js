const CONFIG = {
    // IMPORTANT : Remplacez par votre ID de feuille publiée
    SHEET_ID: '2PACX-1vSMwc9l4sL1A_peOCszJYVk8uUwxWdeirVR9HHYMLrAYVIt_HtADnZ6RelyYwwCecg7f7EcTbjlVfxQ', 
    FORM_BASE_URL: 'https://docs.google.com/forms/d/e/1WlHJMFNfPVAf6US3wmnXZhtTvr3ip0oy9kCUjVktY2k/viewform',
    // Exemple de lien de paiement via une plateforme comme Paystack ou un numéro Wave
    PAYMENT_LINK: 'https://wa.me/+2290162330710?text=Je-souhaite-payer-une-commande' 
};

async function fetchProducts() {
    const grid = document.getElementById('product-grid');
    
    // Test : Si l'ID n'est pas configuré, afficher un message d'aide
    if (CONFIG.SHEET_ID === 'VOTRE_ID_GOOGLE_SHEET') {
        grid.innerHTML = `
            <div class="col-span-full bg-yellow-100 p-4 rounded text-yellow-800">
                <strong>Mode Test :</strong> Ajoutez l'ID de votre Google Sheet dans <code>app.js</code> pour voir vos produits.
            </div>`;
        return;
    }

    const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.text();
        const rows = data.split('\n').slice(1);
        grid.innerHTML = ''; 

        rows.forEach(row => {
            const cols = row.split(','); 
            if (cols.length >= 3) {
                renderCard(cols[0], cols[1], cols[2], cols[3] || "");
            }
        });
    } catch (err) {
        grid.innerHTML = `<p class="text-red-500">Erreur lors de la récupération des données.</p>`;
    }
}

function renderCard(nom, img, prix, desc) {
    const grid = document.getElementById('product-grid');
    const card = `
        <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition">
            <img src="${img}" class="w-full h-48 object-cover" alt="${nom}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Indisponible'">
            <div class="p-4">
                <h4 class="font-bold text-xl mb-1">${nom}</h4>
                <p class="text-gray-500 text-sm mb-3">${desc}</p>
                <div class="text-blue-700 font-bold text-lg mb-4">${prix} FCFA</div>
                <div class="flex gap-2">
                    <a href="${CONFIG.FORM_BASE_URL}" class="flex-1 bg-blue-600 text-white text-center py-2 rounded font-bold">Commander</a>
                    <a href="${CONFIG.PAYMENT_LINK}" class="bg-yellow-400 px-3 py-2 rounded"><i class="fas fa-wallet"></i></a>
                </div>
            </div>
        </div>
    `;
    grid.innerHTML += card;
}

document.addEventListener('DOMContentLoaded', fetchProducts);
