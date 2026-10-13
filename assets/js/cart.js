/**
 * Emberly Cart Drawer & Multi-Step In-Drawer Checkout
 * Features:
 * - Stock-capped quantity adjustments
 * - Persistent localStorage state
 * - Free shipping progress calculator ($75 threshold)
 * - In-drawer checkout wizard: Cart -> Shipping Details -> Review/Payment -> Confirmation
 * - Guest auth gating: redirects to auth.html, returns and reopens cart drawer
 * - Decrements stock, saves order to localStorage order history
 */

class EmberlyCartManager {
  constructor() {
    this.cartKey = 'emberly_cart_items';
    this.items = this.loadCart();
    this.currentStep = 'cart'; // 'cart', 'details', 'payment', 'confirmation'
    this.lastOrderData = null;

    this.initDOM();
    this.bindEvents();
    this.updateBadge();
    this.checkUrlParams();
  }

  loadCart() {
    try {
      return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.items));
    this.updateBadge();
    this.render();
  }

  initDOM() {
    this.backdrop = document.getElementById('cart-drawer-backdrop');
    this.drawer = document.getElementById('cart-drawer');
    this.badgeEl = document.getElementById('cart-nav-badge');
    this.openBtn = document.getElementById('cart-nav-trigger');
    this.closeBtn = document.getElementById('cart-close-btn');
    this.bodyEl = document.getElementById('cart-drawer-content');
    this.footerEl = document.getElementById('cart-drawer-footer');
  }

  bindEvents() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.openDrawer());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeDrawer());
    }

    if (this.backdrop) {
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) this.closeDrawer();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.drawer && this.drawer.classList.contains('open')) {
        this.closeDrawer();
      }
    });
  }

  checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openCart') === 'true') {
      setTimeout(() => {
        this.openDrawer();
        // Clean URL without refresh
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }, 200);
    }
  }

  openDrawer() {
    if (!this.drawer || !this.backdrop) return;
    this.render();
    this.drawer.classList.add('open');
    this.backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (this.closeBtn) this.closeBtn.focus();
  }

  closeDrawer() {
    if (!this.drawer || !this.backdrop) return;
    this.drawer.classList.remove('open');
    this.backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  addItem(productId, quantity = 1, openAfter = true) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || product.stock <= 0) {
      showToast('Item is currently out of stock.');
      return;
    }

    const existing = this.items.find(item => item.id === productId);
    if (existing) {
      const newQty = existing.qty + quantity;
      if (newQty > product.stock) {
        existing.qty = product.stock;
        showToast(`Stock limit reached (${product.stock} max available).`);
      } else {
        existing.qty = newQty;
        showToast(`Updated quantity in cart.`);
      }
    } else {
      const addQty = Math.min(quantity, product.stock);
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: addQty,
        stock: product.stock
      });
      showToast(`Added ${product.name} to cart.`);
    }

    this.saveCart();
    if (openAfter) this.openDrawer();
  }

  updateQty(productId, delta) {
    const item = this.items.find(i => i.id === productId);
    if (!item) return;

    const product = PRODUCTS.find(p => p.id === productId);
    const maxStock = product ? product.stock : item.stock;

    const newQty = item.qty + delta;
    if (newQty <= 0) {
      this.removeItem(productId);
      return;
    }

    if (newQty > maxStock) {
      showToast(`Cannot exceed lab stock (${maxStock} units).`);
      return;
    }

    item.qty = newQty;
    this.saveCart();
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this.saveCart();
    showToast('Item removed from cart.');
  }

  updateBadge() {
    const count = this.items.reduce((sum, item) => sum + item.qty, 0);
    if (this.badgeEl) {
      this.badgeEl.textContent = count;
      this.badgeEl.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  getTotals() {
    const subtotal = this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }

  render() {
    if (!this.bodyEl || !this.footerEl) return;

    if (this.items.length === 0 && this.currentStep !== 'confirmation') {
      this.renderEmptyState();
      return;
    }

    if (this.currentStep === 'cart') {
      this.renderStepCart();
    } else if (this.currentStep === 'details') {
      this.renderStepDetails();
    } else if (this.currentStep === 'payment') {
      this.renderStepPayment();
    } else if (this.currentStep === 'confirmation') {
      this.renderStepConfirmation();
    }
  }

  renderEmptyState() {
    this.bodyEl.innerHTML = `
      <div class="cart-empty-state">
        <i class="ph ph-coffee"></i>
        <h3>Your Lab Cart is Empty</h3>
        <p>Explore our precision flat-burr grinders, thermal profilers, and artisan drippers.</p>
        <a href="services.html#shop" class="btn btn-primary" onclick="EmberlyCart.closeDrawer()">
          Explore Gear Shop
        </a>
      </div>
    `;
    this.footerEl.innerHTML = '';
  }

  renderStepCart() {
    const { subtotal, shipping, tax, total } = this.getTotals();
    const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    let itemsHtml = '<div class="cart-items-list">';
    this.items.forEach(item => {
      itemsHtml += `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-details">
            <span class="cart-item-title">${item.name}</span>
            <span class="cart-item-price tabular-nums">${CURRENCY}${item.price.toFixed(2)}</span>
            <div class="cart-item-controls">
              <div class="cart-qty-group">
                <button type="button" class="cart-qty-btn" onclick="EmberlyCart.updateQty('${item.id}', -1)" aria-label="Decrease quantity">-</button>
                <span class="cart-qty-val tabular-nums">${item.qty}</span>
                <button type="button" class="cart-qty-btn" onclick="EmberlyCart.updateQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" class="cart-remove-btn" onclick="EmberlyCart.removeItem('${item.id}')">
                <i class="ph ph-trash"></i> Remove
              </button>
            </div>
          </div>
        </div>
      `;
    });
    itemsHtml += '</div>';

    // Free shipping threshold banner
    let shippingBanner = '';
    if (freeShippingRemaining > 0) {
      const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
      shippingBanner = `
        <div style="background: var(--color-accent-subtle); padding: 10px 14px; border-radius: var(--radius); font-size: 0.85rem; margin-bottom: 12px;">
          Add <strong>${CURRENCY}${freeShippingRemaining.toFixed(2)}</strong> more for <strong>Free Climate-Neutral Shipping</strong>!
          <div style="height: 6px; background: rgba(0,0,0,0.08); border-radius: 3px; margin-top: 6px; overflow: hidden;">
            <div style="width: ${progress}%; height: 100%; background: var(--color-accent);"></div>
          </div>
        </div>
      `;
    } else {
      shippingBanner = `
        <div style="background: #EBF5EE; color: var(--color-success); padding: 8px 12px; border-radius: var(--radius); font-size: 0.85rem; margin-bottom: 12px; font-weight: 600;">
          <i class="ph ph-check-circle"></i> Qualified for Free Standard Shipping!
        </div>
      `;
    }

    this.bodyEl.innerHTML = shippingBanner + itemsHtml;

    this.footerEl.innerHTML = `
      <table class="cart-summary-table">
        <tbody>
          <tr>
            <td>Subtotal</td>
            <td class="tabular-nums">${CURRENCY}${subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Shipping Estimate</td>
            <td class="tabular-nums">${shipping === 0 ? 'Free' : CURRENCY + shipping.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Estimated Sales Tax (8.25% demo)</td>
            <td class="tabular-nums">${CURRENCY}${tax.toFixed(2)}</td>
          </tr>
          <tr class="cart-total-row">
            <td>Estimated Total</td>
            <td class="tabular-nums">${CURRENCY}${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <button type="button" class="btn btn-primary btn-lg" style="width: 100%;" onclick="EmberlyCart.proceedToCheckout()">
        Proceed to Checkout <i class="ph ph-arrow-right"></i>
      </button>

      <div style="display: flex; justify-content: center; gap: 16px; margin-top: 12px; font-size: 0.78rem; color: var(--color-text-muted);">
        <span><i class="ph ph-shield-check"></i> 256-Bit SSL Demo</span>
        <a href="services.html#shipping-returns" style="text-decoration: underline;" onclick="EmberlyCart.closeDrawer()">Shipping & Returns</a>
      </div>
    `;
  }

  proceedToCheckout() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('emberly_user') || 'null');
    if (!user) {
      showToast('Please sign in to complete checkout.');
      const currentUrl = window.location.pathname + '?openCart=true';
      window.location.href = `auth.html?redirect=${encodeURIComponent(currentUrl)}`;
      return;
    }

    this.currentStep = 'details';
    this.render();
  }

  renderStepDetails() {
    const user = JSON.parse(localStorage.getItem('emberly_user') || '{"name":"","email":""}');
    const savedAddress = user.address || {};

    this.bodyEl.innerHTML = `
      <div class="checkout-steps-nav">
        <span class="step-item done"><i class="ph ph-check"></i> 1. Cart</span>
        <span class="step-item active">2. Shipping Details</span>
        <span class="step-item">3. Payment</span>
      </div>

      <form id="drawer-shipping-form">
        <div class="form-group">
          <label class="form-label" for="ship-name">Recipient Full Name <span class="required">*</span></label>
          <input type="text" id="ship-name" class="form-input" required value="${savedAddress.name || user.name || ''}" placeholder="Jane Barista" />
        </div>

        <div class="form-group">
          <label class="form-label" for="ship-street">Delivery Street Address <span class="required">*</span></label>
          <input type="text" id="ship-street" class="form-input" required value="${savedAddress.street || ''}" placeholder="742 Evergreen Terrace, Apt 4" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label" for="ship-city">City <span class="required">*</span></label>
            <input type="text" id="ship-city" class="form-input" required value="${savedAddress.city || 'Seattle'}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="ship-zip">Postal Code <span class="required">*</span></label>
            <input type="text" id="ship-zip" class="form-input" required value="${savedAddress.zip || '98101'}" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="ship-speed">Shipping Method</label>
          <select id="ship-speed" class="form-select">
            <option value="standard">Standard Ground (3–5 Business Days) — Included</option>
            <option value="express">Express Air Courier (1–2 Business Days) — +$18.00</option>
          </select>
        </div>
      </form>
    `;

    this.footerEl.innerHTML = `
      <div style="display: flex; gap: 12px;">
        <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="EmberlyCart.currentStep='cart'; EmberlyCart.render();">
          Back to Cart
        </button>
        <button type="button" class="btn btn-primary" style="flex: 2;" onclick="EmberlyCart.submitShippingDetails()">
          Continue to Payment <i class="ph ph-arrow-right"></i>
        </button>
      </div>
    `;
  }

  submitShippingDetails() {
    const name = document.getElementById('ship-name').value.trim();
    const street = document.getElementById('ship-street').value.trim();
    const city = document.getElementById('ship-city').value.trim();
    const zip = document.getElementById('ship-zip').value.trim();

    if (!name || !street || !city || !zip) {
      showToast('Please fill out all required shipping fields.');
      return;
    }

    this.shippingAddress = { name, street, city, zip };
    this.currentStep = 'payment';
    this.render();
  }

  renderStepPayment() {
    const { total } = this.getTotals();

    this.bodyEl.innerHTML = `
      <div class="checkout-steps-nav">
        <span class="step-item done"><i class="ph ph-check"></i> 1. Cart</span>
        <span class="step-item done"><i class="ph ph-check"></i> 2. Shipping</span>
        <span class="step-item active">3. Payment Review</span>
      </div>

      <div style="background: var(--color-secondary); padding: 14px; border-radius: var(--radius); margin-bottom: 16px; font-size: 0.88rem;">
        <strong>Delivering to:</strong><br />
        ${this.shippingAddress.name}<br />
        ${this.shippingAddress.street}, ${this.shippingAddress.city} ${this.shippingAddress.zip}
      </div>

      <div class="badge badge-accent" style="margin-bottom: 12px;">Demo Sandbox Environment</div>
      <p style="font-size: 0.88rem; margin-bottom: 16px; color: var(--color-text-muted);">
        No real credit cards will be charged. Clicking "Place Demo Order" tests the end-to-end checkout, stores the transaction in your account, and decrements catalog inventory.
      </p>

      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
        <button type="button" class="btn btn-secondary" style="display: flex; justify-content: center; gap: 8px;" onclick="showToast('PayPal Express Demo Placeholder selected')">
          <i class="ph ph-paypal-logo"></i> PayPal 1-Click Checkout Placeholder
        </button>
        <button type="button" class="btn btn-secondary" style="display: flex; justify-content: center; gap: 8px;" onclick="showToast('Apple Pay Demo Placeholder selected')">
          <i class="ph ph-apple-logo"></i> Apple Pay Demo Placeholder
        </button>
      </div>

      <div class="form-group">
        <label class="form-label">Card Number (Demo Mock)</label>
        <input type="text" class="form-input" value="•••• •••• •••• 4242" disabled />
      </div>
    `;

    this.footerEl.innerHTML = `
      <div style="display: flex; gap: 12px;">
        <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="EmberlyCart.currentStep='details'; EmberlyCart.render();">
          Back
        </button>
        <button type="button" class="btn btn-accent btn-lg" style="flex: 2;" onclick="EmberlyCart.placeDemoOrder()">
          Place Demo Order (${CURRENCY}${total.toFixed(2)})
        </button>
      </div>
    `;
  }

  placeDemoOrder() {
    const { total } = this.getTotals();
    const orderId = 'EMB-' + Math.floor(10000 + Math.random() * 90000);
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const newOrder = {
      id: orderId,
      date: dateStr,
      status: 'Processing in Lab',
      total: total,
      items: [...this.items],
      shippingAddress: this.shippingAddress
    };

    // Save to user orders in localStorage
    const existingOrders = JSON.parse(localStorage.getItem('emberly_orders') || JSON.stringify(INITIAL_DEMO_ORDERS));
    existingOrders.unshift(newOrder);
    localStorage.setItem('emberly_orders', JSON.stringify(existingOrders));

    // Decrement catalog inventory
    this.items.forEach(cartItem => {
      const p = PRODUCTS.find(prod => prod.id === cartItem.id);
      if (p) {
        p.stock = Math.max(0, p.stock - cartItem.qty);
      }
    });

    this.lastOrderData = newOrder;
    this.items = [];
    this.saveCart();

    this.currentStep = 'confirmation';
    this.render();

    showToast(`Order ${orderId} successfully placed!`);
    if (window.EmberlyAccount) {
      window.EmberlyAccount.renderOrders();
    }
  }

  renderStepConfirmation() {
    const order = this.lastOrderData;
    if (!order) return;

    this.bodyEl.innerHTML = `
      <div style="text-align: center; padding: 24px 8px;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: #EBF5EE; color: var(--color-success); display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 16px;">
          <i class="ph ph-check-bold"></i>
        </div>
        <h3 style="margin-bottom: 8px;">Order Confirmed!</h3>
        <p style="font-size: 0.95rem; margin-bottom: 16px;">
          Thank you for choosing Emberly specialty gear. Your package is scheduled for bench inspection and dispatch.
        </p>

        <div style="background: var(--color-secondary); padding: 16px; border-radius: var(--radius); text-align: left; margin-bottom: 24px; font-size: 0.9rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <strong>Demo Order Reference:</strong>
            <span class="tabular-nums" style="font-family: var(--font-serif); font-weight: 600;">${order.id}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>Order Date:</span>
            <span>${order.date}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>Total Paid:</span>
            <span class="tabular-nums">${CURRENCY}${order.total.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Status:</span>
            <span class="badge badge-stock">${order.status}</span>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: var(--color-text-muted);">
          This demo order is now visible inside your <strong>My Account</strong> slide-over panel.
        </p>
      </div>
    `;

    this.footerEl.innerHTML = `
      <button type="button" class="btn btn-primary" style="width: 100%;" onclick="EmberlyCart.currentStep='cart'; EmberlyCart.closeDrawer();">
        Done & Continue Exploring
      </button>
    `;
  }
}

// Global initialization
window.EmberlyCart = new EmberlyCartManager();
