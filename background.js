chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'profileData') {
    chrome.storage.local.get('profileData', (result) => {
      const currentData = result.profileData || {};
      const updatedData = { ...currentData, ...message.data };

      chrome.storage.local.set({ profileData: updatedData }, () => {
        sendResponse({ status: 'success', message: 'Profile data saved.' });
      });
    });
    return true; // Keep the message channel open
  } else if (message.type === 'getProfileData') {
    chrome.storage.local.get('profileData', (result) => {
      sendResponse({ status: 'success', data: result.profileData || {} });
    });
    return true; // Keep the message channel open
  } else if (message.type === 'certificatesData') {
    chrome.storage.local.get('profileData', (result) => {
      const currentData = result.profileData || {};
      currentData.certificates = message.data;

      chrome.storage.local.set({ profileData: currentData }, () => {
        sendResponse({ status: 'success', message: 'Certificates data saved.' });
      });
    });
    return true; // Keep the message channel open
  } else if (message.type === 'experiencesData') {
    chrome.storage.local.get('profileData', (result) => {
      const currentData = result.profileData || {};
      currentData.experiences = message.data;
  
      chrome.storage.local.set({ profileData: currentData }, () => {
        sendResponse({ status: 'success', message: 'Experiences data saved.' });
      });
    });
    return true; // Keep the message channel open
  }
});
