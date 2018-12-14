'use strict';

const fs = require('fs');
const util = require('util');

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const speechToText = require('@google-cloud/speech');

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

let iteration_num = 0;
let max_iterations = 3;

let audioFileName = '';

//starting text
let starterText = 'I am sitting in a room different from the one you are in now. I am recording the sound of my speaking voice and I am going to play it back into the room again and again until the resonant frequencies of the room reinforce themselves so that any semblance of my speech, with perhaps the exception of rhythm, is destroyed. What you will hear, then, are the natural resonant frequencies of the room articulated by speech. I regard this activity not so much as a demonstration of a physical fact, but more as a way to smooth out any irregularities my speech might have.';

async function speakText(text) {
  if (iteration_num < max_iterations) {
    // Construct the request
    const request = {
      input: {text: text},
      // Select the language and SSML Voice Gender (optional)
      voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
      // Select the type of audio encoding
      audioConfig: {audioEncoding: 'LINEAR16'},
    };

    // Performs the Text-to-Speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    audioFileName = 'i_am_sitting_' + iteration_num + '.raw';
    await writeFile(audioFileName, response.audioContent, 'binary');
    console.log('Audio content written to file: ' + audioFileName);
    iteration_num++;
    writeSpeech();
  }
  else {
    console.log('Audio content complete');
    return;
  }


}

speakText(starterText).catch(console.error);

async function writeSpeech() {

  const client = new speechToText.SpeechClient();

  // Reads a local audio file and converts it to base64
  const file = fs.readFileSync(audioFileName);
  const audioBytes = file.toString('base64');

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 24000,
    languageCode: 'en-US',
    maxAlternatives: 10,
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: ${transcription}`);

  speakText(transcription);
}
//main().catch(console.error);
