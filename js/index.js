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
