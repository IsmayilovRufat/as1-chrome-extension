// Function to load saved profile data from localStorage and display it in editable fields
function loadFields() {
    const profileFieldsDiv = document.getElementById('profileFields');
    profileFieldsDiv.innerHTML = '';  // Clear previous fields

    const storedData = JSON.parse(localStorage.getItem('profileData')) || {};
  
    const defaultFields = [
      { key: 'name', label: 'Name' },
      { key: 'title', label: 'Title' },
      { key: 'location', label: 'Location' },
      { key: 'email', label: 'Email' },
      { key: 'website', label: 'Website' },
      { key: 'phone', label: 'Phone' },
      { key: 'bio', label: 'Bio' },
      { key: 'birthday', label: 'Birthday' },
    ];
  
    // Create editable fields for each profile attribute
    defaultFields.forEach(field => {
      const fieldDiv = document.createElement('div');
      fieldDiv.classList.add('editable');
  
      const label = document.createElement('label');
      label.textContent = `${field.label}:`;
  
      const input = document.createElement('input');
      input.type = 'text';
      input.value = storedData[field.key] || '';  // Use stored data, if available
      input.dataset.fieldKey = field.key;
  
      fieldDiv.appendChild(label);
      fieldDiv.appendChild(input);
      profileFieldsDiv.appendChild(fieldDiv);
    });

    // Load custom fields (if any)
    const customFields = storedData.customFields || [];
    customFields.forEach(field => {
      const fieldDiv = document.createElement('div');
      fieldDiv.classList.add('editable');
  
      const label = document.createElement('label');
      label.textContent = `${field.label}:`;
  
      const input = document.createElement('input');
      input.type = 'text';
      input.value = field.value || '';  // Use stored data, if available
      input.dataset.fieldKey = field.key;
  
      fieldDiv.appendChild(label);
      fieldDiv.appendChild(input);
      profileFieldsDiv.appendChild(fieldDiv);
    });
}

// Function to save the data to localStorage when the "Save Data" button is clicked
function saveData() {
    const storedData = {};
  
    // Collect the data from all the input fields
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      storedData[input.dataset.fieldKey] = input.value.trim();
    });
  
    // Store the data in localStorage
    localStorage.setItem('profileData', JSON.stringify(storedData));
    alert('Profile data saved successfully!');
}

// Function to handle adding a custom field
function addCustomField() {
    const labelInput = document.getElementById('customFieldLabel');
    const valueInput = document.getElementById('customFieldValue');
    
    const fieldLabel = labelInput.value.trim();
    const fieldValue = valueInput.value.trim();

    if (fieldLabel && fieldValue) {
        // Get the existing data from localStorage
        const storedData = JSON.parse(localStorage.getItem('profileData')) || {};
        const customFields = storedData.customFields || [];

        // Add the new custom field to the custom fields array
        customFields.push({ label: fieldLabel, value: fieldValue });

        // Update the stored data with the new custom field
        storedData.customFields = customFields;

        // Save the updated data to localStorage
        localStorage.setItem('profileData', JSON.stringify(storedData));

        // Reload the fields to display the new custom field
        loadFields();

        // Clear the input fields after adding the custom field
        labelInput.value = '';
        valueInput.value = '';
    } else {
        alert('Please provide both a label and a value for the custom field.');
    }
}

// Function to reset profile data and allow fetching new LinkedIn profile info
function resetData() {
    // Clear the saved profile data in localStorage
    localStorage.removeItem('profileData');
  
    // Clear the profile fields in the popup
    const profileFieldsDiv = document.getElementById('profileFields');
    profileFieldsDiv.innerHTML = '';  // Clear existing fields
  
    // Optionally, clear the custom fields section if you want to reset everything
    const customFieldsDiv = document.getElementById('addCustomFields');
    customFieldsDiv.querySelector('#customFieldLabel').value = '';
    customFieldsDiv.querySelector('#customFieldValue').value = '';
  
    // Trigger the re-fetch of LinkedIn profile data after resetting
    chrome.tabs.executeScript(null, { file: 'payload.js' });  // Re-run the payload.js to extract new data
  
    alert('Profile data has been reset! Please wait for new data to load.');
}

// Listen to messages from payload.js and save the data to localStorage
chrome.runtime.onMessage.addListener(function (message) {
    if (message.type === 'profileData') {
      // Save the profile data into localStorage when received
      localStorage.setItem('profileData', JSON.stringify(message.data));
  
      // Load the saved fields
      loadFields();
    }
});

// Add event listeners for the buttons when the page is loaded
window.addEventListener('load', function () {
    // Add the "Save Data" button functionality
    const saveDataBtn = document.getElementById('saveDataBtn');
    saveDataBtn.addEventListener('click', saveData);

    // Add the "Add Field" button functionality
    const addFieldBtn = document.getElementById('addFieldBtn');
    addFieldBtn.addEventListener('click', addCustomField);

    // Add the "Reset Data" button functionality
    const resetDataBtn = document.getElementById('resetDataBtn');
    resetDataBtn.addEventListener('click', resetData);
  
    // Load the fields from localStorage (persistent storage)
    loadFields();
});
