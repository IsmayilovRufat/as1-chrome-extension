chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'downloadCSV') {
        const csvData = message.data;
        const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvData);

        chrome.downloads.download({
            url: csvContent,
            filename: "linkedin_profile_data.csv",
            saveAs: true // This will prompt the user for a save location
        });
    }
});
