# Academic Homepage Template

A minimalist, data-driven academic homepage designed in the **Swiss International Style**.

It is built with raw HTML/CSS/JS. **Zero dependencies. No build tools. No `npm install`.**

## How to Use

1.  **Fork** this repository.
2.  **Edit Data**: All content is separated in `js/data/`. You don't need to touch HTML.
    *   `profile.js`: Name, bio, social links, education/timeline.
    *   `news.js`: Updates/News list.
    *   `works.js`: Publications and projects.
3.  **Images**: Replace `assets/images/cat.svg` with your profile photo.
4.  **Deploy**: Go to GitHub Repo -> Settings -> Pages -> Select `main` branch. Done.

## Local Development

Since this project uses a Namespace pattern instead of ES Modules, you don't even need a local server.

*   **Just double-click `index.html`** to open it in your browser.

## Customization

*   **Colors/Fonts**: Edit CSS variables in `css/style.css` (`:root`).
*   **Ink Effect**: The background is a procedural canvas (`js/visuals/ink-landscape.js`). You can toggle it off in `js/main.js` if you prefer a static background.

## License

MIT. Feel free to use this as your own personal website.