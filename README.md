# Text-to-Video AI App

AI-powered application that converts text into HD quality videos with character audio narration using Google Veo 3 and PlayAI TTS.

## Features

- **Text-to-Video Generation**: Convert text prompts into high-quality videos using Google Veo 3
- **Character Audio**: Generate natural-sounding voiceovers with PlayAI TTS (40+ voices)
- **HD Quality**: Support for 720p and 1080p video output
- **Multiple Aspect Ratios**: 16:9, 9:16, and 1:1
- **Voice Selection**: Choose from 60+ voices across 15+ languages
- **Audio Integration**: Automatic audio generation with video

## Tech Stack

- **Backend**: Node.js with Express
- **Video Generation**: Google Veo 3.1 (via Bhindi API)
- **Audio Generation**: PlayAI TTS v3
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Modern responsive UI

## Installation

```bash
# Clone the repository
git clone https://github.com/asamwarkiran/text-to-video-ai-app.git
cd text-to-video-ai-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API credentials

# Start the server
npm start
```

## Environment Variables

```
BHINDI_API_KEY=your_bhindi_api_key_here
PORT=3000
```

## Usage

1. Enter your text prompt describing the video you want to create
2. Select video quality (720p or 1080p)
3. Choose aspect ratio (16:9, 9:16, or 1:1)
4. Enter narration text for the voiceover
5. Select a voice from 60+ available options
6. Click "Generate Video" and wait for processing
7. Download your HD video with audio

## API Endpoints

- `POST /api/generate-video` - Generate video from text
- `POST /api/generate-audio` - Generate audio narration
- `GET /api/check-status/:requestId` - Check video generation status
- `GET /api/voices` - Get available TTS voices

## License

MIT

## Author

Created by Asamwar Kiran
