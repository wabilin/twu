let idUrlMap = {};

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

function notify(message) {
  // TODO: i18n
  // var title = browser.i18n.getMessage("notificationTitle");
  // var content = browser.i18n.getMessage("notificationContent", message.url);

  const { url, playerName, danDetail } = message;

  var title = `天鳳 0w0 ${playerName} 開戰!`;
  var content = `快來觀看 ${playerName} (${danDetail}) 在天鳳的對戰`;

  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/link-48.png"),
    "title": title,
    "message": content
  }).then(notificationId => {
    idUrlMap[notificationId] = url
  })
}

browser.runtime.onMessage.addListener(notify);
browser.notifications.onClicked.addListener(onNotifyClicked);
browser.notifications.onClosed.addListener(onNotifyClickedClosed)
