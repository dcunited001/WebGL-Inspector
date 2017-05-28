// Called when a message is passed.  We assume that the content script wants to show the page action.
function onMessage(request, sender, sendResponse) {
console.log("bg.js: onmesage");
    if (request.present) {
console.log("bg.js: onmesage -present");
        // Show the page action for the tab that the sender (content script) was on.
        if (global["browser"]) {
            browser.pageAction.show(sender.tab.id);
        } else if (window["chrome"]) {
            chrome.pageAction.show(sender.tab.id);
        }
    }

    // Return nothing to let the connection be cleaned up.
    sendResponse({});
};

var global = this;

if (global["browser"]) {
    // Listen for the content script to send a message to the background page.
    browser.runtime.onMessage.addListener(onMessage);

    browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
        browser.pageAction.show(tab.id);
    });

    browser.pageAction.onClicked.addListener(function (tab) {
        browser.tabs.sendMessage(tab.id, {
            reload: true
        }).catch(e => {
            console.error(e);
        });
    });
} else if (window["chrome"]) {
    chrome.extension.onRequest.addListener(onMessage);

    chrome.pageAction.onClicked.addListener(function (tab) {
        chrome.tabs.sendRequest(tab.id, {
            reload: true
        }, function(response) {

        });
    });
}
