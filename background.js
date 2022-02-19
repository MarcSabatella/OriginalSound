
chrome.action.onClicked.addListener((tab) => {
  console.log("action clicked");
  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    files: ["foreground.js"],
    world: "MAIN"
  });
});
