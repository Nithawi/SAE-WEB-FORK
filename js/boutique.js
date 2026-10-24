document.addEventListener('DOMContentLoaded', () => {
    // Ciblage des éléments HTML
    const filterBtns = document.querySelectorAll('.explorer__categorie');
    const galleryItems = document.querySelectorAll('.collection__livre');
    const galleryEmpty = document.getElementById('galleryEmpty');
    const galleryMore = document.getElementById('galleryMore');
    const searchInput = document.getElementById('recherche-livre');
    const searchForm = document.querySelector('.explorer__recherche');
    
    // Paramètres
    const livres = 4; 
    let activeFilter = 'all';
    let visibleLimit = livres;
    let searchTerm = ''; // Stocke le texte tapé dans la barre

    // 1. Empêcher le formulaire de recherche de recharger la page
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    // 2. Écouteur sur la barre de recherche (déclenché à chaque lettre tapée)
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase().trim();
            visibleLimit = livres; // On réinitialise l'affichage au début lors d'une nouvelle recherche
            refreshGallery();
        });
    }

    // 3. Événement au clic sur les filtres (catégories)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            const selectedCategory = btn.dataset.category;
            activeFilter = (activeFilter === selectedCategory) ? 'all' : selectedCategory;
            
            visibleLimit = livres; 
            refreshGallery();
        });
    });

    // 4. Fonction globale de mise à jour de la galerie
    function refreshGallery() {
        // Sélectionne les livres qui correspondent À LA FOIS au filtre catégorie ET à la recherche texte
        const matchingItems = Array.from(galleryItems).filter(item => {
            // Test de la catégorie
            const categories = item.dataset.category.split(' ');
            const isCategoryMatch = activeFilter === 'all' || categories.includes(activeFilter);

            // Test du texte (titre ou auteur)
            const title = item.querySelector('.collection__livre__titre').textContent.toLowerCase();
            const author = item.querySelector('.collection__livre__auteur').textContent.toLowerCase();
            const isSearchMatch = searchTerm === '' || title.includes(searchTerm) || author.includes(searchTerm);

            return isCategoryMatch && isSearchMatch;
        });

        // Affiche ou masque les cartes selon les correspondances et la limite
        galleryItems.forEach(item => {
            const itemIndex = matchingItems.indexOf(item);
            // Si l'index est -1, le livre ne correspond pas aux filtres. Sinon, on vérifie s'il est sous la limite visible.
            const isVisible = itemIndex !== -1 && itemIndex < visibleLimit;
            
            item.classList.toggle('hidden', !isVisible);
        });

        // Gestion du message "Aucun livre"
        if (galleryEmpty) {
            galleryEmpty.classList.toggle('hidden', matchingItems.length > 0);
        }

        // Gestion du bouton Voir Plus / Voir Moins
        if (galleryMore) {
            const hasMoreItems = matchingItems.length > visibleLimit;
            const canShowLess = visibleLimit > livres && matchingItems.length > livres;
            
            galleryMore.classList.toggle('hidden', !hasMoreItems && !canShowLess);
            
            if (hasMoreItems) {
                galleryMore.innerHTML = 'Voir plus <i class="fa-solid fa-plus" aria-hidden="true"></i>';
            } else {
                galleryMore.innerHTML = 'Voir moins <i class="fa-solid fa-minus" aria-hidden="true"></i>';
            }
        }
    }

    // 5. Événement au clic sur "Voir plus / Voir moins"
    if (galleryMore) {
        galleryMore.addEventListener('click', (e) => {
            e.preventDefault();
            
            // On recalcule le nombre d'éléments correspondants pour savoir où on en est
            const matchingItems = Array.from(galleryItems).filter(item => {
                const categories = item.dataset.category.split(' ');
                const isCategoryMatch = activeFilter === 'all' || categories.includes(activeFilter);
                const title = item.querySelector('.collection__livre__titre').textContent.toLowerCase();
                const author = item.querySelector('.collection__livre__auteur').textContent.toLowerCase();
                const isSearchMatch = searchTerm === '' || title.includes(searchTerm) || author.includes(searchTerm);
                
                return isCategoryMatch && isSearchMatch;
            });
            
            if (visibleLimit < matchingItems.length) {
                visibleLimit += livres; 
            } else {
                visibleLimit = livres; 
            }
            refreshGallery();
        });
    }

    // Initialisation au chargement de la page
    refreshGallery();
});