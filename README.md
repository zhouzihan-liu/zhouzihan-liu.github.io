# Personal Homepage Template

A minimalist personal/academic homepage template. Clean, fast, and easy to customize.

**[Live Demo →](https://zhouzihan-liu.github.io)**

## Features

- **Zero Dependencies:** Pure HTML/CSS/JS - no build tools needed
- **Data-Driven:** Update content by editing JS files, no HTML changes required  
- **Responsive Design:** Optimized for desktop and mobile
- **Particle Background:** Animated canvas effect

## Quick Start

### 1. Use This Template

Click **"Use this template"** or fork this repository.

### 2. Update Your Content

Edit the files in `js/data/`:

- **`profile.js`** - Name, bio, photo, contact links
- **`news.js`** - News and updates
- **`works.js`** - Publications, projects, or portfolio items

### 3. Add Your Photo

1. Create an `assets/images/` folder
2. Add your photo (e.g., `profile.jpg`)
3. Update the path in `js/data/profile.js`:
   ```javascript
   photo: "assets/images/profile.jpg"
   ```

### 4. Deploy to GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Select `main` branch as source
3. Your site will be live at `https://[username].github.io/[repo-name]`

## Customization

### Colors

Edit CSS variables in `css/style.css`:

```css
:root {
    --bg-color: #fafafa;
    --text-primary: #111;
    --text-secondary: #555;
    /* ... more variables */
}
```

### Fonts

Change the Google Fonts import in `index.html` (line 12) and update CSS variables.

### Structure

- `index.html` - Page structure
- `css/style.css` - All styles
- `js/app.js` - Main application logic
- `js/particles.js` - Background animation
- `js/data/` - **Your content goes here**

## License

MIT License - free to use and modify.
