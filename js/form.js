(() => {
  'use strict';

  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const success = document.querySelector('#form-success');

  if (!form || !status || !success) return;

  const button = form.querySelector('button[type="submit"]');
  if (!button || !window.fetch || !window.FormData || !window.AbortController) return;
  const defaultButtonText = button.textContent;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    status.textContent = '';
    button.disabled = true;
    button.textContent = 'Sending…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        signal: controller.signal,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        form.reset();
        form.hidden = true;
        success.hidden = false;
        success.focus();
        return;
      }

      if (response.status === 429) {
        throw new Error('Too many messages were submitted recently. Please wait a few minutes and try again.');
      }

      const result = await response.json().catch(() => null);
      const message = Array.isArray(result?.errors)
        ? result.errors.map((error) => error.message).filter(Boolean).join(' ')
        : result?.error;
      throw new Error(message || 'We could not send your message. Please check your information and try again.');
    } catch (error) {
      status.textContent = error.name === 'AbortError'
        ? 'The request timed out. Delivery could not be confirmed. Please wait a moment before trying again.'
        : error instanceof TypeError
          ? 'We could not connect to the form service. Please check your internet connection and try again.'
          : error.message || 'We could not send your message. Please try again.';
    } finally {
      clearTimeout(timeout);
      if (!form.hidden) {
        button.disabled = false;
        button.textContent = defaultButtonText;
      }
    }
  });
})();
