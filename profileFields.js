function loadFields() {
  const profileFieldsDiv = document.getElementById('profileFields');
  profileFieldsDiv.innerHTML = '';

  chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
    const storedData = response.data || {};

    const defaultFields = [
      { key: 'name', label: 'Name' },
      { key: 'title', label: 'Title' },
      { key: 'location', label: 'Location' },
      { key: 'email', label: 'Email' },
      { key: 'website', label: 'Website' },
      { key: 'phone', label: 'Phone' },
      { key: 'bio', label: 'Bio' },
      { key: 'birthday', label: 'Birthday' }
    ];

    defaultFields.forEach((field) => {
      const fieldDiv = document.createElement('div');
      fieldDiv.classList.add('editable');

      const label = document.createElement('label');
      label.textContent = `${field.label}:`;

      const input = document.createElement('input');
      input.type = 'text';
      input.value = storedData[field.key] || '';
      input.dataset.fieldKey = field.key;

      fieldDiv.appendChild(label);
      fieldDiv.appendChild(input);
      profileFieldsDiv.appendChild(fieldDiv);
    });

    // Add custom fields
    const customFields = storedData.customFields || [];
    customFields.forEach((field) => {
      const fieldDiv = document.createElement('div');
      fieldDiv.classList.add('editable');

      const label = document.createElement('label');
      label.textContent = `${field.label}:`;

      const input = document.createElement('input');
      input.type = 'text';
      input.value = field.value;
      input.dataset.fieldKey = `custom_${field.label}`;

      fieldDiv.appendChild(label);
      fieldDiv.appendChild(input);
      profileFieldsDiv.appendChild(fieldDiv);
    });
  });
}

function resetNonSkillsData() {
  chrome.tabs.executeScript(null, { file: 'payload_non_skills.js' }, () => {
    alert('Non-skills data has been reset and reloaded!');
    loadFields();
  });
}

function saveData() {
  const dataTextarea = document.getElementById("dataTextarea");
  const data = dataTextarea.value
    .split("\n")
    .map((cert) => cert.replace(/^•\s*/, "").trim()) // Remove bullet points and trim
    .filter((cert) => cert); // Remove empty values

  const selectedProfile = localStorage.getItem("selectedProfile"); // Get the current profile
  if (!selectedProfile) {
    alert("Please select a profile first.");
    return;
  }

  // Fetch existing profile data, update data, and save
  chrome.runtime.sendMessage(
    { type: "getProfileData", profileName: selectedProfile },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error fetching profile data:", chrome.runtime.lastError.message);
        return;
      }

      const profiles = response.data || {};
      const profileData = profiles[selectedProfile] || {};

      profileData.data = data; // Update data for the current profile
      profiles[selectedProfile] = profileData;

      chrome.runtime.sendMessage({ type: "profileData", data: profiles }, (saveResponse) => {
        if (saveResponse.status === "success") {
          alert("Datas saved successfully!");
          console.log(`Updated datas for profile "${selectedProfile}":`, data);
        } else {
          console.error("Failed to save datas:", saveResponse.message);
        }
      });
    }
  );
}

document.addEventListener('DOMContentLoaded', loadFields);
document.getElementById('saveDataBtn').addEventListener('click', saveData);
document.getElementById('resetNonSkillsBtn').addEventListener('click', resetNonSkillsData);
