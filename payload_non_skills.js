(function () {
    function getText(selector) {
      const element = document.querySelector(selector);
      return element ? element.textContent.trim() : '';
    }
    
    // Function to extract birthday data
    function getBirthday() {
      const birthdaySection = Array.from(document.querySelectorAll('section.pv-contact-info__contact-type'))
        .find(section => section.querySelector('h3')?.textContent.trim() === 'Birthday');

      if (birthdaySection) {
        const birthdayElement = birthdaySection.querySelector('span.t-black.t-normal');
        return birthdayElement ? birthdayElement.textContent.trim() : 'N/A';
      }
      return 'N/A';
    }

    const nonSkillsData = {
      name: getText('#pv-contact-info'),
      title: getText('div.text-body-medium.break-words[data-generated-suggestion-target]'),
      location: getText('span.text-body-small.inline.t-black--light.break-words'),
      email: getText('a[href^="mailto:"]'),
      website: getText('a[href^="https://github.com/"]'),
      phone: getText('section.pv-contact-info__contact-type ul li span.t-black'),
      bio: getText('div.inline-show-more-text--is-collapsed span[aria-hidden="true"]'),
      birthday: getBirthday()
    };
  
    chrome.runtime.sendMessage({ type: 'profileData', data: nonSkillsData });
  })();