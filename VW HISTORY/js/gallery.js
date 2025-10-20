// Enhanced Gallery filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryContainer = document.querySelector('.gallery-grid') || document.querySelector('.gallery-container');
    
    // Add loading state to gallery container
    if (galleryContainer) {
        galleryContainer.classList.add('gallery-loading');
    }
    
    // Debounce function to prevent rapid filtering
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Filter function with enhanced animations
    const filterGallery = debounce(function(filterValue) {
        // Update URL hash for shareable filtered state
        if (filterValue !== 'all') {
            window.location.hash = `filter-${filterValue}`;
        } else {
            window.location.hash = '';
        }
        
        // Add loading state
        if (galleryContainer) {
            galleryContainer.classList.add('gallery-filtering');
        }
        
        let visibleItems = 0;
        const animationDuration = 300;
        
        galleryItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            const shouldShow = filterValue === 'all' || itemCategory === filterValue;
            
            if (shouldShow) {
                visibleItems++;
                item.style.display = 'block';
                
                // Stagger animation for better visual effect
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1) translateY(0)';
                    item.classList.add('active');
                    item.classList.remove('hidden');
                }, index * 50); // Stagger delay
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8) translateY(20px)';
                item.classList.remove('active');
                item.classList.add('hidden');
                
                setTimeout(() => {
                    item.style.display = 'none';
                }, animationDuration);
            }
        });
        
        // Show message if no items found
        setTimeout(() => {
            const existingMessage = document.querySelector('.no-items-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            if (visibleItems === 0) {
                const noItemsMessage = document.createElement('div');
                noItemsMessage.className = 'no-items-message';
                noItemsMessage.innerHTML = `
                    <i class="fas fa-search"></i>
                    <h3>No items found</h3>
                    <p>Try selecting a different filter</p>
                `;
                
                if (galleryContainer) {
                    galleryContainer.appendChild(noItemsMessage);
                }
            }
            
            // Remove loading state
            if (galleryContainer) {
                galleryContainer.classList.remove('gallery-filtering');
            }
        }, animationDuration + (galleryItems.length * 50));
        
        // Update counter if exists
        updateItemsCounter(visibleItems, galleryItems.length);
        
    }, 150); // 150ms debounce delay
    
    // Items counter function
    function updateItemsCounter(visible, total) {
        let counter = document.querySelector('.gallery-counter');
        
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'gallery-counter';
            const filterContainer = document.querySelector('.filter-buttons');
            if (filterContainer) {
                filterContainer.appendChild(counter);
            }
        }
        
        counter.innerHTML = `Showing ${visible} of ${total} items`;
        counter.style.opacity = '1';
    }
    
    // Add click handlers with enhanced feedback
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const previousActive = document.querySelector('.filter-btn.active');
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Remove active class from all buttons
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            const filter = this.getAttribute('data-filter');
            
            // Update button states for accessibility
            filterBtns.forEach(b => {
                if (b !== this) {
                    b.classList.add('inactive');
                } else {
                    b.classList.remove('inactive');
                }
            });
            
            // Apply filter
            filterGallery(filter);
        });
        
        // Add keyboard navigation
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Check URL hash on page load for persistent filtering
    function checkInitialFilter() {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#filter-')) {
            const filterValue = hash.replace('#filter-', '');
            const correspondingBtn = document.querySelector(`.filter-btn[data-filter="${filterValue}"]`);
            if (correspondingBtn) {
                correspondingBtn.click();
            }
        } else {
            // Trigger initial "all" filter
            const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if (allBtn) {
                allBtn.classList.add('active');
                allBtn.setAttribute('aria-pressed', 'true');
                updateItemsCounter(galleryItems.length, galleryItems.length);
            }
        }
        
        // Remove initial loading state
        if (galleryContainer) {
            setTimeout(() => {
                galleryContainer.classList.remove('gallery-loading');
            }, 500);
        }
    }
    
    // Initialize
    checkInitialFilter();
    
    // Enhanced CSS for the new features
    const style = document.createElement('style');
    style.textContent = `
        .gallery-loading .gallery-item {
            opacity: 0.5;
        }
        
        .gallery-filtering {
            pointer-events: none;
        }
        
        .gallery-item {
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .gallery-item.hidden {
            display: none;
        }
        
        .filter-btn {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .filter-btn:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 3px;
            background: #e63946;
            transition: all 0.3s ease;
            transform: translateX(-50%);
        }
        
        .filter-btn.active:after {
            width: 80%;
        }
        
        .filter-btn.inactive {
            opacity: 0.7;
        }
        
        .filter-btn:focus {
            outline: 2px solid #e63946;
            outline-offset: 2px;
        }
        
        .no-items-message {
            text-align: center;
            padding: 3rem 1rem;
            grid-column: 1 / -1;
            color: #6c757d;
        }
        
        .no-items-message i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }
        
        .no-items-message h3 {
            margin-bottom: 0.5rem;
            color: #495057;
        }
        
        .gallery-counter {
            text-align: center;
            padding: 0.5rem;
            font-size: 0.9rem;
            color: #6c757d;
            transition: opacity 0.3s ease;
            grid-column: 1 / -1;
        }
        
        @media (max-width: 768px) {
            .gallery-item {
                transition: all 0.3s ease;
            }
        }
    `;
    document.head.appendChild(style);
});