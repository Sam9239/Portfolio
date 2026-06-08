// ========================================
// PORTFOLIO JAVASCRIPT
// All interactive functionality
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // ========================================
    // LOAD EDITABLE SITE CONTENT (from CMS-managed JSON)
    // Elements with data-bind="field" get their text from content/site.json.
    // Elements with data-bind-href="field" (optionally "mailto:field" or
    // "tel:field") get their href set. Falls back silently to the hardcoded
    // HTML if the file can't be loaded (e.g. opened via file://).
    // ========================================
    (function loadSiteContent() {
        // Resolve content path relative to this page so it works both at the
        // repo root locally and under /Portfolio/ on GitHub Pages.
        const contentUrl = new URL('content/site.json', window.location.href).href;

        fetch(contentUrl)
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .then((data) => {
                // Text bindings
                document.querySelectorAll('[data-bind]').forEach((el) => {
                    const key = el.getAttribute('data-bind');
                    if (data[key] != null && data[key] !== '') el.textContent = data[key];
                });

                // Href bindings (supports "mailto:" / "tel:" prefixes)
                document.querySelectorAll('[data-bind-href]').forEach((el) => {
                    const raw = el.getAttribute('data-bind-href');
                    let prefix = '';
                    let key = raw;
                    const m = raw.match(/^(mailto:|tel:)(.+)$/);
                    if (m) { prefix = m[1]; key = m[2]; }
                    if (data[key] != null && data[key] !== '') {
                        el.setAttribute('href', prefix + data[key]);
                    }
                });

                // Logo initials (all .logo-mark spans)
                if (data.initials) {
                    document.querySelectorAll('.logo-mark > span').forEach((s) => {
                        s.textContent = data.initials;
                    });
                }
                if (data.name) {
                    document.querySelectorAll('.logo-name').forEach((s) => { s.textContent = data.name; });
                }
                if (data.role) {
                    document.querySelectorAll('.logo-role').forEach((s) => { s.textContent = data.role; });
                }
            })
            .catch(() => { /* keep hardcoded fallback content */ });
    })();

    // ========================================
    // THEME TOGGLE (dark / light)
    // The saved theme is applied pre-paint via an inline script in <head>.
    // Here we just wire the button and persist the choice.
    // ========================================
    const themeToggle = document.getElementById('themeToggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            if (isLight) {
                document.documentElement.removeAttribute('data-theme');
                try { localStorage.setItem('theme', 'dark'); } catch (e) {}
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                try { localStorage.setItem('theme', 'light'); } catch (e) {}
            }
        });
    }

    // ========================================
    // CUSTOM CURSOR
    // ========================================
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    // Only enable on non-touch devices
    if (window.matchMedia('(hover: hover)').matches && cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Smooth follow for main cursor
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;

            // Smoother follow for follower
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            cursorFollower.style.transform = `translate(${followerX - 16}px, ${followerY - 16}px)`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-category');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.style.width = '48px';
                cursorFollower.style.height = '48px';
                cursorFollower.style.borderColor = 'var(--color-accent)';
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.style.width = '32px';
                cursorFollower.style.height = '32px';
                cursorFollower.style.borderColor = 'var(--color-primary)';
            });
        });
    }

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ========================================
    // MOBILE MENU
    // ========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ========================================
    // SMOOTH SCROLL FOR NAV LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // ANIMATED COUNTERS
    // ========================================
    const stats = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const heroSection = document.querySelector('.hero');

    function animateCounters() {
        if (statsAnimated || !heroSection || stats.length === 0) return;

        const heroBottom = heroSection.getBoundingClientRect().bottom;

        if (heroBottom > window.innerHeight / 2) {
            statsAnimated = true;
            stats.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                const duration = 2000;
                const start = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing function (ease-out)
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(easeOut * target);

                    stat.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = target;
                    }
                }

                requestAnimationFrame(updateCounter);
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Check on load

    // ========================================
    // SKILL BARS ANIMATION
    // ========================================
    const skillBars = document.querySelectorAll('.skill-progress');
    let skillsAnimated = false;

    const skillsSection = document.querySelector('.skills');

    function animateSkillBars() {
        if (skillsAnimated || !skillsSection || skillBars.length === 0) return;

        const sectionTop = skillsSection.getBoundingClientRect().top;

        if (sectionTop < window.innerHeight * 0.8) {
            skillsAnimated = true;
            skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.width = bar.dataset.width + '%';
                }, index * 100);
            });
        }
    }

    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars(); // Check on load

    // ========================================
    // SCROLL REVEAL ANIMATION
    // ========================================
    const revealElements = document.querySelectorAll(
        '.section-header, .about-grid, .skill-category, .project-card, .timeline-item, .contact-grid'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('fade-in');
        revealObserver.observe(el);
    });

    // ========================================
    // PARALLAX EFFECT FOR HERO ORBS
    // ========================================
    const orbs = document.querySelectorAll('.gradient-orb');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        orbs.forEach((orb, index) => {
            const speed = 0.1 + (index * 0.05);
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // ========================================
    // BACK TO TOP BUTTON
    // ========================================
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // CONTACT FORM HANDLING
    // ========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            const action = contactForm.getAttribute('action') || '';
            const formspreeReady = action.includes('formspree.io') && !action.includes('YOUR_FORM_ID');

            const setBtn = (text, bg) => {
                btn.innerHTML = `<span>${text}</span>`;
                btn.style.background = bg || '';
            };
            const resetBtn = (delay) => setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, delay);

            // If Formspree isn't configured yet, just show a friendly confirmation.
            if (!formspreeReady) {
                setBtn('Message Sent!', 'var(--color-accent)');
                setTimeout(() => { resetBtn(0); contactForm.reset(); }, 3000);
                console.log('Form submitted (Formspree not configured):', Object.fromEntries(new FormData(contactForm)));
                return;
            }

            // Real submission via Formspree's AJAX endpoint.
            setBtn('Sending...', '');
            btn.disabled = true;
            try {
                const res = await fetch(action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    setBtn('Message Sent!', 'var(--color-accent)');
                    contactForm.reset();
                } else {
                    setBtn('Something went wrong', 'var(--color-accent-secondary)');
                }
            } catch (err) {
                setBtn('Network error — try again', 'var(--color-accent-secondary)');
                console.error('Form error:', err);
            } finally {
                btn.disabled = false;
                resetBtn(3500);
            }
        });
    }

    // ========================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // The current page is marked with .current in each page's HTML,
    // so no scroll-based highlighting is needed in the multi-page setup.
    // ========================================

    // ========================================
    // TYPING EFFECT FOR HERO (Optional)
    // Uncomment to enable typing animation
    // ========================================
    /*
    const heroTitle = document.querySelector('.hero-title');
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    typeWriter();
    */

    // ========================================
    // MAGNETIC BUTTON EFFECT
    // ========================================
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ========================================
    // PROJECT CARD TILT EFFECT
    // ========================================
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================
    document.addEventListener('keydown', (e) => {
        // Escape to close mobile menu
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    console.log('✨ Portfolio loaded successfully!');
});
