// Initialize Solution Token Slider (This feature was completed on 20th June'2025, Friday)
function initSolutionTokenSlider() {
    const slider = document.getElementById('solutionTokenSlider');
    const valueDisplay = document.getElementById('solutionTokenValue');
    
    // Set initial display value
    valueDisplay.textContent = slider.value;
    
    // Update display when slider moves
    slider.addEventListener('input', () => {
        valueDisplay.textContent = slider.value;
    });
}

async function solveEquation(equation, userName) {
    try {
        if (!window.openAIKey) throw new Error('API key is not set. Please go back and confirm your API key.');

        // Get token budget from slider
        const tokenBudget = parseInt(document.getElementById('solutionTokenSlider').value);

        const requestPayload = {
            model: "o3-mini",     // Upgraded to o3-mini (18 Feb'2025) : Previous Model options: gpt-3.5-turbo, o1-mini etc. 
            messages: [
                {
                    role: "user", // "system" for gpt-3.5-turbo, "user" for o1-mini
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
            max_completion_tokens: tokenBudget, // Use solutionTokenValue value
            temperature: 1                      // 0.3 for gpt-3.5-turbo, 1 for o1-mini, 1 for o3-mini
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

// Initialize PDF saving functionality with iOS support
function initSolutionPDFSave() {
    const solutionOutput = document.getElementById('solutionOutput');
    const solutionContextMenu = document.getElementById('solutionContextMenu');
    const saveSolutionAsPdf = document.getElementById('saveSolutionAsPdf');
    let longPressTimer;

    // Show context menu on right-click
    solutionOutput.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        if (solutionOutput.innerHTML.trim() === '') return;
        solutionContextMenu.style.left = `${e.pageX}px`;
        solutionContextMenu.style.top = `${e.pageY}px`;
        solutionContextMenu.classList.remove('hidden');
    });

    // iOS touch support: long-press detection ; Successful integration on 15 June'2025
    solutionOutput.addEventListener('touchstart', function(e) {
        if (solutionOutput.innerHTML.trim() === '') return;
        longPressTimer = setTimeout(() => {
            const touch = e.touches[0];
            solutionContextMenu.style.left = `${touch.pageX}px`;
            solutionContextMenu.style.top = `${touch.pageY}px`;
            solutionContextMenu.classList.remove('hidden');
            e.preventDefault();
        }, 500); // 500ms long-press duration
    });

    solutionOutput.addEventListener('touchend', function() {
        clearTimeout(longPressTimer);
    });

    solutionOutput.addEventListener('touchmove', function() {
        clearTimeout(longPressTimer);
    });

    // Hide context menu when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!solutionContextMenu.contains(e.target)) {
            solutionContextMenu.classList.add('hidden');
        }
    });

    // Handle PDF saving using browser print
    saveSolutionAsPdf.addEventListener('click', function() {
        solutionContextMenu.classList.add('hidden');
        const solutionOutput = document.getElementById('solutionOutput');
        
        if (solutionOutput.innerHTML.trim() === '') {
            alert('Solution is empty. Nothing to save.');
            return;
        }
        
        // Create a print-friendly version
        const printWindow = window.open('', '_blank');
        const printDate = new Date().toLocaleDateString();
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Algebraic Equation GPT4 Solution</title>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 2cm;
                        line-height: 1.6;
                    }
                    .print-header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .print-content {
                        margin: 30px 0;
                    }
                    .print-footer {
                        text-align: center;
                        margin-top: 30px;
                        font-size: 0.9em;
                        color: #666;
                    }
                    .error-message {
                        color: #cc0000;
                        font-weight: bold;
                        padding: 10px;
                        border: 1px solid #cc0000;
                        border-radius: 4px;
                        background-color: #ffe6e6;
                    }
                    .MathJax {
                        color: #000 !important;
                    }
                </style>
                <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"><\/script>
            </head>
            <body>
                <div class="print-header">
                    <h1>Algebraic Equation GPT4 Solution</h1>
                    <h3>Generated on ${printDate}</h3>
                    <hr>
                </div>
                <div class="print-content">
                    ${solutionOutput.innerHTML}
                </div>
                <div class="print-footer">
                    <hr>
                    <p>Generated by Algebraic Equation GPT4</p>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() {
                            window.close();
                        }, 1000);
                    };
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize token slider
    initSolutionTokenSlider();
    
    // Solve button functionality
    document.getElementById('solveExplainButton').addEventListener('click', async function() {
        const equation = document.getElementById('extractedEquation').value;
        const solutionOutput = document.getElementById('solutionOutput');
        const userName = document.getElementById('userName').value;
        
        if (!equation) {
            alert('Please extract an equation first.');
            return;
        }

        try {
            document.getElementById('loadingIndicator').style.display = 'flex';
            solutionOutput.classList.add('hidden');

            const solution = await solveEquation(equation, userName);
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

    // Clear solution button
    document.getElementById('clearSolutionButton').addEventListener('click', function() {
        const solutionOutput = document.getElementById('solutionOutput');
        solutionOutput.innerHTML = '';
        
        // Reset token slider to default
        document.getElementById('solutionTokenSlider').value = 8000;
        document.getElementById('solutionTokenValue').textContent = '8000';
        
        if (window.MathJax) {
            MathJax.typesetClear([solutionOutput]);
        }
    });

    // Initialize PDF saving functionality
    initSolutionPDFSave();
});