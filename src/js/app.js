import initMobileNavigation from './modules/burger.js';

initMobileNavigation();

// A subscription service is not provided by this static template.
// Avoid silently accepting addresses or claiming that a subscription succeeded.
const form = document.getElementById('newsletter-form');
const status = document.getElementById('newsletter-status');
if (form && status) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = 'Newsletter subscriptions are not available online. Please contact us directly.';
  });
}
