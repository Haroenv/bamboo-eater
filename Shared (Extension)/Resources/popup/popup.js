// @ts-check

/**
 * Initialize popup functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  const actionButton = document.getElementById('actionButton');

  if (!actionButton) {
    console.error('Action button not found');
    return;
  }

  actionButton.addEventListener('click', () => {
    console.log('Button clicked in popup');

    // Send message to background script
    browser.runtime
      .sendMessage({ action: 'buttonClicked' })
      .then((/** @type {MessageResponse} */ response) => {
        console.log('Response from background:', response);
      })
      .catch((/** @type {Error} */ error) => {
        console.error('Error:', error);
      });
  });
});
