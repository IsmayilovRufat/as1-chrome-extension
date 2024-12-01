function loadFields() {
  const selectedProfile = localStorage.getItem("selectedProfile");
  if (!selectedProfile) {
    console.error("No profile selected.");
    return;
  }

  chrome.runtime.sendMessage(
    { type: "getProfileData", profileName: selectedProfile },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error fetching profile data:", chrome.runtime.lastError.message);
        return;
      }

      const profileData = response?.data || {};
      console.log(`Loaded data for profile "${selectedProfile}":`, profileData);

      // Populate the fields with the profile data
      document.getElementById("skillsTextarea").value = (profileData.skills || []).join(", ");
      document.getElementById("certificatesTextarea").value = (profileData.certificates || []).join(", ");
      document.getElementById("experiencesTextarea").value = (profileData.experiences || []).join(", ");
      document.getElementById("educationTextarea").value = (profileData.education || []).join(", ");
      document.getElementById("languagesTextarea").value = (profileData.languages || []).join(", ");
      document.getElementById("titleInput").value = profileData.title || "";
      document.getElementById("locationInput").value = profileData.location || "";
      document.getElementById("bioTextarea").value = profileData.bio || "";
    }
  );
}

function populateFormFields(profileData) {
  // Populate the Skills Textarea
  const skillsTextarea = document.getElementById("skillsTextarea");
  if (skillsTextarea) {
    skillsTextarea.value = (profileData.skills || []).join(", ");
  }

  // Populate the Certificates Textarea
  const certificatesTextarea = document.getElementById("certificatesTextarea");
  if (certificatesTextarea) {
    certificatesTextarea.value = (profileData.certificates || []).join(", ");
  }

  // Populate the Experiences Textarea
  const experiencesTextarea = document.getElementById("experiencesTextarea");
  if (experiencesTextarea) {
    experiencesTextarea.value = (profileData.experiences || []).join(", ");
  }

  // Populate the Education Textarea
  const educationTextarea = document.getElementById("educationTextarea");
  if (educationTextarea) {
    educationTextarea.value = (profileData.education || []).join(", ");
  }

  // Populate the Languages Textarea
  const languagesTextarea = document.getElementById("languagesTextarea");
  if (languagesTextarea) {
    languagesTextarea.value = (profileData.languages || []).join(", ");
  }

  // Populate Title, Location, and Bio fields
  const titleInput = document.getElementById("titleInput");
  if (titleInput) {
    titleInput.value = profileData.title || "";
  }

  const locationInput = document.getElementById("locationInput");
  if (locationInput) {
    locationInput.value = profileData.location || "";
  }

  const bioTextarea = document.getElementById("bioTextarea");
  if (bioTextarea) {
    bioTextarea.value = profileData.bio || "";
  }
}

// Function to load profiles into the dropdown
function loadProfiles() {
  const profileSelector = document.getElementById("profile-selector");
  profileSelector.innerHTML = ""; // Clear existing options

  chrome.runtime.sendMessage({ type: "getProfileData" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error fetching profile data:", chrome.runtime.lastError.message);
      return;
    }

    if (response && response.status === "success") {
      const profiles = response.data || {};
      const userProfiles = Object.keys(profiles).filter(
        (key) =>
          ![
            "certificates",
            "education",
            "experiences",
            "languages",
            "skills",
            "bio",
            "birthday",
            "email",
            "location",
            "name",
            "phone",
            "title",
            "website",
          ].includes(key)
      );

      userProfiles.forEach((profileName) => {
        const option = document.createElement("option");
        option.value = profileName;
        option.textContent = profileName;
        profileSelector.appendChild(option);
      });

      // Select the first profile by default
      if (userProfiles.length > 0) {
        const defaultProfile = localStorage.getItem("selectedProfile") || userProfiles[0];
        profileSelector.value = defaultProfile;
        localStorage.setItem("selectedProfile", defaultProfile); // Ensure it's saved
        loadFields(); // Load fields for the default profile
      }
    } else {
      console.error("Failed to load profiles:", response);
    }
  });

  profileSelector.addEventListener("change", (event) => {
    const selectedProfile = event.target.value;
    localStorage.setItem("selectedProfile", selectedProfile);
    console.log(`Switched to profile: ${selectedProfile}`);
    loadFields(); // Reload fields for the newly selected profile
  });
}

// Add this code block to listen for profile changes
document.getElementById("profile-selector").addEventListener("change", () => {
  const selectedProfile = document.getElementById("profile-selector").value;

  if (!selectedProfile) {
    console.error("No profile selected.");
    return;
  }

  localStorage.setItem("selectedProfile", selectedProfile); // Save the selected profile
  console.log(`Switched to profile: ${selectedProfile}`);

  // Clear the form fields
  document.getElementById("skillsTextarea").value = "";
  document.getElementById("certificatesTextarea").value = "";
  document.getElementById("experiencesTextarea").value = "";
  document.getElementById("educationTextarea").value = "";
  document.getElementById("languagesTextarea").value = "";
  document.getElementById("titleInput").value = "";
  document.getElementById("locationInput").value = "";
  document.getElementById("bioTextarea").value = "";

  // Reload the form fields with data for the selected profile
  loadFields();
});



function addProfile() {
  const profileNameInput = document.getElementById("new-profile-name");
  const profileName = profileNameInput.value.trim();

  if (!profileName) {
    alert("Profile name cannot be empty!");
    return;
  }

  chrome.runtime.sendMessage({ type: "getProfileData" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error fetching profile data:", chrome.runtime.lastError.message);
      return;
    }

    const profiles = response.data || {};
    if (profiles[profileName]) {
      alert("Profile name already exists!");
      return;
    }

    profiles[profileName] = {
      skills: [],
      certificates: [],
      experiences: [],
      education: [],
      languages: [],
      title: "",
      location: "",
      bio: "",
    };

    chrome.runtime.sendMessage({ type: "profileData", data: profiles }, (saveResponse) => {
      if (saveResponse && saveResponse.status === "success") {
        alert("Profile added successfully!");
        console.log("Updated profiles:", profiles);
        profileNameInput.value = "";
        document.getElementById("new-profile-modal").style.display = "none";
        loadProfiles(); // Refresh dropdown
      } else {
        console.error("Failed to save profile:", saveResponse);
      }
    });
  });
}

function addCustomField() {
  const labelInput = document.getElementById("customFieldLabel");
  const valueInput = document.getElementById("customFieldValue");

  const label = labelInput.value.trim();
  const value = valueInput.value.trim();
  const selectedProfile = document.getElementById("profile-selector").value;

  if (label && value) {
    chrome.runtime.sendMessage({ type: "getProfileData" }, (response) => {
      const profiles = response.data || {};
      const profileData = profiles[selectedProfile] || { customFields: [] };

      profileData.customFields.push({ label, value });
      profiles[selectedProfile] = profileData;

      chrome.runtime.sendMessage({ type: "profileData", data: profiles }, () => {
        alert("Custom field added successfully!");
        labelInput.value = "";
        valueInput.value = "";
        loadFields(); // Reload fields to display the new custom field
      });
    });
  } else {
    alert("Please enter both a field name and value.");
  }
}

function submitApplicationForm() {
  const applicationData = {
    fullName: document.getElementById("fullName").value,
    emailAddress: document.getElementById("emailAddress").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    address: document.getElementById("address").value,
    desiredSalary: {
      amount: document.getElementById("desiredSalary").value,
      currency: document.getElementById("currency").value,
      type: document.getElementById("salaryType").value,
    },
    coverLetter: document.getElementById("coverLetter").value,
  };

  chrome.storage.local.set({ applicationData }, () => {
    console.log("Application data saved:", applicationData);
    alert("Application submitted successfully!");
  });
}

function loadApplicationData() {
  chrome.storage.local.get("applicationData", (result) => {
    const applicationData = result.applicationData || {};

    if (applicationData.fullName)
      document.getElementById("fullName").value = applicationData.fullName;
    if (applicationData.emailAddress)
      document.getElementById("emailAddress").value =
        applicationData.emailAddress;
    if (applicationData.phoneNumber)
      document.getElementById("phoneNumber").value =
        applicationData.phoneNumber;
    if (applicationData.address)
      document.getElementById("address").value = applicationData.address;
    if (applicationData.desiredSalary) {
      document.getElementById("desiredSalary").value =
        applicationData.desiredSalary.amount;
      document.getElementById("currency").value =
        applicationData.desiredSalary.currency;
      document.getElementById("salaryType").value =
        applicationData.desiredSalary.type;
    }
    if (applicationData.coverLetter)
      document.getElementById("coverLetter").value = applicationData.coverLetter;
  });
}

function exportData() {
  chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
    const data = response.data || {};
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profile_data.json';
    a.click();
    URL.revokeObjectURL(url);
  });
}

function importData() {
  const fileInput = document.getElementById('importDataFile');
  fileInput.click(); // Open the file dialog

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const importedData = JSON.parse(reader.result);
        chrome.runtime.sendMessage({ type: 'profileData', data: importedData }, (response) => {
          if (response && response.status === 'success') {
            alert('Data imported successfully!');
            loadFields(); // Refresh the fields
          } else {
            alert('Failed to save imported data.');
          }
        });
      } catch (e) {
        alert('Invalid file format.');
      }
    };

    reader.readAsText(file);
  });
}

function sendDataViaEmail() {
  chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
    const data = response.data || {};

    // Prepare the body content of the email
    const emailBody = encodeURIComponent("Here is the exported profile data:\n" + JSON.stringify(data, null, 2));

    // Create the mailto link with subject and body
    const mailtoLink = `mailto:?subject=Exported Profile Data&body=${emailBody}`;

    // Open the mailto link in a new tab or window
    const mailtoWindow = window.open(mailtoLink, '_blank');

    // Check if the window was successfully opened
    if (!mailtoWindow) {
      alert("Unable to open email client. Please check your browser settings.");
    }
  });
}

// Function to save form data in localStorage
function saveFormData(data) {
  const savedForms = JSON.parse(localStorage.getItem('savedForms')) || [];
  savedForms.push({ id: Date.now(), data: data });
  localStorage.setItem('savedForms', JSON.stringify(savedForms));
  alert('Form data saved!');
}

// Function to load saved forms from localStorage
function loadSavedForms() {
  const savedForms = JSON.parse(localStorage.getItem('savedForms')) || [];
  const savedFormsList = document.getElementById('saved-forms-list');
  savedFormsList.innerHTML = ''; // Clear the list
  savedForms.forEach((form) => {
      const listItem = document.createElement('li');
      listItem.textContent = `Saved Form - ${new Date(form.id).toLocaleString()}`;
      listItem.onclick = () => restoreFormData(form.data);
      savedFormsList.appendChild(listItem);
  });
  document.getElementById('history-section').style.display = 'block';
}

// Function to restore form data from a saved entry
function restoreFormData(data) {
  for (const name in data) {
      const field = document.querySelector(`[name="${name}"]`);
      if (field) field.value = data[name];
  }
  alert('Form data restored!');
}

// Event listeners for saving, viewing history, and closing history
document.getElementById('close-history').addEventListener('click', () => {
  document.getElementById('history-section').style.display = 'none';
});

document.getElementById('save-form-btn').addEventListener('click', () => {
  const formData = {}; // Collect form data
  document.querySelectorAll('input, textarea, select').forEach((field) => {
      if (field.name) formData[field.name] = field.value;
  });
  saveFormData(formData);
});

document.getElementById('view-history-btn').addEventListener('click', loadSavedForms);


window.addEventListener("load", () => {
  document
    .getElementById("addCustomFieldBtn")
    .addEventListener("click", addCustomField);

  document
    .getElementById("new-profile-btn")
    .addEventListener("click", () => {
      document.getElementById("new-profile-modal").style.display = "block";
    });

  document
    .getElementById("cancel-profile-btn")
    .addEventListener("click", () => {
      document.getElementById("new-profile-modal").style.display = "none";
    });

  document
    .getElementById("save-profile-btn")
    .addEventListener("click", addProfile);

  document
    .getElementById('exportDataBtn')
    .addEventListener('click', exportData);

  document
    .getElementById('importDataBtn')
    .addEventListener('click', importData);

  document
    .getElementById('sendEmailButton')
    .addEventListener('click', sendDataViaEmail);

  loadProfiles();
  loadApplicationData();
});