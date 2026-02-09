document.addEventListener('DOMContentLoaded', () => {
    // 1. Image Navigation Logic
    const items = document.querySelectorAll('[data-item]');
    
    items.forEach(item => {
        const scroller = item.querySelector('[data-scroller]');
        const images = scroller.querySelectorAll('img');
        const nextBtn = item.querySelector('.next');
        const prevBtn = item.querySelector('.prev');
        let currentIndex = 0;

        const updateSlide = () => {
            const width = scroller.offsetWidth;
            scroller.style.transform = `translateX(-${currentIndex * width}px)`;
        };

        nextBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateSlide();
        });

        prevBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateSlide();
        });

        // Responsive fix: update slide on window resize
        window.addEventListener('resize', updateSlide);
    });

    // 2. Details Toggle Logic
    const toggleButtons = document.querySelectorAll('[data-toggle="details"]');

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('aria-controls');
            const targetDiv = document.getElementById(targetId);
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            // Toggle state
            btn.setAttribute('aria-expanded', !isExpanded);
            targetDiv.hidden = isExpanded;
            
            // Change button text
            btn.textContent = isExpanded ? 'Ətraflı bax' : 'Bağla';
        });
    });
});