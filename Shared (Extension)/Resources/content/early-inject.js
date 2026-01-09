// @ts-check
// Early injection script that runs before the page loads
// This intercepts the calendar data script tag and modifies it

console.log('Early inject script running');

// Set up observer to catch the calendar data script as it's added to the DOM
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      // Check if this is the calendar data script
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.nodeName === 'SCRIPT' &&
        /** @type {HTMLElement} */ (node).id === 'js-calendar-page-load-data'
      ) {
        console.log('Found calendar data script, modifying...');

        try {
          // Parse the JSON
          const calendarData = JSON.parse(node.textContent || '{}');

          // Modify the weekends filter
          if (calendarData.filters && Array.isArray(calendarData.filters)) {
            const weekendFilter = calendarData.filters.find(
              /** @param {any} filter */
              (filter) => filter.filterKey === 'weekends'
            );

            if (weekendFilter) {
              console.log('Setting weekends filter to false');
              weekendFilter.selected = false;

              // Update the script content
              node.textContent = JSON.stringify(calendarData);
              console.log(
                'Successfully modified calendar data before page initialization'
              );
            }
          }
        } catch (error) {
          console.error('Error modifying calendar data:', error);
        }

        // Disconnect observer once we've found and modified the script
        observer.disconnect();
        return;
      }
    }
  }
});

// Start observing as early as possible
observer.observe(document.documentElement || document, {
  childList: true,
  subtree: true,
});

console.log('Observer set up to intercept calendar data');
