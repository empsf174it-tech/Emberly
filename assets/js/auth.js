/**
 * Emberly Auth Engine (auth.html)
 * Handles Login and Register tabs, strict client-side validation,
 * demo session storage (name + email only; never password), and return redirects.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuthPage();
});

function initAuthPage() {
  const loginTabBtn = document.getElementById('auth-tab-login');
  const registerTabBtn = document.getElementById('auth-tab-register');
  const loginPane = document.getElementById('auth-pane-login');
  const registerPane = document.getElementById('auth-pane-register');
  const loginForm = document.getElementById('auth-login-form');
  const registerForm = document.getElementById('auth-register-form');

  // Tab switching
  function switchTab(target) {
    if (target === 'register') {
      loginTabBtn.classList.remove('active');
      loginTabBtn.setAttribute('aria-selected', 'false');
      registerTabBtn.classList.add('active');
      registerTabBtn.setAttribute('aria-selected', 'true');
      loginPane.style.display = 'none';
      registerPane.style.display = 'block';
    } else {
      registerTabBtn.classList.remove('active');
      registerTabBtn.setAttribute('aria-selected', 'false');
      loginTabBtn.classList.add('active');
      loginTabBtn.setAttribute('aria-selected', 'true');
      registerPane.style.display = 'none';
      loginPane.style.display = 'block';
    }
  }

  if (loginTabBtn) loginTabBtn.addEventListener('click', () => switchTab('login'));
  if (registerTabBtn) registerTabBtn.addEventListener('click', () => switchTab('register'));

  // Switch links inside forms
  document.querySelectorAll('.switch-to-register').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('register');
    });
  });
  document.querySelectorAll('.switch-to-login').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('login');
    });
  });

  // URL hash or param tab switch
  const params = new URLSearchParams(window.location.search);
  if (params.get('tab') === 'register') {
    switchTab('register');
  }

  // Redirect handling
  function handleAuthSuccess(userName, userEmail) {
    // Store only name and email in localStorage; NEVER password
    const demoSession = {
      name: userName || 'Specialty Brewer',
      email: userEmail || 'barista@emberlylab.com',
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem('emberly_user', JSON.stringify(demoSession));

    showToast(`Welcome, ${demoSession.name}!`);

    // Determine redirect destination
    const redirectParam = params.get('redirect');
    let targetUrl = 'index.html';
    if (redirectParam) {
      targetUrl = decodeURIComponent(redirectParam);
    }

    setTimeout(() => {
      window.location.href = targetUrl;
    }, 700);
  }

  // Validation helpers
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setInvalid(input, msg) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    const group = input.closest('.form-group');
    if (group) {
      let fb = group.querySelector('.form-feedback');
      if (fb) {
        fb.textContent = msg;
        fb.classList.add('show');
      }
    }
  }

  function setValid(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    const group = input.closest('.form-group');
    if (group) {
      let fb = group.querySelector('.form-feedback');
      if (fb) fb.classList.remove('show');
    }
  }

  // LOGIN FORM SUBMISSION
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const email = document.getElementById('login-email');
      const pass = document.getElementById('login-password');

      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        setInvalid(email, 'Please enter a valid email address.');
        valid = false;
      } else {
        setValid(email);
      }

      if (!pass.value || pass.value.length < 8) {
        setInvalid(pass, 'Password must be at least 8 characters.');
        valid = false;
      } else {
        setValid(pass);
      }

      if (!valid) return;

      const inferredName = email.value.split('@')[0].replace(/[\.\_\-]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      handleAuthSuccess(inferredName, email.value.trim());
    });
  }

  // REGISTER FORM SUBMISSION
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name = document.getElementById('reg-name');
      const email = document.getElementById('reg-email');
      const pass = document.getElementById('reg-password');
      const confirmPass = document.getElementById('reg-confirm-password');
      const terms = document.getElementById('reg-terms');

      if (!name.value.trim()) {
        setInvalid(name, 'Full name is required.');
        valid = false;
      } else {
        setValid(name);
      }

      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        setInvalid(email, 'Please enter a valid email address.');
        valid = false;
      } else {
        setValid(email);
      }

      if (!pass.value || pass.value.length < 8) {
        setInvalid(pass, 'Password must be at least 8 characters.');
        valid = false;
      } else {
        setValid(pass);
      }

      if (confirmPass.value !== pass.value || !confirmPass.value) {
        setInvalid(confirmPass, 'Passwords do not match.');
        valid = false;
      } else {
        setValid(confirmPass);
      }

      if (!terms.checked) {
        showToast('You must agree to the Terms of Service to create an account.');
        valid = false;
      }

      if (!valid) return;

      handleAuthSuccess(name.value.trim(), email.value.trim());
    });
  }

  // Demo Social Auth buttons
  window.demoSocialAuth = (provider) => {
    handleAuthSuccess(`${provider} Demo Barista`, `demo.${provider.toLowerCase()}@emberlylab.com`);
  };
}

/* Password show/hide toggles */
document.querySelectorAll('.password-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.getAttribute('aria-controls'));
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    btn.querySelector('i').className = show ? 'ph ph-eye-slash' : 'ph ph-eye';
  });
});
