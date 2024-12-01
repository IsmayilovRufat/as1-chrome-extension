function loadFields() {
  const profileFieldsDiv = document.getElementById('profileFields');
  profileFieldsDiv.innerHTML = '';

  // Fetch the profile data
  chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
    const storedData = response.data || {};

    // Only handle the custom fields
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





function addCustomField() {
  const labelInput = document.getElementById('customFieldLabel');
  const valueInput = document.getElementById('customFieldValue');

  const label = labelInput.value.trim();
  const value = valueInput.value.trim();

  if (label && value) {
    chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
      const storedData = response.data || {};
      const customFields = storedData.customFields || [];

      customFields.push({ label, value });
      storedData.customFields = customFields;

      chrome.runtime.sendMessage({ type: 'profileData', data: storedData }, () => {
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


window.addEventListener('load', () => {

  document.getElementById('addCustomFieldBtn').addEventListener('click', addCustomField);

  document.getElementById('exportDataBtn').addEventListener('click', exportData);
  document.getElementById('importDataBtn').addEventListener('click', importData);
  document.getElementById('sendEmailButton').addEventListener('click', sendDataViaEmail);

  loadFields();
});
