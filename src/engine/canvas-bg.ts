// ==========================================
// NUKHBA Dynamic Stardust & Constellation Canvas
// Interactive cosmic particles with golden filaments
// ==========================================

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  colorType: 'gold' | 'cyan' | 'white';
}

export class StardustCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animId: number = 0;
  private mouseX: number = -1000;
  private mouseY: number = -1000;
  private width: number = 0;
  private height: number = 0;
  private isDark: boolean = true;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2d context');
    this.ctx = context;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);

    this.init();
  }

  public setTheme(dark: boolean) {
    this.isDark = dark;
  }

  private init() {
    this.resize();
    window.addEventListener('resize', this.resize);
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });

    // Populate particles
    const particleCount = Math.floor(Math.min(100, (this.width * this.height) / 14000));
    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      const typeRand = Math.random();
      const colorType: 'gold' | 'cyan' | 'white' =
        typeRand > 0.4 ? 'gold' : typeRand > 0.15 ? 'cyan' : 'white';

      const baseAlpha = 0.2 + Math.random() * 0.5;

      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 0.8 + Math.random() * 2.2,
        alpha: baseAlpha,
        baseAlpha: baseAlpha,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        colorType
      });
    }

    this.animate();
  }

  private resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  private onMouseMove(e: MouseEvent) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  private onTouchMove(e: TouchEvent) {
    if (e.touches.length > 0) {
      this.mouseX = e.touches[0].clientX;
      this.mouseY = e.touches[0].clientY;
    }
  }

  private animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const maxDist = 110;
    const mouseRadius = 140;

    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Pulse alpha
      p.alpha = p.baseAlpha + Math.sin(Date.now() * p.pulseSpeed * 0.1) * 0.2;
      p.alpha = Math.max(0.08, Math.min(0.9, p.alpha));

      // Drift
      p.x += p.vx;
      p.y += p.vy;

      // Mouse gentle interaction
      const dxMouse = this.mouseX - p.x;
      const dyMouse = this.mouseY - p.y;
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      if (distMouse < mouseRadius && distMouse > 1) {
        const force = (1 - distMouse / mouseRadius) * 0.35;
        p.x -= (dxMouse / distMouse) * force;
        p.y -= (dyMouse / distMouse) * force;
      }

      // Screen wrap
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Draw particle
      let color = 'rgba(217, 119, 6, ';
      if (p.colorType === 'cyan') {
        color = 'rgba(0, 240, 255, ';
      } else if (p.colorType === 'white') {
        color = this.isDark ? 'rgba(255, 255, 255, ' : 'rgba(30, 41, 59, ';
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = color + p.alpha + ')';
      this.ctx.shadowBlur = p.size > 1.8 ? 8 : 0;
      this.ctx.shadowColor = p.colorType === 'cyan' ? '#00f0ff' : '#f59e0b';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Draw connecting filaments to nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * 0.16 * (this.isDark ? 1 : 0.8);
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(217, 119, 6, ${lineAlpha})`;
          this.ctx.lineWidth = 0.75;
          this.ctx.stroke();
        }
      }
    }

    this.animId = requestAnimationFrame(this.animate);
  }

  public destroy() {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('touchmove', this.onTouchMove);
  }
}
