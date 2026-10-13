/**
 * Emberly Gear Shop & Quick-View Modal Engine
 * Handles catalog rendering, instant multi-faceted filtering, sorting,
 * wishlist persistence, and the complete 4-tab Quick-View modal.
 */


document.addEventListener('DOMContentLoaded', () => {
  initFeaturedGrid();
  initShopPage();
  initQuickViewModal();
  updateWishlistUI();
});

/* ==========================================================================
   FEATURED GEAR GRID (Home Page)
   ========================================================================== */
function initFeaturedGrid() {
  const container = document.getElementById('home-featured-grid');
  if (!container) return;

  const featured = PRODUCTS.filter(p => p.featured).slice(0, 6);
  container.innerHTML = featured.map(renderProductCard).join('');
}

/* ==========================================================================
   SHOP PAGE CATALOG & FILTERS (services.html #shop)
   ========================================================================== */
function initShopPage() {
  const grid = document.getElementById('shop-products-grid');
  if (!grid) return;

  const categoryFilter = document.getElementById('shop-filter-category');
  const brewFilter = document.getElementById('shop-filter-brew');
  const minPriceInput = document.getElementById('shop-filter-min-price');
  const maxPriceInput = document.getElementById('shop-filter-max-price');
  const ratingFilter = document.getElementById('shop-filter-rating');
  const stockToggle = document.getElementById('shop-filter-stock');
  const sortSelect = document.getElementById('shop-sort-select');
  const resetBtn = document.getElementById('shop-reset-filters-btn');
  const resultsCount = document.getElementById('shop-results-count');

  function filterAndRender() {
    let list = PRODUCTS.filter(p => p.featured).slice(0, 6);

    // Category
    if (categoryFilter && categoryFilter.value !== 'all') {
      list = list.filter(p => p.category === categoryFilter.value);
    }

    // Brew Method
    if (brewFilter && brewFilter.value !== 'all') {
      list = list.filter(p => p.brewMethods.includes(brewFilter.value));
    }

    // Price range (validated numeric)
    const minP = minPriceInput ? parseFloat(minPriceInput.value) || 0 : 0;
    const maxP = maxPriceInput && maxPriceInput.value ? parseFloat(maxPriceInput.value) : Infinity;
    list = list.filter(p => p.price >= minP && p.price <= maxP);

    // Rating
    if (ratingFilter && ratingFilter.value !== 'all') {
      const minRate = parseFloat(ratingFilter.value);
      list = list.filter(p => p.rating >= minRate);
    }

    // In Stock Only
    if (stockToggle && stockToggle.checked) {
      list = list.filter(p => p.stock > 0);
    }

    // Sort
    const sortVal = sortSelect ? sortSelect.value : 'featured';
    if (sortVal === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'rating-desc') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    // Update Counter
    if (resultsCount) {
      resultsCount.textContent = `Showing ${list.length} precision gear pieces`;
    }

    // Render Cards or Empty State
    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 64px 20px;">
          <i class="ph ph-magnifying-glass" style="font-size: 3rem; color: var(--color-text-muted); margin-bottom: 16px; display: inline-block;"></i>
          <h3>No Equipment Matches Current Criteria</h3>
          <p style="margin: 8px 0 24px 0;">Try relaxing your price boundary or switching brew method filters.</p>
          <button type="button" class="btn btn-primary" onclick="resetShopFilters()">
            <i class="ph ph-arrows-clockwise"></i> Reset All Filters
          </button>
        </div>
      `;
    } else {
      grid.innerHTML = list.map(renderProductCard).join('');
    }

    updateWishlistUI();
  }

  // Bind filter triggers
  if (categoryFilter) categoryFilter.addEventListener('change', filterAndRender);
  if (brewFilter) brewFilter.addEventListener('change', filterAndRender);
  if (minPriceInput) minPriceInput.addEventListener('input', filterAndRender);
  if (maxPriceInput) maxPriceInput.addEventListener('input', filterAndRender);
  if (ratingFilter) ratingFilter.addEventListener('change', filterAndRender);
  if (stockToggle) stockToggle.addEventListener('change', filterAndRender);
  if (sortSelect) sortSelect.addEventListener('change', filterAndRender);
  if (resetBtn) resetBtn.addEventListener('click', () => window.resetShopFilters());

  window.resetShopFilters = () => {
    if (categoryFilter) categoryFilter.value = 'all';
    if (brewFilter) brewFilter.value = 'all';
    if (minPriceInput) minPriceInput.value = '';
    if (maxPriceInput) maxPriceInput.value = '';
    if (ratingFilter) ratingFilter.value = 'all';
    if (stockToggle) stockToggle.checked = false;
    if (sortSelect) sortSelect.value = 'featured';
    filterAndRender();
  };

  filterAndRender();
}

/* ==========================================================================
   PRODUCT CARD COMPONENT TEMPLATE
   ========================================================================== */
function renderProductCard(p) {
  const isOutOfStock = p.stock <= 0;
  let stockBadgeHtml = '';
  if (isOutOfStock) {
    stockBadgeHtml = '<span class="badge badge-sold-out">Sold Out</span>';
  } else if (p.stock <= 4) {
    stockBadgeHtml = `<span class="badge badge-low-stock">Low Stock (${p.stock} left)</span>`;
  } else {
    stockBadgeHtml = `<span class="badge badge-stock">In Stock (${p.stock})</span>`;
  }

  const categoryName = p.category.replace('-', ' ');

  return `
    <article class="product-card" data-product-id="${p.id}">
      <div class="product-card-top">
        <div class="product-badge-float">
          ${p.badge ? `<span class="badge badge-accent">${p.badge}</span>` : ''}
        </div>
        <button type="button" class="product-wishlist-btn" onclick="toggleWishlist('${p.id}')" aria-label="Save ${p.name} to wishlist" title="Save to wishlist">
          <i class="ph ph-heart"></i>
        </button>
        <img src="${p.image}" alt="${p.name}" class="product-card-img" loading="lazy" />
      </div>

      <div class="product-card-body">
        <span class="product-category-text">${categoryName}</span>
        <h3 class="product-card-title">${p.name}</h3>

        <div class="product-rating-bar">
          <span class="stars-display" aria-label="${p.rating} out of 5 stars">
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star-half"></i>
          </span>
          <span class="tabular-nums"><strong>${p.rating}</strong> (${p.reviewCount})</span>
        </div>

        <div class="product-card-price-row">
          <span class="product-card-price tabular-nums">${CURRENCY}${p.price.toFixed(2)}</span>
          ${stockBadgeHtml}
        </div>

        <div class="product-card-actions">
          <button type="button" class="btn btn-secondary btn-sm" onclick="openQuickView('${p.id}')">
            Quick View
          </button>
          <button type="button" class="btn btn-primary btn-sm" onclick="EmberlyCart.addItem('${p.id}', 1)" ${isOutOfStock ? 'disabled title="Currently unavailable"' : ''}>
            ${isOutOfStock ? 'Sold Out' : '<i class="ph ph-shopping-bag"></i> Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  `;
}

/* ==========================================================================
   QUICK-VIEW MODAL (3 Accessible Tabs, Focus Trap, Esc Close)
   ========================================================================== */
function initQuickViewModal() {
  const backdrop = document.getElementById('quick-view-modal');
  if (!backdrop) return;

  const closeBtn = backdrop.querySelector('.modal-close-btn');

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeModal();
    }
  });

  window.openQuickView = (productId) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    renderQuickViewContent(product);
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessible focus trap
    setTimeout(() => {
      if (closeBtn) closeBtn.focus();
    }, 100);
  };
}

function renderQuickViewContent(p) {
  const container = document.getElementById('quick-view-dialog-content');
  if (!container) return;

  const isOutOfStock = p.stock <= 0;

  // Render Reviews tab breakdown
  let reviewsListHtml = '';
  p.reviews.forEach(r => {
    reviewsListHtml += `
      <div style="border-bottom: 1px solid var(--color-border); padding: 16px 0;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
          <div>
            <strong>${r.author}</strong>
            ${r.verified ? '<span class="badge badge-stock" style="margin-left: 6px; font-size: 0.7rem;">Verified Bench Buyer</span>' : ''}
          </div>
          <span style="font-size: 0.82rem; color: var(--color-text-muted);">${r.date}</span>
        </div>
        <div style="color: var(--color-accent); font-size: 0.9rem; margin-bottom: 4px;">
          ${'<i class="ph-fill ph-star"></i>'.repeat(Math.floor(r.rating))}
        </div>
        <strong style="display: block; font-size: 0.95rem; margin-bottom: 4px;">${r.title}</strong>
        <p style="font-size: 0.9rem; line-height: 1.5;">${r.comment}</p>
      </div>
    `;
  });

  // Render Specs table
  let specsRowsHtml = '';
  for (const [key, val] of Object.entries(p.specs)) {
    specsRowsHtml += `
      <tr>
        <td>${key}</td>
        <td>${val}</td>
      </tr>
    `;
  }

  container.innerHTML = `
    <div class="modal-tabs-header" role="tablist">
      <button type="button" class="modal-tab-btn active" role="tab" aria-selected="true" data-tab="tab-overview">Overview</button>
      <button type="button" class="modal-tab-btn" role="tab" aria-selected="false" data-tab="tab-specs">Technical Specs</button>
      <button type="button" class="modal-tab-btn" role="tab" aria-selected="false" data-tab="tab-reviews">Reviews (${p.reviewCount})</button>
    </div>

    <div class="modal-tab-content">
      <!-- TAB 1: OVERVIEW -->
      <div class="modal-pane active" id="tab-overview">
        <div class="modal-overview-grid">
          <div style="position: relative; border-radius: var(--radius); overflow: hidden; background: var(--color-secondary);">
            <img src="${p.image}" alt="${p.name}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover;" id="modal-main-img" />
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              ${p.gallery.map(img => `
                <img src="${img}" alt="View angle" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius); cursor: pointer; border: 1px solid var(--color-border);" onclick="document.getElementById('modal-main-img').src='${img}'" />
              `).join('')}
            </div>
          </div>

          <div>
            <span class="badge badge-accent" style="margin-bottom: 8px;">${p.category.replace('-', ' ')}</span>
            <h2 style="font-size: 1.85rem; margin-bottom: 8px;">${p.name}</h2>
            <p style="font-size: 0.95rem; margin-bottom: 16px; color: var(--color-text-muted);">${p.tagline}</p>

            <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px;">
              <span class="price tabular-nums" style="font-size: 1.75rem; font-weight: 560; color: var(--color-primary); font-family: var(--font-serif);">${CURRENCY}${p.price.toFixed(2)}</span>
              ${p.stock > 0 
                ? `<span class="badge badge-stock">In Stock (${p.stock} units in Seattle lab)</span>` 
                : `<span class="badge badge-sold-out">Currently Backordered</span>`}
            </div>

            <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">${p.description}</p>

            <div class="modal-buy-row">
              <div class="cart-qty-group">
                <button type="button" class="cart-qty-btn" onclick="adjustModalQty(-1)" aria-label="Decrease quantity">-</button>
                <span class="cart-qty-val" id="modal-qty-val">1</span>
                <button type="button" class="cart-qty-btn" onclick="adjustModalQty(1)" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" class="btn btn-primary btn-lg modal-add-btn" onclick="addFromModal('${p.id}')" ${isOutOfStock ? 'disabled' : ''}>
                ${isOutOfStock ? 'Sold Out' : '<i class="ph ph-shopping-bag"></i> Add to Cart'}
              </button>
              <button type="button" class="btn btn-secondary modal-wish-btn" onclick="toggleWishlist('${p.id}')" aria-label="Wishlist">
                <i class="ph ph-heart"></i>
              </button>
            </div>

            <div class="modal-perks">
              <div class="modal-perk"><span class="modal-perk-icon"><i class="ph ph-truck"></i></span><span>Free Climate-Neutral Delivery</span></div>
              <div class="modal-perk"><span class="modal-perk-icon"><i class="ph ph-shield-check"></i></span><span>2-Year Precision Warranty</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: SPECS -->
      <div class="modal-pane" id="tab-specs">
        <h4 style="margin-bottom: 16px;">Bench-Laboratory Specifications</h4>
        <div class="table-scroll-container">
          <table class="specs-table">
            <tbody>
              ${specsRowsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: REVIEWS -->
      <div class="modal-pane" id="tab-reviews">
        <div class="reviews-summary-bar">
          <div class="reviews-big-score">
            <div class="score-num tabular-nums">${p.rating}</div>
            <div style="color: var(--color-accent); font-size: 1.1rem; margin: 4px 0;">
              <i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star-half"></i>
            </div>
            <div style="font-size: 0.8rem; color: var(--color-text-muted);">${p.reviewCount} Verified Ratings</div>
          </div>
          <div class="rating-bars">
            <div class="rating-row">
              <span class="rating-label">5 <i class="ph-fill ph-star"></i></span>
              <div class="rating-track">
                <div class="rating-fill" style="width: 88%;"></div>
              </div>
              <span class="tabular-nums">88%</span>
            </div>
            <div class="rating-row">
              <span class="rating-label">4 <i class="ph-fill ph-star"></i></span>
              <div class="rating-track">
                <div class="rating-fill" style="width: 10%;"></div>
              </div>
              <span class="tabular-nums">10%</span>
            </div>
            <div class="rating-row">
              <span class="rating-label">3 <i class="ph-fill ph-star"></i></span>
              <div class="rating-track">
                <div class="rating-fill" style="width: 2%;"></div>
              </div>
              <span class="tabular-nums">2%</span>
            </div>
          </div>
        </div>
        <div class="reviews-list-container">
          ${reviewsListHtml}
        </div>
      </div>
    </div>
  `;

  // Bind tab switching
  const tabBtns = container.querySelectorAll('.modal-tab-btn');
  const panes = container.querySelectorAll('.modal-pane');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const targetPane = document.getElementById(btn.getAttribute('data-tab'));
      if (targetPane) targetPane.classList.add('active');

    });
  });
}

window.adjustModalQty = (delta) => {
  const el = document.getElementById('modal-qty-val');
  if (!el) return;
  let val = parseInt(el.textContent, 10) + delta;
  if (val < 1) val = 1;
  el.textContent = val;
};

window.addFromModal = (productId) => {
  const el = document.getElementById('modal-qty-val');
  const qty = el ? parseInt(el.textContent, 10) : 1;
  EmberlyCart.addItem(productId, qty);
  const backdrop = document.getElementById('quick-view-modal');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
};

/* ==========================================================================
   WISHLIST / SAVED GEAR SYSTEM
   ========================================================================== */
window.toggleWishlist = (productId) => {
  let saved = JSON.parse(localStorage.getItem('emberly_wishlist') || '[]');
  const idx = saved.indexOf(productId);
  if (idx > -1) {
    saved.splice(idx, 1);
    showToast('Removed from Saved Gear');
  } else {
    saved.push(productId);
    showToast('Saved to My Account Saved Gear');
  }
  localStorage.setItem('emberly_wishlist', JSON.stringify(saved));
  updateWishlistUI();
  if (window.EmberlyAccount) {
    window.EmberlyAccount.renderSavedGear();
  }
};

function updateWishlistUI() {
  const saved = JSON.parse(localStorage.getItem('emberly_wishlist') || '[]');
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.getAttribute('data-product-id');
    const heartBtn = card.querySelector('.product-wishlist-btn');
    if (heartBtn) {
      heartBtn.classList.toggle('active', saved.includes(id));
      const icon = heartBtn.querySelector('i');
      if (icon) {
        icon.className = saved.includes(id) ? 'ph-fill ph-heart' : 'ph ph-heart';
      }
    }
  });
}
