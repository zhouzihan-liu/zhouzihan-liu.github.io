/**
 * ==========================================
 * Main Entry Point (Namespace Pattern)
 * ==========================================
 * - Data Logic Separation: YES
 * - Local File Support: YES
 */

class App {
    constructor() {
        // Alias for easier access
        this.Data = window.App.Data;
        this.Renderer = window.App.Core.Renderer;
        this.EventManager = window.App.Core.EventManager;
        this.InkLandscape = window.App.Visuals.InkLandscape;
        
        this.init();
    }

    init() {
        console.log("App Starting...");
        this.injectAnalytics();
        this.renderAll();
        this.initInteractive();
        this.initVisuals();
        console.log("App Started Successfully.");
    }

    injectAnalytics() {
        const gaId = this.Data.profile.googleAnalyticsId;
        if (!gaId) return;

        console.log(`Initializing Analytics (${gaId})...`);
        
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag; // Expose to window for potential usage
        gtag('js', new Date());
        gtag('config', gaId);
    }

    renderAll() {
        // 1. Header
        const headerEl = document.querySelector('.header');
        if (headerEl) {
            headerEl.innerHTML = this.Renderer.header({ 
                ...this.Data.profile, 
                nav: this.Data.nav 
            });
        }

        // 2. Hero
        const heroSection = document.querySelector('.hero-grid-layout');
        if (heroSection) {
            heroSection.innerHTML = this.Renderer.hero(this.Data.profile);
        }

        // 3. Sections
        const sectionMap = [
            { id: 'news', render: () => this.Renderer.listSection(this.Data.news, 'news') },
            { id: 'work', render: () => this.Renderer.listSection(this.Data.works, 'works') },
            { id: 'honors', render: () => this.Renderer.simpleList(this.Data.honors, 'honors') },
            { id: 'experience', render: () => this.Renderer.simpleList(this.Data.experience, 'experience') },
            { id: 'contact', render: () => this.Renderer.footer(this.Data.footer) }
        ];

        sectionMap.forEach(sec => {
            const el = document.getElementById(sec.id);
            if (el) el.innerHTML = sec.render();
        });

        // Icons
        if (window.feather) feather.replace();
    }

    initInteractive() {
        this.events = new this.EventManager();
        this.events.initScrollEffects();
    }

    initVisuals() {
        if (this.InkLandscape) {
            this.ink = new this.InkLandscape('art-canvas');
        }
    }
}

// Start only after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        new App();
    } catch (e) {
        console.error("Initialization Failed:", e);
    }
});