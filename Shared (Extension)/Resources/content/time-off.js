// @ts-check
// Time off request form population

/**
 * Populate time off date fields from URL parameters
 */
function populateTimeOffDates() {
  console.log('Attempting to populate time off dates from URL');

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const startDate = urlParams.get('start');
  const endDate = urlParams.get('end');

  console.log('URL parameters:', { startDate, endDate });

  if (!startDate || !endDate) {
    console.log('No date parameters found in URL');
    return;
  }

  /**
   * Format date to various formats that BambooHR might expect
   * @param {string} dateStr - Date string in YYYY-MM-DD format
   * @returns {{iso: string, formatted: string, us: string}} - Different date formats
   */
  const formatDateForBamboo = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthName = monthNames[date.getMonth()];

    return {
      iso: dateStr, // YYYY-MM-DD
      formatted: `${day} ${monthName} ${year}`, // "20 Jan 2026"
      us: `${month}/${day}/${year}`, // MM/DD/YYYY
    };
  };

  const startFormats = formatDateForBamboo(startDate);
  const endFormats = formatDateForBamboo(endDate);

  console.log('Formatted dates:', { start: startFormats, end: endFormats });

  let attemptCount = 0;
  const maxAttempts = 50; // Try for ~5 seconds

  // Wait for form to load and try to populate fields
  const observer = new MutationObserver(() => {
    attemptCount++;

    // Look for date input fields - we need to discover their actual selectors
    const allInputs = document.querySelectorAll('input');

    if (attemptCount === 1) {
      console.log('Found total inputs:', allInputs.length);
    }

    // Look for date-related inputs
    let startField = /** @type {HTMLInputElement | null} */ (null);
    let endField = /** @type {HTMLInputElement | null} */ (null);

    allInputs.forEach((input, index) => {
      const htmlInput = /** @type {HTMLInputElement} */ (input);
      const name = htmlInput.name || '';
      const id = htmlInput.id || '';
      const placeholder = htmlInput.placeholder || '';
      const ariaLabel = htmlInput.getAttribute('aria-label') || '';

      // Log potential date fields
      if (
        attemptCount <= 3 &&
        (name.toLowerCase().includes('date') ||
          name.toLowerCase().includes('start') ||
          name.toLowerCase().includes('end') ||
          id.toLowerCase().includes('date') ||
          placeholder.toLowerCase().includes('date') ||
          ariaLabel.toLowerCase().includes('date'))
      ) {
        console.log(`Input ${index}:`, {
          type: htmlInput.type,
          name: name,
          id: id,
          className: htmlInput.className,
          placeholder: placeholder,
          ariaLabel: ariaLabel,
          value: htmlInput.value,
        });
      }

      // Identify start and end fields
      if (
        name.toLowerCase().includes('start') ||
        id.toLowerCase().includes('start') ||
        placeholder.toLowerCase().includes('start') ||
        ariaLabel.toLowerCase().includes('start')
      ) {
        startField = htmlInput;
      }

      if (
        name.toLowerCase().includes('end') ||
        id.toLowerCase().includes('end') ||
        placeholder.toLowerCase().includes('end') ||
        ariaLabel.toLowerCase().includes('end')
      ) {
        endField = htmlInput;
      }
    });

    if (startField && endField) {
      console.log('Found date fields!', {
        startField: {
          name: startField.name,
          id: startField.id,
          type: startField.type,
        },
        endField: { name: endField.name, id: endField.id, type: endField.type },
      });

      // Try different approaches to set the value
      const trySetValue = (
        /** @type {HTMLInputElement} */ field,
        /** @type {typeof startFormats} */ formats
      ) => {
        // Try formatted date first (what BambooHR seems to expect)
        field.value = formats.formatted;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));

        // If still empty, try other formats
        setTimeout(() => {
          if (!field.value || field.value === '20 mon yyyy') {
            console.log('Trying ISO format');
            field.value = formats.iso;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, 100);

        setTimeout(() => {
          if (!field.value || field.value === '20 mon yyyy') {
            console.log('Trying US format');
            field.value = formats.us;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, 200);

        // Try clicking to trigger any datepicker
        field.click();
        field.focus();
      };

      trySetValue(startField, startFormats);
      trySetValue(endField, endFormats);

      console.log('Date fields populated with formatted dates');
      observer.disconnect();
    } else if (attemptCount >= maxAttempts) {
      console.log('Failed to find date fields after', attemptCount, 'attempts');
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Also try immediately
  setTimeout(() => {
    const allInputs = document.querySelectorAll('input');
    console.log('Immediate check - total inputs:', allInputs.length);
  }, 1000);
}
