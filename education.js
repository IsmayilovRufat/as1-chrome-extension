function loadEducation() {
  chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
    const storedData = response.data || {};
    const education = storedData.education || [];
    const educationTextarea = document.getElementById('educationTextarea');
    educationTextarea.value = education.join('\n');
  });
} 

function resetEducationData() {
  chrome.tabs.executeScript(null, { file: 'payload_education.js' }, () => {
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
        const education = response.data.education || [];
        const educationTextarea = document.getElementById('educationTextarea');
        educationTextarea.value = education.join('\n');
        alert('Education data has been reset and reloaded!');
      });
    }); // Wait for the script to execute
  });
}

function saveEducation() {
  const educationTextarea = document.getElementById("educationTextarea");
  const education = educationTextarea.value
    .split("\n")
    .map((cert) => cert.replace(/^•\s*/, "").trim()) // Remove bullet points and trim
    .filter((cert) => cert); // Remove empty values

  const selectedProfile = localStorage.getItem("selectedProfile"); // Get the current profile
  if (!selectedProfile) {
    alert("Please select a profile first.");
    return;
  }

  // Fetch existing profile data, update education, and save
  chrome.runtime.sendMessage(
    { type: "getProfileData", profileName: selectedProfile },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error fetching profile data:", chrome.runtime.lastError.message);
        return;
      }

      const profiles = response.data || {};
      const profileData = profiles[selectedProfile] || {};

      profileData.education = education; // Update education for the current profile
      profiles[selectedProfile] = profileData;

      chrome.runtime.sendMessage({ type: "profileData", data: profiles }, (saveResponse) => {
        if (saveResponse.status === "success") {
          alert("Educations saved successfully!");
          console.log(`Updated educations for profile "${selectedProfile}":`, education);
        } else {
          console.error("Failed to save educations:", saveResponse.message);
        }
      });
    }
  );
}

window.addEventListener('load', () => {
  document.getElementById('refreshEducationBtn').addEventListener('click', resetEducationData);
  document.getElementById('saveEducationBtn').addEventListener('click', saveEducation);
  loadEducation();
});