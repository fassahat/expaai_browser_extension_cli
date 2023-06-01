# <img src="public/icons/icon_48.png" width="45" align="left"> Expaai Browser Extension

This git project contains the code for the chromium browser extension which calls our EXPAAI model API to do the sentiment analysis or semantic search on the already opened patent on the browser with help of trained and pre-trained BERT models.

## Features

- Sentiment nnalysis of the patent text
- Semantic search for patents

## Install

As this chrome extension is not yet on the chrome web browser, to install it on your chrome browser you can choose one of the following ways. But for each of these to work make sure that `Developer mode` on your chrome browser extension page is turned on.

### Download the project folder from Google drive

In this the chrome extension requests the API that is deployed locally at the `3000` port number. Download the complete folder from [here](https://drive.google.com/drive/folders/14nwO1owq3ZVWzNJu5IN6PB7hGve4KOmj?usp=drive_link) and do the following;

1. From chrome browser settings page, select and go to extensions page.
2. Turn the developer mode on.
3. Click on `Load unpacked`.
4. Select the build folder of already downloaded chrome project.
5. EXPAAI extension is installed.

### Using [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli)

1. Install [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli).
2. Download or pull source code of chrome extension from git.
3. Make changes to the code(port number, API URL) as per your requirements.
4. Build the browser extension using `npm run build` command.
5. Then follow from 2nd step from above.

## Important

For browser extension work properly the `EXPAAI Model API` also has to be deployed locally. See [this](https://github.com/fassahat/expaai_model_api) git project for more details on deploying this API locally.

## Contribution

Suggestions and pull requests are welcomed!.

---

This project was bootstrapped with [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli)

