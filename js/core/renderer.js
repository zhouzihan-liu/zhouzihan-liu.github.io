// 核心渲染逻辑：将数据转换为 HTML 字符串
// 纯函数设计，无副作用，挂载到 window.App.Core

window.App.Core.Renderer = {
    header(data) {
        const altNames = Array.isArray(data.alternateNames) ? data.alternateNames.filter(Boolean) : [];
        const altHtml = altNames.length ? `<div class="brand-alt">${altNames.join(' / ')}</div>` : '';
        const cnGroup = data.chineseName ? `
            <div class="brand-cn-group">
                ${data.chineseName.split('').map((char, i) => 
                    `<span class="cn-char cn-char-${i}">${char}</span>`
                ).join('')}
            </div>` : '';

        const navHtml = data.nav ? `
            <div class="header-right">
                <nav class="nav">
                    ${data.nav.map(link => `<a href="${link.href}" class="nav-link">${link.label}</a>`).join('')}
                </nav>
            </div>` : '';

        return `
            <div class="brand-container">
                <div class="brand">${data.name}</div>
                ${altHtml}
                ${cnGroup}
            </div>
            ${navHtml}
        `;
    },

    hero(profile) {
        const nameParts = [profile.chineseName, ...(profile.alternateNames || [])].filter(Boolean);
        const nameLine = nameParts.length ? `<div class="hero-name">${nameParts.join(' / ')}</div>` : '';
        const photoHtml = profile.photo
            ? `<img src="${profile.photo}" class="profile-img" alt="Portrait of ${profile.name || 'Profile'}">`
            : `<div class="photo-placeholder">Photo</div>`;
        const specsHtml = profile.specs.map(spec => {
            const valContent = spec.active 
                ? `<div class="status-indicator"><span class="status-dot"></span><span class="spec-val">${spec.value}</span></div>` 
                : `<span class="spec-val">${spec.value}</span>`;
            return `<div class="spec-item"><span class="spec-label">${spec.label}</span>${valContent}</div>`;
        }).join('');

        return `
            <div class="hero-text">
                ${nameLine}
                <h1 class="hero-title">${profile.title}</h1>
                <p class="hero-bio">${profile.bio}</p>
            </div>
            <div class="hero-profile-col">
                <div class="photo-frame">
                    ${photoHtml}
                </div>
                <div class="specs-list">${specsHtml}</div>
            </div>
        `;
    },

    listSection(data, type) { 
        if (!data) return '';
        const limit = data.limit || 100;
        const visible = data.items.slice(0, limit);
        const hidden = data.items.slice(limit);
        const listClass = type === 'works' ? 'works-container' : 'news-list';
        const hiddenId = `${type}-archive`;

        let html = `<div class="section-header"><h2 class="section-title">${data.title}</h2></div>`;
        html += `<div class="${listClass}">`;
        
        const renderItem = type === 'works' ? this._workCard : this._newsItem;
        html += visible.map(renderItem).join('');
        
        if (hidden.length > 0) {
            html += `<div class="${type === 'works' ? 'works-hidden' : 'news-hidden'}" id="${hiddenId}">`;
            html += hidden.map(renderItem).join('');
            html += `</div>`;
        }
        html += `</div>`;

        if (hidden.length > 0) {
            const btnText = type === 'news' ? 'View All Logs' : 'View Full Archive';
            html += `<button class="expand-btn" data-action="toggle" data-target="${hiddenId}" data-text-collapsed="${btnText}" data-text-expanded="Show Less">
                        <span class="btn-text">${btnText}</span><i data-feather="chevron-down"></i>
                     </button>`;
        }
        return html;
    },

    simpleList(data, type) {
        if (!data) return '';
        const listClass = type === 'honors' ? 'award-list' : 'exp-list';
        const renderItem = type === 'honors' ? this._honorItem : this._expItem;
        
        return `
            <div class="section-header"><h2 class="section-title">${data.title}</h2></div>
            <div class="${listClass}">${data.items.map(renderItem).join('')}</div>
        `;
    },

    footer(data) {
        if (!data) return '';
        const links = data.links.map(l => `<a href="${l.url}">${l.label}</a>`).join('');
        return `
            <div class="footer-links">${links}</div>
            <div class="copyright-row">
                <p class="copyright">${data.copyright}</p>
                <img src="assets/favicon.svg" class="footer-seal" alt="Seal">
            </div>
        `;
    },

    _newsItem(item) {
        return `<div class="news-item"><div class="news-date">${item.date}</div><div class="news-content">${item.content}</div></div>`;
    },

    _workCard(item) {
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
    },

    _honorItem(item) {
        return `<div class="award-row"><div class="award-year">${item.year}</div><div class="award-info"><span class="award-title">${item.title}</span><span class="award-org">${item.org}</span></div></div>`;
    },

    _expItem(item) {
        return `<div class="exp-row"><div class="exp-date">${item.date}</div><div class="exp-info"><h4>${item.role}</h4><span class="exp-loc">${item.location}</span></div></div>`;
    }
};
