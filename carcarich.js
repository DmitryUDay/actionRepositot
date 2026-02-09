document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Модалка
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('fullImage');
    const modalContent = document.querySelector('.modal-image-container');
    
    // Создаем элемент видео для модалки, если его нет
    let modalVideo = document.getElementById('modalVideo');
    if (!modalVideo) {
        modalVideo = document.createElement('video');
        modalVideo.id = 'modalVideo';
        modalVideo.controls = true;
        modalContent.appendChild(modalVideo);
    }

    let currentIndex = 0;
    let modalIndex = 0;
    const totalSlides = slides.length;
    let slideWidth = 0;
    let slideGap = 25;

    function initCarousel() {
        updateSlideDimensions();
        centerSlide(currentIndex);
        updateIndicators();
    }

    function updateSlideDimensions() {
        if (slides.length > 0) {
            slideWidth = slides[0].offsetWidth;
            const style = window.getComputedStyle(carousel);
            slideGap = parseInt(style.gap) || 25;
        }
    }

    function centerSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        const containerWidth = carousel.parentElement.offsetWidth;
        const offset = (containerWidth / 2) - (index * (slideWidth + slideGap) + slideWidth / 2);
        
        carousel.style.transform = `translateX(${offset}px)`;
        currentIndex = index;
        updateIndicators();

        // Авто-превью видео: запускаем видео в маленьком окне при наведении или фокусе
        slides.forEach((slide, i) => {
            const v = slide.querySelector('video');
            if(v) i === index ? v.play() : v.pause();
        });
    }

    function updateIndicators() {
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        nextBtn.style.opacity = currentIndex === totalSlides - 1 ? '0.3' : '1';
    }

    // Логика модалки (Картинка vs Видео)
    function showContent(index) {
        modalIndex = index;
        const slide = slides[index];
        const isVideo = slide.getAttribute('data-type') === 'video';
        
        imageModal.classList.toggle('is-video', isVideo);
        
        if (isVideo) {
            modalVideo.src = slide.getAttribute('data-video-src');
            modalVideo.play();
        } else {
            modalVideo.pause();
            modalImage.src = slide.getAttribute('data-full') || slide.querySelector('img').src;
        }
        
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        imageModal.classList.remove('active');
        modalVideo.pause();
        modalVideo.src = "";
        document.body.style.overflow = '';
    }

    // Слушатели
    nextBtn.onclick = () => currentIndex < totalSlides - 1 && centerSlide(currentIndex + 1);
    prevBtn.onclick = () => currentIndex > 0 && centerSlide(currentIndex - 1);

    slides.forEach((slide, i) => {
        slide.onclick = () => showContent(i);
    });

    document.querySelector('.modal-close').onclick = closeModal;
    document.querySelector('.modal-next-btn').onclick = () => showContent((modalIndex + 1) % totalSlides);
    document.querySelector('.modal-prev-btn').onclick = () => showContent((modalIndex - 1 + totalSlides) % totalSlides);

    // Закрытие по клику на фон
    imageModal.onclick = (e) => e.target === imageModal && closeModal();

    // Ресайз
    window.onresize = () => {
        updateSlideDimensions();
        centerSlide(currentIndex);
    };

    initCarousel();
});