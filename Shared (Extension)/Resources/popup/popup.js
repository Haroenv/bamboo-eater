// @ts-check

/**
 * Get the company subdomain from a BambooHR URL
 * @param {string} url - BambooHR URL
 * @returns {string|null} - Company subdomain or null
 */
function getCompanySubdomain(url) {
  const match = url.match(/https:\/\/([^.]+)\.bamboohr\.com/);
  return match ? match[1] : null;
}

/**
 * Initialize popup functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
  const statusText = document.getElementById('statusText');
  const requestTimeOffButton = document.getElementById('requestTimeOffButton');
  const openCalendarButton = document.getElementById('openCalendarButton');

  // Get the current active tab
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const currentTab = tabs[0];

  if (!currentTab?.url) {
    if (statusText) {
      statusText.textContent = 'Unable to detect current page';
    }
    return;
  }

  let companySubdomain = getCompanySubdomain(currentTab.url);

  // If on a BambooHR page, store it
  if (companySubdomain) {
    await browser.storage.local.set({ lastBambooSubdomain: companySubdomain });
  } else {
    // Not on BambooHR, try to get last visited subdomain
    const result = await browser.storage.local.get('lastBambooSubdomain');
    companySubdomain = result.lastBambooSubdomain || null;
  }

  // If we have no subdomain at all
  if (!companySubdomain) {
    if (statusText) {
      statusText.textContent =
        'Navigate to a BambooHR page to use this extension.';
    }
    return;
  }

  // Update status
  if (statusText) {
    const onBamboo = getCompanySubdomain(currentTab.url);
    if (onBamboo) {
      statusText.textContent = `Connected to ${companySubdomain}.bamboohr.com`;
    } else {
      statusText.textContent = `Company: ${companySubdomain}.bamboohr.com`;
    }
  }

  // Show and enable request button
  if (requestTimeOffButton) {
    requestTimeOffButton.style.display = 'block';
    requestTimeOffButton.addEventListener('click', () => {
      const url = `https://${companySubdomain}.bamboohr.com/app/time_off/requests/create`;
      browser.tabs.create({ url });
    });
  }

  // Show calendar button
  if (openCalendarButton) {
    openCalendarButton.style.display = 'block';
    openCalendarButton.addEventListener('click', () => {
      const url = `https://${companySubdomain}.bamboohr.com/calendar`;
      browser.tabs.create({ url });
    });
  }
});
