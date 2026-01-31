document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const imageModal = document.getElementById('imageModal');
    const modalClose = document.querySelector('.modal-close');
    const modalImage = document.getElementById('fullImage');
    const modalPrevBtn = document.querySelector('.modal-prev-btn');
    const modalNextBtn = document.querySelector('.modal-next-btn');
    
    let currentIndex = 0;
    let modalIndex = 0;
    const totalSlides = slides.length;
    
    // Параметры слайда
    let slideWidth = 0;
    let slideGap = 25;
    
    // Инициализация
    initCarousel();
    
    function initCarousel() {
        // Получаем актуальные размеры
        updateSlideDimensions();
        
        // Центрируем первый слайд
        centerSlide(currentIndex);
        
        // Обновляем индикаторы
        updateIndicators();
        
        // Предзагрузка изображений
        preloadImages();
    }
    
    function updateSlideDimensions() {
        if (slides.length > 0) {
            const slide = slides[0];
            const rect = slide.getBoundingClientRect();
            slideWidth = rect.width;
            
            // Получаем gap из computed стилей
            const carouselStyle = window.getComputedStyle(carousel);
            const gap = carouselStyle.getPropertyValue('gap');
            slideGap = parseInt(gap) || 25;
        }
    }
    
    // ГЛАВНАЯ ФУНКЦИЯ: центрирование слайда
    function centerSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        const container = carousel.parentElement;
        const containerWidth = container.offsetWidth;
        
        // Центр контейнера
        const containerCenter = containerWidth / 2;
        
        // Позиция центра текущего слайда
        let slideCenter = 0;
        
        // Считаем позицию центра слайда
        for (let i = 0; i < index; i++) {
            slideCenter += slideWidth + slideGap;
        }
        slideCenter += slideWidth / 2;
        
        // Вычисляем смещение для центрирования
        const offset = containerCenter - slideCenter;
        
        // Применяем трансформацию
        carousel.style.transform = `translateX(${offset}px)`;
        
        // Обновляем текущий индекс
        currentIndex = index;
        
        // Обновляем индикаторы
        updateIndicators();
    }
    
    function updateIndicators() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Обновляем видимость стрелок
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex === totalSlides - 1 ? '0.5' : '1';
    }
    
    function nextSlide() {
        if (currentIndex < totalSlides - 1) {
            centerSlide(currentIndex + 1);
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            centerSlide(currentIndex - 1);
        }
    }
    
    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            centerSlide(index);
        }
    }
    
    // Модальное окно
    function openModal(index) {
        modalIndex = index;
        const slide = slides[index];
        const fullImageSrc = slide.getAttribute('data-full') || slide.querySelector('img').src;
        
        modalImage.src = fullImageSrc;
        modalImage.alt = slide.querySelector('img').alt;
        
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function modalNext() {
        modalIndex = (modalIndex + 1) % totalSlides;
        const slide = slides[modalIndex];
        const fullImageSrc = slide.getAttribute('data-full') || slide.querySelector('img').src;
        modalImage.src = fullImageSrc;
        modalImage.alt = slide.querySelector('img').alt;
    }
    
    function modalPrev() {
        modalIndex = (modalIndex - 1 + totalSlides) % totalSlides;
        const slide = slides[modalIndex];
        const fullImageSrc = slide.getAttribute('data-full') || slide.querySelector('img').src;
        modalImage.src = fullImageSrc;
        modalImage.alt = slide.querySelector('img').alt;
    }
    
    // События
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => openModal(index));
    });
    
    modalClose.addEventListener('click', closeModal);
    modalNextBtn.addEventListener('click', modalNext);
    modalPrevBtn.addEventListener('click', modalPrev);
    
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            closeModal();
        }
        if (e.key === 'ArrowLeft' && imageModal.classList.contains('active')) {
            modalPrev();
        }
        if (e.key === 'ArrowRight' && imageModal.classList.contains('active')) {
            modalNext();
        }
        if (e.key === 'ArrowLeft' && !imageModal.classList.contains('active')) {
            prevSlide();
        }
        if (e.key === 'ArrowRight' && !imageModal.classList.contains('active')) {
            nextSlide();
        }
    });
    
    // Свайпы для мобильных
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isSwiping = true;
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        touchEndX = e.touches[0].clientX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', () => {
        if (!isSwiping) return;
        
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isSwiping = false;
        touchStartX = 0;
        touchEndX = 0;
    }, { passive: true });
    
    // Свайпы в модальном окне
    modalImage.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    modalImage.addEventListener('touchend', (e) => {
        const diff = touchStartX - touchEndX;
        const swipeThreshold = 30;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                modalNext();
            } else {
                modalPrev();
            }
        }
    }, { passive: true });
    
    // Ресайз окна
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateSlideDimensions();
            centerSlide(currentIndex);
        }, 100);
    });
    
    function preloadImages() {
        slides.forEach(slide => {
            const fullSrc = slide.getAttribute('data-full');
            if (fullSrc) {
                const img = new Image();
                img.src = fullSrc;
            }
        });
    }
    
    // Инициализация задержки для гарантии загрузки DOM
    setTimeout(() => {
        initCarousel();
    }, 100);
});