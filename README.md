# SRE Portfolio — Configuration Guide

## Quick Start
1. Open `index.html` in your browser (or run: `python -m http.server 8000`).
2. Click theme/color buttons in the header to preview appearance.

## Personalization

### Replace your name & contact
Edit `index.html`:
- Line 15: `<a class="brand" href="#">Your Name</a>` → your name
- Line 101: `<a href="mailto:mealoksrivastav@gmail.com">mealoksrivastav@gmail.com</a>` → your email
- Line 102: Update resume link in `<a class="btn" href="#">Download Resume</a>`

### Update About & Skills
- About section (line 54): describe your background
- Skills list (line 61): list your key skills or tools

### Sample Data

**Projects** — Edit `data/projects.json` to customize your projects:
```json
[
  {
    "title": "Project Name",
    "description": "Short description",
    "link": "https://github.com/...",
    "image": "assets/images/diagram.svg",
    "tags": ["tag1", "tag2"]
  }
]
```
Portfolio includes sample projects: Infrastructure as Code, CI/CD pipelines, Kubernetes automation, observability, and incident response.

New areas included:
- **Web Development**: frontend and backend projects (React, TypeScript, Node.js).
- **QA Automation**: Cypress/Playwright suites, CI-integrated testing.

**Metrics** — Edit `data/metrics.json`:
```json
{
  "uptime": 99.95,
  "incidents_per_month": 1.2,
  "mttr_minutes": 15
}
```

### Profile Image
- Replace `assets/images/avatar.jpg` with your photo or SVG (kept only in the About section).
- Or update the `src` in the About image element in `index.html`.

## Themes & Colors

| Button | Action |
|--------|--------|
| 🌙 | Toggle theme: Dark → Soothing → Light |
| 🎨 | Enable/disable dynamic color rotation |

**Custom colors**: Edit CSS variables in `css/styles.css` (`:root` section).
**Custom palettes**: Edit `palettes` array in `js/script.js` for rotation schemes.

## File Structure
```
portfolio/
├── index.html           # Main homepage
├── css/
│   ├── styles.css       # Main styles + themes
│   └── palettes.css     # Animation helpers
├── js/
│   └── script.js        # UI logic, animations, modals
├── data/
│   ├── projects.json    # Sample projects (edit here)
│   └── metrics.json     # SRE metrics (edit here)
└── assets/
    └── images/          # SVG samples & uploads
```

## Deploy

### GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USER/portfolio
git push -u origin main
```
Then enable Pages in repo settings (deploy from `main` branch).

### Netlify / Vercel
- Connect your GitHub repo via their dashboard.
- No build step needed — deploys automatically.

## Tips
- **Responsive**: Works on mobile (480px+), tablet, desktop.
- **Mobile-optimized**: Touch-friendly buttons (44x44px), optimized fonts, flexible layouts.
- **No build required**: Pure HTML/CSS/JS.
- **Themes persist**: Browser localStorage saves your theme preference.
- **Fast**: Lightweight SVG images and minimal dependencies.
- **Edit projects via JSON**: Update `data/projects.json` to customize your portfolio projects.