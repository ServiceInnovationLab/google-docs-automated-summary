const fs = require("fs");
const { google } = require("googleapis");
require("dotenv").config();

const raw = fs.readFileSync(process.env.SERVICE_CREDS);
const serviceCredentials = JSON.parse(raw);
// configure a JWT auth client
let jwtClient = new google.auth.JWT(
  serviceCredentials.client_email,
  null,
  serviceCredentials.private_key,
  [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.appdata",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.metadata",
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/drive.photos.readonly",
    "https://www.googleapis.com/auth/drive.readonly"
  ]
);
//authenticate request
jwtClient.authorize(function(err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Successfully connected!");
  }
});

let drive = google.drive("v3");
drive.files.list(
  {
    auth: jwtClient
  },
  function(err, response) {
    if (err) {
      console.log("The API returned an error: " + err);
      return;
    }
    var files = response.data.files;
    console.log(files);
    if (files.length == 0) {
      console.log("No files found.");
    } else {
      console.log("Files from Google Drive:");
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        console.log("%s (%s)", file.name, file.id);
      }
    }
  }
);
