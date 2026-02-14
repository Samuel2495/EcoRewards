class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.reset();
        // Add pulsating properties
        this.baseOpacity = Math.random() * 0.5 + 0.2;
        this.opacityStep = 0.02;
        this.opacityDirection = 1;
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = this.baseOpacity;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Pulsating opacity effect
        this.opacity += this.opacityStep * this.opacityDirection;
        if (this.opacity >= this.baseOpacity + 0.3) {
            this.opacityDirection = -1;
        } else if (this.opacity <= this.baseOpacity - 0.1) {
            this.opacityDirection = 1;
        }

        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(26, 26, 26, ${this.opacity})`;
        this.ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        console.log('Initializing particle system');
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        console.log('Canvas found:', this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 150; // Increased from 50 to 150
        
        this.resizeCanvas();
        this.init();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Create particles
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this.canvas));
        }
        this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
}); 