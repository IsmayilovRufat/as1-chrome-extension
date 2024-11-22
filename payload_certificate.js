var parentDivs = document.querySelectorAll('div.display-flex.flex-column.align-self-center.flex-grow-1');
var extractedData = [];

function extractKeyValuePair(parent) {
    if (!parent) return;

    var firstSpan = parent.querySelector('div.display-flex.align-items-center.mr1.t-bold span[aria-hidden="true"]');
    var firstText = firstSpan ? firstSpan.textContent.trim() : "";

    var secondSpan = parent.querySelector('span.t-14.t-normal span[aria-hidden="true"]');
    var secondText = secondSpan ? secondSpan.textContent.trim() : "";

    if (firstText && secondText) {
        extractedData.push(`${firstText} - ${secondText}`);
    }
}

parentDivs.forEach(function (div) {
    extractKeyValuePair(div);
});

console.log("Extracted Data:", extractedData);

extractedData = extractedData.slice(0, -5);

chrome.runtime.sendMessage({ type: 'certificatesData', data: extractedData });
