function loadCertificates() {
  chrome.runtime.sendMessage({ type: 'getProfileData' }, (response) => {
      const storedData = response.data || {};
      const certificates = storedData.certificates || [];

      const certificatesTextarea = document.getElementById('certificatesTextarea');
      // Format the certificates before displaying them
      certificatesTextarea.value = formatCertificates(certificates);
  });
}
  
  function resetCertificatesData() {
    chrome.tabs.executeScript(null, { file: 'payload_certificate.js' }, () => {
        alert('Certificates data has been reset and reloaded!');
        loadCertificates(); // Reload certificates after resetting
    });
  }
  
  function formatCertificates(certificates) {
    // Format each certificate with a bullet point
    return certificates.map(cert => `• ${cert}`).join('\n');
}

function saveCertificates() {
  const certificatesTextarea = document.getElementById("certificatesTextarea");
  const certificates = certificatesTextarea.value
    .split("\n")
    .map((cert) => cert.replace(/^•\s*/, "").trim()) // Remove bullet points and trim
    .filter((cert) => cert); // Remove empty values

  const selectedProfile = localStorage.getItem("selectedProfile"); // Get the current profile
  if (!selectedProfile) {
    alert("Please select a profile first.");
    return;
  }

  // Fetch existing profile data, update certificates, and save
  chrome.runtime.sendMessage(
    { type: "getProfileData", profileName: selectedProfile },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error fetching profile data:", chrome.runtime.lastError.message);
        return;
      }

      const profiles = response.data || {};
      const profileData = profiles[selectedProfile] || {};

      profileData.certificates = certificates; // Update certificates for the current profile
      profiles[selectedProfile] = profileData;

      chrome.runtime.sendMessage({ type: "profileData", data: profiles }, (saveResponse) => {
        if (saveResponse.status === "success") {
          alert("Certificates saved successfully!");
          console.log(`Updated certificates for profile "${selectedProfile}":`, certificates);
        } else {
          console.error("Failed to save certificates:", saveResponse.message);
        }
      });
    }
  );
}
  
  window.addEventListener('load', () => {
    document.getElementById('refreshCertificatesBtn').addEventListener('click', resetCertificatesData);
    document.getElementById('saveCertificatesBtn').addEventListener('click', saveCertificates);
    loadCertificates();
  });