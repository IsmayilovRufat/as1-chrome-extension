chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'fetchPageContent') {
    // Existing fetchPageContent logic
  }

  if (message.type === 'getProfileData') {
    chrome.storage.local.get('profileData', (result) => {

// Initialize a listener for incoming messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message); // Debugging log

  // Handle fetchPageContent logic if applicable
  if (message.type === 'fetchPageContent') {
    console.log('Handling fetchPageContent (not yet implemented)');
    // Add your fetchPageContent logic here if needed
    return false; // No async response required
  }

  // Fetch profile data from chrome.storage.local
  if (message.type === 'getProfileData') {
    console.log('Fetching profile data...');
    chrome.storage.local.get('profileData', (result) => {
      console.log('Profile data retrieved:', result.profileData || {});
      sendResponse({ status: 'success', data: result.profileData || {} });
    });
    return true; // Keeps the message channel open for async response
  }

  if (message.type === 'sendProfileDataViaEmail') {
    chrome.storage.local.get('profileData', (result) => {
      const profileData = result.profileData || {};

      // Example: Convert profile data to a string for the email body
      const emailBody = Object.keys(profileData)
        .map(field => `${field}: ${profileData[field]}`)
        .join('\n');

      // Construct mailto URL
      const mailtoUrl = `mailto:?subject=Profile Data&body=${encodeURIComponent(emailBody)}`;
      
      // Open the default mail client
      window.open(mailtoUrl);

  // Send profile data via email
  if (message.type === 'sendProfileDataViaEmail') {
    console.log('Sending profile data via email...');
    chrome.storage.local.get('profileData', (result) => {
      const profileData = result.profileData || {};
      const emailBody = Object.keys(profileData)
        .map((field) => `${field}: ${profileData[field]}`)
        .join('\n');
      const mailtoUrl = `mailto:?subject=Profile Data&body=${encodeURIComponent(emailBody)}`;
      console.log('Generated mailto URL:', mailtoUrl);
      window.open(mailtoUrl); // Open the default email client
      sendResponse({ status: 'success', message: 'Email sent successfully.' });
    });
    return true; // Keeps the message channel open for async response
  }

  // Handle profile data management messages
  const handleProfileData = (field, data) => {
  // Function to handle saving/updating profile data
  const handleProfileData = (field, data) => {
    console.log(`Saving profile data for field: ${field || 'entire profile'}...`);
    chrome.storage.local.get('profileData', (result) => {
      const currentData = result.profileData || {};
      if (field) {
        currentData[field] = data;
      } else {
        Object.assign(currentData, data);
      }
      chrome.storage.local.set({ profileData: currentData }, () => {
        console.log('Profile data saved:', currentData);
        sendResponse({ status: 'success', message: `${field || 'Profile'} data saved.` });
      });
    });
  };

  switch (message.type) {
    case 'profileData':
      handleProfileData(null, message.data);
      return true;

    case 'certificatesData':
      handleProfileData('certificates', message.data);
      return true;

    case 'experiencesData':
      handleProfileData('experiences', message.data);
      return true;

    case 'educationData':
      handleProfileData('education', message.data);
      return true;

    case 'languagesData':
      handleProfileData('languages', message.data);

  // Switch case to handle various message types
  switch (message.type) {
    case 'profileData':
      handleProfileData(null, message.data); // Save entire profile data
      return true; // Keeps the message channel open

    case 'certificatesData':
      handleProfileData('certificates', message.data); // Save certificates data
      return true;

    case 'experiencesData':
      handleProfileData('experiences', message.data); // Save experiences data
      return true;

    case 'educationData':
      handleProfileData('education', message.data); // Save education data
      return true;

    case 'languagesData':
      handleProfileData('languages', message.data); // Save languages data
      return true;

    default:
      console.warn('Unknown message type:', message.type);
      sendResponse({ status: 'error', message: 'Unknown message type.' });
      return false; // Close the message channel
  }
});
