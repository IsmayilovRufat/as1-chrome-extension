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
    const storedData = {};
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      storedData[input.dataset.fieldKey] = input.value.trim();
    });
  
    chrome.runtime.sendMessage({ type: 'profileData', data: storedData }, () => {
      alert('Profile data saved successfully!');
    });
  }
  
  document.addEventListener('DOMContentLoaded', loadFields);
  document.getElementById('saveDataBtn').addEventListener('click', saveData);
  document.getElementById('resetNonSkillsBtn').addEventListener('click', resetNonSkillsData);
  