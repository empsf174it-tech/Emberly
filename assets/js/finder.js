/**
 * Emberly Brew-Method Finder & Grind-Size Guide
 * Powers interactive recipe generation, kit bundling, and grind calibration tools.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBrewMethodFinder();
  initGrindSizeGuide();
});

/* ==========================================================================
   BREW-METHOD FINDER
   ========================================================================== */
function initBrewMethodFinder() {
  const methodButtons = document.querySelectorAll('.finder-method-btn');
  const expSelect = document.getElementById('finder-exp-level');
  const budgetInput = document.getElementById('finder-max-budget');
  const recipeContainer = document.getElementById('finder-recipe-card');
  const gearContainer = document.getElementById('finder-recommended-gear');
  const addKitBtn = document.getElementById('finder-add-kit-btn');

  if (!recipeContainer || !gearContainer) return;

  let currentMethod = 'espresso';

  function updateFinder() {
    const guide = BREW_GUIDES[currentMethod];
    if (!guide) return;

    // Filter gear by budget if specified
    const maxBudget = budgetInput ? parseFloat(budgetInput.value) || 99999 : 99999;
    const expLevel = expSelect ? expSelect.value : 'all';

    // Retrieve product objects from PRODUCTS
    const kitProducts = guide.gearIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
    const kitTotal = kitProducts.reduce((sum, p) => sum + p.price, 0);

    // Render Recipe Spec Card
    recipeContainer.innerHTML = `
      <div class="recipe-spec-card">
        <div class="badge badge-accent" style="margin-bottom: 8px;">Calibrated Lab Starting Point</div>
        <h3>${guide.title}</h3>
        <p class="recipe-subtitle">${guide.desc}</p>

        <div class="recipe-metrics-grid">
          <div class="recipe-metric-item">
            <div class="recipe-metric-label">Dose & Yield</div>
            <div class="recipe-metric-value tabular-nums">${guide.dose} → ${guide.yield}</div>
          </div>
          <div class="recipe-metric-item">
            <div class="recipe-metric-label">Brew Ratio</div>
            <div class="recipe-metric-value">${guide.ratio}</div>
          </div>
          <div class="recipe-metric-item">
            <div class="recipe-metric-label">Water Temp</div>
            <div class="recipe-metric-value tabular-nums">${guide.temp}</div>
          </div>
          <div class="recipe-metric-item">
            <div class="recipe-metric-label">Extraction Time</div>
            <div class="recipe-metric-value tabular-nums">${guide.time}</div>
          </div>
        </div>

        <div class="recipe-why-box">
          <strong>Why this configuration:</strong> ${guide.why}
        </div>
      </div>
    `;

    // Render Recommended Gear List
    let gearHtml = `
      <div class="recommended-gear-col">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
          <h4>Recommended Gear Kit</h4>
          <span class="tabular-nums" style="font-weight: 600; color: var(--color-primary);">Bundle: ${CURRENCY}${kitTotal.toFixed(2)}</span>
        </div>
        <div class="recommended-gear-list">
    `;

    kitProducts.forEach(prod => {
      gearHtml += `
        <div class="rec-gear-item">
          <div class="rec-gear-thumb">
            <img src="${prod.image}" alt="${prod.name}" loading="lazy" />
          </div>
          <div class="rec-gear-info">
            <div class="rec-gear-title">${prod.name}</div>
            <div class="rec-gear-meta">
              <span class="rec-gear-price tabular-nums">${CURRENCY}${prod.price.toFixed(2)}</span>
              <span class="rec-gear-cat">${prod.category.replace(/-/g, ' ')}</span>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm rec-gear-view" onclick="openQuickView('${prod.id}')" aria-label="Quick view ${prod.name}">
            <span class="rec-gear-view-label">View</span><i class="ph ph-arrow-up-right"></i>
          </button>
        </div>
      `;
    });

    gearHtml += `
        </div>
        <button type="button" class="btn btn-accent btn-lg" id="add-kit-action-btn" style="width: 100%;">
          <i class="ph ph-shopping-bag"></i> Add Full Kit to Cart (${CURRENCY}${kitTotal.toFixed(2)})
        </button>
      </div>
    `;

    gearContainer.innerHTML = gearHtml;

    // Bind Kit Add to Cart
    const newAddKitBtn = document.getElementById('add-kit-action-btn');
    if (newAddKitBtn) {
      newAddKitBtn.addEventListener('click', () => {
        kitProducts.forEach(prod => {
          if (prod.stock > 0) {
            EmberlyCart.addItem(prod.id, 1, false);
          }
        });
        EmberlyCart.openDrawer();
        showToast(`Full ${guide.title.split(' ')[0]} Kit added to cart!`);
      });
    }
  }

  methodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      methodButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMethod = btn.getAttribute('data-method');
      updateFinder();
    });
  });

  if (expSelect) expSelect.addEventListener('change', updateFinder);
  if (budgetInput) budgetInput.addEventListener('input', updateFinder);

  updateFinder();
}

/* ==========================================================================
   GRIND-SIZE GUIDE
   ========================================================================== */
function initGrindSizeGuide() {
  const slider = document.getElementById('grind-slider');
  const stepNodes = document.querySelectorAll('.grind-step-node');
  const previewCanvas = document.getElementById('grind-particle-canvas');
  const nameEl = document.getElementById('grind-name-display');
  const micronsEl = document.getElementById('grind-microns-display');
  const textureEl = document.getElementById('grind-texture-display');
  const methodsEl = document.getElementById('grind-methods-display');
  const timeEl = document.getElementById('grind-time-display');
  const troubleEl = document.getElementById('grind-trouble-display');
  const matchedGrindersEl = document.getElementById('grind-matched-grinders');

  if (!slider && stepNodes.length === 0) return;

  function renderStep(stepIndex) {
    const data = GRIND_LEVELS[stepIndex] || GRIND_LEVELS[3];

    // Update active node
    stepNodes.forEach((node, i) => {
      node.classList.toggle('active', i === stepIndex);
      node.setAttribute('aria-selected', i === stepIndex);
    });

    if (slider) slider.value = stepIndex;

    if (nameEl) nameEl.textContent = `${data.name} (${data.label})`;
    if (micronsEl) micronsEl.textContent = data.microns;
    if (textureEl) textureEl.textContent = data.textureDesc;
    if (methodsEl) methodsEl.textContent = data.methods;
    if (timeEl) timeEl.textContent = data.time;
    if (troubleEl) troubleEl.innerHTML = `<strong>Extraction Troubleshooting:</strong> ${data.troubleshoot}`;

    // Render Particle SVG Canvas
    if (previewCanvas) {
      previewCanvas.innerHTML = generateParticleSvg(stepIndex);
    }

    // Render Matching Grinders
    if (matchedGrindersEl) {
      const grinders = data.matchedGrinders.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
      let gHtml = '<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px;">';
      grinders.forEach(g => {
        gHtml += `
          <button type="button" class="btn btn-secondary btn-sm" onclick="openQuickView('${g.id}')">
            <i class="ph ph-sliders"></i> ${g.name}
          </button>
        `;
      });
      gHtml += '</div>';
      matchedGrindersEl.innerHTML = gHtml;
    }
  }

  function generateParticleSvg(stepIndex) {
    // Generates visual dispersion of coffee particles sized proportionally to stepIndex
    const particleRadius = 1.2 + stepIndex * 1.5;
    const count = Math.max(16, 120 - stepIndex * 14);
    let circles = '';

    // Seeded visual positions in a 160x160 circular brew bed
    for (let i = 0; i < count; i++) {
      const angle = (i * 137.5) * (Math.PI / 180);
      const r = Math.sqrt(i / count) * 65;
      const x = 80 + r * Math.cos(angle);
      const y = 80 + r * Math.sin(angle);
      const jitter = (i % 3 === 0 ? 0.8 : (i % 2 === 0 ? 1.1 : 0.95));
      const radius = Math.max(0.8, particleRadius * jitter);
      const color = i % 4 === 0 ? '#C37A38' : (i % 3 === 0 ? '#3D302A' : '#1C1613');
      circles += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(1)}" fill="${color}" opacity="0.85" />`;
    }

    return `
      <svg viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="74" fill="none" stroke="var(--color-border)" stroke-width="2" stroke-dasharray="4 4"/>
        ${circles}
      </svg>
    `;
  }

  if (slider) {
    slider.addEventListener('input', (e) => {
      renderStep(parseInt(e.target.value, 10));
    });
  }

  stepNodes.forEach((node, i) => {
    node.addEventListener('click', () => {
      renderStep(i);
    });
  });

  renderStep(3); // Start at Medium (Pour-over)
}
