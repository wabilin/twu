const TWO_HOURS = 2 * 60 * 60 * 1000;

let notifiedUrls = new Set();

function notifyExtension(battle) {
  const { url } = battle
  if (notifiedUrls.has(url)) { return }

  notifiedUrls.add(url)
  setTimeout(() => {
    if (notifiedUrls.has(url)) {
      notifiedUrls.delete(url)
    }
  }, TWO_HOURS)

  browser.runtime.sendMessage(battle);
};

// Parse <div class='b'> in http://tenhou.net/0/wg/
function parseBDiv(div) {
  const [danDiv, a] = div.children;
  const danStr = danDiv.className.replace('dan', '')
  return {
    danDetail: danDiv.innerHTML,
    dan: parseInt(danStr, 10),
    url: a.href,
    playerName: a.innerHTML,
  }
}

function run() {
  const bDivs = document.querySelectorAll(".b");
  const battles = [...bDivs].map(parseBDiv);

  browser.storage.sync.get(['subscriptedNames', 'subscriptedDan'])
  .then((res) => {
    const namesJson = res.subscriptedNames
    const subscriptedNames = namesJson ? JSON.parse(namesJson) : [];

    let { subscriptedDan } = res
    if (subscriptedDan && typeof(subscriptedDan) === 'string') {
      if (subscriptedDan === 'x') {
        subscriptedDan = undefined
      } else {
        subscriptedDan = parseInt(subscriptedDan, 10)
      }
    }

    battles.forEach(battle => {
      const { playerName, dan } = battle

      if (subscriptedNames.includes(playerName) ||
          (subscriptedDan && dan >= subscriptedDan)) {
        notifyExtension(battle)
      }
    })
  })
}

const onDocumentMutataion = function(mutationsList) {
  // Wait for tenhou javascript rendering
  setTimeout(run, 1000)
};

const observer = new MutationObserver(onDocumentMutataion);
const options = { attributes: true, childList: true, subtree: true }
observer.observe(document, options);
