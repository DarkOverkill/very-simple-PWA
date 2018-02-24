const db = firebase.database();

const update = () => {
  if (!navigator.onLine) {
    renderData();
    return alert('No connection!');
  }
  document.getElementById('updateBtn').disabled = true;
  const cors_api_url = 'https://cors-anywhere.herokuapp.com/';
  const url = 'https://coinmarketcap.com/currencies/bitcoin/';
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `${cors_api_url}${url}`, true);
  xhr.onload = function () {
    const btcToUsd = $(xhr.response).find('#quote_price')[0].getAttribute('data-usd');
    const updateTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    const data = {
      btcValue: btcToUsd,
      updateTime: updateTime
    }
    writeDataInDB(data);
  };
  xhr.send();
}

const writeDataInDB = (data) => {
  db.ref().set(data);
  updateDataFromDB();
}

const updateDataFromDB = () => {
  db.ref().once('value').then(function(snapshot) {
    localStorage.btcValue = snapshot.val().btcValue + '$';
    localStorage.updateTime = snapshot.val().updateTime;
    renderData();
  });
}

const renderData = () => {
  document.getElementById('btcValue').innerText = localStorage.btcValue;
  document.getElementById('updateTime').innerText = localStorage.updateTime;
  document.getElementById('updateBtn').disabled = false;
}


window.onload = () => {
  updateDataFromDB();
  // renderData();
}
