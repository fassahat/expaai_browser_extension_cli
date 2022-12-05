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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ANALYSE') {
    chrome.runtime.sendMessage(
      {
        type: 'googlePatentText',
        payload: {
          message: getGooglePatentText(false, true),
        },
      },
      response => {
        highlightSentences(response.data)
      }
    );
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SEMANTIC_SEARCH') {
    chrome.runtime.sendMessage(
      {
        type: 'googlePatentTextSemanticSearch',
        payload: {
          question: request.payload.question,
          message: getGooglePatentText(false, false),
        },
      },
      response => {
        console.log(response.data)
        highlightSentences(response.data)
      }
    );
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});

function highlightSentences(sentenceObject) {
  const divTexts = getGooglePatentText(true, false)
  // console.log(divTexts)

  if ('answer' in sentenceObject) {
    const answer = sentenceObject['answer']
    const key = getKeyByMatchingText(divTexts, answer)
    if (key) {
      if (key.includes('CLM')) {
        highlighter(answer, '#00B4CC', false, key)
      } else {
        highlighter(answer, '#00B4CC', true, key)
      }
    }
  } else {
    for (const type in sentenceObject) {
      if (type === "advantages") {
        for (const sentence of sentenceObject["advantages"]) {
          const key = getKeyByMatchingText(divTexts, sentence)
          if (key) {
            if (key.includes('CLM')) {
              highlighter(sentence, '#CCFFCD', false, key)
            } else {
              highlighter(sentence, '#CCFFCD', true, key)
            }
          }
        }
      } else if (type === "solutions") {
        for (const sentence of sentenceObject["solutions"]) {
          const key = getKeyByMatchingText(divTexts, sentence)
          if (key) {
            if (key.includes('CLM')) {
              highlighter(sentence, '#F4EA56', false, key)
            } else {
              highlighter(sentence, '#F4EA56', true, key)
            }
          }
        }
      } else if (type === "problems") {
        for (const sentence of sentenceObject["problems"]) {
          const key = getKeyByMatchingText(divTexts, sentence)
          if (key) {
            if (key.includes('CLM')) {
              highlighter(sentence, '#FFCCCB', false, key)
            } else {
              highlighter(sentence, '#FFCCCB', true, key)
            }
          }
        }
      }
    }
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^$%{}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

function highlighter(sentence, color, query, key) {
  let element = null
  if (query) {
    element = document.querySelector(key)
  
    var myRegExp = new RegExp(escapeRegExp(sentence), 'gi')
    var final_str = element.innerHTML.replace(myRegExp, 
      function(str) {
        return `<span style="background-color:${color}">`+str+'</span>'
      });
    element.innerHTML= final_str
  } else {
    // document.getElementById(key).style.backgroundColor = color
    var elementText = document.getElementById(key).innerText
    // document.getElementById(key).innerHTML = `<span style="background-color:${color}">`+elementText+'</span>'
    document.getElementById(key).innerHTML = '<span>'+elementText+'</span>'
    element = document.getElementById(key)
  
    var myRegExp = new RegExp(escapeRegExp(sentence), 'gi')
    var final_str = element.innerHTML.replace(myRegExp, 
      function(str) {
        return `<span style="background-color:${color}">`+str+'</span>'
      });
    element.innerHTML= final_str
  }
}

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

function getGooglePatentText(getHash, getArray) {
  let divIdNum = 1
  let patentText = ''
  let hash = {}
  let claimTextArray = []
  const divIdPrefix = 'p-0000'
  const claimDivPrefix = 'CLM-00000'

  while (true) {
    let divIdNumString = divIdNum.toString()
    let divId = divIdPrefix.substr(0,divIdPrefix.length-divIdNumString.length) + divIdNumString
    if (document.querySelector(`[num=${divId}]`)) {
      let element = document.querySelector(`[num=${divId}]`)
      let text = element.innerText || element.textContent
      hash[`[num=${divId}]`] = text
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
      hash[divId] = text
      patentText = patentText + text
      claimTextArray.push(text)
      divIdNum = divIdNum + 1
    } else {
      break
    }
  }

  if (getHash) {
    return hash
  } else if (getArray) {
    return claimTextArray.concat(patentText.match( /[^\.!\?]+[\.!\?]+/g ))
  } else {
    return patentText
  }
}

function getKeyByMatchingText(object, value) {
  return Object.keys(object).find(key => object[key].includes(value));
}
