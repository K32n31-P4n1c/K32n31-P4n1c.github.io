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
    'section, .work-group, .video-card, .footer'
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

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    document.body.classList.add('gsap-ready');

    gsap.from('.logo, .nav-toggle', {
        y: -24,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.intro__eyebrow, .section_title__intro, .section_subtitle__intro, .intro__actions, .intro__hud', {
        y: 34,
        opacity: 0,
        duration: 0.95,
        stagger: 0.1,
        ease: 'power3.out'
    });

    gsap.to('.intro__img', {
        yPercent: -10,
        rotate: 2,
        scrollTrigger: {
            trigger: '.intro',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.utils.toArray('section, .work-group, .video-card, .footer').forEach((element) => {
        gsap.fromTo(element, {
            y: 58,
            opacity: 0.18
        }, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 86%',
                end: 'top 45%',
                scrub: 0.65
            }
        });
    });

    gsap.utils.toArray('.portfolio img, .video-card__media video').forEach((media) => {
        gsap.fromTo(media, {
            scale: 0.88,
            opacity: 0.72
        }, {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: media,
                start: 'top 90%',
                end: 'bottom 28%',
                scrub: true
            }
        });
    });

    gsap.utils.toArray('.work-group').forEach((group) => {
        const directCards = Array.from(group.children).filter((child) => {
            return child.tagName === 'DIV' &&
                !child.classList.contains('work-group__header') &&
                !child.classList.contains('video-grid');
        });
        const cards = directCards.concat(Array.from(group.querySelectorAll('.video-card')));

        cards.forEach((card, index) => {
            gsap.fromTo(card, {
                y: 44 + index * 8,
                opacity: 0.38
            }, {
                y: 0,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    end: 'top 48%',
                    scrub: 0.5
                }
            });
        });
    });
}
