/**
 * Emberly Contact & Consultation Booking Form Validation
 * Includes real-time character counter, consent validation,
 * inline error/success states, and consultation booking handlers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initConsultationForm();
});

/* ==========================================================================
   CONTACT ENQUIRY FORM (contact.html)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-enquiry-form');
  const messageInput = document.getElementById('contact-message');
  const charCounter = document.getElementById('contact-char-count');
  const consentBox = document.getElementById('contact-consent');
  const successBanner = document.getElementById('contact-success-banner');

  if (!form) return;

  // Live character counter
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 500 characters`;
      if (len > 500) {
        charCounter.style.color = 'var(--color-error)';
      } else {
        charCounter.style.color = 'var(--color-text-muted)';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const topic = document.getElementById('contact-topic');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate Name
    if (!name.value.trim()) {
      showError(name, 'Full name is required.');
      isValid = false;
    } else {
      clearError(name);
    }

    // Validate Email
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      showError(email, 'Please provide a valid email address.');
      isValid = false;
    } else {
      clearError(email);
    }

    // Validate Topic
    if (!topic.value) {
      showError(topic, 'Please select a topic.');
      isValid = false;
    } else {
      clearError(topic);
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.length > 500) {
      showError(messageInput, 'Message is required (max 500 characters).');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    // Validate Consent Checkbox
    if (!consentBox.checked) {
      showToast('You must consent to privacy terms before sending.');
      isValid = false;
    }

    if (!isValid) return;

    // Demo success state
    form.style.display = 'none';
    if (successBanner) {
      successBanner.style.display = 'block';
    }
    showToast('Enquiry received! Our lab will respond within 4 hours.');
  });

  function showError(input, msg) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    const parent = input.closest('.form-group');
    if (parent) {
      let fb = parent.querySelector('.form-feedback');
      if (fb) {
        fb.textContent = msg;
        fb.classList.add('show');
      }
    }
  }

  function clearError(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    const parent = input.closest('.form-group');
    if (parent) {
      let fb = parent.querySelector('.form-feedback');
      if (fb) {
        fb.classList.remove('show');
      }
    }
  }
}

/* ==========================================================================
   BREW CONSULTATION BOOKING FORM (services.html #consultations)
   ========================================================================== */
function initConsultationForm() {
  const consultForm = document.getElementById('consultation-booking-form');
  const consultSuccess = document.getElementById('consultation-success-state');

  if (!consultForm) return;

  consultForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('consult-name');
    const email = document.getElementById('consult-email');
    const date = document.getElementById('consult-date');
    const time = document.getElementById('consult-time');
    const barista = document.getElementById('consult-barista');

    if (!name.value.trim() || !email.value.trim() || !date.value || !time.value) {
      showToast('Please fill out all required appointment fields.');
      return;
    }

    consultForm.style.display = 'none';
    if (consultSuccess) {
      consultSuccess.innerHTML = `
        <div style="background: #EBF5EE; border: 1px solid var(--color-success); border-radius: var(--radius); padding: 24px; text-align: center;">
          <i class="ph ph-calendar-check" style="font-size: 3rem; color: var(--color-success); margin-bottom: 12px; display: inline-block;"></i>
          <h3 style="color: var(--color-success); margin-bottom: 8px;">1-on-1 Lab Consultation Confirmed!</h3>
          <p style="font-size: 0.95rem; margin-bottom: 12px;">
            Booked with <strong>${barista.options[barista.selectedIndex].text}</strong> on <strong>${date.value}</strong> at <strong>${time.value}</strong>.
          </p>
          <p style="font-size: 0.85rem; color: var(--color-text-muted);">
            A calendar invite and virtual bench preparation guide have been sent to <strong>${email.value}</strong>.
          </p>
        </div>
      `;
      consultSuccess.style.display = 'block';
    }

    showToast('Consultation session reserved.');
  });
}
