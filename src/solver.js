async function solveEquation(equation, userName) {
    try {
        if (!window.openAIKey) throw new Error('API key is not set. Please go back and confirm your API key.');

        const requestPayload = {
            model: "o3-mini", // Upgraded to o3-mini (18 Feb'2025) : Previous Model options: gpt-3.5-turbo, o1-mini etc. 
            messages: [
                {
                    role: "user",   // "system" for gpt-3.5-turbo, "user" for o1-mini
                    content: `You are a mathematics professor. Format all mathematical expressions using LaTeX:
                    - Use \\(...\\) for inline equations
                    - Use \\[...\\] for display equations
                    - Use \\frac{}{} for fractions
                    - Use ^{} for exponents
                    - Properly align equations
                    - Explain steps using proper mathematical notation
                    - Avoid markdown formatting
                    - Ensure correct LaTeX syntax`
                },
                {
                    role: "user",
                    content: `Solve and explain this equation in detail using LaTeX formatting: ${equation}. 
                              Start the output addressing the user: "Hi, ${userName}, Here is the solution with explanation."
                              provide the solution. Ensure to explain each step clearly and use LaTeX for all mathematical expressions.` 
                }
            ],
            max_completion_tokens: 10000, // max_tokens for gpt-3.5-turbo, max_completion_tokens for o1-mini
            temperature: 1               // 0.3 for gpt-3.5-turbo, 1 for o1-mini
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.openAIKey}`
            },
            body: JSON.stringify(requestPayload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        let solution = data.choices[0]?.message?.content.trim();

        // Post-process LaTeX formatting to ensure proper display
        // An important Update from Algebraic-Equation-GPT to V3.5 (V2 fixed formatting, V3 incorprated audio, V3.5 cross device compatibility)
            solution = solution
            .replace(/\\\(/g, '\\( ')
            .replace(/\\\)/g, ' \\)')
            .replace(/\\\[/g, '\\[')
            .replace(/\\\]/g, '\\]')
            .replace(/\$\$(.*?)\$\$/gs, '\\[$1\\]')
            .replace(/\$(.*?)\$/g, '\\($1\\)')
            .replace(/\\begin{equation\*?}/g, '\\[')
            .replace(/\\end{equation\*?}/g, '\\]');

        return solution;
    } catch (error) {
        console.error('solveEquation Error:', error);
        return `<p class="error-message">${error.message}</p>`;
    }
}

document.getElementById('solveExplainButton').addEventListener('click', async function() {
    const equation = document.getElementById('extractedEquation').value;
    const solutionOutput = document.getElementById('solutionOutput');
    const userName = document.getElementById('userName').value; // Retrieve username from input to be passed to the API
    
    if (!equation) {
        alert('Please extract an equation first.');
        return;
    }

    try {
        document.getElementById('loadingIndicator').style.display = 'flex';
        solutionOutput.classList.add('hidden');

        const solution = await solveEquation(equation, userName); // Pass retrieved username
        solutionOutput.innerHTML = solution;

        if (window.MathJax) {
            MathJax.typesetPromise([solutionOutput]).catch(err => {
                console.log('MathJax rendering error:', err);
                solutionOutput.textContent = solution;
            });
        }
    } catch (error) {
        solutionOutput.innerHTML = `<p class="error-message">${error.message}</p>`;
    } finally {
        document.getElementById('loadingIndicator').style.display = 'none';
        solutionOutput.classList.remove('hidden');
    }
});

// Clear solution button remains unchanged
document.getElementById('clearSolutionButton').addEventListener('click', function() {
    const solutionOutput = document.getElementById('solutionOutput');
    solutionOutput.innerHTML = '';
    if (window.MathJax) {
        MathJax.typesetClear([solutionOutput]);
    }
});