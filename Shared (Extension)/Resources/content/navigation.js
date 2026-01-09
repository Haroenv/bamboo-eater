// @ts-check
// Navigation and sidebar functionality

/**
 * Add calendar link to the sidebar navigation
 */
function addCalendarLinkToSidebar() {
  let attemptCount = 0;
  const maxAttempts = 100; // Try for ~10 seconds

  // Wait for sidebar to load
  const observer = new MutationObserver(() => {
    attemptCount++;

    const navLinks = document.querySelector('.fabric-1ks1eua-links');

    if (attemptCount === 1 || attemptCount === 10 || attemptCount === 50) {
      console.log(
        `Attempt ${attemptCount}: Looking for sidebar. Found:`,
        !!navLinks
      );
    }

    if (navLinks && !document.getElementById('bamboo-calendar-link')) {
      console.log('Found sidebar navigation, adding calendar link');
      createCalendarLink(navLinks);
      observer.disconnect();
    } else if (attemptCount >= maxAttempts) {
      console.log('Failed to find sidebar after', attemptCount, 'attempts');
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Also try immediately in case it's already loaded
  const navLinks = document.querySelector('.fabric-1ks1eua-links');
  if (navLinks && !document.getElementById('bamboo-calendar-link')) {
    console.log('Sidebar already loaded, adding calendar link immediately');
    createCalendarLink(navLinks);
  } else {
    console.log('Sidebar not yet loaded, waiting for it...');
  }
}

/**
 * Create and insert the calendar link in the sidebar
 * @param {Element} navLinks - The navigation links container element
 */
function createCalendarLink(navLinks) {
  console.log('Adding calendar link to sidebar');

  // Get the company subdomain from URL
  const [companySubdomain] = window.location.hostname.split('.');

  // Check if we're currently on the calendar page
  const isActive = window.location.href.includes('/calendar');
  // nav works differently, so we hide the text
  const isBrokenPage = window.location.href.includes(
    '/app/time_off/requests/create'
  );

  // Create the calendar link element matching BambooHR's structure
  const calendarLinkItem = document.createElement('li');
  calendarLinkItem.id = 'bamboo-calendar-link';
  calendarLinkItem.innerHTML = `
    <a class="bamboo-extension-calendar-link${
      isActive ? ' bamboo-extension-calendar-link--active' : ''
    }" href="https://${companySubdomain}.bamboohr.com/calendar" aria-label="Calendar">
      <div class="bamboo-extension-calendar-container">
        <span class="bamboo-extension-calendar-icon">
          <svg aria-hidden="true" fill="currentColor" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"></path>
          </svg>
        </span>
        <div class="bamboo-extension-calendar-text" ${
          isBrokenPage ? 'hidden' : ''
        }>Calendar</div>
      </div>
    </a>
  `;

  // Append to the end of the navigation links
  navLinks.appendChild(calendarLinkItem);

  console.log('Calendar link added to sidebar');
}
