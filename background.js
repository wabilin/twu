let idUrlMap = {};
let messageQueue = [];

function onNotifyClicked(notificationId) {
  const url = idUrlMap[notificationId];
  browser.tabs.create({
    url,
    active: true,
  });

  browser.notifications.clear(notificationId);
}

function onNotifyClickedClosed(notificationId) {
  if (idUrlMap[notificationId]) {
    delete idUrlMap[notificationId];
  }
}

function addToQueue(message) {
  messageQueue.push(message)
}

function notify(message) {
  // TODO: i18n
  // var title = browser.i18n.getMessage("notificationTitle");
  // var content = browser.i18n.getMessage("notificationContent", message.url);

  const { url, playerName, danDetail } = message;

  const title = `天鳳 0w0 ${playerName} 開戰!`;
  const content = `快來觀看 ${playerName} (${danDetail}) 在天鳳的對戰`;

  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/link-48.png"),
    "title": title,
    "message": content
  }).then(notificationId => {
    idUrlMap[notificationId] = url
  })
}

// handle queue per 3 secs, avoid all notifications pop-up in a sec
function lookQueue() {
  if (messageQueue.length !== 0) {
    const message = messageQueue.shift()
    notify(message)
  }

  setTimeout(lookQueue, 3000)
}

browser.runtime.onMessage.addListener(addToQueue);
browser.notifications.onClicked.addListener(onNotifyClicked);
browser.notifications.onClosed.addListener(onNotifyClickedClosed)

lookQueue()
