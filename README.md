# Personal Portfolio Website

A stunning, fully customizable personal portfolio built with HTML, CSS, and vanilla JavaScript. Designed for developers who want full control over their online presence.

## 🚀 Features

- **Modern Dark Theme** - Sleek, professional design with gradient accents
- **Fully Responsive** - Looks great on desktop, tablet, and mobile
- **Custom Cursor** - Animated cursor with hover effects (desktop only)
- **Smooth Animations** - Scroll-triggered reveals, counters, and skill bars
- **Interactive Elements** - Magnetic buttons, card tilt effects, parallax orbs
- **Mobile Menu** - Smooth hamburger menu for mobile devices
- **Contact Form** - Ready-to-integrate form with validation
- **SEO Optimized** - Semantic HTML and proper meta tags
- **Performance** - Lightweight, no heavy frameworks required

## 📁 File Structure

```
portfolio/
├── index.html      # Home (hero, intro, services, CTA)
├── about.html      # About + Experience timeline
├── work.html       # Skills + Featured projects
├── contact.html    # Contact details + form
├── styles.css      # All styling (shared across pages)
├── script.js       # All JavaScript (shared, page-aware)
├── assets/         # Images (profile + project thumbnails)
│   ├── profile.webp
│   └── project-*.webp
├── preview.png     # Social/OG share image
└── README.md       # This file
```

> **Multi-page site.** Navigation links point to real pages, so each is
> bookmarkable and SEO-friendly. The nav, footer, and logo are duplicated
> in each HTML file — when you change one (e.g. add a nav item), update all
> four pages to keep them in sync.

### Replacing the placeholder images

The images in `assets/` are AI-generated placeholders. Swap them with your
own by replacing the files (keep the same filenames), or update the `src`
paths in `index.html`, `about.html`, and `work.html`.

## 🎨 Customization Guide

### 1. Personal Information

Open `index.html` and update:

- **Line 6**: Change the page title
- **Line 24**: Update logo initials (YN → your initials)
- **Line 58**: Update your role/title
- **Line 61-63**: Update hero headline
- **Line 66-67**: Update hero description
- **Line 79-93**: Update stats (years, projects, clients)
- **Line 117-132**: Update About section text
- **Line 328-333**: Update Experience entries
- **Line 395**: Update email address
- **Line 400**: Update location
- **Line 405**: Update availability status
- **Line 412-421**: Update social media links
- **Line 445**: Update footer copyright

### 2. Projects

Each project card (Lines 220-300) contains:
- Project image placeholder (replace with actual screenshots)
- Technology tags
- Project title and description
- Live demo and GitHub links

### 3. Colors & Theme

Open `styles.css` and modify the CSS variables at the top:

```css
:root {
    --color-bg: #0a0a0f;           /* Main background */
    --color-bg-secondary: #12121a;  /* Section backgrounds */
    --color-primary: #6366f1;       /* Primary brand color */
    --color-accent: #22d3ee;        /* Accent color */
    --color-accent-secondary: #f472b6; /* Secondary accent */
    /* ... more variables */
}
```

### 4. Skills

In `index.html` (Lines 140-210), update:
- Skill categories and names
- Progress percentages (`data-width` attributes)

## 🚀 Deployment

### Option 1: GitHub Pages (Free)

1. Create a new repository on GitHub
2. Upload these files to the repository
3. Go to Settings → Pages
4. Select "Deploy from a branch" → "main" → "/ (root)"
5. Your site will be live at `https://yourusername.github.io/repository-name`

### Option 2: Netlify (Free)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Your site is live instantly!

### Option 3: Vercel (Free)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy with one click

## 📧 Contact Form Setup

The contact form is ready but needs a backend. Options:

### Formspree (Easiest)
1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Replace the form action in `index.html`:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Netlify Forms
Add `netlify` attribute to the form:
```html
<form name="contact" netlify>
```

### EmailJS
Integrate with [EmailJS](https://emailjs.com) for client-side email sending.

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **JavaScript** - Vanilla JS (no frameworks)
- **Lucide Icons** - Beautiful, lightweight icons
- **Google Fonts** - Inter & Space Grotesk

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This project is open source. Feel free to use it for your personal portfolio!

## 💡 Tips

- Replace placeholder images with actual project screenshots
- Add your real social media links
- Customize the color scheme to match your personal brand
- Add a favicon by placing `favicon.ico` in the root
- Consider adding a blog section for SEO benefits

---

**Happy coding! 🚀**
