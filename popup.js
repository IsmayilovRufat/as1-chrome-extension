function loadFields() {
  const profileFieldsDiv = document.getElementById('profileFields');
  profileFieldsDiv.innerHTML = '';

<<<<<<< HEAD
  // Fetch the profile data
  chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
    const storedData = response.data || {};

    // Only handle the custom fields
    const customFields = storedData.customFields || [];
=======
  // Fetch the profile data for the selected profile
  const selectedProfile = document.getElementById('profile-selector').value;
  chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
    const storedData = response.data || {};
    const profileData = storedData[selectedProfile] || { customFields: [] };

    // Only handle the custom fields
    const customFields = profileData.customFields || [];
>>>>>>> 3a3d6f0 (Initial versions of Profile Switching and Form Mapping)

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

<<<<<<< HEAD


document.getElementById('generateBtn').addEventListener('click', () => {
  // Get the pasted HTML content
  const htmlInput = document.getElementById('htmlInput').value;

  if (!htmlInput.trim()) {
    // Alert the user if no HTML is provided
    document.getElementById('coverLetterOutput').value = 'Please provide the HTML content to generate the cover letter.';
    return;
  }

  // Send the HTML content to the background script
  chrome.runtime.sendMessage(
    { type: 'generateCoverLetter', htmlStructure: htmlInput },
    (response) => {
      const outputField = document.getElementById('coverLetterOutput');
      if (response.status === 'success') {
        // Display the generated cover letter
        outputField.value = response.coverLetter;
      } else {
        // Display error messages
        outputField.value = `Error: ${response.message}`;
      }
    }
  );
});



document.addEventListener('DOMContentLoaded', () => {
  const htmlInput = document.getElementById('htmlInput'); // Match the ID from popup.html

  // Query the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      // Send a message to the content script to fetch page content
      chrome.tabs.sendMessage(activeTab.id, { type: 'fetchPageContent' }, (response) => {
          if (response && response.status === 'success') {
              // Set the content in the textarea
              htmlInput.value = response.content;
          } else {
              htmlInput.value = 'Failed to fetch page content.';
          }
      });
  });
});




=======
function loadProfiles() {
  const profileSelector = document.getElementById('profile-selector');
  profileSelector.innerHTML = ''; // Clear existing options

  chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error fetching profile data:', chrome.runtime.lastError.message);
      return;
    }

    if (response && response.status === 'success') {
      const profiles = response.data || {};
      Object.keys(profiles).forEach((profileName) => {
        const option = document.createElement('option');
        option.value = profileName;
        option.textContent = profileName;
        profileSelector.appendChild(option);
      });

      if (Object.keys(profiles).length > 0) {
        profileSelector.value = Object.keys(profiles)[0];
        loadFields(profiles[profileSelector.value]); // Load fields for the first profile
      }
    } else {
      console.error('Failed to load profiles:', response);
    }
  });
}

function addProfile() {
  const profileNameInput = document.getElementById('new-profile-name');
  const profileName = profileNameInput.value.trim();

  if (!profileName) {
    alert('Profile name cannot be empty!');
    return;
  }

  chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error fetching profile data:', chrome.runtime.lastError.message);
      return;
    }

    const profiles = response.data || {};
    if (profiles[profileName]) {
      alert('Profile name already exists!');
      return;
    }

    profiles[profileName] = { customFields: [] };

    chrome.runtime.sendMessage({ type: 'profileData', data: profiles }, (saveResponse) => {
      if (saveResponse && saveResponse.status === 'success') {
        alert('Profile added successfully!');
        console.log('Updated profiles:', profiles);
        profileNameInput.value = '';
        document.getElementById('new-profile-modal').style.display = 'none';
        loadProfiles(); // Refresh dropdown
      } else {
        console.error('Failed to save profile:', saveResponse);
      }
    });
  });
}
>>>>>>> 3a3d6f0 (Initial versions of Profile Switching and Form Mapping)

function addCustomField() {
  const labelInput = document.getElementById('customFieldLabel');
  const valueInput = document.getElementById('customFieldValue');

  const label = labelInput.value.trim();
  const value = valueInput.value.trim();
<<<<<<< HEAD

  if (label && value) {
    chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
      const storedData = response.data || {};
      const customFields = storedData.customFields || [];

      customFields.push({ label, value });
      storedData.customFields = customFields;

      chrome.runtime.sendMessage({ type: 'profileData', data: storedData }, () => {
=======
  const selectedProfile = document.getElementById('profile-selector').value;

  if (label && value) {
    chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
      const profiles = response.data || {};
      const profileData = profiles[selectedProfile] || { customFields: [] };

      profileData.customFields.push({ label, value });
      profiles[selectedProfile] = profileData;

      chrome.runtime.sendMessage({ type: 'profileData', data: profiles }, () => {
>>>>>>> 3a3d6f0 (Initial versions of Profile Switching and Form Mapping)
        alert('Custom field added successfully!');
        labelInput.value = '';
        valueInput.value = '';
        loadFields(); // Reload fields to display the new custom field
      });
    });
  } else {
    alert('Please enter both a field name and value.');
  }
}

<<<<<<< HEAD



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




window.addEventListener('load', () => {

  document.getElementById('addCustomFieldBtn').addEventListener('click', addCustomField);

  document.getElementById('exportDataBtn').addEventListener('click', exportData);
  document.getElementById('importDataBtn').addEventListener('click', importData);
  document.getElementById('sendEmailButton').addEventListener('click', sendDataViaEmail);

  loadFields();
});
=======
function submitApplicationForm() {
  const applicationData = {
    fullName: document.getElementById('fullName').value,
    emailAddress: document.getElementById('emailAddress').value,
    phoneNumber: document.getElementById('phoneNumber').value,
    address: document.getElementById('address').value,
    desiredSalary: {
      amount: document.getElementById('desiredSalary').value,
      currency: document.getElementById('currency').value,
      type: document.getElementById('salaryType').value,
    },
    coverLetter: document.getElementById('coverLetter').value,
  };

  // Save application data to chrome.storage.local
  chrome.storage.local.set({ applicationData }, () => {
    console.log('Application data saved:', applicationData);
    alert('Application submitted successfully!');
  });
}

function loadApplicationData() {
  chrome.storage.local.get('applicationData', (result) => {
    const applicationData = result.applicationData || {};

    if (applicationData.fullName) document.getElementById('fullName').value = applicationData.fullName;
    if (applicationData.emailAddress) document.getElementById('emailAddress').value = applicationData.emailAddress;
    if (applicationData.phoneNumber) document.getElementById('phoneNumber').value = applicationData.phoneNumber;
    if (applicationData.address) document.getElementById('address').value = applicationData.address;
    if (applicationData.desiredSalary) {
      document.getElementById('desiredSalary').value = applicationData.desiredSalary.amount;
      document.getElementById('currency').value = applicationData.desiredSalary.currency;
      document.getElementById('salaryType').value = applicationData.desiredSalary.type;
    }
    if (applicationData.coverLetter) document.getElementById('coverLetter').value = applicationData.coverLetter;
  });
}

window.addEventListener('load', () => {
  document.getElementById('addCustomFieldBtn').addEventListener('click', addCustomField);

  document.getElementById('new-profile-btn').addEventListener('click', () => {
    document.getElementById('new-profile-modal').style.display = 'block';
  });

  document.getElementById('cancel-profile-btn').addEventListener('click', () => {
    document.getElementById('new-profile-modal').style.display = 'none';
  });

  document.getElementById('save-profile-btn').addEventListener('click', addProfile);

  document.getElementById('submitApplication').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form reload
    submitApplicationForm();
  });

  loadProfiles();
  loadApplicationData();
});
>>>>>>> 3a3d6f0 (Initial versions of Profile Switching and Form Mapping)
