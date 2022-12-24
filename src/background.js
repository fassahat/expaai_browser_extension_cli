'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    const message = `Hi ${
      sender.tab ? 'Con' : 'Pop'
    }, my name is Bac. I am from Background. It's great to hear from you.`;

    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    // Send a response message
    sendResponse({
      message,
    });
  } 
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGSS') {
    const message = `Hi ${
      sender.tab ? 'Con' : 'Pop'
    }, my name is Bac. I am from Background. It's great to hear from you...`;

    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    // Send a response message

    const msg = request.payload.message
    sendResponse({
      msg,
    });
  } 
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'googlePatentText') {

    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    // Send a response message

    chrome.runtime.sendMessage({
      msg: "something_started"
    })

    fetch('http://localhost:105/sentiment_predict', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "sentences": request.payload.message })
    }).then(function(res) {
      if (res.status !== 200){
        sendResponse({ msg: 'api error!' })
      }

      res.json().then(function(data) {
        sendResponse({ data })
        chrome.runtime.sendMessage({
          msg: "something_completed"
        })
      })
    });
  } else if (request.type === 'googlePatentTextSemanticSearch') {

    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    // Send a response message

    chrome.runtime.sendMessage({
      msg: "something_started"
    })

    fetch('http://localhost:105/semantic_search', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "patent_text": request.payload.message,
        // "question": "what is the disadvantage related to the mousetrap"
        "question": request.payload.question
      })
    }).then(function(res) {
      if (res.status !== 200){
        sendResponse({ msg: 'api error!' })
      }

      res.json().then(function(data) {
        sendResponse({ data })
        chrome.runtime.sendMessage({
          msg: "something_completed"
        })
      })
    });
  }

  return true
});


