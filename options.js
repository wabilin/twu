const DANS = [
  // 0    1      2     3     4     5     6      7    8      9
 	"新人","９級","８級","７級","６級","５級","４級","３級","２級","１級",
  // 10    11    12    13    14    15    16     17   18     19
	"初段","二段","三段","四段","五段","六段","七段","八段","九段","十段",
  // 20
	"天鳳位"
];
const DEFAULT_PALYERS = ['トトリ先生19歳'];

let subscriptedNames = undefined;
let subscriptedDan = undefined;

function saveOptions() {
  let namesJson = undefined
  if (subscriptedNames !== undefined) {
    namesJson = JSON.stringify(subscriptedNames)
  }
  browser.storage.sync.set({
    subscriptedDan,
    subscriptedNames: namesJson,
  });
}

function addNameToTable(namesBody, name) {
  const row = namesBody.insertRow(namesBody.rows.length)

  const sell0 = row.insertCell(0);
  sell0.appendChild( document.createTextNode(name) )
  const sell1 = row.insertCell(1);

  const x = document.createElement('button')
  x.appendChild(document.createTextNode('x'));

  sell1.appendChild(x)
  x.onclick = () => {
    namesBody.removeChild(row)
    subscriptedNames = subscriptedNames.filter(val => val !== name)
    saveOptions()
  }
}

function restoreNames(namesJson) {
  if (namesJson) {
    subscriptedNames = JSON.parse(namesJson);
  }

  subscriptedNames = subscriptedNames || DEFAULT_PALYERS

  const namesBody = document.querySelector('#subscripted-names-table-body')
  namesBody.innerHTML = ''

  subscriptedNames.forEach(name => {
    addNameToTable(namesBody, name)
  })

  const newPlayerInput = document.getElementById("new-player-name-input")
  const newPlayerBtn = document.getElementById("new-player-name-btn")
  const addNameFromInput = () => {
    const name = newPlayerInput.value
    if (!name || subscriptedNames.includes(name)) { return }

    newPlayerInput.value = '';
    subscriptedNames = [...subscriptedNames, name];
    addNameToTable(namesBody, name);
    saveOptions()
  }
  newPlayerBtn.onclick = addNameFromInput;

  newPlayerInput.onkeypress = (e) => {
    if (e.keyCode === 13) {
      addNameFromInput()
      return false;
    }
    return true;
  };
}

function restoreDan(dan) {
  const selector = document.getElementById('dan-select');
  for (let i = selector.options.length - 1; i >= 0; i -= 1) {
    selector.remove(i);
  }

  if (dan && typeof(dan) === 'string') {
    dan = parseInt(dan, 10)
  }

  // 7 dan ~ tenhou
  const options = ['x', 16, 17, 18, 19, 20].map(val => {
    const option = document.createElement("option");
    option.text = val === 'x' ? 'x' : DANS[val];
    option.value = val
    if (val === dan || (val === 'x' && !dan)) {
      option.selected = true
    }

    return option
  })

  options.forEach(option => selector.add(option))

  selector.onchange = () => {
    const selected = selector.value
    subscriptedDan = selected
    saveOptions()
    selector.blur()
    return false
  }
}

function restoreOptions() {
  // var storageItem = browser.storage.managed.get('colour');
  // storageItem.then((res) => {
  //   document.querySelector("#managed-colour").innerText = res.colour;
  // });

  browser.storage.sync.get(['subscriptedNames', 'subscriptedDan'])
  .then(res => {
    restoreNames(res.subscriptedNames)
    restoreDan(res.subscriptedDan)
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
