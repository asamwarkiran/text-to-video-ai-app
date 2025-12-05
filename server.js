require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Bhindi API configuration
const BHINDI_API_KEY = process.env.BHINDI_API_KEY;
const BHINDI_API_BASE = process.env.BHINDI_API_BASE_URL || 'https://api.bhindi.io';

// Available voices list
const VOICES = [
  "Jennifer (English (US)/American)",
  "Dexter (English (US)/American)",
  "Ava (English (AU)/Australian)",
  "Tilly (English (AU)/Australian)",
  "Charlotte (Advertising) (English (CA)/Canadian)",
  "Cecil (English (GB)/British)",
  "Sterling (English (GB)/British)",
  "Cillian (English (IE)/Irish)",
  "Madison (English (IE)/Irish)",
  "Ada (English (ZA)/South african)",
  "Furio (English (IT)/Italian)",
  "Alessandro (English (IT)/Italian)",
  "Carmen (English (MX)/Mexican)",
  "Sumita (English (IN)/Indian)",
  "Navya (English (IN)/Indian)",
  "Baptiste (English (FR)/French)",
  "Lumi (English (FI)/Finnish)"
];

// Generate video endpoint
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, resolution, aspectRatio, negativePrompt, seed } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Call Bhindi API for video generation
    const response = await axios.post(
      `${BHINDI_API_BASE}/veo3/generate`,
      {
        prompt,
        modelName: 'veo3.1',
        resolution: resolution || '720p',
        aspectRatio: aspectRatio || '16:9',
        negativePrompt,
        seed
      },
      {
        headers: {
          'Authorization': `Bearer ${BHINDI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      requestId: response.data.requestId,
      message: 'Video generation started. Use the requestId to check status.'
    });
  } catch (error) {
    console.error('Video generation error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to generate video',
      details: error.response?.data || error.message
    });
  }
});

// Check video status endpoint
app.get('/api/check-status/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;

    const response = await axios.get(
      `${BHINDI_API_BASE}/veo3/status/${requestId}`,
      {
        headers: {
          'Authorization': `Bearer ${BHINDI_API_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Status check error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to check status',
      details: error.response?.data || error.message
    });
  }
});

// Generate audio endpoint
app.post('/api/generate-audio', async (req, res) => {
  try {
    const { text, voice, language } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const response = await axios.post(
      `${BHINDI_API_BASE}/tts/generate`,
      {
        text,
        voice: voice || 'Jennifer (English (US)/American)',
        language
      },
      {
        headers: {
          'Authorization': `Bearer ${BHINDI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      audioUrl: response.data.audioUrl,
      message: 'Audio generated successfully'
    });
  } catch (error) {
    console.error('Audio generation error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to generate audio',
      details: error.response?.data || error.message
    });
  }
});

// Get available voices
app.get('/api/voices', (req, res) => {
  res.json({ voices: VOICES });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Text-to-Video AI App running on http://localhost:${PORT}`);
  console.log(`📹 Video Generation: POST /api/generate-video`);
  console.log(`🎵 Audio Generation: POST /api/generate-audio`);
  console.log(`✅ Status Check: GET /api/check-status/:requestId`);
});
