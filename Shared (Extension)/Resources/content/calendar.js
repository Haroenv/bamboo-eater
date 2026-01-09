// @ts-check
// Calendar-related functionality

/**
 * Add the time off request button to the calendar page
 */
function addTimeOffButton() {
  console.log('Adding time off request button');

  // Wait for the filter section to load
  const observer = new MutationObserver(() => {
    const filterSection = document.querySelector(
      '.CalendarMenu__filterControls'
    );
    if (filterSection && !document.getElementById('bamboo-timeoff-button')) {
      createTimeOffButton(filterSection);
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Also try immediately in case it's already loaded
  const filterSection = document.querySelector('.CalendarMenu__filterControls');
  if (filterSection && !document.getElementById('bamboo-timeoff-button')) {
    createTimeOffButton(filterSection);
  }
}

/**
 * Create and insert the time off request button
 * @param {Element} filterSection - The filter controls container element
 */
function createTimeOffButton(filterSection) {
  // Get the company subdomain from URL
  const [companySubdomain] = window.location.hostname.split('.');

  // Create button element
  const button = document.createElement('a');
  button.id = 'bamboo-timeoff-button';
  button.href = `https://${companySubdomain}.bamboohr.com/app/time_off/requests/create`;
  button.className = 'bamboo-extension-timeoff-button';
  button.innerHTML = `
    <svg aria-hidden="true" fill="currentColor" height="20" width="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
    Request Time Off
  `;

  if (filterSection && filterSection.parentElement) {
    filterSection.appendChild(button);
    console.log('Time off button added');
  }
}
