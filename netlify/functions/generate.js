exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt, duration, resolution, aspect_ratio, reference_images, apiKey } = JSON.parse(event.body);

        const response = await fetch('https://api.replicate.com/v1/models/bytedance/seedance-2.0/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: {
                    prompt,
                    duration,
                    resolution,
                    aspect_ratio,
                    ...(reference_images && { reference_images })
                }
            })
        });

        const prediction = await response.json();

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(prediction)
        };

    } catch (err) {
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: err.message })
        };
    }
};