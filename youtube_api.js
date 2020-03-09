const {google} = require('googleapis');
require("dotenv").config();
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YT_KEY // specify your API key here
});

const params = {
  part: 'snippet',
  type: 'video',
  maxResults: 10,
  q: 'surf'
};

async function main(params) {
  const res = await youtube.search.list(params);
  console.log(res.data.items[0].id.videoId)
};

main(params);

// 'use strict';

// const {google} = require('googleapis');
// const sampleClient = require('./sampleclient');

// // initialize the Youtube API library
// const youtube = google.youtube({
//   version: 'v3',
//   auth: sampleClient.oAuth2Client,
// });

// // a very simple example of searching for youtube videos
// async function runSample() {
//   const res = await youtube.search.list({
//     part: 'snippet',
//     q: 'surfing',
//     maxResults: 10,
//     type: 'video'
//   });
//   console.log(res.data.items[0].id.videoId);
// }

// const scopes = ['https://www.googleapis.com/auth/youtube'];

// sampleClient
//   .authenticate(scopes)
//   .then(runSample)
//   .catch(console.error);
