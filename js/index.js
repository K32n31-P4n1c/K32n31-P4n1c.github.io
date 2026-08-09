const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav__link');

if (navToggle) {
    const syncNavState = (isOpen) => {
        document.body.classList.toggle('nav-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    };

    navToggle.addEventListener('click', () => {
        const isOpen = !document.body.classList.contains('nav-open');
        syncNavState(isOpen);
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            syncNavState(false);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
            syncNavState(false);
        }
    });
}

const revealTargets = document.querySelectorAll(
    'section, .work-group, .video-card'
);

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.01,
        rootMargin: '0px 0px -10% 0px'
    });

    revealTargets.forEach((element, index) => {
        element.classList.add('reveal');
        element.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
        revealObserver.observe(element);
    });
} else {
    revealTargets.forEach((element) => {
        element.classList.add('is-visible');
    });
}

const workSections = document.querySelectorAll('.work-group[id]');
const workNavLinks = document.querySelectorAll('.work__nav-link');

if ('IntersectionObserver' in window && workSections.length > 0 && workNavLinks.length > 0) {
    const setActiveWorkLink = (id) => {
        workNavLinks.forEach((link) => {
            const isMatch = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('is-active', isMatch);
        });
    };

    const workNavObserver = new IntersectionObserver((entries) => {
        const visibleEntry = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
            setActiveWorkLink(visibleEntry.target.id);
        }
    }, {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: '-10% 0px -45% 0px'
    });

    workSections.forEach((section) => {
        workNavObserver.observe(section);
    });

    setActiveWorkLink(workSections[0].id);
}

const shaderCarousels = document.querySelectorAll('[data-shader-carousel]');

shaderCarousels.forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('[data-shader-slide]'));
    const prevButton = carousel.querySelector('[data-shader-prev]');
    const nextButton = carousel.querySelector('[data-shader-next]');
    const status = carousel.querySelector('[data-shader-status]');

    if (slides.length < 2 || !prevButton || !nextButton || !status) {
        return;
    }

    let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));

    if (activeIndex < 0) {
        activeIndex = 0;
    }

    const formatCount = (value) => String(value).padStart(2, '0');

    const syncSlides = () => {
        slides.forEach((slide, index) => {
            const isActive = index === activeIndex;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));

            if (!isActive) {
                const video = slide.querySelector('video');
                if (video) {
                    video.pause();
                }
            }
        });

        status.textContent = `${formatCount(activeIndex + 1)} / ${formatCount(slides.length)}`;
    };

    const moveToSlide = (direction) => {
        activeIndex = (activeIndex + direction + slides.length) % slides.length;
        syncSlides();
    };

    carousel.classList.add('is-enhanced');
    syncSlides();

    prevButton.addEventListener('click', () => moveToSlide(-1));
    nextButton.addEventListener('click', () => moveToSlide(1));
});

const workCarouselConfigs = [
    { id: 'work-unreal', label: 'Unreal', selectors: ['.crt-display', '.interacting-systems', '.color-shooter', '.dolly-zoom'] },
    { id: 'work-unity', label: 'Unity', selectors: ['.unity-shaders', '.cubic-lerp', '.rpg', '.ballz'] },
    { id: 'work-pygame', label: 'Pygame', selectors: ['.snake', '.turtle-race', '.pathfinding'] },
    { id: 'work-gamejams', label: 'Game jam', selectors: ['.bob-colorland', '.defector', '.kompir', '.shadow-rune'] }
];

workCarouselConfigs.forEach(({ id, label, selectors }) => {
    const section = document.getElementById(id);
    const slides = selectors
        .map((selector) => section?.querySelector(selector))
        .filter(Boolean);

    if (!section || slides.length < 2) {
        return;
    }

    const sourceContainer = slides[0].parentElement;

    const carousel = document.createElement('div');
    carousel.className = 'work-carousel';
    carousel.dataset.workCarousel = '';

    const controls = document.createElement('div');
    controls.className = 'shader-carousel__controls work-carousel__controls';
    controls.setAttribute('aria-label', `${label} project navigation`);
    controls.innerHTML = `
        <button class="shader-carousel__button work-carousel__button--prev" type="button" data-work-prev aria-label="Previous ${label} project"><span aria-hidden="true">&lt;</span><span>Prev project</span></button>
        <span class="shader-carousel__status work-carousel__status" data-work-status aria-live="polite"></span>
        <button class="shader-carousel__button work-carousel__button--next" type="button" data-work-next aria-label="Next ${label} project"><span>Next project</span><span aria-hidden="true">&gt;</span></button>`;

    const track = document.createElement('div');
    track.className = 'work-carousel__track';
    slides.forEach((slide, index) => {
        slide.classList.add('work-carousel__slide');
        slide.classList.toggle('is-active', index === 0);
        track.appendChild(slide);
    });

    carousel.append(controls, track);
    section.querySelector('.work-group__header')?.after(carousel);

    if (sourceContainer?.classList.contains('work-group__projects')) {
        sourceContainer.remove();
    }

    const prevButton = controls.querySelector('[data-work-prev]');
    const nextButton = controls.querySelector('[data-work-next]');
    const status = controls.querySelector('[data-work-status]');
    let activeIndex = 0;
    const formatCount = (value) => String(value).padStart(2, '0');

    const syncSlides = () => {
        slides.forEach((slide, index) => {
            const isActive = index === activeIndex;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));
            if (!isActive) {
                slide.querySelectorAll('video').forEach((video) => video.pause());
            }
        });
        status.textContent = `${formatCount(activeIndex + 1)} / ${formatCount(slides.length)}`;
    };

    const moveToSlide = (direction) => {
        activeIndex = (activeIndex + direction + slides.length) % slides.length;
        syncSlides();
    };

    carousel.classList.add('is-enhanced');
    syncSlides();
    prevButton.addEventListener('click', () => moveToSlide(-1));
    nextButton.addEventListener('click', () => moveToSlide(1));
});
const crtMediaCarousels = document.querySelectorAll('[data-crt-media-carousel]');

crtMediaCarousels.forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('[data-crt-media-slide]'));
    const prevButton = carousel.querySelector('[data-crt-media-prev]');
    const nextButton = carousel.querySelector('[data-crt-media-next]');
    const status = carousel.querySelector('[data-crt-media-status]');

    if (slides.length < 2 || !prevButton || !nextButton || !status) {
        return;
    }

    let activeIndex = 0;
    const formatCount = (value) => String(value).padStart(2, '0');

    const syncMedia = () => {
        slides.forEach((slide, index) => {
            const isActive = index === activeIndex;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));

            if (!isActive) {
                slide.querySelectorAll('video').forEach((video) => video.pause());
            }
        });

        status.textContent = `${formatCount(activeIndex + 1)} / ${formatCount(slides.length)}`;
    };

    const moveToMedia = (direction) => {
        activeIndex = (activeIndex + direction + slides.length) % slides.length;
        syncMedia();
    };

    carousel.classList.add('is-enhanced');
    syncMedia();
    prevButton.addEventListener('click', () => moveToMedia(-1));
    nextButton.addEventListener('click', () => moveToMedia(1));
});
const visiblePlayVideos = document.querySelectorAll('video[data-play-on-visible]');

if ('IntersectionObserver' in window && visiblePlayVideos.length > 0) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target;

            if (entry.isIntersecting) {
                video.play().catch(() => {});
                return;
            }

            video.pause();
        });
    }, {
        threshold: 0.15,
        rootMargin: '200px 0px'
    });

    visiblePlayVideos.forEach((video) => {
        video.pause();
        videoObserver.observe(video);
    });
} else {
    visiblePlayVideos.forEach((video) => {
        video.play().catch(() => {});
    });
}
