# Voiceflow Voice Chat

A simple voice-enabled chat interface using Voiceflow and Web Speech API. Users can speak to interact with the Voiceflow chatbot.

## Features

- Voice recognition for hands-free interaction
- Real-time speech-to-text transcription
- Integration with Voiceflow chat widget
- Clean, modern UI
- Works best in Chrome browser

## Usage

1. Visit the deployed site at: `https://[your-github-username].github.io/voiceflow-chat/`
2. Allow microphone access when prompted
3. Click "Start Talking" to begin voice recognition
4. Speak your message
5. The Voiceflow chatbot will respond in the chat widget

## Local Development

To run locally:

1. Clone this repository
2. Open `index.html` in a web browser
   
Or serve using Python's HTTP server:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Web Speech API
- Voiceflow Chat Widget API

## Browser Support

This application works best in Google Chrome as it uses the `webkitSpeechRecognition` API.
