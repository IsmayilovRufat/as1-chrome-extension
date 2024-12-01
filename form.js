function loadForm() {
  const selectedProfile = localStorage.getItem("selectedProfile"); // Get the current profile
  if (!selectedProfile) {
    alert("Please select a profile first.");
    return;
  }

  // Fetch the form data for the selected profile
  chrome.runtime.sendMessage(
    { type: "getProfileData", profileName: selectedProfile },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error fetching form data:", chrome.runtime.lastError.message);
        return;
      }

      const profileData = response.data || {};

      // Load the fields
      document.getElementById("nameInput").value = profileData.name || "";
      document.getElementById("websiteInput").value = profileData.website || "";
      document.getElementById("birthdayInput").value = profileData.birthday || "";
      document.getElementById("emailInput").value = profileData.email || "";
      document.getElementById("skillsTextarea").value = (profileData.skills || []).join(", ");
      document.getElementById("certificatesTextarea").value = (profileData.certificates || []).join(", ");
      document.getElementById("experiencesTextarea").value = (profileData.experiences || []).join(", ");
      document.getElementById("educationTextarea").value = (profileData.education || []).join(", ");
      document.getElementById("languagesTextarea").value = (profileData.languages || []).join(", ");
      document.getElementById("bioTextarea").value = profileData.bio || "";
    }
  );
}

function saveForm() {
  const selectedProfile = localStorage.getItem("selectedProfile"); // Get the current profile
  if (!selectedProfile) {
    alert("Please select a profile first.");
    return;
  }

  // Collect form data
  const formData = {
    name: document.getElementById("nameInput").value.trim(),
    website: document.getElementById("websiteInput").value.trim(),
    birthday: document.getElementById("birthdayInput").value,
    email: document.getElementById("emailInput").value.trim(),
    skills: document.getElementById("skillsTextarea").value.split(",").map(skill => skill.trim()).filter(skill => skill),
    certificates: document.getElementById("certificatesTextarea").value.split(",").map(cert => cert.trim()).filter(cert => cert),
    experiences: document.getElementById("experiencesTextarea").value.split(",").map(exp => exp.trim()).filter(exp => exp),
    education: document.getElementById("educationTextarea").value.split(",").map(edu => edu.trim()).filter(edu => edu),
    languages: document.getElementById("languagesTextarea").value.split(",").map(lang => lang.trim()).filter(lang => lang),
    bio: document.getElementById("bioTextarea").value.trim(),
  };

  // Save form data to the current profile
  chrome.runtime.sendMessage(
    { type: "getProfileData", profileName: selectedProfile },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error fetching profile data:", chrome.runtime.lastError.message);
        return;
      }

      const profiles = response.data || {};
      profiles[selectedProfile] = { ...profiles[selectedProfile], ...formData };

      chrome.runtime.sendMessage(
        { type: "profileData", data: profiles },
        (saveResponse) => {
          if (saveResponse.status === "success") {
            alert("Form saved successfully!");
            console.log(`Updated form data for profile "${selectedProfile}":`, formData);
          } else {
            console.error("Failed to save form:", saveResponse.message);
          }
        }
      );
    }
  );
}

// Event listeners
document.getElementById("refreshFormBtn").addEventListener("click", (event) => {
  event.preventDefault(); // Prevent page reload
  loadForm();
});

document.getElementById("saveFormBtn").addEventListener("click", (event) => {
  event.preventDefault(); // Prevent page reload
  saveForm();
});

// Initial load
loadForm();
