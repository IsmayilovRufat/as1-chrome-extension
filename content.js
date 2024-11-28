chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in content.js:", message);  // Check if the message is received
    
    if (message.type === 'fetchHTMLStructure') {
      try {
        const pageContent = document.body.innerText || document.body.textContent;
        console.log("Fetched page content:", pageContent);
        sendResponse({ status: 'success', content: pageContent });
      } catch (error) {
        console.error("Error fetching content:", error);
        sendResponse({ status: 'error', message: 'Failed to fetch page content.' });
      }
    }
  });
  
