async function generateSection1() {
    const status = document.getElementById('status-1');
    const output = document.getElementById('output-1');
    const btn = document.getElementById('generate-btn-1');

    if (!apiKey) {
        status.style.color = '#ff4444';
        status.textContent = 'Please save your Replicate API key at the top of the page first.';
        return;
    }

    const prompt = document.getElementById('prompt-1').value.trim();
    if (!prompt) {
        status.style.color = '#ff4444';
        status.textContent = 'Please enter a prompt before generating.';
        return;
    }

    const duration = parseInt(document.getElementById('duration-1').value);
    const resolution = document.getElementById('resolution-1').value;
    const aspect_ratio = document.getElementById('aspect-1').value;
    const imageFile = document.getElementById('image1-upload').files[0];

    btn.disabled = true;
    btn.textContent = 'Generating...';
    status.style.color = '#888';
    status.textContent = 'Starting generation — this may take 60-90 seconds...';
    output.innerHTML = '';

    try {
        const body = { prompt, duration, resolution, aspect_ratio, apiKey };

        if (imageFile) {
            const base64 = await fileToBase64(imageFile);
            body.reference_images = [base64];
        }

        const response = await fetch('/.netlify/functions/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const prediction = await response.json();

        if (!response.ok) {
            throw new Error(prediction.detail || 'Failed to start generation');
        }

        const videoUrl = await pollPrediction(prediction.id, status);

output.innerHTML = `
    <video controls autoplay loop>
        <source src="${videoUrl}" type="video/mp4">
    </video>
    <a class="video-download" href="${videoUrl}" target="_blank">Download video</a>
    <p class="video-warning">⚠️ Download your video now. This link is temporary — if you leave or refresh this page the video will be gone.</p>
`;
        status.style.color = '#1D9E75';
        status.textContent = '✓ Video generated successfully!';

    } catch (err) {
        status.style.color = '#ff4444';
        status.textContent = `Error: ${err.message}`;
    } finally {
        btn.disabled = false;
        btn.textContent = 'Generate Video';
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

document.getElementById('image1-upload').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('image-preview');
            const container = document.getElementById('image-preview-container');
            preview.src = e.target.result;
            container.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});