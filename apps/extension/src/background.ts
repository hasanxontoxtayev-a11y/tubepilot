/**
 * TubePilot AI — Chrome Extension Service Worker
 */

declare const chrome: any;

chrome.runtime.onInstalled.addListener(() => {
  console.log('[TubePilot AI] Universal YouTube HUD Extension Installed Successfully');
});

// Message listener for proxying or notification events
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'PING') {
    sendResponse({ status: 'PONG', timestamp: Date.now() });
  }
  return true;
});
