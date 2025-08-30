class Navigation {
    constructor() {
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Mobile menu toggle
        if (this.mobileMenuBtn && this.mobileMenu) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Set active nav link based on current page
        this.setActiveNavLink();
        
        // Add navbar background on scroll
        this.handleNavbarScroll();
    }
    
    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('active');
        const icon = this.mobileMenuBtn.querySelector('i') || this.mobileMenuBtn;
        icon.textContent = this.mobileMenu.classList.contains('active') ? '✕' : '☰';
    }
    
    closeMobileMenu() {
        this.mobileMenu.classList.remove('active');
        const icon = this.mobileMenuBtn.querySelector('i') || this.mobileMenuBtn;
        icon.textContent = '☰';
    }
    
    setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(13, 15, 23, 0.95)';
            } else {
                navbar.style.background = 'rgba(13, 15, 23, 0.6)';
            }
        });
    }
}

// Form handling
class ContactForm {
    constructor() {
        this.form = document.querySelector('#contact-form');
        // Use production URL when deployed, local URL for development
        this.apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://127.0.0.1:3000/api/contact'
            : 'https://crafix-media.vercel.app/api/contact'; 
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                this.handleSubmit(e);
            });
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span>📤</span> Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Send data to backend
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccessMessage(submitBtn, originalText);
                this.form.reset();
            } else {
                this.showErrorMessage(submitBtn, originalText, result.message);
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showErrorMessage(submitBtn, originalText, 'Network error. Please try again.');
        }
    }
    
    showSuccessMessage(submitBtn, originalText) {
        submitBtn.innerHTML = '<span>✓</span> Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        
        // Show success notification
        this.showNotification('Message sent successfully! We will get back to you within 24 hours.', 'success');
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }
    
    showErrorMessage(submitBtn, originalText, message) {
        submitBtn.innerHTML = '<span>❌</span> Error';
        submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        
        // Show error notification
        this.showNotification(message || 'Something went wrong. Please try again.', 'error');
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: auto;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
    }
}

// Portfolio filtering
class PortfolioFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        this.init();
    }
    
    init() {
        if (this.filterButtons.length > 0) {
            this.filterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.handleFilter(e);
                });
            });
        }
    }
    
    handleFilter(e) {
        const category = e.target.dataset.category;
        
        // Update active button
        this.filterButtons.forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        });
        e.target.classList.remove('btn-outline');
        e.target.classList.add('btn-primary');
        
        // Filter items
        this.portfolioItems.forEach(item => {
            const itemCategory = item.dataset.category;
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// Smooth scrolling for anchor links
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Intersection Observer for animations
class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements that should animate on scroll
        document.querySelectorAll('.card, .feature-card, .stat-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Counter animation for stats
class CounterAnimation {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('CounterAnimation initialized');
        const counters = document.querySelectorAll('.stat-value[data-count]');
        console.log('Found counters:', counters);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Counter intersecting:', entry.target);
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        console.log('Animating counter for target:', target);
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current).toLocaleString();
            
            if (current >= target) {
                element.textContent = target.toLocaleString() + '+';
                clearInterval(timer);
            }
        }, 16);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
    new ContactForm();
    new PortfolioFilter();
    new SmoothScroll();
    new ScrollAnimations();
    new CounterAnimation();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Utility functions
const utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Get element with error handling
    getElement: (selector) => {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element not found: ${selector}`);
        }
        return element;
    },
    
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};