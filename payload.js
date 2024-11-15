// Select all the parent elements with the specific classes
var divs = document.querySelectorAll('div.display-flex.align-items-center.mr1.hoverable-link-text.t-bold');
// Initialize an array to hold the spans' text content
var spanTexts = [];

// Function to extract the text content of span elements
function extractTextFromElement(element) {
    // Select the first span with aria-hidden="true" which contains visible content
    var span = element.querySelector('span[aria-hidden="true"]');

    if (span && !spanTexts.includes(span.textContent.trim())) {
        spanTexts.push(span.textContent.trim());
    }
}

// Log how many divs were found
console.log('Found divs:', divs.length);

// Loop through divs and extract the text content from the first visible span
divs.forEach(function(div) {
    extractTextFromElement(div);
});

// Remove the last 5 items from the array
var modifiedSpanTexts = spanTexts.slice(0, -5);

// Log the final array of span texts (excluding last 5)
console.log('Span texts (without last 5):', modifiedSpanTexts);

// Send the array of span texts (excluding last 5) to the popup or other function
chrome.runtime.sendMessage(modifiedSpanTexts);
