# Academic Homepage Template

A minimalist, data-driven academic homepage with a **Chinese Ink Wash (Shui-mo)** aesthetic.

Built with raw HTML/CSS/JS. **Zero dependencies. No build tools. No `npm install`.**

## How to Use

1.  **Fork** this repository.
2.  **Edit Data**: All content is separated in `js/data/`.
    *   `profile.js`: Bio, social links, education.
    *   `news.js`: Updates.
    *   `works.js`: Publications.
3.  **Images**: Replace `assets/images/cat.svg` with your profile photo.
4.  **Deploy**: GitHub Repo -> Settings -> Pages -> Select `main` branch.

## Local Development

Since it's just raw files, you don't even need a local server.
**Just double-click `index.html`** to view it.

## Customization

*   **Style**: Colors and fonts are in `css/style.css`.
*   **Ink Effect**: The background is a procedural canvas (`js/visuals/ink-landscape.js`). You can toggle it off in `js/main.js` if you want a clean look.

## License

MIT.