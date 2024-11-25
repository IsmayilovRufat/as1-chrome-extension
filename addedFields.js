function loadFields() {
    const addedProfileFieldsDiv = document.getElementById('addedProfileFields');
    addedProfileFieldsDiv.innerHTML = '';
  
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
        addedProfileFieldsDiv.appendChild(fieldDiv);
      });
    });
  }


  // Function to save data
function saveData() {
    // Collect data from all input fields inside #addedProfileFields
    const fields = document.querySelectorAll('#addedProfileFields input');
    
    // Create an object to store the field values
    const data = {};
    
    // Loop through the inputs and store the values in the data object
    fields.forEach((input) => {
      data[input.id] = input.value;
    });
  
    // Save the data to chrome.storage.local
    chrome.storage.local.set({ addedProfileFields: data }, () => {
      // Optionally, alert or update the UI to confirm data was saved
      alert('Profile fields data saved successfully!');
    });
  }
  
  // Add event listener to the Save Data button
  document.getElementById('saveDataBtn').addEventListener('click', saveData);
  
  window.addEventListener('load', loadFields);
  