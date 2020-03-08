'use strict';

const {google} = require('googleapis');
const sampleClient = require('./sampleclient');

// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: sampleClient.oAuth2Client,
});

// a very simple example of searching for youtube videos
async function runSample() {
  const res = await youtube.search.list({
    part: 'id,snippet',
    q: 'Node.js on Google Cloud',
  });
  console.log(res.data);
}

const scopes = ['https://www.googleapis.com/auth/youtube'];

sampleClient
  .authenticate(scopes)
  .then(runSample)
  .catch(console.error);
