function loadLanguages() {
  chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
    const storedData = response.data || {};
    const languages = storedData.languages || [];
    const languagesTextarea = document.getElementById('languagesTextarea');
    languagesTextarea.value = languages.join('\n');   
  });
}

function resetLanguagesData() {
  chrome.tabs.executeScript(null, { file: 'payload_language.js' }, () => {
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
        const languages = response.data.languages || [];
        const languagesTextarea = document.getElementById('languagesTextarea');
        languagesTextarea.value = languages.join('\n');
        alert('Language data has been reset and reloaded!');
      });
    }); // Add a delay to ensure payload script execution
  });
}

function saveLanguages() {
  const languagesTextarea = document.getElementById("languagesTextarea");
  const languages = languagesTextarea.value
    .split("\n")
    .map((cert) => cert.replace(/^•\s*/, "").trim()) // Remove bullet points and trim
    .filter((cert) => cert); // Remove empty values

  const selectedProfile = localStorage.getItem("selectedProfile"); // Get the current profile
  if (!selectedProfile) {
    alert("Please select a profile first.");
    return;
  }

  // Fetch existing profile data, update languages, and save
  chrome.runtime.sendMessage(
    { type: "getProfileData", profileName: selectedProfile },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error fetching profile data:", chrome.runtime.lastError.message);
        return;
      }

      const profiles = response.data || {};
      const profileData = profiles[selectedProfile] || {};

      profileData.languages = languages; // Update languages for the current profile
      profiles[selectedProfile] = profileData;

      chrome.runtime.sendMessage({ type: "profileData", data: profiles }, (saveResponse) => {
        if (saveResponse.status === "success") {
          alert("Languages saved successfully!");
          console.log(`Updated languages for profile "${selectedProfile}":`, languages);
        } else {
          console.error("Failed to save languages:", saveResponse.message);
        }
      });
    }
  );
}

window.addEventListener('load', () => {
  document.getElementById('refreshLanguagesBtn').addEventListener('click', resetLanguagesData);
  document.getElementById('saveLanguagesBtn').addEventListener('click', saveLanguages);
  loadLanguages();
});