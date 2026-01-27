class SilkVeil {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Config: 像流动的山脉
        this.config = {
            speed: 0.0012, // 保持适中的流动速度
            colors: [
                'rgba(40, 50, 60, 0.05)',  // 远山
                'rgba(60, 70, 80, 0.04)',  // 中景
                'rgba(100, 110, 120, 0.03)' // 近景
            ]
        };

        this.time = 0;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.dpr = window.devicePixelRatio || 1;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.time += this.config.speed;

        this.config.colors.forEach((color, index) => {
            this.drawWave(color, index);
        });

        requestAnimationFrame(() => this.animate());
    }

    drawWave(color, index) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height);

        // 微调：基准线整体上移，让山脉显露更多
        const baseOffset = this.height * (0.4 + index * 0.12);

        // 微调：振幅大幅增加，模拟山峰
        const frequency = 0.001 + (index * 0.0001); 
        const amplitude = 120 - (index * 20); // 120px 的起伏，比之前高很多

        for (let x = 0; x <= this.width; x += 10) {
            // 核心微调：叠加第三层高频波 (x * frequency * 3)，模拟山脊的细节
            const noise = 
                Math.sin(x * frequency + this.time + index) * amplitude +
                Math.cos(x * (frequency * 1.5) - this.time) * (amplitude * 0.5) + 
                Math.sin(x * (frequency * 3) + this.time) * (amplitude * 0.2); // 细节层
            
            this.ctx.lineTo(x, baseOffset + noise);
        }

        this.ctx.lineTo(this.width, this.height);
        this.ctx.lineTo(0, this.height);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SilkVeil('art-canvas');
});