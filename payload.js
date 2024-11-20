(function () {
    // Utility function to extract text content
    function getText(selector) {
      const element = document.querySelector(selector);
      return element ? element.textContent.trim() : 'N/A';
    }

    // Utility function to extract attribute values
    function getAttribute(selector, attribute) {
      const element = document.querySelector(selector);
      return element ? element.getAttribute(attribute) : 'N/A';
    }

    function getBirthday() {
      const birthdaySection = Array.from(document.querySelectorAll('section.pv-contact-info__contact-type'))
        .find(section => section.querySelector('h3')?.textContent.trim() === 'Birthday');

      if (birthdaySection) {
        const birthdayElement = birthdaySection.querySelector('span.t-black.t-normal');
        return birthdayElement ? birthdayElement.textContent.trim() : 'N/A';
      }
      return 'N/A';
    }

    // Collect the data using updated selectors
    const profileData = {
      name: getText('h1.text-heading-xlarge.inline.t-24.v-align-middle.break-words'),
      title: getText('div.text-body-medium.break-words[data-generated-suggestion-target]'),
      location: getText('span.text-body-small.inline.t-black--light.break-words'),
      email: getAttribute('a[href^="mailto:"]', 'href').replace('mailto:', ''),
      website: getAttribute('a[href^="https://github.com/"]', 'href'),
      phone: getText('section.pv-contact-info__contact-type ul li span.t-black'),
      bio: getText('div.inline-show-more-text--is-collapsed.inline-show-more-text--is-collapsed-with-line-clamp.full-width span[aria-hidden="true"]'),
      birthday: getBirthday()
    };

    // Send the profile data to the popup.js
    chrome.runtime.sendMessage({ type: 'profileData', data: profileData });
})();
