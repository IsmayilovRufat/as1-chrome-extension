chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "fetchHTMLStructure") {
      console.log("Received request to fetch HTML structure.");
      try {
        const htmlStructure = document.documentElement.outerHTML;
        sendResponse({ status: "success", htmlStructure });
      } catch (error) {
        console.error("Error fetching HTML structure:", error.message);
        sendResponse({ status: "error", message: error.message });
      }
    }
    return true;
  });
  