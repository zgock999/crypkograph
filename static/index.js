var URL_SEARCH = 'https://api.crypko.ai/crypkos/search'
var WARN_NUM = 36

function submit() {
  let ownerAddr = document.querySelector('input').value;
  let submitBtn = document.querySelector('button')
  let statusDiv = document.querySelector('.status')

  submitBtn.disabled = true;
  statusDiv.innerText = 'Generating graph. Please wait...'

  fetch(URL_SEARCH + `?category=all&sort=-id&ownerAddr=${ownerAddr}`).then((res) => {
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }).then((obj) => {
    let numOfCrypkos = obj['totalMatched'];
    if (numOfCrypkos > WARN_NUM) {
      statusDiv.innerText +=
        `\nYour crypko collection is larger than ${WARN_NUM}. Only first ${WARN_NUM} crypkos will be shown.`;
    }

    return fetch(`/api/render?owner_addr=${ownerAddr}`)
  }).then((res) => {
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      statusDiv.innerHTML = `
        <img src="/generated/${ownerAddr}.gv.png" style="width: 100%"/>
        <a href="/generated/${ownerAddr}.gv.pdf">Download PDF</a>
      `;
  }).catch((err) => {
    statusDiv.innerText = `Error! ${err.message}`;
  });
}
