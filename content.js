(function () {
    // Utility function to escape and wrap text in quotes
    function escapeCSV(value) {
        if (value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`; // Escape existing quotes by doubling them
        }
        return value;
    }

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
        // Locate the section containing the "Birthday" header
        const birthdaySection = Array.from(document.querySelectorAll('section.pv-contact-info__contact-type'))
            .find(section => section.querySelector('h3')?.textContent.trim() === 'Birthday');

        // Extract the birthday if the section exists
        if (birthdaySection) {
            const birthdayElement = birthdaySection.querySelector('span.t-black.t-normal');
            return birthdayElement ? birthdayElement.textContent.trim() : 'N/A';
        }
        return 'N/A';
    }

    // Collect the data using updated selectors
    const profileData = {
        name: getText('h1.text-heading-xlarge.inline.t-24.v-align-middle.break-words'), // Name
        title: getText('div.text-body-medium.break-words[data-generated-suggestion-target]'), // Title
        location: getText('span.text-body-small.inline.t-black--light.break-words'), // Location
        email: getAttribute('a[href^="mailto:"]', 'href').replace('mailto:', ''), // Email
        website: getAttribute('a[href^="https://github.com/"]', 'href'), // Website
        phone: getText('section.pv-contact-info__contact-type ul li span.t-black'), // Phone
        bio: getText(
            'div.inline-show-more-text--is-collapsed.inline-show-more-text--is-collapsed-with-line-clamp.full-width span[aria-hidden="true"]'
        ), // Bio
        birthday: getBirthday() // Birthday
    };

    // Log the extracted profile data for debugging
    console.log('Profile Data:', profileData);

    // Format the profile data as CSV
    const csvData = [
        ['Name', 'Title', 'Location', 'Email', 'Website', 'Phone', 'Bio', 'Birthday'],
        [
            escapeCSV(profileData.name),
            escapeCSV(profileData.title),
            escapeCSV(profileData.location),
            escapeCSV(profileData.email),
            escapeCSV(profileData.website),
            escapeCSV(profileData.phone),
            escapeCSV(profileData.bio),
            escapeCSV(profileData.birthday)
        ]
    ]
    .map(row => row.join(','))
    .join('\n');

    // Send the CSV data to the background script for downloading
    chrome.runtime.sendMessage({ type: 'downloadCSV', data: csvData });
})();
