(() => {
  // src/background.ts
  chrome.runtime.onInstalled.addListener(() => {
    console.log("[TubePilot AI] Universal YouTube HUD Extension Installed Successfully");
  });
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "PING") {
      sendResponse({ status: "PONG", timestamp: Date.now() });
    }
    return true;
  });
})();
//# sourceMappingURL=background.js.map
