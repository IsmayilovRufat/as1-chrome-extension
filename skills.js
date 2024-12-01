function loadSkills() {
  const selectedProfile = localStorage.getItem("selectedProfile"); // Get the current profile
  if (!selectedProfile) {
    alert("Please select a profile first.");
    return;
  }

  // Fetch the skills for the selected profile
  chrome.runtime.sendMessage(
    { type: "getProfileData", profileName: selectedProfile },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error fetching skills data:", chrome.runtime.lastError.message);
        return;
      }

      const profileData = response.data || {};
      let skills = profileData.skills || [];

      // Exclude the last 5 lines of skills
      if (skills.length > 5) {
        skills = skills.slice(0, -5);
      }

      console.log(`Loaded skills for profile "${selectedProfile}":`, skills);

      const skillsTextarea = document.getElementById("skillsTextarea");
      skillsTextarea.value = skills.join(", "); // Display skills as a comma-separated list
    }
  );
}


function refreshSkills() {
  // Execute the LinkedIn scraping script and load the scraped skills into the text area
  chrome.tabs.executeScript(null, { file: "payload_skills.js" }, () => {
    alert("Skills refreshed! They are now loaded into the text area. Remember to click 'Save' to store them.");
    loadSkills(); // Reload skills after scraping
  });
}

function saveSkills() {
  const skillsTextarea = document.getElementById("skillsTextarea");
  const skills = skillsTextarea.value
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill); // Remove empty values and trim

  const selectedProfile = localStorage.getItem("selectedProfile"); // Get the current profile
  if (!selectedProfile) {
    alert("Please select a profile first.");
    return;
  }

  // Fetch existing profile data, update with new skills, and save back to storage
  chrome.runtime.sendMessage(
    { type: "getProfileData", profileName: selectedProfile },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error fetching profile data:", chrome.runtime.lastError.message);
        return;
      }

      const profiles = response.data || {};
      const profileData = profiles[selectedProfile] || {};

      profileData.skills = skills; // Update skills for the selected profile
      profiles[selectedProfile] = profileData;

      chrome.runtime.sendMessage(
        { type: "profileData", data: profiles },
        (saveResponse) => {
          if (saveResponse.status === "success") {
            alert("Skills saved successfully!");
            console.log(`Updated skills for profile "${selectedProfile}":`, skills);
          } else {
            console.error("Failed to save skills:", saveResponse.message);
          }
        }
      );
    }
  );
}

  window.addEventListener('load', () => {
    document.getElementById('refreshSkillsBtn').addEventListener('click', refreshSkills);
    document.getElementById('saveSkillsBtn').addEventListener('click', saveSkills);
    loadSkills();
  });