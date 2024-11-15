// Inject the payload.js script into the current tab after the popup has loaded
window.addEventListener('load', function (evt) {
    chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
        file: 'payload.js'
    });
});

// Listen to messages from payload.js script and write to popup.html
chrome.runtime.onMessage.addListener(function (message) {
    // Get the element where the data will be displayed
    var list = document.getElementById('spanList');
    list.innerHTML = ''; // Clear previous content

    // Append each key-value pair as a new <li> element
    message.forEach(function(pair) {
        var listItem = document.createElement('li');
        listItem.textContent = pair; // Add text from the first span
        list.appendChild(listItem); // Append the list item
    });
});




