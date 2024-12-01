# Chrome Extension

## Overview

This tool is a Chrome extension designed to simplify the process of filling out job applications and other forms online. By intelligently extracting and managing your data from LinkedIn, this extension saves time and ensures accuracy. With additional features like profile management, customizable data fields, and application tracking, the extension enhances productivity for users navigating their job search or other repetitive form-filling tasks.

---

## Features

###  Customizable Data Fields
- Extract information such as Name, Experience, Education, and Skills from your [LinkedIn Profile](https://www.linkedin.com/in/username-6a2936233/).
- Manually add or edit additional fields, such as certificates, personal summaries, or portfolio links.
- Save all data securely in local storage for offline use.

###  Automatic Cover Letter Generation *(Bonus)*
- Automatically detect the job title and company name during applications.
- Generate tailored cover letters using free API services (e.g., [Gemini AI](https://ai.google.dev/pricing#1_5flash)).
- Provides a draft that users can further personalize.

###  History Restoring
- Save partially completed forms for future reuse, reducing repetition.

###  Data Transfer
- Export and import data in JSON format for portability or backup.
- Email data files directly from the extension.

---

## How to Use the Extension

### Installation
1. Clone the repository or download the ZIP file.
2. Navigate to `chrome://extensions/` in your browser.
3. Enable **Developer Mode** and click **Load unpacked**.
4. Select the project folder to install the extension.

### Key Actions
1. **Fetch LinkedIn Data**: Navigate to your [LinkedIn Profile](https://www.linkedin.com/in/username-6a2936233/), then use the extension to extract data.
2. **Manage Profiles**: Create or edit profiles for streamlined application processes.
3. **Export & Import Data**: Backup your data or transfer it across devices.

---

## Permissions

The extension uses the following permissions:
- **Storage**: To save user data locally.
- **Active Tab**: To interact with the current browser tab for LinkedIn data extraction and form auto-fill.
- **Scripting**: To fill forms dynamically based on the extracted or user-provided data.

---

## Endpoints Used
- https://www.linkedin.com/in/username/details/skills  
- https://www.linkedin.com/in/username/details/experience 
- https://www.linkedin.com/in/username/overlay/contact-info  
- https://www.linkedin.com/in/username/details/education 
- https://www.linkedin.com/in/username/details/certifications  
- https://www.linkedin.com/in/username/details/languages  

---

## Troubleshooting
- Refresh the extension from the Chrome Extensions page if it doesn't respond.
- Check that permissions are enabled and LinkedIn is accessible.
- Verify that the browser is up to date.

---

## Conclusion

This tool is your productivity partner for seamless online applications. With its intelligent data handling, user-friendly design, and robust customization options, it simplifies a complex process into a few clicks.

Enjoy smarter and faster applications!
