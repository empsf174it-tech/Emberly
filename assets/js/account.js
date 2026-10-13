/**
 * Emberly My Account Slide-Over Panel Engine
 * Page-Budget Tradeoff: Replaces standalone dashboard with high-fidelity slide-over panel.
 * Tabs:
 * 1. Orders: Demo order history with status, items, reorder button
 * 2. Saved Gear: Wishlist persisted per user in localStorage
 * 3. Subscriptions: Active subscription management (pause/modify demo)
 * 4. Profile: User details and validated address updates, logout
 */

class EmberlyAccountManager {
  constructor() {
    this.backdrop = document.getElementById('account-drawer-backdrop');
    this.drawer = document.getElementById('account-drawer');
    this.closeBtn = document.getElementById('account-close-btn');

    this.initDOM();
    this.bindEvents();
    this.updateNavSession();
  }

  initDOM() {
    if (!this.drawer) return;

    this.tabs = this.drawer.querySelectorAll('.account-tab-btn');
    this.panes = this.drawer.querySelectorAll('.account-tab-pane');
    this.ordersContainer = document.getElementById('account-orders-list');
    this.wishlistContainer = document.getElementById('account-wishlist-grid');
    this.subContainer = document.getElementById('account-subscription-pane');
    this.profileForm = document.getElementById('account-profile-form');
    this.logoutBtn = document.getElementById('account-logout-btn');
  }

  bindEvents() {
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

    if (this.tabs) {
      this.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          this.tabs.forEach(t => t.classList.remove('active'));
          this.panes.forEach(p => p.classList.remove('active'));

          tab.classList.add('active');
          const target = document.getElementById(tab.getAttribute('data-target'));
          if (target) target.classList.add('active');
        });
      });
    }

    if (this.profileForm) {
      this.profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProfile();
      });
    }

    if (this.logoutBtn) {
      this.logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }
  }

  openDrawer(initialTab = 'pane-orders') {
    if (!this.drawer || !this.backdrop) return;

    // Check if user is logged in; if not, send to auth
    const user = this.getUser();
    if (!user) {
      window.location.href = 'auth.html';
      return;
    }

    this.renderOrders();
    this.renderSavedGear();
    this.renderSubscription();
    this.populateProfileForm();

    // Select initial tab
    this.tabs.forEach(t => {
      const isTarget = t.getAttribute('data-target') === initialTab;
      t.classList.toggle('active', isTarget);
    });
    this.panes.forEach(p => {
      p.classList.toggle('active', p.id === initialTab);
    });

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

  getUser() {
    try {
      return JSON.parse(localStorage.getItem('emberly_user') || 'null');
    } catch (e) {
      return null;
    }
  }

  updateNavSession() {
    const user = this.getUser();
    const navAuthButtons = document.querySelectorAll('.nav-auth-btn');

    navAuthButtons.forEach(btn => {
      if (user) {
        btn.innerHTML = `<i class="ph ph-user"></i> My Account`;
        btn.setAttribute('href', '#account');
        btn.onclick = (e) => {
          e.preventDefault();
          this.openDrawer();
        };
      } else {
        btn.innerHTML = `<i class="ph ph-sign-in"></i> Sign In`;
        btn.setAttribute('href', 'auth.html');
        btn.onclick = null;
      }
    });
  }

  renderOrders() {
    if (!this.ordersContainer) return;

    const orders = JSON.parse(localStorage.getItem('emberly_orders') || JSON.stringify(INITIAL_DEMO_ORDERS));

    if (orders.length === 0) {
      this.ordersContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <i class="ph ph-receipt" style="font-size: 2.5rem; color: var(--color-text-muted); margin-bottom: 8px; display: inline-block;"></i>
          <h4>No Order History Yet</h4>
          <p style="font-size: 0.9rem;">Your lab equipment shipments will show here.</p>
        </div>
      `;
      return;
    }

    let html = '';
    orders.forEach(order => {
      html += `
        <div class="order-history-card">
          <div class="order-header-row">
            <div>
              <strong style="font-family: var(--font-serif); font-size: 1.05rem;">${order.id}</strong>
              <div style="font-size: 0.8rem; color: var(--color-text-muted);">${order.date}</div>
            </div>
            <div style="text-align: right;">
              <span class="badge badge-stock">${order.status}</span>
              <div class="tabular-nums" style="font-weight: 600; font-size: 0.95rem; margin-top: 4px;">${CURRENCY}${order.total.toFixed(2)}</div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; margin: 12px 0;">
            ${order.items.map(it => `
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem;">
                <span style="display: flex; align-items: center; gap: 8px;">
                  <img src="${it.image}" alt="${it.name}" style="width: 32px; height: 32px; border-radius: 4px; object-fit: cover;" />
                  ${it.name} <strong class="tabular-nums">× ${it.qty}</strong>
                </span>
                <span class="tabular-nums">${CURRENCY}${(it.price * it.qty).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" style="width: 100%;" onclick="EmberlyAccount.reorder('${order.id}')">
            <i class="ph ph-arrows-clockwise"></i> Reorder All Items
          </button>
        </div>
      `;
    });

    this.ordersContainer.innerHTML = html;
  }

  reorder(orderId) {
    const orders = JSON.parse(localStorage.getItem('emberly_orders') || JSON.stringify(INITIAL_DEMO_ORDERS));
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    order.items.forEach(it => {
      EmberlyCart.addItem(it.id, it.qty, false);
    });

    this.closeDrawer();
    EmberlyCart.openDrawer();
    showToast(`Items from order ${orderId} added to cart!`);
  }

  renderSavedGear() {
    if (!this.wishlistContainer) return;

    const savedIds = JSON.parse(localStorage.getItem('emberly_wishlist') || '[]');
    const savedProducts = savedIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

    if (savedProducts.length === 0) {
      this.wishlistContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <i class="ph ph-heart-break" style="font-size: 2.5rem; color: var(--color-text-muted); margin-bottom: 8px; display: inline-block;"></i>
          <h4>No Saved Gear</h4>
          <p style="font-size: 0.9rem;">Click the heart icon on any product to save it to your bench wishlist.</p>
        </div>
      `;
      return;
    }

    let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
    savedProducts.forEach(prod => {
      html += `
        <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--color-secondary); border-radius: var(--radius); border: 1px solid var(--color-border);">
          <img src="${prod.image}" alt="${prod.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius);" />
          <div style="flex-grow: 1;">
            <div style="font-size: 0.9rem; font-weight: 600;">${prod.name}</div>
            <div class="tabular-nums" style="font-family: var(--font-serif); color: var(--color-accent); font-size: 0.95rem;">${CURRENCY}${prod.price.toFixed(2)}</div>
          </div>
          <button type="button" class="btn btn-primary btn-sm" onclick="EmberlyCart.addItem('${prod.id}', 1); showToast('Added to cart!');" ${prod.stock <= 0 ? 'disabled' : ''}>
            Add to Cart
          </button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="toggleWishlist('${prod.id}')" aria-label="Remove from wishlist">
            <i class="ph ph-trash"></i>
          </button>
        </div>
      `;
    });
    html += '</div>';

    this.wishlistContainer.innerHTML = html;
  }

  renderSubscription() {
    if (!this.subContainer) return;

    const sub = JSON.parse(localStorage.getItem('emberly_sub') || JSON.stringify(INITIAL_DEMO_SUBSCRIPTION));

    this.subContainer.innerHTML = `
      <div style="border: 1px solid var(--color-border); border-radius: var(--radius); padding: 20px; background: var(--color-secondary); margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
          <h4 style="margin: 0;">${sub.name}</h4>
          <span class="badge ${sub.status === 'Active' ? 'badge-stock' : 'badge-low-stock'}">${sub.status}</span>
        </div>

        <p style="font-size: 0.88rem; margin-bottom: 12px;">
          <strong>Frequency:</strong> ${sub.frequency} · <strong>Price:</strong> ${CURRENCY}${sub.price.toFixed(2)}/cycle
        </p>

        <p style="font-size: 0.88rem; margin-bottom: 12px;">
          <strong>Quantity:</strong> ${sub.quantity}
        </p>

        <div style="background: rgba(195, 122, 56, 0.1); border-left: 3px solid var(--color-accent); padding: 10px; border-radius: 0 var(--radius) var(--radius) 0; font-size: 0.82rem; margin-bottom: 16px;">
          <strong>Upcoming Roast Batch:</strong> ${sub.nextRoast}<br />
          <em>${sub.originPreview}</em>
        </div>

        <div style="display: flex; gap: 8px;">
          <button type="button" class="btn btn-secondary btn-sm" style="flex: 1;" onclick="EmberlyAccount.toggleSubStatus()">
            ${sub.status === 'Active' ? 'Pause Shipments' : 'Resume Shipments'}
          </button>
          <button type="button" class="btn btn-secondary btn-sm" style="flex: 1;" onclick="showToast('Frequency change settings saved for next roast cycle')">
            Modify Frequency
          </button>
        </div>
      </div>

      <div style="text-align: center; font-size: 0.82rem; color: var(--color-text-muted);">
        Want to add paper filters or change origins? Explore our <a href="services.html#subscriptions" style="color: var(--color-accent); text-decoration: underline;" onclick="EmberlyAccount.closeDrawer()">Subscription Plans</a>.
      </div>
    `;
  }

  toggleSubStatus() {
    const sub = JSON.parse(localStorage.getItem('emberly_sub') || JSON.stringify(INITIAL_DEMO_SUBSCRIPTION));
    sub.status = sub.status === 'Active' ? 'Paused' : 'Active';
    localStorage.setItem('emberly_sub', JSON.stringify(sub));
    this.renderSubscription();
    showToast(`Subscription status updated to: ${sub.status}`);
  }

  populateProfileForm() {
    const user = this.getUser();
    if (!user) return;

    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const streetInput = document.getElementById('profile-street');
    const cityInput = document.getElementById('profile-city');
    const zipInput = document.getElementById('profile-zip');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';

    const address = user.address || {};
    if (streetInput) streetInput.value = address.street || '';
    if (cityInput) cityInput.value = address.city || 'Seattle';
    if (zipInput) zipInput.value = address.zip || '98101';
  }

  saveProfile() {
    const user = this.getUser() || {};
    const name = document.getElementById('profile-name').value.trim();
    const email = document.getElementById('profile-email').value.trim();
    const street = document.getElementById('profile-street').value.trim();
    const city = document.getElementById('profile-city').value.trim();
    const zip = document.getElementById('profile-zip').value.trim();

    if (!name || !email) {
      showToast('Name and email are required.');
      return;
    }

    user.name = name;
    user.email = email;
    user.address = { street, city, zip };

    localStorage.setItem('emberly_user', JSON.stringify(user));
    showToast('Profile information successfully updated.');
  }

  logout() {
    localStorage.removeItem('emberly_user');
    this.closeDrawer();
    this.updateNavSession();
    showToast('Signed out of demo session.');
    window.location.reload();
  }
}

// Global initialization
window.EmberlyAccount = new EmberlyAccountManager();
