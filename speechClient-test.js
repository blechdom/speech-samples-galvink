const record = require('node-record-lpcm16');
//import { inspect } from 'util';
const util = require('util');
// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();
//
console.log("client: " + util.inspect(client));
//console.log("client: " + JSON.stringify(client, null, "  "));

const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: false, // If you want interim results, set this to true
};
console.log("request: " + JSON.stringify(request, null, "  "));

//console.log("client with request: " + JSON.stringify(client.streamingRecognize(request), null, "  "));

const recognizeStream = client
  .streamingRecognize(request)
  .addListener('error', console.error)
  .addListener('data', data =>
    process.stdout.write(
      JSON.stringify(data, null, "  ")
    )
  );
console.log("recognizeStream: " + JSON.stringify(recognizeStream, null, "  "));

/*
(function startRecording(){

  console.log("starting to record");
  record.stop;

  recognizeStream.cancel;
  console.log("operation" + recognizeStream.getOperation);

  record
    .start({
      sampleRateHertz: sampleRateHertz,
      threshold: 0,
      verbose: false,
      recordProgram: 'rec',
      silence: '10.0',
    })
    .on('error', console.error)
    .pipe(recognizeStream);
  setTimeout(startRecording,30000);
})(); //at Interval here to reset recording...
console.log('Listening, press Ctrl+C to stop.');
*/
