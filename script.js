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

                // Hero headline + description (home page)
                const setText = (sel, val) => {
                    const el = document.querySelector(sel);
                    if (el && val != null && val !== '') el.textContent = val;
                };
                setText('.hero-title .title-line:nth-child(1)', data.headline1);
                setText('.hero-title .title-line.highlight', data.headline2);
                setText('.hero-title .title-line:nth-child(3)', data.headline3);
                setText('.hero-description', data.heroDescription);
                // Hero label uses the name
                setText('.hero-label .label-text', data.name);
            })
            .catch(() => { /* keep hardcoded fallback content */ });
    })();

    // ========================================
    // DYNAMIC CONTENT RENDERERS (CMS-managed JSON)
    // Each renderer targets a container by id; if the container isn't on the
    // current page, it does nothing. All fall back to the hardcoded HTML if
    // the JSON can't be loaded.
    // ========================================
    const esc = (s) => String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const loadJSON = (path) =>
        fetch(new URL(path, window.location.href).href)
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)));

    const refreshIcons = () => { try { lucide.createIcons(); } catch (e) {} };

    // ---- HOME: stats, intro, services, CTA ----
    (function renderHome() {
        if (!document.querySelector('.hero-stats')) return; // home only
        loadJSON('content/home.json').then((d) => {
            // Stats
            const statsWrap = document.querySelector('.hero-stats');
            if (statsWrap && Array.isArray(d.stats) && d.stats.length) {
                statsWrap.innerHTML = d.stats.map((s) => `
                    <div class="stat">
                        <span class="stat-number" data-target="${esc(s.number)}">0</span>
                        <span class="stat-label">${esc(s.label)}</span>
                    </div>`).join('');
            }
            // Intro
            const ih = document.querySelector('[data-home="introHeading"]');
            if (ih && d.introHeading) ih.textContent = d.introHeading;
            const ip1 = document.querySelector('[data-home="introP1"]');
            if (ip1 && d.introP1) ip1.textContent = d.introP1;
            const ip2 = document.querySelector('[data-home="introP2"]');
            if (ip2 && d.introP2) ip2.textContent = d.introP2;
            // Services
            const svc = document.getElementById('servicesGrid');
            if (svc && Array.isArray(d.services) && d.services.length) {
                svc.innerHTML = d.services.map((s) => `
                    <div class="highlight-card">
                        <div class="hc-icon"><i data-lucide="${esc(s.icon || 'star')}"></i></div>
                        <h3>${esc(s.title)}</h3>
                        <p>${esc(s.description)}</p>
                    </div>`).join('');
            }
            // CTA
            const ch = document.querySelector('[data-home="ctaHeading"]');
            if (ch && d.ctaHeading) ch.textContent = d.ctaHeading;
            const ct = document.querySelector('[data-home="ctaText"]');
            if (ct && d.ctaText) ct.textContent = d.ctaText;

            refreshIcons();
        }).catch(() => {});
    })();

    // ---- ABOUT: paragraphs + trait tags ----
    (function renderAbout() {
        const lead = document.querySelector('[data-about="lead"]');
        if (!lead) return; // about page only
        loadJSON('content/about.json').then((d) => {
            const set = (sel, val) => {
                const el = document.querySelector(sel);
                if (el && val) el.textContent = val;
            };
            set('[data-about="lead"]', d.lead);
            set('[data-about="p2"]', d.p2);
            set('[data-about="p3"]', d.p3);
            const tagWrap = document.querySelector('[data-about="tags"]');
            if (tagWrap && Array.isArray(d.tags) && d.tags.length) {
                tagWrap.innerHTML = d.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('');
            }
        }).catch(() => {});
    })();

    // ---- EXPERIENCE timeline ----
    (function renderExperience() {
        const wrap = document.getElementById('timeline');
        if (!wrap) return;
        loadJSON('content/experience.json').then((d) => {
            if (!Array.isArray(d.items) || !d.items.length) return;
            wrap.innerHTML = d.items.map((it) => `
                <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <span class="timeline-date">${esc(it.date)}</span>
                        <h3 class="timeline-title">${esc(it.title)}</h3>
                        <span class="timeline-company">${esc(it.company)}</span>
                        <p class="timeline-description">${esc(it.description)}</p>
                        <div class="timeline-tags">
                            ${(it.tags || []).map((t) => `<span>${esc(t)}</span>`).join('')}
                        </div>
                    </div>
                </div>`).join('');
            // Re-observe new timeline items for the reveal animation
            reobserveReveal(wrap.querySelectorAll('.timeline-item'));
        }).catch(() => {});
    })();

    // ---- SKILLS ----
    (function renderSkills() {
        const wrap = document.getElementById('skillsGrid');
        if (!wrap) return;
        loadJSON('content/skills.json').then((d) => {
            if (!Array.isArray(d.categories) || !d.categories.length) return;
            wrap.innerHTML = d.categories.map((cat) => `
                <div class="skill-category">
                    <div class="skill-header">
                        <i data-lucide="${esc(cat.icon || 'star')}"></i>
                        <h3>${esc(cat.name)}</h3>
                    </div>
                    <div class="skill-items">
                        ${(cat.skills || []).map((s) => `
                            <div class="skill-item">
                                <span class="skill-name">${esc(s.name)}</span>
                                <div class="skill-bar">
                                    <div class="skill-progress" data-width="${esc(s.level)}"></div>
                                </div>
                            </div>`).join('')}
                    </div>
                </div>`).join('');
            refreshIcons();
            reobserveReveal(wrap.querySelectorAll('.skill-category'));
            // Let the skill-bar animation pick up the new bars
            rebindSkillBars();
        }).catch(() => {});
    })();

    // ---- PROJECTS (fully dynamic) ----
    (function renderProjects() {
        const wrap = document.getElementById('projectsGrid');
        if (!wrap) return;
        // List project files via the public GitHub API so newly-added
        // projects (with random slugs from the CMS) appear automatically.
        const api = 'https://api.github.com/repos/Sam9239/Portfolio/contents/content/projects?ref=main';
        fetch(api, { headers: { 'Accept': 'application/vnd.github+json' } })
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .then((entries) => {
                const files = (entries || [])
                    .filter((e) => e.type === 'file' && e.name.endsWith('.json'))
                    .map((e) => e.name);
                return Promise.all(files.map((f) =>
                    loadJSON('content/projects/' + f).catch(() => null)
                ));
            }).then((projects) => {
            const list = (projects || []).filter(Boolean)
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            if (!list.length) return; // keep hardcoded fallback
            wrap.innerHTML = list.map((p) => {
                const links = [];
                if (p.liveUrl) links.push(`<a href="${esc(p.liveUrl)}" class="project-link" title="View Live" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link"></i></a>`);
                if (p.codeUrl) links.push(`<a href="${esc(p.codeUrl)}" class="project-link" title="View Code" target="_blank" rel="noopener noreferrer"><i data-lucide="github"></i></a>`);
                const overlay = links.length
                    ? `<div class="project-overlay"><div class="project-links">${links.join('')}</div></div>` : '';
                const img = p.image
                    ? `<img class="project-thumb" src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`
                    : `<div class="project-placeholder"><i data-lucide="image"></i><span>No image</span></div>`;
                return `
                    <div class="project-card">
                        <div class="project-image">
                            ${img}
                            ${overlay}
                        </div>
                        <div class="project-info">
                            <div class="project-tags">
                                ${(p.tags || []).map((t) => `<span class="project-tag">${esc(t)}</span>`).join('')}
                            </div>
                            <h3 class="project-title">${esc(p.title)}</h3>
                            <p class="project-description">${esc(p.description)}</p>
                        </div>
                    </div>`;
            }).join('');
            refreshIcons();
            reobserveReveal(wrap.querySelectorAll('.project-card'));
            rebindProjectTilt();
        }).catch(() => {});
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
    // Re-queries the DOM each run so it works even after the home stats are
    // re-rendered from home.json.
    // ========================================
    let statsAnimated = false;
    const heroSection = document.querySelector('.hero');

    function animateCounters() {
        if (statsAnimated || !heroSection) return;
        const stats = document.querySelectorAll('.stat-number');
        if (stats.length === 0) return;

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
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    stat.textContent = Math.floor(easeOut * target);
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
    animateCounters();

    // ========================================
    // SKILL BARS ANIMATION
    // rebindSkillBars() lets the dynamic skills renderer re-arm this after
    // it replaces the skill bars.
    // ========================================
    let skillsAnimated = false;
    const skillsSection = document.querySelector('.skills');

    function animateSkillBars() {
        if (skillsAnimated || !skillsSection) return;
        const skillBars = document.querySelectorAll('.skill-progress');
        if (skillBars.length === 0) return;

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

    window.rebindSkillBars = function () {
        skillsAnimated = false;
        animateSkillBars();
    };

    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars();

    // ========================================
    // SCROLL REVEAL ANIMATION
    // reobserveReveal(nodes) lets dynamic renderers add their new elements to
    // the reveal observer.
    // ========================================
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

    window.reobserveReveal = function (nodes) {
        nodes.forEach(el => {
            el.classList.add('fade-in');
            revealObserver.observe(el);
        });
    };

    window.reobserveReveal(document.querySelectorAll(
        '.section-header, .about-grid, .skill-category, .project-card, .timeline-item, .contact-grid'
    ));

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
    // bindProjectTilt() is exposed so the dynamic projects renderer can
    // re-bind after replacing the cards.
    // ========================================
    function bindProjectTilt() {
        document.querySelectorAll('.project-card').forEach(card => {
            if (card.dataset.tiltBound) return; // avoid double-binding
            card.dataset.tiltBound = '1';
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
    }
    window.rebindProjectTilt = bindProjectTilt;
    bindProjectTilt();

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
