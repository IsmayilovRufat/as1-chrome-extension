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

function resetNonSkillsData() {
  chrome.tabs.executeScript(null, { file: 'payload_non_skills.js' }, () => {
    alert('Non-skills data has been reset and reloaded!');
    loadFields();
  });
}

function saveData() {
  const storedData = {};
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    storedData[input.dataset.fieldKey] = input.value.trim();
  });

  chrome.runtime.sendMessage({ type: 'profileData', data: storedData }, () => {
    alert('Profile data saved successfully!');
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
    const emailBody = encodeURIComponent("Here is the exported data:\n" + JSON.stringify(data, null, 2));
    window.open(`mailto:?subject=Exported Profile Data&body=${emailBody}`);
  });
}

window.addEventListener('load', () => {
  document.getElementById('saveDataBtn').addEventListener('click', saveData);
  document.getElementById('resetNonSkillsBtn').addEventListener('click', resetNonSkillsData);
  document.getElementById('addCustomFieldBtn').addEventListener('click', addCustomField);
  document.getElementById('exportDataBtn').addEventListener('click', exportData);
  document.getElementById('importDataBtn').addEventListener('click', importData);
  document.getElementById('sendDataEmailBtn').addEventListener('click', sendDataViaEmail);
  loadFields();
});
