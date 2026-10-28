import gsap from 'gsap';
import confetti from 'canvas-confetti';

export function initMotion() {
  // Staggered hero reveal
  gsap.from('.hero-reveal', {
    y: 35,
    opacity: 0,
    duration: 1.1,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Staggered sectors reveal
  gsap.from('.sector-card-reveal', {
    y: 40,
    opacity: 0,
    duration: 0.9,
    stagger: 0.08,
    ease: 'power2.out',
    delay: 0.3
  });

  // Initialize 3D Tilt with spotlight on all interactive cards
  initCardTilt();
}

export function initCardTilt() {
  const cards = document.querySelectorAll<HTMLElement>('.luxury-tilt-card');

  cards.forEach((card) => {
    // Avoid double attaching
    if (card.dataset.tiltInit === 'true') return;
    card.dataset.tiltInit = 'true';

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6.5; // Max 6.5deg
      const rotateY = ((x - centerX) / centerX) * 6.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
  });
}

/**
 * Animate numeric counter smoothly
 */
export function animateCounter(element: HTMLElement, targetValue: number, prefix: string = '', suffix: string = '', duration: number = 1.2) {
  const obj = { val: 0 };
  gsap.to(obj, {
    val: targetValue,
    duration: duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = `${prefix}${Math.round(obj.val).toLocaleString('en-US')}${suffix}`;
    }
  });
}

/**
 * Luxury Gold & Emerald Foil Flakes Confetti
 */
export function triggerLuxuryConfetti() {
  confetti({
    particleCount: 50,
    spread: 65,
    origin: { y: 0.65 },
    colors: ['#d97706', '#f59e0b', '#fbbf24', '#10b981', '#ffffff']
  });

  setTimeout(() => {
    confetti({
      particleCount: 35,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#d97706', '#f59e0b', '#00f0ff']
    });
    confetti({
      particleCount: 35,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#d97706', '#10b981', '#fbbf24']
    });
  }, 150);
}
