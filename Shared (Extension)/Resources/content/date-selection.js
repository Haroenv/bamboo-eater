// @ts-check
// Date selection functionality for calendar

/**
 * Enable date selection functionality on calendar
 */
function enableDateSelection() {
  console.log('Enabling date selection on calendar');

  /** @type {Date[]} */
  let selectedDates = [];

  // Wait for calendar to load
  const observer = new MutationObserver(() => {
    const calendar = /** @type {HTMLElement | null} */ (
      document.querySelector('[role="table"]')
    );
    if (calendar && !calendar.dataset.dateSelectionEnabled) {
      calendar.dataset.dateSelectionEnabled = 'true';
      setupDateSelection(calendar, selectedDates);
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Also try immediately
  const calendar = /** @type {HTMLElement | null} */ (
    document.querySelector('[role="table"]')
  );
  if (calendar && !calendar.dataset.dateSelectionEnabled) {
    calendar.dataset.dateSelectionEnabled = 'true';
    setupDateSelection(calendar, selectedDates);
  }
}

/**
 * Set up date selection on calendar
 * @param {Element} calendar - The calendar table element
 * @param {Date[]} selectedDates - Array to store selected dates
 */
function setupDateSelection(calendar, selectedDates) {
  /** @type {Date | null} */
  let firstDate = null;

  calendar.addEventListener('click', (e) => {
    // Find the clicked day cell
    const target = /** @type {HTMLElement | null} */ (e.target);
    const dayCell = target?.closest('.Calendar__day');
    if (!dayCell) return;

    // Get the date from aria-label (e.g., "January 13th")
    const ariaLabel = dayCell.getAttribute('aria-label');
    if (!ariaLabel) return;

    const date = parseDateFromAriaLabel(ariaLabel);
    if (!date) return;

    if (!firstDate) {
      // First click - start selection
      firstDate = date;
      selectedDates.length = 0;
      selectedDates.push(date);
      highlightDate(dayCell);
    } else {
      // Second click - complete selection
      const dateRange = getDateRange(firstDate, date);
      selectedDates.length = 0;
      selectedDates.push(...dateRange);

      // Highlight all dates in range
      clearAllHighlights();
      dateRange.forEach((d) => {
        const cell = findDayCellByDate(d);
        if (cell) highlightDate(cell);
      });

      // Redirect to time off request page with dates
      redirectToTimeOffRequest(dateRange);

      firstDate = null;
    }
  });
}

/**
 * Parse date from aria-label
 * @param {string} ariaLabel - The aria-label text
 * @returns {Date|null} - Parsed date or null
 */
function parseDateFromAriaLabel(ariaLabel) {
  // Format: "January 13th" or "Jan 1"
  const match = ariaLabel.match(/^(\w+)\s+(\d+)/);
  if (!match) return null;

  /** @type {string} */
  const monthStr = match[1];
  const day = parseInt(match[2], 10);

  // Get year from page heading
  const yearHeading = document.querySelector('h1');
  const yearMatch = yearHeading?.textContent.match(/\d{4}/);
  let year = yearMatch ? parseInt(yearMatch[0], 10) : new Date().getFullYear();

  // Parse month
  /** @type {{[key: string]: number}} */
  const monthMap = {
    January: 0,
    Jan: 0,
    February: 1,
    Feb: 1,
    March: 2,
    Mar: 2,
    April: 3,
    Apr: 3,
    May: 4,
    June: 5,
    Jun: 5,
    July: 6,
    Jul: 6,
    August: 7,
    Aug: 7,
    September: 8,
    Sep: 8,
    October: 9,
    Oct: 9,
    November: 10,
    Nov: 10,
    December: 11,
    Dec: 11,
  };

  const month = monthMap[monthStr];
  if (month === undefined) return null;

  // Handle year boundaries: only an issue when viewing January or December
  const headingText = yearHeading?.textContent || '';

  // If viewing January and see December dates, they're from previous year
  if (headingText.includes('January') && month === 11) {
    year -= 1;
  }
  // If viewing December and see January dates, they're from next year
  else if (headingText.includes('December') && month === 0) {
    year += 1;
  }

  return new Date(year, month, day);
}

/**
 * Get date range between two dates
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Date[]} - Array of dates in range
 */
function getDateRange(start, end) {
  const [startDate, endDate] = start <= end ? [start, end] : [end, start];
  const dates = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Highlight a date cell
 * @param {Element} cell - The day cell element
 */
function highlightDate(cell) {
  cell.classList.add('bamboo-extension-selected-date');
}

/**
 * Clear all date highlights
 */
function clearAllHighlights() {
  document
    .querySelectorAll('.bamboo-extension-selected-date')
    .forEach((cell) => {
      cell.classList.remove('bamboo-extension-selected-date');
    });
}

/**
 * Find day cell by date
 * @param {Date} date - The date to find
 * @returns {Element|null} - The day cell or null
 */
function findDayCellByDate(date) {
  const day = date.getDate();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthName = monthNames[date.getMonth()];

  const cells = document.querySelectorAll('.Calendar__day');
  for (const cell of cells) {
    const ariaLabel = cell.getAttribute('aria-label');
    if (
      ariaLabel &&
      ariaLabel.includes(monthName) &&
      ariaLabel.includes(String(day))
    ) {
      return cell;
    }
  }
  return null;
}

/**
 * Redirect to time off request page with date parameters
 * @param {Date[]} dates - Array of selected dates
 */
function redirectToTimeOffRequest(dates) {
  if (dates.length === 0) return;

  const [companySubdomain] = window.location.hostname.split('.');
  const startDate = dates[0];
  const endDate = /** @type {Date} */ (dates.at(-1));

  /**
   * @param {Date} d - Date to format
   * @returns {string} - Formatted date string
   */
  const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);

  // Redirect with date parameters
  window.location.href = `https://${companySubdomain}.bamboohr.com/app/time_off/requests/create?start=${startDateStr}&end=${endDateStr}`;
}
