const record = require('node-record-lpcm16');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

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

// Create a recognize stream
/*const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data =>
    process.stdout.write(
      JSON.stringify(data, null, "  ")
    )
  );*/
/*function startRecording() {
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
}*/
const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data =>
    process.stdout.write(
      JSON.stringify(data, null, "  ")
    )
  );

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
