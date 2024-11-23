(function () {
    function extractJobDetails() {
      const listItems = document.querySelectorAll('li.pvs-list__paged-list-item');
      const jobDetails = [];
  
      listItems.forEach((li) => {
        try {
          const roleElement = li.querySelector('div > div > div > span[aria-hidden="true"]');
          const companyTypeElement = li.querySelector('span.t-14.t-normal span[aria-hidden="true"]');
          const durationElement = li.querySelector('span.t-14.t-black--light span[aria-hidden="true"]:first-child');
  
          if (roleElement && companyTypeElement && durationElement) {
            const role = roleElement.textContent.trim();
            const companyType = companyTypeElement.textContent.trim();
            const duration = durationElement.textContent.trim();
            const jobDetail = `${companyType} - ${role} - ${duration}`;
            jobDetails.push(jobDetail);
          }
        } catch (error) {
          console.error('Error extracting job details:', error);
        }
      });
  
      return jobDetails;
    }
  
    const jobDetails = extractJobDetails();
  
    // Send the extracted details to the background script
    chrome.runtime.sendMessage({ type: 'experiencesData', data: jobDetails });
  })();
  