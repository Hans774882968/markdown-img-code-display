chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'markdown-img-code-display',
    title: 'Markdown Image Code Display (page)',
    contexts: ['page'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'markdown-img-code-display' && tab?.id) {
    const popup_url = chrome.runtime.getURL('index.html');
    chrome.windows.create({ url: popup_url, type: 'popup', width: 1024, height: 768 });
  }
});
