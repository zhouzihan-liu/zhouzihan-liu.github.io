/**
 * Ink Wash Landscape Engine
 * A standalone module for generating the background art.
 */

const INK_CONFIG = {
    speed: 0.0025,
    colors: {
        bg: '#ffffff', 
        mountBack:  'rgba(75, 80, 85, 0.15)',
        mountFront: 'rgba(40, 45, 50, 0.22)',
        waterMid:   'rgba(45, 60, 70, 0.08)',
        waterFront: 'rgba(40, 45, 50, 0.16)',
        inkDark:    'rgba(30, 30, 30, 0.9)',
        inkLight:   'rgba(60, 65, 60, 0.25)'
    },
    layout: { boatPositionX: 0.20, bambooXRatio: 0.92 }
};

const Utils = {
    hash(n) { n = Math.sin(n) * 43758.5453123; return n - Math.floor(n); },
    noise(x) {
        const i = Math.floor(x), f = x - i, u = f * f * (3.0 - 2.0 * f);
        return this.hash(i) * (1.0 - u) + this.hash(i + 1) * u;
    },
    fbm(x, octaves = 6, lacunarity = 2.0, gain = 0.5) {
        let value = 0, amplitude = 0.5, frequency = 1.0;
        for (let i = 0; i < octaves; i++) {
            value += amplitude * this.noise(x * frequency);
            frequency *= lacunarity;
            amplitude *= gain;
        }
        return value;
    },
    drawInkPath(ctx, points, height) {
        if (points.length < 2) return;
        ctx.beginPath(); ctx.moveTo(0, height); ctx.lineTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i], p1 = points[i + 1];
            ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
        }
        const last = points[points.length - 1];
        ctx.lineTo(last.x, last.y); ctx.lineTo(last.x, height); ctx.closePath();
    }
};

class MountainPainter {
    constructor() { this.layers = []; }
    generate(width, height) {
        this.layers = [this._generateDistant(width, height), this._generateNear(width, height)];
    }
    _generateDistant(width, height) {
        const points = [], baseY = height * 0.62, scaleY = height * 0.28, steps = width / 2; 
        for (let i = 0; i <= steps; i++) {
            const nx = (width / steps * i) / width; 
            let h = Math.pow(Math.abs(Utils.fbm(nx * 1.8 + 100, 5, 2.0, 0.5)), 3.0) * 1.3;
            h *= Math.pow(Math.sin(nx * Math.PI), 0.3);
            points.push({ x: nx * width, y: baseY - h * scaleY * Math.min(nx * 10, (1 - nx) * 10, 1) });
        }
        return { points };
    }
    _generateNear(width, height) {
        const points = [], baseY = height * 0.75, scaleY = height * 0.45, steps = width; 
        for (let i = 0; i <= steps; i++) {
            const nx = (width / steps * i) / width;
            let mainShape = nx < 0.382 ? Math.pow(1.0 - (nx / 0.382), 1.5) : 0;
            let h = mainShape * scaleY;
            if (h > 5) h += (Utils.fbm(nx * 5 + 1234, 8, 2.0, 0.6) - 0.5) * scaleY * 0.6 * mainShape;
            if (nx > 0.6) h = 0;
            points.push({ x: nx * width, y: baseY - Math.max(0, h) });
        }
        return { points };
    }
    draw(ctx, width, height) {
        if (!this.layers.length) return;
        const style = { color: INK_CONFIG.colors.mountFront, blur: 5, opacity: 1 };
        ctx.save();
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, style.color); gradient.addColorStop(0.65, style.color); gradient.addColorStop(0.85, 'rgba(255, 255, 255, 0)');
        ctx.globalAlpha = style.opacity; ctx.shadowBlur = style.blur; ctx.shadowColor = style.color; ctx.fillStyle = gradient;
        Utils.drawInkPath(ctx, this.layers[1].points, height);
        ctx.fill(); ctx.restore();

        const mistY = height * 0.52;
        const mistGradient = ctx.createLinearGradient(0, mistY, 0, height * 0.70);
        mistGradient.addColorStop(0, 'rgba(255, 255, 255, 0)'); mistGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)'); mistGradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
        ctx.fillStyle = mistGradient; ctx.fillRect(0, mistY, width, height * 0.2);
    }
}

class WaterPainter {
    constructor() { this.boatInfo = null; }
    
    // 提取统一的波浪计算公式，确保渲染和物理一致
    _calculateY(x, time, p) {
        const t = time * p.speed;
        return p.baseY + 
               Math.sin(x * p.freq + t) * p.amp + 
               Math.sin(x * p.freq * 2.5 - t * 0.7) * (p.amp * 0.25) + 
               Math.cos(x * 0.008 + t * 1.5) * 2;
    }

    draw(ctx, width, height, time) {
        // Layer 1 (Mid)
        this._drawLayer(ctx, width, height, time, { 
            color: INK_CONFIG.colors.waterMid, 
            baseY: height * 0.70, 
            amp: 20, // 稍微降低幅度
            freq: 0.002, 
            speed: 2.0, 
            calc: true 
        });
        
        // Layer 2 (Front)
        this._drawLayer(ctx, width, height, time, { 
            color: INK_CONFIG.colors.waterFront, 
            baseY: height * 0.82, 
            amp: 30, // 稍微降低幅度
            freq: 0.003, 
            speed: 2.5, 
            calc: false 
        });
    }

    _drawLayer(ctx, width, height, time, p) {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0.5, p.color); 
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        
        ctx.fillStyle = gradient; 
        ctx.beginPath(); 
        ctx.moveTo(0, height);
        
        const targetBoatX = width * INK_CONFIG.layout.boatPositionX;
        const step = 8; // 采样步长

        for (let x = 0; x <= width; x += step) {
            const y = this._calculateY(x, time, p);
            ctx.lineTo(x, y);

            // 船体物理计算
            if (p.calc && Math.abs(x - targetBoatX) < step) {
                // 预测前方一点的高度，计算斜率
                const lookAhead = 10;
                const nextY = this._calculateY(x + lookAhead, time, p);
                // 使用 atan2 计算准确角度
                let angle = Math.atan2(nextY - y, lookAhead);
                
                // 限制最大倾角 (例如 +/- 0.3 弧度，约 17度)，防止翻船
                const maxAngle = 0.3;
                angle = Math.max(-maxAngle, Math.min(maxAngle, angle));
                
                this.boatInfo = { x, y, angle };
            }
        }
        ctx.lineTo(width, height); 
        ctx.closePath(); 
        ctx.fill();
    }
}

class BoatPainter {
    draw(ctx, info, time) {
        if (!info) return;
        const { x, y, angle } = info, rock = Math.sin(time * 1.5) * 0.03;
        ctx.save(); ctx.translate(x, y + 3); ctx.rotate(angle * 0.5 + rock);
        ctx.save(); ctx.scale(1, -0.6); ctx.translate(0, 10); ctx.globalAlpha = 0.05; ctx.fillStyle = '#000'; this._drawRaft(ctx); this._drawMan(ctx, false, 0); ctx.restore();
        ctx.fillStyle = 'rgba(25, 25, 25, 0.92)'; this._drawRaft(ctx); this._drawMan(ctx, true, Math.sin(time * 3) * 1.5);
        ctx.restore();
    }
    _drawRaft(ctx) { ctx.beginPath(); ctx.moveTo(-25, -1); ctx.quadraticCurveTo(0, 5, 25, -1); ctx.quadraticCurveTo(0, 2, -25, -1); ctx.fill(); }
    _drawMan(ctx, drawRod, rodOffset) {
        ctx.beginPath(); ctx.moveTo(-5, -1); ctx.quadraticCurveTo(-8, -10, 0, -12); ctx.lineTo(3, -1); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-7, -11); ctx.lineTo(7, -11); ctx.lineTo(0, -14); ctx.fill();
        if (drawRod) {
            ctx.strokeStyle = 'rgba(20, 20, 20, 0.75)'; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(2, -8); ctx.lineTo(35, 6 + rodOffset); ctx.stroke();
            ctx.lineWidth = 0.3; ctx.beginPath(); ctx.moveTo(35, 6 + rodOffset); ctx.lineTo(35, 20 + rodOffset * 0.8); ctx.stroke();
        }
    }
}

class NaturePainter {
    constructor() { this.bamboo = { stems: [], leaves: [] }; }
    generateBamboo(width, height) {
        const startX = (width < 800 ? 0.85 : INK_CONFIG.layout.bambooXRatio) * width, startY = height + 20;
        this.bamboo = { stems: [], leaves: [] };
        [{ x: 0, y: 0, h: 420, a: -5 }, { x: 45, y: 50, h: 300, a: -9 }].forEach(c => {
            const segments = []; let cH = 0;
            while (cH < c.h) { const l = 40 + Math.random() * 22; segments.push({ y: -cH, l }); cH += l + 1; }
            this.bamboo.stems.push({ ...c, x: startX + c.x, y: startY + c.y, segments });
        });
        [{ x: -25, y: -260, a: -28 }, { x: -8, y: -340, a: -48 }, { x: 35, y: -180, a: 8 }, { x: 18, y: -100, a: -12 }, { x: 45, y: -200, a: 4 }]
            .forEach(c => this.bamboo.leaves.push({ ...c, x: startX + c.x, y: startY + c.y }));
    }
    drawBamboo(ctx) {
        ctx.save(); ctx.lineCap = 'butt'; ctx.lineJoin = 'round';
        this.bamboo.stems.forEach(s => {
            ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.a * Math.PI / 180); ctx.strokeStyle = INK_CONFIG.colors.inkLight; ctx.lineWidth = 5;
            s.segments.forEach(seg => { ctx.beginPath(); ctx.moveTo(0, seg.y); ctx.lineTo(0, seg.y - seg.l); ctx.stroke(); ctx.fillStyle = 'rgba(50, 55, 50, 0.35)'; ctx.fillRect(-3, seg.y - seg.l, 6, 2); });
            ctx.restore();
        });
        const dL = (s) => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(s*.2, -s*.1, s*.6, -s*.15, s, 0); ctx.bezierCurveTo(s*.6, s*.15, s*.2, s*.1, 0, 0); ctx.fill(); };
        ctx.fillStyle = 'rgba(30, 35, 30, 0.22)';
        this.bamboo.leaves.forEach(l => {
            ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.a * Math.PI / 180);
            ctx.save(); ctx.rotate(-15 * Math.PI/180); dL(45); ctx.restore(); ctx.save(); ctx.rotate(5 * Math.PI/180); dL(55); ctx.restore(); ctx.save(); ctx.translate(2,2); ctx.rotate(25 * Math.PI/180); dL(40); ctx.restore();
            ctx.restore();
        });
        ctx.restore();
    }
    drawBirds(ctx, width, height, time) {
        ctx.fillStyle = 'rgba(40, 40, 40, 0.8)';
        [{ x: width * .62, y: height * .11, s: 4, p: 0, v: 1 }, { x: width * .66, y: height * .09, s: 3, p: 1.2, v: .8 }, { x: width * .58, y: height * .14, s: 2.5, p: 2.5, v: 1.2 }].forEach(b => {
            const wY = Math.sin(time * 8 + b.p) * b.s * .25, fY = Math.sin(time * 1.5 * b.v + b.p) * 6, fX = Math.cos(time * .8 * b.v + b.p) * 8;
            ctx.save(); ctx.translate(b.x + fX, b.y + wY + fY); ctx.beginPath();
            ctx.moveTo(0, 0); ctx.quadraticCurveTo(-b.s*1.5, -b.s*.8+wY, -b.s*3.5, -b.s+wY); ctx.quadraticCurveTo(-b.s*2, -b.s*.2+wY, -1, 1);
            ctx.moveTo(0, 0); ctx.quadraticCurveTo(b.s*1.5, -b.s*.8+wY, b.s*3.5, -b.s+wY); ctx.quadraticCurveTo(b.s*2, -b.s*.2+wY, 1, 1);
            ctx.rect(-.4, 0, .8, 1.5); ctx.fill(); ctx.restore();
        });
    }
}

class InkLandscape {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.time = 0; this.active = true;
        this.painters = { mount: new MountainPainter(), water: new WaterPainter(), boat: new BoatPainter(), nature: new NaturePainter() };
        this._resize = this.resize.bind(this);
        window.addEventListener('resize', this._resize);
        this.resize(); this.animate();
    }
    resize() {
        if (!this.active) return;
        const dpr = window.devicePixelRatio || 1;
        this.width = window.innerWidth; this.height = window.innerHeight;
        this.canvas.width = this.width * dpr; this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.painters.mount.generate(this.width, this.height);
        this.painters.nature.generateBamboo(this.width, this.height);
    }
    animate() {
        if (!this.active) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.time += INK_CONFIG.speed;
        this.painters.mount.draw(this.ctx, this.width, this.height);
        const mG = this.ctx.createLinearGradient(0, this.height * 0.68, 0, this.height * 0.75);
        mG.addColorStop(0, 'rgba(255, 255, 255, 0)'); mG.addColorStop(1, INK_CONFIG.colors.bg);
        this.ctx.fillStyle = mG; this.ctx.fillRect(0, this.height * 0.68, this.width, this.height * 0.07); // Refined mask height
        this.painters.nature.drawBirds(this.ctx, this.width, this.height, this.time);
        this.painters.water.draw(this.ctx, this.width, this.height, this.time);
        this.painters.boat.draw(this.ctx, this.painters.water.boatInfo, this.time);
        this.painters.nature.drawBamboo(this.ctx);
        requestAnimationFrame(() => this.animate());
    }
}

// 自动暴露到全局，无需复杂的命名空间
window.App.Visuals.InkLandscape = InkLandscape;
