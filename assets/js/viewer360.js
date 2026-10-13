/**
 * Emberly 360° Grinder & Brewer Interactive Viewer
 * Features:
 * - Drag to rotate (Mouse & Touch)
 * - Keyboard left/right arrow controls
 * - Manual rotate prev/next buttons
 * - Auto-rotate toggle with speed control (respects prefers-reduced-motion)
 * - Drag hint indicator
 * - Accessible live readout with angle degrees (0° - 345°)
 * - Fallback still gallery thumbnails
 * - Clean SVG multi-frame generator + image URL array support
 */

class Emberly360Viewer {
  constructor(containerElement, options = {}) {
    this.container = typeof containerElement === 'string' 
      ? document.querySelector(containerElement) 
      : containerElement;

    if (!this.container) return;

    this.options = Object.assign({
      productId: 'aethel-64-grinder',
      totalFrames: 24,
      autoRotateSpeed: 100, // ms per frame
      initialFrame: 0,
      customFrames: null // optional array of image URLs
    }, options);

    this.currentFrame = this.options.initialFrame;
    this.totalFrames = this.options.totalFrames;
    this.isDragging = false;
    this.startX = 0;
    this.isAutoRotating = false;
    this.autoRotateInterval = null;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.renderDOM();
    this.bindEvents();
    this.updateFrame(this.currentFrame);
  }

  renderDOM() {
    const angle = Math.round((this.currentFrame / this.totalFrames) * 360);
    this.container.innerHTML = `
      <div class="viewer-360-screen" tabindex="0" role="region" aria-label="Interactive 360 degree product view. Drag or use arrow keys to rotate." aria-valuenow="${angle}">
        <div class="viewer-angle-pill" aria-live="polite">
          <i class="ph ph-arrows-clockwise"></i>
          <span class="angle-text">${angle}° Perspective</span>
        </div>
        <div class="viewer-hint-overlay">
          <i class="ph ph-hand-pointing"></i> Drag or use arrow keys to rotate
        </div>
        <div class="viewer-frame-canvas"></div>
      </div>

      <div class="viewer-controls-bar">
        <button type="button" class="viewer-btn viewer-prev-btn" aria-label="Rotate left 15 degrees" title="Rotate Left">
          <i class="ph ph-caret-left"></i>
        </button>
        <button type="button" class="viewer-btn viewer-auto-btn" aria-label="Toggle auto rotation" title="Auto Rotate">
          <i class="ph ph-play"></i>
        </button>
        <button type="button" class="viewer-btn viewer-next-btn" aria-label="Rotate right 15 degrees" title="Rotate Right">
          <i class="ph ph-caret-right"></i>
        </button>
      </div>

      <div class="viewer-still-gallery" aria-label="Still perspective thumbnails">
        <button type="button" class="viewer-still-thumb" data-frame="0" aria-label="Front View (0 degrees)">
          <div class="thumb-inner">0° Front</div>
        </button>
        <button type="button" class="viewer-still-thumb" data-frame="6" aria-label="Right Profile (90 degrees)">
          <div class="thumb-inner">90° Side</div>
        </button>
        <button type="button" class="viewer-still-thumb" data-frame="12" aria-label="Back View (180 degrees)">
          <div class="thumb-inner">180° Rear</div>
        </button>
        <button type="button" class="viewer-still-thumb" data-frame="18" aria-label="Left Profile (270 degrees)">
          <div class="thumb-inner">270° Side</div>
        </button>
      </div>
    `;

    this.screen = this.container.querySelector('.viewer-360-screen');
    this.canvas = this.container.querySelector('.viewer-frame-canvas');
    this.angleText = this.container.querySelector('.angle-text');
    this.prevBtn = this.container.querySelector('.viewer-prev-btn');
    this.nextBtn = this.container.querySelector('.viewer-next-btn');
    this.autoBtn = this.container.querySelector('.viewer-auto-btn');
    this.thumbs = this.container.querySelectorAll('.viewer-still-thumb');
  }

  bindEvents() {
    // Mouse Drag
    this.screen.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.startX = e.clientX;
      this.screen.classList.add('dragging');
      this.stopAutoRotate();
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.startX;
      if (Math.abs(deltaX) > 12) {
        if (deltaX > 0) {
          this.step(1);
        } else {
          this.step(-1);
        }
        this.startX = e.clientX;
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.screen.classList.remove('dragging');
      }
    });

    // Touch Drag
    this.screen.addEventListener('touchstart', (e) => {
      this.isDragging = true;
      this.startX = e.touches[0].clientX;
      this.stopAutoRotate();
    }, { passive: true });

    this.screen.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.touches[0].clientX - this.startX;
      if (Math.abs(deltaX) > 14) {
        if (deltaX > 0) {
          this.step(1);
        } else {
          this.step(-1);
        }
        this.startX = e.touches[0].clientX;
      }
    }, { passive: true });

    this.screen.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Keyboard Arrow Keys
    this.screen.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.step(-1);
        this.stopAutoRotate();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.step(1);
        this.stopAutoRotate();
      }
    });

    // Button Controls
    this.prevBtn.addEventListener('click', () => {
      this.step(-1);
      this.stopAutoRotate();
    });

    this.nextBtn.addEventListener('click', () => {
      this.step(1);
      this.stopAutoRotate();
    });

    this.autoBtn.addEventListener('click', () => {
      this.toggleAutoRotate();
    });

    // Thumbnails
    this.thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const frame = parseInt(thumb.getAttribute('data-frame'), 10);
        this.updateFrame(frame);
        this.stopAutoRotate();
      });
    });
  }

  step(direction) {
    let next = this.currentFrame + direction;
    if (next >= this.totalFrames) next = 0;
    if (next < 0) next = this.totalFrames - 1;
    this.updateFrame(next);
  }

  updateFrame(frameIndex) {
    this.currentFrame = frameIndex;
    const angle = Math.round((this.currentFrame / this.totalFrames) * 360);

    if (this.angleText) {
      this.angleText.textContent = `${angle}° Angle`;
    }
    if (this.screen) {
      this.screen.setAttribute('aria-valuenow', angle);
    }

    // Update thumbnail active states
    this.thumbs.forEach(thumb => {
      const f = parseInt(thumb.getAttribute('data-frame'), 10);
      thumb.classList.toggle('active', Math.abs(f - this.currentFrame) <= 1);
    });

    // Render Frame Visual
    this.renderFrameVisual(this.currentFrame, angle);
  }

  renderFrameVisual(frame, angle) {
    if (this.options.customFrames && this.options.customFrames.length > 0) {
      const idx = frame % this.options.customFrames.length;
      this.canvas.innerHTML = `<img src="${this.options.customFrames[idx]}" alt="Product frame at ${angle} degrees" />`;
      return;
    }

    // High fidelity parametric SVG renderer representing 360 degree rotation
    // Generates mathematically precise perspective rotation with lighting shifts
    this.canvas.innerHTML = this.generateParametricGearSVG(this.options.productId, frame, angle);
  }

  generateParametricGearSVG(productId, frame, angle) {
    const rad = (angle * Math.PI) / 180;
    const cosVal = Math.cos(rad);
    const sinVal = Math.sin(rad);

    if (productId === 'kallio-thermal-profiler') {
      // Espresso Machine 360 view
      const paddleX = 200 + sinVal * 40;
      const groupX = 200 + sinVal * 15;
      const wandX = 200 - sinVal * 55;
      const reflectionOpacity = (0.2 + 0.3 * (cosVal + 1) / 2).toFixed(2);

      return `
        <svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bodyGradKallio" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#2D231E" />
              <stop offset="50%" stop-color="#3D302A" />
              <stop offset="100%" stop-color="#1C1613" />
            </linearGradient>
            <linearGradient id="metalChrome" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#F2EDE4" />
              <stop offset="40%" stop-color="#C2B8AA" />
              <stop offset="70%" stop-color="#ECE5DA" />
              <stop offset="100%" stop-color="#8E8273" />
            </linearGradient>
          </defs>
          <!-- Ground Shadow -->
          <ellipse cx="200" cy="355" rx="${130 + cosVal * 15}" ry="24" fill="rgba(28, 22, 19, 0.18)" />
          <!-- Machine Main Body -->
          <rect x="100" y="110" width="200" height="220" rx="10" fill="url(#bodyGradKallio)" stroke="#4A3B33" stroke-width="2"/>
          <!-- Top Cup Warmer Rail -->
          <rect x="110" y="95" width="180" height="15" rx="3" fill="url(#metalChrome)" />
          <!-- Walnut Side Accents (Rotating with perspective) -->
          <rect x="${102 + (cosVal > 0 ? 0 : 176)}" y="125" width="22" height="190" rx="4" fill="#8B4513" opacity="${Math.abs(sinVal) > 0.3 ? '0.9' : '0.4'}" />
          <!-- Pressure Gauge (Visible predominantly front-ish) -->
          <circle cx="${150 + sinVal * 20}" cy="160" r="18" fill="url(#metalChrome)" stroke="#1C1613" stroke-width="2" />
          <line x1="${150 + sinVal * 20}" y1="160" x2="${150 + sinVal * 20 + 8}" y2="152" stroke="#B84233" stroke-width="2" />
          <!-- Flow Paddle -->
          <circle cx="${paddleX}" cy="160" r="14" fill="#C37A38" />
          <rect x="${paddleX - 4}" y="146" width="8" height="28" rx="2" fill="#5C2E0B" />
          <!-- E61 Saturated Group Head -->
          <path d="M ${groupX - 22} 190 L ${groupX + 22} 190 L ${groupX + 16} 250 L ${groupX - 16} 250 Z" fill="url(#metalChrome)" />
          <!-- Portafilter Spout & Handle (Spins around) -->
          <line x1="${groupX}" y1="240" x2="${groupX + cosVal * 65}" y2="${240 + sinVal * 25}" stroke="#2D231E" stroke-width="12" stroke-linecap="round" />
          <circle cx="${groupX + cosVal * 65}" cy="${240 + sinVal * 25}" r="8" fill="#C37A38" />
          <!-- Steam Wand -->
          <path d="M ${wandX} 185 Q ${wandX - 25} 240 ${wandX - 10} 275" fill="none" stroke="url(#metalChrome)" stroke-width="6" stroke-linecap="round" />
          <!-- Drip Tray Grid -->
          <rect x="110" y="305" width="180" height="25" rx="4" fill="url(#metalChrome)" opacity="0.9" />
          <!-- Dynamic Light Sheen -->
          <polygon points="120,110 160,110 200,330 160,330" fill="#FFFFFF" opacity="${reflectionOpacity}" />
        </svg>
      `;
    } else if (productId === 'vapour-precision-kettle') {
      // Gooseneck Kettle 360 view
      const spoutEndX = 200 + cosVal * 110;
      const spoutEndY = 180 - sinVal * 30;
      const handleX = 200 - cosVal * 85;
      const handleY = 220 + sinVal * 20;

      return `
        <svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="kettleMatte" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#2D231E" />
              <stop offset="60%" stop-color="#1C1613" />
              <stop offset="100%" stop-color="#3D302A" />
            </linearGradient>
          </defs>
          <!-- Base Shadow -->
          <ellipse cx="200" cy="340" rx="95" ry="18" fill="rgba(28, 22, 19, 0.15)" />
          <!-- Digital Base Platform -->
          <rect x="120" y="315" width="160" height="20" rx="6" fill="#1C1613" stroke="#C37A38" stroke-width="1.5" />
          <circle cx="250" cy="325" r="5" fill="#C37A38" />
          <!-- Kettle Body -->
          <path d="M 150 310 C 140 260, 155 190, 170 170 L 230 170 C 245 190, 260 260, 250 310 Z" fill="url(#kettleMatte)" />
          <!-- Lid & Walnut Finial -->
          <ellipse cx="200" cy="170" rx="32" ry="8" fill="#3D302A" />
          <circle cx="200" cy="155" r="10" fill="#C37A38" />
          <!-- Gooseneck Spout (Pivoting with cosine) -->
          <path d="M 160 280 C ${160 + cosVal * 50} 250, ${spoutEndX} 230, ${spoutEndX} ${spoutEndY}" fill="none" stroke="#2D231E" stroke-width="8" stroke-linecap="round" />
          <path d="M ${spoutEndX} ${spoutEndY} L ${spoutEndX + 8} ${spoutEndY - 4}" fill="none" stroke="#C37A38" stroke-width="4" stroke-linecap="round" />
          <!-- Ergonomic Counterbalanced Handle -->
          <path d="M 240 200 C ${handleX} 190, ${handleX} 270, 240 290" fill="none" stroke="#8B4513" stroke-width="14" stroke-linecap="round" />
          <!-- Dial Temp Readout on Base -->
          <rect x="145" y="321" width="45" height="9" rx="2" fill="#000" />
          <text x="167" y="328" font-size="7" fill="#C37A38" font-family="monospace" text-anchor="middle">94.0°C</text>
        </svg>
      `;
    } else {
      // Default: Aethel 64 Precision Flat Burr Grinder
      const dialMarkerX = 200 + sinVal * 42;
      const dialMarkerY = 160 + cosVal * 12;
      const chuteX = 200 + sinVal * 15;
      const cupX = 200 + sinVal * 18;

      return `
        <svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grinderChassis" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#3D302A" />
              <stop offset="50%" stop-color="#1C1613" />
              <stop offset="100%" stop-color="#28201B" />
            </linearGradient>
            <linearGradient id="brassAccent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#E29C52" />
              <stop offset="50%" stop-color="#C37A38" />
              <stop offset="100%" stop-color="#8E4F18" />
            </linearGradient>
          </defs>
          <!-- Ground Shadow -->
          <ellipse cx="200" cy="360" rx="85" ry="16" fill="rgba(28, 22, 19, 0.16)" />
          <!-- Heavy Anodized Base Plinth -->
          <rect x="135" y="335" width="130" height="22" rx="6" fill="#1C1613" stroke="#3D302A" stroke-width="2" />
          <!-- Angled Motor Housing Column -->
          <path d="M 160 335 L 175 140 L 225 140 L 240 335 Z" fill="url(#grinderChassis)" />
          <!-- 64mm Stepless Micrometer Dial Collar -->
          <rect x="150" y="140" width="100" height="24" rx="4" fill="url(#brassAccent)" />
          <!-- Stepless Dial Indicator Tick Mark -->
          <line x1="${dialMarkerX}" y1="140" x2="${dialMarkerX}" y2="164" stroke="#FFF" stroke-width="3" />
          <!-- Top Single-Dose Bellows Hopper -->
          <path d="M 170 140 L 160 85 L 240 85 L 230 140 Z" fill="#28201B" stroke="#4A3B33" stroke-width="1.5" />
          <!-- Silicone Ribs of Bellows -->
          <line x1="166" y1="102" x2="234" y2="102" stroke="#1C1613" stroke-width="3" />
          <line x1="168" y1="118" x2="232" y2="118" stroke="#1C1613" stroke-width="3" />
          <!-- Solid Turned Walnut Hopper Cap -->
          <ellipse cx="200" cy="85" rx="42" ry="10" fill="#8B4513" stroke="#C37A38" stroke-width="1.5" />
          <!-- Exit Chute & Anti-Static Plasma Nozzle -->
          <path d="M ${chuteX - 14} 200 L ${chuteX + 14} 200 L ${chuteX + 8} 245 L ${chuteX - 8} 245 Z" fill="url(#brassAccent)" />
          <!-- Magnetic CNC Dosing Catch Cup -->
          <rect x="${cupX - 25}" y="255" width="50" height="65" rx="6" fill="#2D231E" stroke="#C37A38" stroke-width="2" />
          <circle cx="${cupX}" cy="285" r="4" fill="#C37A38" />
          <!-- Power Toggle Button -->
          <circle cx="200" cy="346" r="6" fill="#C37A38" />
        </svg>
      `;
    }
  }

  toggleAutoRotate() {
    if (this.isAutoRotating) {
      this.stopAutoRotate();
    } else {
      this.startAutoRotate();
    }
  }

  startAutoRotate() {
    if (this.prefersReducedMotion) return;
    this.isAutoRotating = true;
    this.autoBtn.classList.add('active');
    this.autoBtn.innerHTML = '<i class="ph ph-pause"></i>';
    this.autoBtn.setAttribute('aria-label', 'Pause auto rotation');

    this.autoRotateInterval = setInterval(() => {
      this.step(1);
    }, this.options.autoRotateSpeed);
  }

  stopAutoRotate() {
    this.isAutoRotating = false;
    if (this.autoBtn) {
      this.autoBtn.classList.remove('active');
      this.autoBtn.innerHTML = '<i class="ph ph-play"></i>';
      this.autoBtn.setAttribute('aria-label', 'Start auto rotation');
    }
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }
  }

  setProduct(productId) {
    this.options.productId = productId;
    this.updateFrame(this.currentFrame);
  }
}

// Global exposure for scripts
window.Emberly360Viewer = Emberly360Viewer;
