console.log("The event extension is up and running");

function cleanupElements() {
  console.log("Cleanup function called");
  
  // Remove blur-sm class
  const blurredElements = document.querySelectorAll('.blur-sm');
  blurredElements.forEach(element => {
    element.classList.remove('blur-sm');
  });

  // Remove svg with the lock icon
  const lockIcons = document.querySelectorAll('svg[data-src="https://secure.meetupstatic.com/next/images/design-system-icons/lock-outline.svg"]');
  lockIcons.forEach(icon => {
    icon.remove();
  });

  addLinkedInSearchButtons();
}

// Run initial cleanup immediately since content scripts load after the DOM is ready
cleanupElements();

// Set up a MutationObserver to handle dynamically added elements, and observe the body
const observer = new MutationObserver(cleanupElements);
observer.observe(document.body, {
    childList: true,
    subtree: true
});


// Add a button to trigger a search for an attendee on LinkedIn
function addLinkedInSearchButtons() {
  const attendeeButtons = document.querySelectorAll('button[data-event-label="attendee-card"]');
    
  attendeeButtons.forEach(button => {
      // Check if we haven't already added a LinkedIn button after this one
      if (!button.nextSibling?.classList?.contains('linkedin-search-btn')) {
          // Get the name from the p tag
          const nameElement = button.querySelector('p.font-medium');
          if (nameElement) {
              // Get text content and clean it up
              const fullName = nameElement.textContent.trim();
              
              // Create the LinkedIn button
              const linkedInButton = document.createElement('button');
              linkedInButton.textContent = 'LinkedIn';
              linkedInButton.className = 'linkedin-search-btn font-medium';
              linkedInButton.style.cssText = `
                padding: 0.65rem;
                background-color: #0A66C2;
                color: white;
                border-radius: 0.25rem;
                font-weight: 300;
                transition: background-color 200ms;
                display: flex;
                align-items: center;
                gap: 0.25rem;
                border: none;
                cursor: pointer;
              `;
              
              // Add LinkedIn icon
              const icon = document.createElement('span');
              icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                              </svg>`;
              linkedInButton.prepend(icon);
              
              // Create the LinkedIn search URL
              const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(fullName)}&origin=SWITCH_SEARCH_VERTICAL`;
              
              // Add click handler
              linkedInButton.addEventListener('click', (e) => {
                  e.preventDefault();
                  window.open(searchUrl, '_blank');
              });
              
              // Insert the button after the attendee button
              button.parentNode.insertBefore(linkedInButton, button.nextSibling);
          }
      }
  });
}

