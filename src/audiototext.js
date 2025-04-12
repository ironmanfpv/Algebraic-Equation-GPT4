let mediaRecorder;
let audioChunks = [];
let recording = false;
let audioStream;

// Universal MIME type handler
function getSupportedMimeType() {
    const types = [
        'audio/webm;codecs=opus',
        'audio/mp4;codecs=mp4a',
        'audio/mpeg'
    ];
    return types.find(type => MediaRecorder.isTypeSupported(type)) || '';
}

// iOS-compatible audio converter
async function convertForWhisper(blob) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000
    });
    
    // Convert any format to 16kHz mono
    const buffer = await blob.arrayBuffer();
    const audioData = await ctx.decodeAudioData(buffer);
    
    const offlineCtx = new OfflineAudioContext({
        numberOfChannels: 1,
        length: audioData.length * (16000 / audioData.sampleRate),
        sampleRate: 16000
    });

    const source = offlineCtx.createBufferSource();
    source.buffer = audioData;
    source.connect(offlineCtx.destination);
    source.start();
    const renderedBuffer = await offlineCtx.startRendering();
    return encodeWAV(renderedBuffer.getChannelData(0));
}

function encodeWAV(samples) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 32 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 16000, true);
    view.setUint32(28, 32000, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    const floatTo16Bit = (output, offset, input) => {
        for (let i = 0; i < input.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    };

    floatTo16Bit(new DataView(buffer, 44), 0, samples);
    return new Blob([view], { type: 'audio/wav' });
}

document.getElementById('sayEquationButton').addEventListener('click', async function(e) {
    try {
        if (recording) {
            mediaRecorder.stop();
            return;
        }

        audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                sampleRate: 16000,
                channelCount: 1,
                noiseSuppression: false,
                echoCancellation: false,
                autoGainControl: false
            }
        });

        const options = {
            mimeType: getSupportedMimeType(),
            audioBitsPerSecond: 16000
        };

        mediaRecorder = new MediaRecorder(audioStream, options);
        recording = true;
        audioChunks = [];

        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        
        mediaRecorder.onstop = async () => {
            try {
                const audioBlob = new Blob(audioChunks);
                const whisperReadyBlob = await convertForWhisper(audioBlob);
                await transcribeAudio(whisperReadyBlob);
            } catch (error) {
                handleError(error);
            } finally {
                audioStream.getTracks().forEach(t => t.stop());
                recording = false;
                this.classList.remove('recording');
            }
        };

        mediaRecorder.start();
        this.classList.add('recording');
    } catch (error) {
        handleError(error);
    }
});

async function transcribeAudio(blob) {
    const equationField = document.getElementById('extractedEquation');
    const statusMessage = document.getElementById('extractionStatus');
    
    if (!window.openAIKey) {
        showStatus('API key required', true);
        return;
    }

    try {
        equationField.disabled = true;
        showStatus('Processing...', false);

        const formData = new FormData();
        formData.append('file', blob, 'audio.wav');   // circumventing the MIME type issue; ensuring platform compatibility.
        formData.append('model', 'whisper-1');
        formData.append('language', 'en'); // Force English transcription ; an important step to reduce transcription errors.

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: { Authorization: `Bearer ${window.openAIKey}` },
            body: formData
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const result = await response.json();
        equationField.value = result.text || '';
        showStatus(result.text ? 'Success!' : 'No speech detected', !result.text);
        
    } catch (error) {
        console.error('Transcription failed:', error);
        showStatus(`Error: ${error.message}`, true);
    } finally {
        equationField.disabled = false;
        equationField.style.height = `${equationField.scrollHeight}px`;
    }
}

function showStatus(message, isError) {
    const status = document.getElementById('extractionStatus');
    status.textContent = message;
    status.style.color = isError ? '#ff4444' : '#666';
}

function handleError(error) {
    console.error('Recording error:', error);
    showStatus(`Error: ${error.message}`, true);
    if (audioStream) audioStream.getTracks().forEach(t => t.stop());
    recording = false;
    document.getElementById('sayEquationButton').classList.remove('recording');
}