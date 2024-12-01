// Initialize a listener for incoming messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const storageKey = "profileData";

  // Handle fetchPageContent logic if applicable
  if (message.type === 'fetchPageContent') {
    console.log('Handling fetchPageContent (not yet implemented)');
    // Add your fetchPageContent logic here if needed
    return false; // No async response required
  }

  if (message.type === "getAllProfiles") {
    chrome.storage.local.get("profileData", (result) => {
      const profiles = result.profileData || {};
      console.log("Profiles from storage in getAllProfiles:", profiles); // Debugging log
      sendResponse({ status: "success", data: profiles }); // Send back all profiles
    });
    return true; // Keeps the message channel open for async response
  } 

  // Fetch profile data from chrome.storage.local
  if (message.type === "getProfileData") {
    const profileName = message.profileName;
    chrome.storage.local.get(storageKey, (result) => {
      const profiles = result[storageKey] || {};
      const profileData = profiles[profileName] || {};
      sendResponse({ status: "success", data: profileData });
    });
    return true; // Keeps the message channel open for async response
  }

  if (message.type === 'sendProfileDataViaEmail') {
    const profileName = message.profileName;
  
    if (!profileName) {
      console.warn("No profile name specified for email.");
      sendResponse({ status: 'error', message: 'Profile name not provided.' });
      return false;
    }
  
    chrome.storage.local.get('profileData', (result) => {
      const profiles = result.profileData || {};
      const profileData = profiles[profileName];
  
      if (!profileData) {
        console.warn(`No data found for profile "${profileName}".`);
        sendResponse({ status: 'error', message: `No data found for profile "${profileName}".` });
        return;
      }
  
      // Generate the email body with all fields
      const emailBody = Object.entries(profileData)
        .map(([field, value]) => {
          if (Array.isArray(value)) {
            return `${field}: ${value.join(', ')}`;
          }
          return `${field}: ${value}`;
        })
        .join('\n');
  
      // Construct the mailto URL
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(profileName)} Profile Data&body=${encodeURIComponent(emailBody)}`;
      
      // Open the default mail client with the generated email content
      window.open(mailtoUrl);
  
      sendResponse({ status: 'success', message: `Email sent successfully for profile "${profileName}".` });
    });
  
    return true; // Keeps the message channel open for async response
  }
  

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