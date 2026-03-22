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
