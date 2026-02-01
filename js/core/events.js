// 核心交互逻辑：事件委托与DOM操作
// 挂载到 window.App.Core

window.App.Core.EventManager = class EventManager {
    constructor() {
        this.bindGlobalEvents();
    }

    bindGlobalEvents() {
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-action]');
            if (!trigger) return;

            const action = trigger.dataset.action;
            if (action === 'toggle') {
                this.handleToggle(trigger);
            }
        });
    }

    handleToggle(btn) {
        const targetId = btn.dataset.target;
        const section = document.getElementById(targetId);
        const icon = btn.querySelector('i');
        const textSpan = btn.querySelector('.btn-text');

        if (!section) return;

        if (section.style.maxHeight) {
            section.style.maxHeight = null;
            section.style.opacity = 0;
            btn.classList.remove('active');
            textSpan.textContent = btn.dataset.textCollapsed;
            if (icon) icon.setAttribute('data-feather', 'chevron-down');
        } else {
            section.style.display = 'block';
            section.style.maxHeight = section.scrollHeight + "px";
            section.style.opacity = 1;
            btn.classList.add('active');
            textSpan.textContent = btn.dataset.textExpanded;
            if (icon) icon.setAttribute('data-feather', 'chevron-up');
        }
        
        if (window.feather) feather.replace();
    }
    
    initScrollEffects() {
        if (!('IntersectionObserver' in window)) return;
        
        // 动态注入 CSS，避免污染全局 CSS 文件
        if (!document.getElementById('anim-style')) {
            const style = document.createElement('style');
            style.id = 'anim-style';
            style.innerHTML = `
                .anim-ready { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
                .anim-ready.visible { opacity: 1; transform: translateY(0); }
            `;
            document.head.appendChild(style);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // 此时 DOM 已经由 Renderer 渲染完毕，可以安全查询
        const targets = document.querySelectorAll('.hero-section, .work-card, .exp-row');
        targets.forEach(el => {
            el.classList.add('anim-ready');
            observer.observe(el);
        });
    }
}
