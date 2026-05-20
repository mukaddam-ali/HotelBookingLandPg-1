// Main JavaScript file for Direct-Booking MVP

document.addEventListener('DOMContentLoaded', () => {
    console.log('Frontend script loaded.');
    
    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerClose = document.getElementById('drawerClose');

    function openDrawer() {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer when a link inside it is clicked
    document.querySelectorAll('.drawer-link, .drawer-book').forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // ----------------------------------------------------
    // Infinite Drag-to-Scroll Marquee Gallery (Per-Row)
    // ----------------------------------------------------
    const marqueeContainer = document.getElementById('marquee-gallery');
    if (marqueeContainer) {

        const AUTO_SPEED = 0.3; // Slower auto-scroll

        marqueeContainer.querySelectorAll('.marquee-row').forEach((row) => {
            const direction = parseFloat(row.dataset.direction) || 1;
            const track = row.querySelector('.marquee-track');

            let position = 0;
            let trackWidth = 0;
            let isDragging = false;
            let lastX = 0;
            let dragDelta = 0;

            // Measure track width after layout
            setTimeout(() => {
                trackWidth = track.getBoundingClientRect().width;
            }, 150);

            window.addEventListener('resize', () => {
                trackWidth = track.getBoundingClientRect().width;
            });

            // Per-row mousedown — only this row is targeted
            row.addEventListener('mousedown', (e) => {
                isDragging = true;
                lastX = e.pageX;
                dragDelta = 0;
                row.style.cursor = 'grabbing';
                e.preventDefault();
            });

            window.addEventListener('mouseup', () => {
                if (!isDragging) return;
                isDragging = false;
                row.style.cursor = 'grab';
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                dragDelta = e.pageX - lastX;
                lastX = e.pageX;
                position += dragDelta;
            });

            // Animation loop — completely independent per row
            function animate() {
                if (!isDragging) {
                    position -= direction * AUTO_SPEED;
                }

                // Seamless infinite loop
                if (position <= -trackWidth) position += trackWidth;
                else if (position > 0) position -= trackWidth;

                row.style.transform = `translate3d(${position}px, 0, 0)`;
                requestAnimationFrame(animate);
            }

            animate();
        });
    }

    // ----------------------------------------------------
    // Drag-to-Scroll for Pricing Grid (Desktop Swiping)
    // ----------------------------------------------------
    const pricingGrid = document.querySelector('.pricing-grid');
    if (pricingGrid) {
        let isDown = false;
        let startX;
        let scrollLeft;

        pricingGrid.style.cursor = 'grab'; // Indicate it's draggable

        pricingGrid.addEventListener('mousedown', (e) => {
            isDown = true;
            pricingGrid.style.cursor = 'grabbing';
            pricingGrid.style.scrollSnapType = 'none'; // Disable snap during drag
            startX = e.pageX - pricingGrid.offsetLeft;
            scrollLeft = pricingGrid.scrollLeft;
        });

        pricingGrid.addEventListener('mouseleave', () => {
            isDown = false;
            pricingGrid.style.cursor = 'grab';
            pricingGrid.style.scrollSnapType = ''; // Restore snap
        });

        pricingGrid.addEventListener('mouseup', () => {
            isDown = false;
            pricingGrid.style.cursor = 'grab';
            pricingGrid.style.scrollSnapType = ''; // Restore snap
        });

        pricingGrid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault(); // Prevent text selection
            const x = e.pageX - pricingGrid.offsetLeft;
            const walk = (x - startX) * 1.5; // Drag speed multiplier
            pricingGrid.scrollLeft = scrollLeft - walk;
        });
    }

});
