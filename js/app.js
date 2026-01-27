// ==========================================
// 核心逻辑整合包 (App Logic)
// ==========================================

// 1. 全局交互工具 (暴露给HTML onclick)
window.toggleSection = function(id, btn) {
    const section = document.getElementById(id);
    const icon = btn.querySelector('i');
    const text = btn.querySelector('.btn-text');
    
    if (section.style.maxHeight) {
        section.style.maxHeight = null;
        section.style.opacity = 0;
        btn.classList.remove('active');
        const isNews = id.includes('news');
        text.textContent = isNews ? 'View All Logs' : 'View Full Archive';
        if(icon) icon.setAttribute('data-feather', 'chevron-down');
    } else {
        section.style.display = 'block'; 
        section.style.maxHeight = section.scrollHeight + "px";
        section.style.opacity = 1;
        btn.classList.add('active');
        text.textContent = 'Show Less';
        if(icon) icon.setAttribute('data-feather', 'chevron-up');
    }
    if(window.feather) feather.replace();
};

// 2. 渲染器定义
const Renderers = {
    // --- 基础部分 ---
    Core: {
        init(data) {
            this.data = data;
            this.renderHeader();
            this.renderHero();
            this.renderSection('honors', this._renderHonorItem);
            this.renderSection('experience', this._renderExpItem);
            this.renderFooter();
        },
        renderHeader() {
            const brand = document.querySelector('.brand');
            const nav = document.querySelector('.nav');
            if (brand) brand.innerHTML = this.data.profile.name + ".";
            if (nav) {
                nav.innerHTML = this.data.nav.map(link => 
                    `<a href="${link.href}" class="nav-link">${link.label}</a>`
                ).join('');
            }
        },
        renderHero() {
            const titleEl = document.querySelector('.hero-title');
            const bioEl = document.querySelector('.hero-bio');
            if(titleEl) titleEl.innerHTML = this.data.profile.title;
            if(bioEl) bioEl.innerHTML = this.data.profile.bio;

            const specsContainer = document.querySelector('.specs-list');
            if(specsContainer) {
                specsContainer.innerHTML = this.data.profile.specs.map(spec => {
                    let valContent = spec.value;
                    if (spec.active) {
                        valContent = `<div class="status-indicator"><span class="status-dot"></span><span class="spec-val">${spec.value}</span></div>`;
                    } else {
                        valContent = `<span class="spec-val">${spec.value}</span>`;
                    }
                    return `<div class="spec-item"><span class="spec-label">${spec.label}</span>${valContent}</div>`;
                }).join('');
            }
        },
        renderSection(key, itemRenderer) {
            const sectionData = this.data[key];
            const section = document.getElementById(key);
            if (!section || !sectionData) return;

            const listClass = key === 'honors' ? 'award-list' : 'exp-list';
            let html = `<div class="section-header"><h2 class="section-title">${sectionData.title}</h2></div>`;
            html += `<div class="${listClass}">` + sectionData.items.map(itemRenderer).join('') + `</div>`;
            section.innerHTML = html;
        },
        renderFooter() {
            const footer = document.querySelector('.footer');
            if(!footer) return;
            const linksHtml = this.data.footer.links.map(link => `<a href="${link.url}">${link.label}</a>`).join('');
            footer.innerHTML = `<div class="footer-links">${linksHtml}</div><p class="copyright">${this.data.footer.copyright}</p>`;
        },
        _renderHonorItem(item) {
            return `<div class="award-row"><div class="award-year">${item.year}</div><div class="award-info"><h4>${item.title}</h4><span class="award-org">${item.org}</span></div></div>`;
        },
        _renderExpItem(item) {
            return `<div class="exp-row"><div class="exp-date">${item.date}</div><div class="exp-info"><h4>${item.role}</h4><span class="exp-loc">${item.location}</span></div></div>`;
        }
    },

    // --- 新闻部分 ---
    News: {
        render(data, containerId) {
            const container = document.getElementById(containerId);
            if (!container || !data) return;

            const visibleItems = data.items.slice(0, data.limit);
            const hiddenItems = data.items.slice(data.limit);
            
            let html = `<div class="section-header"><h2 class="section-title">${data.title}</h2></div>`;
            html += `<div class="news-list">`;
            visibleItems.forEach(item => html += this._createItem(item));
            if (hiddenItems.length > 0) {
                html += `<div class="news-hidden" id="news-archive">`;
                hiddenItems.forEach(item => html += this._createItem(item));
                html += `</div>`;
            }
            html += `</div>`;
            if (hiddenItems.length > 0) {
                html += `<button class="expand-btn" onclick="toggleSection('news-archive', this)"><span class="btn-text">View All Logs</span><i data-feather="chevron-down"></i></button>`;
            }
            container.innerHTML = html;
        },
        _createItem(item) {
            return `<div class="news-item"><div class="news-date">${item.date}</div><div class="news-content">${item.content}</div></div>`;
        }
    },

    // --- 论文部分 ---
    Works: {
        render(data, containerId) {
            const container = document.getElementById(containerId);
            if (!container || !data) return;

            const visibleItems = data.items.slice(0, data.limit);
            const hiddenItems = data.items.slice(data.limit);

            let html = `<div class="section-header"><h2 class="section-title">${data.title}</h2></div>`;
            html += `<div class="works-container">`;
            visibleItems.forEach(item => html += this._createCard(item));
            if (hiddenItems.length > 0) {
                html += `<div class="works-hidden" id="works-archive">`;
                hiddenItems.forEach(item => html += this._createCard(item));
                html += `</div>`;
            }
            html += `</div>`;
            if (hiddenItems.length > 0) {
                html += `<button class="expand-btn" onclick="toggleSection('works-archive', this)"><span class="btn-text">View Full Archive</span><i data-feather="chevron-down"></i></button>`;
            }
            container.innerHTML = html;
        },
        _createCard(item) {
            let badgeHtml = '';
            if (item.badge) {
                const badgeClass = item.badgeColor === 'blue' ? 'badge-award badge-blue' : 'badge-award';
                badgeHtml = `<span class="${badgeClass}">${item.badge}</span>`;
            }
            const linksHtml = item.links.map(link => `<a href="${link.url}" class="btn-outline">${link.label}</a>`).join('');
            const descHtml = item.desc ? `<p class="card-desc">${item.desc}</p>` : '';

            return `
            <article class="work-card">
                <div class="card-meta-col"><span class="card-venue">${item.venue}</span>${badgeHtml}<span class="card-year">${item.year}</span></div>
                <div class="card-content-col"><h3 class="card-title">${item.title}</h3><div class="card-authors">${item.authors}</div>${descHtml}</div>
                <div class="card-links-col">${linksHtml}</div>
            </article>`;
        }
    }
};

// 3. 启动逻辑
document.addEventListener('DOMContentLoaded', () => {
    try {
        // 检查数据是否加载
        if (!window.SiteData) {
            throw new Error("Data not loaded. Please check js/data/*.js files.");
        }

        // 执行渲染
        Renderers.Core.init(window.SiteData);
        if (window.SiteData.news) Renderers.News.render(window.SiteData.news, 'news');
        if (window.SiteData.works) Renderers.Works.render(window.SiteData.works, 'work');

        // 图标
        if (window.feather) feather.replace();

        // 动效
        initEffects();

    } catch (e) {
        console.error("Initialization Error:", e);
        // 回退机制：确保内容可见
        document.body.style.opacity = 1;
    }
});

function initEffects() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        if (!document.getElementById('anim-style')) {
            const style = document.createElement('style');
            style.id = 'anim-style';
            style.innerHTML = `
                .anim-ready { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
                .anim-ready.visible { opacity: 1; transform: translateY(0); }
            `;
            document.head.appendChild(style);
        }

        const targets = document.querySelectorAll('.hero-section, .work-card, .exp-row');
        targets.forEach(el => {
            el.classList.add('anim-ready');
            observer.observe(el);
        });
    }
}
