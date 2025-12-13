document.addEventListener('DOMContentLoaded', function () {
    // ====================================
    // MOBILE MENU FUNCTIONALITY
    // ====================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function (e) {
            e.stopPropagation();

            // Toggle mobile menu class
            mainNav.classList.toggle('mobile-open');

            // Toggle icon and body scroll
            if (mainNav.classList.contains('mobile-open')) {
                this.innerHTML = '<i class="fas fa-times"></i>';
                document.body.style.overflow = 'hidden';
            } else {
                this.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 900 &&
                mainNav.classList.contains('mobile-open') &&
                !mainNav.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {

                mainNav.classList.remove('mobile-open');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 900 && mainNav.classList.contains('mobile-open')) {
                    mainNav.classList.remove('mobile-open');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = '';
                }
            });
        });
    }
    
});