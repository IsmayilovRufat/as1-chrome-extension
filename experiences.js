function loadExperiences() {
  chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
    const storedData = response.data || {};
    const experiences = storedData.experiences || [];
    const experiencesTextarea = document.getElementById('experiencesTextarea');
    experiencesTextarea.value = experiences.join('\n');
  });
} 

function resetExperiencesData() {
  chrome.tabs.executeScript(null, { file: 'payload_experiences.js' }, () => {
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
        const experiences = response.data.experiences || [];
        const experiencesTextarea = document.getElementById('experiencesTextarea');
        experiencesTextarea.value = experiences.join('\n');
        alert('Experiences data has been reset and reloaded!');
      });
    });
  });
}

function saveExperiences() {
  const experiencesTextarea = document.getElementById("experiencesTextarea");
  const experiences = experiencesTextarea.value
    .split("\n")
    .map((cert) => cert.replace(/^•\s*/, "").trim()) // Remove bullet points and trim
    .filter((cert) => cert); // Remove empty values

  const selectedProfile = localStorage.getItem("selectedProfile"); // Get the current profile
  if (!selectedProfile) {
    alert("Please select a profile first.");
    return;
  }

  // Fetch existing profile data, update experiences, and save
  chrome.runtime.sendMessage(
    { type: "getProfileData", profileName: selectedProfile },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error fetching profile data:", chrome.runtime.lastError.message);
        return;
      }

      const profiles = response.data || {};
      const profileData = profiles[selectedProfile] || {};

      profileData.experiences = experiences; // Update experiences for the current profile
      profiles[selectedProfile] = profileData;

      chrome.runtime.sendMessage({ type: "profileData", data: profiles }, (saveResponse) => {
        if (saveResponse.status === "success") {
          alert("Experiences saved successfully!");
          console.log(`Updated experiences for profile "${selectedProfile}":`, experiences);
        } else {
          console.error("Failed to save experiences:", saveResponse.message);
        }
      });
    }
  );
}

window.addEventListener('load', () => {
  document.getElementById('refreshExperiencesBtn').addEventListener('click', resetExperiencesData);
  document.getElementById('saveExperiencesBtn').addEventListener('click', saveExperiences);
  loadExperiences();
});