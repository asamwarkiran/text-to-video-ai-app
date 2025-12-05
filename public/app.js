const API_BASE = window.location.origin;

let currentRequestId = null;
let statusCheckInterval = null;

// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const generateAudioBtn = document.getElementById('generateAudioBtn');
const statusSection = document.getElementById('status');
const statusText = document.getElementById('statusText');
const resultsSection = document.getElementById('results');
const videoResult = document.getElementById('videoResult');
const audioResult = document.getElementById('audioResult');
const videoPlayer = document.getElementById('videoPlayer');
const audioPlayer = document.getElementById('audioPlayer');
const videoDownload = document.getElementById('videoDownload');
const audioDownload = document.getElementById('audioDownload');

// Generate Video
generateBtn.addEventListener('click', async () => {
    const videoPrompt = document.getElementById('videoPrompt').value.trim();
    const narrationText = document.getElementById('narrationText').value.trim();
    const resolution = document.getElementById('resolution').value;
    const aspectRatio = document.getElementById('aspectRatio').value;
    const negativePrompt = document.getElementById('negativePrompt').value.trim();
    const voice = document.getElementById('voice').value;

    if (!videoPrompt || !narrationText) {
        alert('Please fill in both video description and narration text');
        return;
    }

    // Disable button
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    // Show status
    statusSection.style.display = 'block';
    resultsSection.style.display = 'none';
    statusText.textContent = 'Generating video...';

    try {
        // Step 1: Generate Audio
        statusText.textContent = 'Generating audio narration...';
        const audioResponse = await fetch(`${API_BASE}/api/generate-audio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: narrationText,
                voice: voice
            })
        });

        const audioData = await audioResponse.json();
        
        if (!audioData.success) {
            throw new Error(audioData.error || 'Audio generation failed');
        }

        // Step 2: Generate Video
        statusText.textContent = 'Generating video (this may take 1-3 minutes)...';
        const videoResponse = await fetch(`${API_BASE}/api/generate-video`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: videoPrompt,
                resolution: resolution,
                aspectRatio: aspectRatio,
                negativePrompt: negativePrompt || undefined
            })
        });

        const videoData = await videoResponse.json();
        
        if (!videoData.success) {
            throw new Error(videoData.error || 'Video generation failed');
        }

        currentRequestId = videoData.requestId;

        // Start checking status
        checkVideoStatus(audioData.audioUrl);

    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
        resetUI();
    }
});

// Generate Audio Only
generateAudioBtn.addEventListener('click', async () => {
    const narrationText = document.getElementById('narrationText').value.trim();
    const voice = document.getElementById('voice').value;

    if (!narrationText) {
        alert('Please enter narration text');
        return;
    }

    generateAudioBtn.disabled = true;
    generateAudioBtn.textContent = 'Generating...';

    statusSection.style.display = 'block';
    resultsSection.style.display = 'none';
    statusText.textContent = 'Generating audio...';

    try {
        const response = await fetch(`${API_BASE}/api/generate-audio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: narrationText,
                voice: voice
            })
        });

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Audio generation failed');
        }

        // Show audio result
        statusSection.style.display = 'none';
        resultsSection.style.display = 'block';
        videoResult.style.display = 'none';
        audioResult.style.display = 'block';

        audioPlayer.src = data.audioUrl;
        audioDownload.href = data.audioUrl;

    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    } finally {
        generateAudioBtn.disabled = false;
        generateAudioBtn.textContent = 'Generate Audio Only';
    }
});

// Check video generation status
async function checkVideoStatus(audioUrl) {
    statusCheckInterval = setInterval(async () => {
        try {
            const response = await fetch(`${API_BASE}/api/check-status/${currentRequestId}`);
            const data = await response.json();

            if (data.status === 'SUCCESS') {
                clearInterval(statusCheckInterval);
                
                // Show results
                statusSection.style.display = 'none';
                resultsSection.style.display = 'block';
                videoResult.style.display = 'block';
                audioResult.style.display = 'block';

                videoPlayer.src = data.videoUrl;
                videoDownload.href = data.videoUrl;

                audioPlayer.src = audioUrl;
                audioDownload.href = audioUrl;

                resetUI();
            } else if (data.status === 'FAILED') {
                clearInterval(statusCheckInterval);
                throw new Error('Video generation failed');
            } else {
                statusText.textContent = `Processing... (${data.status})`;
            }
        } catch (error) {
            clearInterval(statusCheckInterval);
            console.error('Status check error:', error);
            alert(`Error: ${error.message}`);
            resetUI();
        }
    }, 5000); // Check every 5 seconds
}

// Reset UI
function resetUI() {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Video';
    generateAudioBtn.disabled = false;
    generateAudioBtn.textContent = 'Generate Audio Only';
}

// Load voices on page load
window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_BASE}/api/voices`);
        const data = await response.json();
        
        const voiceSelect = document.getElementById('voice');
        voiceSelect.innerHTML = '';
        
        data.voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice;
            option.textContent = voice;
            voiceSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load voices:', error);
    }
});
