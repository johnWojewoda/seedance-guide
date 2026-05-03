let apiKey = '';

function saveApiKey() {
    const input = document.getElementById('api-key-input');
    const status = document.getElementById('api-key-status');
    apiKey = input.value.trim();
    if (apiKey.startsWith('r8_')) {
        status.style.color = '#1D9E75';
        status.textContent = '✓ API key saved! You can now use the generators below.';
        input.value = '';
    } else {
        status.style.color = '#ff4444';
        status.textContent = 'That doesn\'t look right — Replicate keys start with r8_';
    }
}

async function pollPrediction(predictionId, statusEl) {
    while (true) {
        const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        const prediction = await response.json();

        if (prediction.status === 'succeeded') {
            return prediction.output;
        } else if (prediction.status === 'failed') {
            throw new Error('Generation failed. Please try again.');
        }

        statusEl.textContent = `Status: ${prediction.status}... please wait`;
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}