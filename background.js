chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'saveProfileData') {
      // Save profile data to chrome.storage.local
      chrome.storage.local.set({ profileData: message.data }, () => {
        console.log('Profile data saved');
      });
    }
    if (message.type === 'getProfileData') {
      // Retrieve profile data from chrome.storage.local
      chrome.storage.local.get('profileData', (result) => {
        sendResponse(result.profileData || {});
      });
      return true; // Keep the message channel open
    }
  });
  