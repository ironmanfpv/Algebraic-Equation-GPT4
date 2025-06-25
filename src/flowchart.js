// Initialize Flowchart Sliders (This feature was completed on 20th June'2025, Friday)
function initFlowchartSliders() {
    const tokenSlider = document.getElementById('flowchartTokenSlider');
    const tokenValue = document.getElementById('flowchartTokenValue');
    const tempSlider = document.getElementById('flowchartTempSlider');
    const tempValue = document.getElementById('flowchartTempValue');
    
    // Set initial values
    tokenValue.textContent = tokenSlider.value;
    tempValue.textContent = parseFloat(tempSlider.value).toFixed(1);
    
    // Update displays
    tokenSlider.addEventListener('input', () => {
        tokenValue.textContent = tokenSlider.value;
    });
    
    tempSlider.addEventListener('input', () => {
        tempValue.textContent = parseFloat(tempSlider.value).toFixed(1);
    });
}

// src/flowchart.js (This feature was completed on 13th June'2025, Friday)
async function createFlowchart(equation, userName) {
    try {
        if (!window.openAIKey) {
            throw new Error('API key is not set. Please go back and confirm your API key.');
        }
        
        // Get values from sliders
        const tokenBudget = parseInt(document.getElementById('flowchartTokenSlider').value);
        const temperature = parseFloat(document.getElementById('flowchartTempSlider').value);
         
        const requestPayload = {
            model: "gpt-4o", 
            messages: [{
                role: "system", 
                content: `You are an expert in mathematics education and flowchart design. 
                          Create a detailed flowchart laying out all the solution paths for this problem: ${equation}
                
                Follow these strict formatting rules:
                1. Use standard flowchart symbols:
                   - Terminator (start/end): rounded rectangle
                   - Data (input/output): right-slanting parallelogram
                   - Decision (question): diamond
                   - Process (operations): rectangle
                2. All symbols must contain text within them, describing their purpose
                3. Start equation on a different line. Do not break equation into 2 different lines.
                4. Connect symbols with arrows branching horizontally or vertically and bending at right angles.
                5. Arrows should not cut across another arrow when joining symbol to symbols 
                6. Label Decision branches with "Yes" or "No"
                7. Use Mermaid syntax for flowchart representation
                8. Ensure the flowchart is comprehensive, covering all possible solution paths.
                9. Use LaTeX for mathematical expressions, ensuring they are properly formatted.
                10. Follow the example structure below to ensure proper formatting and clarity.
                
                Example structure:
                \`\`\`mermaid
                graph TD
                A(["$$x^2$$"]) -->|"$$\sqrt{x+3}$$"| B[/"$$\frac{1}{2}$$"/]
                A -->|"$$\overbrace{a+b+c}^{\text{note}}$$"| C("$$\pi r^2$$")
                B --> D("$$x = \begin{cases} a &\text{if } b \\ c &\text{if } d \end{cases}$$")
                C --> E("$$x(t)=c_1\begin{bmatrix}-\cos{t}+\sin{t}\\ 2\cos{t} \end{bmatrix}e^{2t}$$")
                \`\`\``
            }, {
                role: "user",
                content:`Equation: ${equation}`
            }],
            max_tokens: tokenBudget, // Reference flowchartTokenValue value
            temperature: temperature // Reference flowchartTempValue value
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
        return data.choices[0]?.message?.content.trim();
    } catch (error) {
        console.error('createFlowchart Error:', error);
        return `<div class="error-message">${error.message}</div>`;
    }
}

function initMermaid() {
    if (window.mermaid) {
        mermaid.initialize({ 
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: { 
                useMaxWidth: true,
                htmlLabels: true,
                nodeSpacing: 50,
                rankSpacing: 100
            }
        });
    }
}

function renderMermaid() {
    if (window.mermaid) {
        try {
            mermaid.init(undefined, '#flowchartOutput .mermaid');
        } catch (e) {
            console.error('Mermaid rendering error:', e);
        }
    }
}

// Save flowchart as image
function saveAsImage(format) {
    const svgElement = document.querySelector('#flowchartOutput svg');
    if (!svgElement) {
        alert('No flowchart available to save!');
        return;
    }

    // Create canvas for conversion
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgSize = svgElement.getBoundingClientRect();
    
    // Set canvas dimensions
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;
    
    // Create and load image
    const img = new Image();
    img.onload = function() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // Create download link
        const link = document.createElement('a');
        link.download = `flowchart.${format}`;
        link.href = format === 'png' 
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', 0.95);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}

// Context menu handler with long-press support
function setupContextMenu() {
    const flowchartOutput = document.getElementById('flowchartOutput');
    const contextMenu = document.getElementById('flowchartContextMenu');
    let longPressTimer;
    const longPressDuration = 500; // milliseconds

    // Handle context menu show
    function showContextMenu(e) {
        if (!document.querySelector('#flowchartOutput svg')) return;
        
        contextMenu.classList.remove('hidden');
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
    }

    // Handle context menu hide
    function hideContextMenu() {
        contextMenu.classList.add('hidden');
    }

    // Touch handlers for long-press, iOS Support
    function handleTouchStart(e) {
        if (e.touches.length !== 1 || !document.querySelector('#flowchartOutput svg')) return;
        
        const touch = e.touches[0];
        const event = {
            pageX: touch.pageX,
            pageY: touch.pageY
        };
        
        longPressTimer = setTimeout(() => {
            showContextMenu(event);
        }, longPressDuration);
    }

    function handleTouchEnd() {
        clearTimeout(longPressTimer);
    }

    function handleTouchMove() {
        clearTimeout(longPressTimer);
    }

    // Mouse right-click handler
    function handleRightClick(e) {
        e.preventDefault();
        showContextMenu(e);
    }

    // Set up event listeners
    flowchartOutput.addEventListener('contextmenu', handleRightClick);
    flowchartOutput.addEventListener('touchstart', handleTouchStart);
    flowchartOutput.addEventListener('touchend', handleTouchEnd);
    flowchartOutput.addEventListener('touchmove', handleTouchMove);
    
    // Hide menu when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target) && 
            !flowchartOutput.contains(e.target)) {
            hideContextMenu();
        }
    });
    
    // Save as PNG handler
    document.getElementById('savePngBtn').addEventListener('click', () => {
        hideContextMenu();
        saveAsImage('png');
    });
    
    // Save as JPG handler
    document.getElementById('saveJpgBtn').addEventListener('click', () => {
        hideContextMenu();
        saveAsImage('jpg');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize sliders
    initFlowchartSliders();
    
    // Initialize context menu
    setupContextMenu();
    
    // Load Mermaid library
    const mermaidScript = document.createElement('script');
    mermaidScript.src = 'https://cdn.jsdelivr.net/npm/mermaid@11.6/dist/mermaid.min.js';
    mermaidScript.onload = initMermaid;
    document.head.appendChild(mermaidScript);

    // Get reference to loading indicator
    const flowchartLoadingIndicator = document.getElementById('flowchartLoadingIndicator');
    
    // Clear Flowchart
    document.getElementById('clearFlowchartButton').addEventListener('click', () => {
        document.getElementById('flowchartOutput').innerHTML = '';
        
        // Reset sliders to default values
        document.getElementById('flowchartTokenSlider').value = 7500;
        document.getElementById('flowchartTokenValue').textContent = '7500';
        document.getElementById('flowchartTempSlider').value = 0.5;
        document.getElementById('flowchartTempValue').textContent = '0.5';
    });

    // Create Flowchart
    document.getElementById('createFlowchartButton').addEventListener('click', async () => {
        const equation = document.getElementById('extractedEquation').value;
        const flowchartOutput = document.getElementById('flowchartOutput');
        
        if (!equation) {
            alert('Please extract an equation first.');
            return;
        }
        try {
            // Show loading indicator
            flowchartLoadingIndicator.style.display = 'flex';
            flowchartOutput.innerHTML = '';
            
            const userName = document.getElementById('userName').value;
            const flowchartData = await createFlowchart(equation, userName);
            
            // Extract Mermaid code from response
            let mermaidCode = flowchartData;
            const codeBlockMatch = flowchartData.match(/```mermaid\n([\s\S]*?)```/);
            if (codeBlockMatch) {
                mermaidCode = codeBlockMatch[1];
            }
            
            // Display flowchart
            flowchartOutput.innerHTML = `<div class="mermaid">${mermaidCode}</div>`;
            
            // Render with Mermaid
            setTimeout(() => {
                if (window.mermaid) {
                    renderMermaid();
                }
            }, 800); //800 ms delay to ensure DOM is ready
            
        } catch (error) {
            flowchartOutput.innerHTML = `<div class="error-message">${error.message}</div>`;
        } finally {
            // Hide loading indicator
            flowchartLoadingIndicator.style.display = 'none';
        }
    });

    // Exit Flowchart
    document.getElementById('exitFlowchartButton').addEventListener('click', () => {
        document.getElementById('exitButton').click();
    });
});
// Ensure the flowchart output is cleared on exit 