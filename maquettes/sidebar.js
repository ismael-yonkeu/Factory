// Script pour gérer la sidebar pliable
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const overlay = document.getElementById('sidebarOverlay');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    
    if (sidebar && mainContent) {
        // Pour mobile, cacher/afficher complètement la sidebar
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('mobile-open');
            sidebar.classList.toggle('mobile-hidden');
            if (overlay) {
                overlay.classList.toggle('active');
            }
        } else {
            // Pour desktop, réduire/étendre la sidebar (icônes restent visibles)
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('sidebar-collapsed');
        }
    }
}

// Fermer la sidebar lors du clic sur le bouton close
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && mainContent) {
        // Pour mobile, cacher complètement
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('mobile-open');
            sidebar.classList.add('mobile-hidden');
            if (overlay) {
                overlay.classList.remove('active');
            }
        } else {
            // Pour desktop, réduire avec icônes visibles
            sidebar.classList.add('collapsed');
            mainContent.classList.add('sidebar-collapsed');
        }
    }
}

// Gérer le redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const overlay = document.getElementById('sidebarOverlay');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    
    if (window.innerWidth <= 768) {
        // Mode mobile : sidebar cachée par défaut (translateX(-100%))
        if (sidebar) {
            sidebar.classList.remove('collapsed');
            if (!sidebar.classList.contains('mobile-open')) {
                sidebar.classList.add('mobile-hidden');
            }
            if (mainContent) {
                mainContent.classList.remove('sidebar-collapsed');
            }
        }
        if (toggleBtn) {
            toggleBtn.classList.remove('hidden');
        }
    } else {
        // Mode desktop : sidebar peut être réduite ou étendue (largeur 70px ou 280px)
        if (sidebar) {
            sidebar.classList.remove('mobile-open');
            sidebar.classList.remove('mobile-hidden');
            // Garder l'état collapsed si déjà collapsed
            const isCollapsed = sidebar.classList.contains('collapsed');
            if (isCollapsed && mainContent) {
                mainContent.classList.add('sidebar-collapsed');
            } else if (!isCollapsed && mainContent) {
                mainContent.classList.remove('sidebar-collapsed');
            }
        }
        if (overlay) {
            overlay.classList.remove('active');
        }
        if (toggleBtn) {
            toggleBtn.classList.add('hidden');
        }
    }
});

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    // Marquer l'élément actif dans la sidebar
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.sidebar-nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            item.classList.add('active');
        }
    });
    
    // Gérer le redimensionnement initial
    window.dispatchEvent(new Event('resize'));
});

