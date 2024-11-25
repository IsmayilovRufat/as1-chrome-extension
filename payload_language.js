(function () {
    function extractLanguageDetails() {
      const listItems = document.querySelectorAll('li.pvs-list__paged-list-item');
      const languageDetails = [];
  
      listItems.forEach((li) => {
        try {
          const languageElement = li.querySelector('div.mr1.t-bold span[aria-hidden="true"]');
          const proficiencyElement = li.querySelector('span.t-14.t-normal span[aria-hidden="true"]');
  
          if (languageElement && proficiencyElement) {
            const language = languageElement.textContent.trim();
            const proficiency = proficiencyElement.textContent.trim();
            languageDetails.push(`${language}: ${proficiency}`);
          }
        } catch (error) {
          console.error('Error extracting language details:', error);
        }
      });
  
      return languageDetails;
    }
  
    const languageDetails = extractLanguageDetails();
  
    // Save the extracted data to profile data via runtime message
    chrome.runtime.sendMessage({ type: 'profileData', data: { languages: languageDetails } }, (response) => {
      if (response.status === 'success') {
        console.log('Languages saved successfully!');
      } else {
        console.error('Failed to save languages:', response.error);
      }
    });
  })();
      