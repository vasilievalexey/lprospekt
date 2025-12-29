# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

L PROSPEKT is a personal band website project showcasing three music projects:
- **L PROSPEKT** (main) - Indie rock band from Saint Petersburg, Russia (Est. 2011)
- **SEPIIA** - Coldwave/darkwave/electropop project (Est. 2014)
- **M O V E L** - Dark minimal techno project (Est. 2016)

The site is a static HTML/CSS/JS website with Three.js animated backgrounds, designed as a mobile-first music artist landing page hosted at lprospekt.com.

## Architecture

### Project Structure
```
/                          # Root - L PROSPEKT main page
├── index.html             # Main landing page (L PROSPEKT)
├── style.css              # Global shared stylesheet for all pages
├── /sepiia/               # SEPIIA subproject page
│   └── index.html
├── /movel/                # M O V E L subproject page
│   └── index.html
├── /js/                   # JavaScript and Three.js files
│   ├── three.min.js       # Three.js library
│   ├── script-lprospekt.js  # Main page animation (color-shifting particles)
│   ├── script-sepiia.js     # SEPIIA page animation (snowflake particles)
│   └── script-movel.js      # M O V E L page animation (pulsing sprites)
├── /img/                  # Album covers and preview images
├── /icons/                # Favicons and icons for all projects
│   ├── lprospekt-apple-touch-icon.png
│   ├── lprospektFavicon.ico
│   ├── sepiia-apple-touch-icon.png
│   ├── sepiiaFavicon.ico
│   ├── movel-apple-touch-icon.png
│   └── movelFavicon.ico
├── sitemap.xml            # SEO sitemap
├── robots.txt             # Search engine directives
└── CNAME                  # GitHub Pages custom domain config
```

### Design System

**Theme Architecture:**
- Dark theme (default): L PROSPEKT and SEPIIA use dark backgrounds
- Light theme: M O V E L uses white background with gray text (`.page-movel` class)
- Each page has a unique Three.js background animation

**Page-Specific Styling:**
- `.page-lprospekt` - Main page with italic logo styling
- `.page-sepiia` - Uses Lusitana serif font for logo
- `.page-movel` - Light theme with inverted color scheme

**Responsive Design:**
- Desktop: Fixed absolute positioning with nav on left, music links on bottom-left
- Mobile (≤600px): Stacked vertical layout, centered content, scrollable
- Mobile switches from absolute to relative/static positioning for natural flow

### Three.js Background Animations

Each page implements a unique Three.js particle system:

1. **L PROSPEKT** (script-lprospekt.js):
   - 4000 particles rotating in 3D space
   - Mouse-controlled camera rotation
   - Color cycles through warm/cool palette every 5 seconds
   - Uses disc.png texture with additive blending

2. **SEPIIA** (script-sepiia.js):
   - 5000 snowflake particles with multiple sprite textures
   - Cycles through 6 different color schemes
   - Mouse parallax camera movement
   - Fog effect for depth

3. **M O V E L** (script-movel.js):
   - 100 pulsing sprites on white background
   - Each sprite has random pulse speed and phase
   - Minimalist aesthetic matching the techno vibe
   - Uses sprite.png texture

### SEO Implementation

All pages include comprehensive SEO markup:
- **JSON-LD structured data** (Schema.org MusicGroup)
- **Open Graph tags** for social media sharing
- **Twitter Card metadata**
- **Canonical URLs**
- Member information, founding dates, genres
- Links to streaming platforms (Apple Music, Spotify, Bandcamp, VK, Yandex Music)

## Development Workflow

### No Build Process
This is a static site with no build tools, bundlers, or package managers. All files are served directly.

### Local Development
```bash
# Simple HTTP server (Python 3)
python3 -m http.server 8000

# Then visit: http://localhost:8000
```

### Deployment
The site is hosted on GitHub Pages with custom domain `lprospekt.com` (configured via CNAME file). Any push to the `main` branch automatically deploys.

### Testing Changes
1. Run local server
2. Test on desktop browsers
3. Test mobile responsiveness (viewport ≤600px)
4. Verify Three.js animations load correctly
5. Check music links and social media links
6. Validate SEO markup with browser dev tools

## Common Tasks

### Adding/Updating Music Links
Music links are in a `.music-links` div on each page. Update the href and link text:
```html
<a class="music-link" href="URL" target="_blank" rel="noopener noreferrer">Platform Name</a>
```

### Modifying Three.js Animations
- Each animation is self-contained in its respective script file
- Particle counts, colors, and behaviors are configured at the top of each script
- Textures are loaded from `/js/` directory (disc.png, snowflake*.png, sprite.png)

### Updating SEO Metadata
Edit the JSON-LD structured data in the `<head>` section of each page. Key fields:
- `name` - Band/project name
- `description` - Bio/description
- `foundingDate` - Establishment year
- `member` - Band members array
- `sameAs` - Links to streaming platforms
- Update corresponding Open Graph and Twitter Card tags

### Adding New Projects
1. Create new subdirectory (e.g., `/newproject/`)
2. Create `index.html` with appropriate page class (e.g., `.page-newproject`)
3. Add project-specific styling to `style.css`
4. Create Three.js script in `/js/` if needed
5. Add navigation links to all existing pages
6. Update `sitemap.xml`
7. Create favicon/icons in `/icons/`

### Mobile Optimization
The mobile breakpoint is `@media (max-width: 600px)` in style.css. Key mobile adjustments:
- Change `overflow: hidden` to `overflow: auto` on body
- Convert absolute positioning to static/relative
- Center all content
- Stack navigation horizontally at top
- Reduce font sizes
- Ensure touch targets are adequate size

## Important Notes

- **Font Loading**: Uses Google Fonts (Antonio, Teko, Lusitana) via CDN
- **External Dependencies**: Only Three.js (included as three.min.js)
- **Image Optimization**: Album covers and preview images should be optimized for web
- **Browser Support**: Modern browsers with Three.js/WebGL support required
- **Domain**: Configured for lprospekt.com via CNAME file
- **Copyright**: All pages include © 2025 copyright notices

## Contacts

- Email: contact@lprospekt.com (used on all pages)
- VK: Project-specific links on each page
- Streaming: Apple Music, Spotify, Yandex Music, Bandcamp links on all pages
