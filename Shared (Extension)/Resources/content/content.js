// @ts-check
// Content script that runs on web pages
// Main initialization - depends on functions from other modules loaded first

console.log('Bamboo extension content script loaded');

/**
 * Message listener for communication with background script or popup
 * @param {Message} message - The message received
 * @param {chrome.runtime.MessageSender} sender - Message sender info
 * @param {(response: MessageResponse) => void} sendResponse - Function to send response
 * @returns {boolean} - True to keep the message channel open
 */
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in content script:', message);
  sendResponse({ status: 'received' });
  return true;
});

/**
 * Initialize the extension functionality
 */
function initExtension() {
  console.log('Initializing Bamboo extension on:', window.location.href);

  // Add calendar link to sidebar on all BambooHR pages
  if (window.location.href.includes('.bamboohr.com')) {
    addCalendarLinkToSidebar();
  }

  // If the page is *.bamboohr.com/calendar, add time off button and enable date selection
  if (window.location.href.includes('.bamboohr.com/calendar')) {
    addTimeOffButton();
    enableDateSelection();
  }

  // If on time off request page, try to populate dates from URL
  if (window.location.href.includes('/app/time_off/requests/create')) {
    populateTimeOffDates();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExtension);
} else {
  initExtension();
}
