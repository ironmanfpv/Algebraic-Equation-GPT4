async function extractEquationFromImage(image) {
    try {
        console.log('[Vision] Initializing extraction');
        
        // 1. Validate global API key ; Use only OPENAI API key
        if (!window.openAIKey?.startsWith('sk-')) {
            throw new Error('Invalid OpenAI API key format');
        }

        // 2. Validate image file
        if (!image || !image.type.startsWith('image/')) {
            throw new Error('Please upload a valid image file (JPEG/PNG)');
        }

        // 3. Convert to base64 format
        const { mime, data } = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const [header, base64] = reader.result.split(',');
                resolve({
                    mime: header.match(/:(.*?);/)[1],
                    data: base64
                });
            };
            reader.onerror = () => reject(new Error('Failed to read image'));
            reader.readAsDataURL(image);
        });

        // 4. API Request with updated model
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.openAIKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o", // Current model name
                messages: [{
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Convert this image to raw LaTeX equation. Rules:
                            1. Output ONLY the equation
                            2. Use standard LaTeX math syntax
                            3. No explanations or text
                            Example: \\frac{x}{2} = \\sqrt{y^2 + 1}`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mime};base64,${data}`,
                                detail: "auto" //low, high or auto 
                            }
                        }
                    ]
                }],
                max_tokens: 1000
            })
        });

        // 5. Handle response
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`API Error: ${error.error?.message || response.statusText}`);
        }

        // 6. Process output
        const result = await response.json();
        let equation = result.choices[0].message.content
            .replace(/^["'`]*(equation|expression):?\s*/i, '')
            .replace(/["'`]/g, '')
            .trim();

        // 7. Final validation
        if (!equation || !/[=+\-*/^()]/.test(equation)) {
            throw new Error('No valid equation detected');
        }

        return equation;
    } catch (error) {
        console.error('[Vision] Extraction Error:', error);
        throw new Error(`Vision Processing Failed: ${error.message}`);
    }
}