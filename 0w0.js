const DANS = [
  // 0    1      2     3     4     5     6      7    8      9
 	"新人","９級","８級","７級","６級","５級","４級","３級","２級","１級",
  // 10    11    12    13    14    15    16     17   18     19
	"初段","二段","三段","四段","五段","六段","七段","八段","九段","十段",
  // 20
	"天鳳位"
];

const TWO_HOURS = 2 * 60 * 60 * 1000

// const subscriptionList = browser.storage.sync.get(subscriptionList)
// const subscriptedNames = browser.storage.sync.get(subscriptedNames)
const subscriptedNames = ['ドクロちゃん', '夜桜システム', '豚の王']

let notifiedUrls = new Set()

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
  console.log(battles)

  battles.forEach(battle => {
    const { playerName } = battle

    if (subscriptedNames.includes(playerName)) {
      console.log('Sent:')
      console.log(battle)
      notifyExtension(battle)
    }
  })
}

const onDocumentMutataion = function(mutationsList) {
  // Wait for tenhou javascript rendering
  setTimeout(run, 1000)
};

const observer = new MutationObserver(onDocumentMutataion);
const options = { attributes: true, childList: true, subtree: true }
observer.observe(document, options);
