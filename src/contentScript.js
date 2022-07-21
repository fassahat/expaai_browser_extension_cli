'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
// const pageTitle = document.getElementsByTagName('title')[0].innerHTML;
// const embedText = document.body.getElementsByTagName('embed')[0].outerHTML

let isPDF = false
if (document.querySelectorAll("embed")[0]) {
 isPDF = document.querySelectorAll("embed")[0].type == "application/pdf"
}
console.log(isPDF)
// console.log(document.querySelectorAll("embed"))

// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Con. I am from ContentScript.',
    },
  },
  response => {
    console.log(response.message);
  }
);

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log(`Current count is ${request.payload.count}`);
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});

async function myDisplay() {
  let myPromise = new Promise(function(resolve, reject) {
    resolve("I love You !!");
  });

  return await myPromise
}

(async () => {
  let message = await myDisplay();
  // let tab = await getCurrentTab();
  // var pdf = pdfjsLib.getDocument('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGSS',
      payload: {
        message: message,
      },
    },
    response => {
      console.log(response.msg);
    }
  );
})();

function getGooglePatentText() {
  let divIdNum = 1
  let patentText = ''
  const divIdPrefix = 'p-0000'
  const claimDivPrefix = 'CLM-00000'

  while (true) {
    let divIdNumString = divIdNum.toString()
    let divId = divIdPrefix.substr(0,divIdPrefix.length-divIdNumString.length) + divIdNumString
    if (document.querySelector(`[num=${divId}]`)) {
      let element = document.querySelector(`[num=${divId}]`)
      let text = element.innerText || element.textContent
      patentText = patentText + text
      divIdNum = divIdNum + 1
    } else {
      divIdNum = 1
      break
    }
  }

  while (true) {
    let divIdNumString = divIdNum.toString()
    let divId = claimDivPrefix.substr(0,claimDivPrefix.length-divIdNumString.length) + divIdNumString
    if (document.getElementById(divId)) {
      let element = document.getElementById(divId)
      let text = element.innerText || element.textContent
      patentText = patentText + text
      divIdNum = divIdNum + 1
    } else {
      break
    }
  }

  // console.log(patentText)

  return patentText.match( /[^\.!\?]+[\.!\?]+/g )
}

chrome.runtime.sendMessage(
  {
    type: 'googlePatentText',
    payload: {
      message: getGooglePatentText(),
    },
  },
  response => {
    console.log(response.data);
  }
);