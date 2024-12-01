# Chrome Extension

## Overview

This tool is a Chrome extension designed to simplify the process of filling out job applications and other forms online. By intelligently extracting and managing your data from LinkedIn, this extension saves time and ensures accuracy. With additional features like profile management, customizable data fields, and application tracking, the extension enhances productivity for users navigating their job search or other repetitive form-filling tasks.

---

## Features

###  Customizable Data Fields
- Extract information such as Name, Experience, Education, and Skills from your [LinkedIn Profile](https://www.linkedin.com/in/username-6a2936233/).
- Manually add or edit additional fields, such as certificates, personal summaries, or portfolio links.
- Save all data securely in local storage for offline use.

### Profile Switching. 
-   Enable users to create multiple profiles (e.g., for different industries or job roles) that they can switch between, depending on the type of application they are filling out.

### Form Field Mapping 
-   Implement a feature where users can map LinkedIn fields to specific form fields, ensuring accurate form filling even for forms with unique field names.

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

---

### Key Actions
1. **Fetch LinkedIn Data**: Navigate to your [LinkedIn Profile](https://www.linkedin.com/in/username-6a2936233/), then use the extension to extract data.
2. **Manage Profiles**: Create or edit profiles for streamlined application processes.
3. **Export & Import Data**: Backup your data or transfer it across devices.

---

### Profile Management
1. Creating a Profile
-   In the popup, click the New Profile button.
-   Enter a name for the new profile in the modal that appears.
-   Click Save Profile to create the profile. The profile is stored locally and becomes available in the profile dropdown.Switching Between Profiles
-   Use the profile dropdown to select a different profile.

---

### How to scrape the data
Skills:	
-   https://www.linkedin.com/in/<profile-username>/details/skills/	
-   Navigate to this URL.
-   Click Refresh Skills.
-   Save data for the current profile.
Certificates:	
-   https://www.linkedin.com/in/<profile-username>/details/certifications/	
-   Navigate to this URL.
-   lick Refresh Certificates.
-   Save data for the current profile.
Experiences: 
-   https://www.linkedin.com/in/<profile-username>/details/experience/ 
-   Navigate to this URL.
-   Click Refresh Experiences.
-   Save data for the current profile.
Education:	
-   https://www.linkedin.com/in/<profile-username>/details/education/	
-   Navigate to this URL.
-   Click Refresh Education.
-   Save data for the current profile.
Languages: 
-   https://www.linkedin.com/in/<profile-username>/details/languages/	
-   Navigate to this URL.
-   Click Refresh Languages.
-   Save data for the current profile.
Personal Info:	
-   https://www.linkedin.com/in/<profile-username>/overlay/contact-info/	
-   Navigate to this URL.
-   Fill in personal fields (Name, Email, Website, etc.).
-   Save data for the current profile.

---

### Saving and Refreshing Data
-   After scraping or entering data manually, click the Save button to store the data locally for the currently selected profile.
-   Each section (Skills, Certificates, Experiences, etc.) has its own Save button, ensuring modular storage.

Refreshing Data:
-   The Refresh button allows you to rescrape or reload data from LinkedIn or clear fields for manual entry.

---

## Profile Form
To use this feature, you need select the profile first and then start to scrape data as mentioned previously. When you scrape data it will also load to related field in Profile Form. When you finished the scraping, navigate to the Profile Form page and save the data. It will be stores in local storage of selected user.


## Permissions

The extension uses the following permissions:
- **Storage**: To save user data locally.
- **Active Tab**: To interact with the current browser tab for LinkedIn data extraction and form auto-fill.
- **Scripting**: To fill forms dynamically based on the extracted or user-provided data.

---

## Troubleshooting
- Refresh the extension from the Chrome Extensions page if it doesn't respond.
- Check that permissions are enabled and LinkedIn is accessible.
- Verify that the browser is up to date.

---

## Conclusion

This tool is your productivity partner for seamless online applications. With its intelligent data handling, user-friendly design, and robust customization options, it simplifies a complex process into a few clicks.

Enjoy smarter and faster applications!
