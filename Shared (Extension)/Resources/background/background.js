// @ts-check
// Background service worker for Safari extension
console.log('Background script loaded');

/**
 * Listen for messages from popup or content scripts
 * @param {Message} message - The message received
 * @param {chrome.runtime.MessageSender} sender - Message sender info
 * @param {(response: MessageResponse) => void} sendResponse - Function to send response
 * @returns {boolean} - True to keep the message channel open
 */
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background:', message);

  if (message.action === 'buttonClicked') {
    console.log('Button was clicked in popup');
    sendResponse({
      status: 'success',
      message: 'Background received the message',
    });
  }

  return true; // Keep the message channel open for async response
});

/**
 * Listen for extension installation or update
 * @param {chrome.runtime.InstalledDetails} details - Installation details
 */
browser.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason);

  if (details.reason === 'install') {
    console.log('Extension installed for the first time');
  } else if (details.reason === 'update') {
    console.log('Extension updated');
  }
});
