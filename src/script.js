function toggleKeyMask() {
    const keyField = document.getElementById('apiKey');
    const maskCheckbox = document.getElementById('maskKey');
    keyField.type = maskCheckbox.checked ? 'password' : 'text';
}

document.getElementById('confirmButton').addEventListener('click', function() {
    const userName = document.getElementById('userName').value;
    const key = document.getElementById('apiKey').value;

    if (userName && key) {
        window.openAIKey = key; 
        document.getElementById('initialInterface').classList.add('hidden');
        document.getElementById('mainApplication').classList.remove('hidden');
    } else {
        alert("Please enter both your name and OpenAI API key.");
    }
});

document.getElementById('clearButton').addEventListener('click', function() {
    document.getElementById('apiKey').value = '';
    window.openAIKey = null;
    alert("API Key cleared.");
});

document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('uploadedImage');
            img.src = e.target.result;
            img.style.display = 'block';
            document.getElementById('clearImageButton').classList.remove('hidden');
            const imageContainer = document.getElementById('imageContainer');
            imageContainer.style.height = 'auto';
            imageContainer.style.height = `${img.clientHeight}px`;
            const uploadPictureWindow = document.getElementById('uploadPictureWindow');
            uploadPictureWindow.style.minHeight = `${img.clientHeight + 100}px`;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('clearImageButton').addEventListener('click', function() {
    const img = document.getElementById('uploadedImage');
    img.src = '';
    img.style.display = 'none';
    document.getElementById('clearImageButton').classList.add('hidden');
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.style.height = 'auto';
    const uploadPictureWindow = document.getElementById('uploadPictureWindow');
    uploadPictureWindow.style.minHeight = 'auto';
});

document.getElementById('readButton').addEventListener('click', async function() {
    const imageFile = document.getElementById('imageInput').files[0];
    const equationField = document.getElementById('extractedEquation');
    const statusMessage = document.getElementById('extractionStatus');
    
    if (!imageFile) {
        alert('Please select an image file first.');
        return;
    }

    try {
        equationField.disabled = true;
        statusMessage.textContent = "Extracting equation using OpenAI Vision...";
        
        const extractedText = await extractEquationFromImage(imageFile);
        
        if (extractedText) {
            equationField.value = extractedText;
            statusMessage.textContent = "Equation extracted successfully!";
            setTimeout(() => statusMessage.textContent = "", 3000);
        } else {
            equationField.value = '';
            statusMessage.textContent = "No equation found in image.";
        }
        
        equationField.style.height = 'auto';
        equationField.style.height = `${equationField.scrollHeight}px`;
        
    } catch (error) {
        console.error('Extraction error:', error);
        equationField.value = '';
        statusMessage.textContent = error.message; // Show actual error
        setTimeout(() => statusMessage.textContent = "", 5000);
    } finally {
        equationField.disabled = false;
    }
});

// Rest of the original code remains unchanged below
// [Clear equation, exit button, AR buttons, MathJax config, etc.]
// ...

document.getElementById('clearEquationButton').addEventListener('click', function() {
    document.getElementById('extractedEquation').value = '';
    const extractedEquation = document.getElementById('extractedEquation');
    extractedEquation.style.height = 'auto';
    document.getElementById('extractionStatus').textContent = '';
});

document.getElementById('exitButton').addEventListener('click', function() {
    document.getElementById('maskKey').checked = false;
    document.getElementById('apiKey').type = 'text';
    document.getElementById('userName').value = '';
    document.getElementById('apiKey').value = '';
    window.openAIKey = null;                        // Clear the API key upon exit
    document.getElementById('imageInput').value = '';
    document.getElementById('uploadedImage').src = '';
    document.getElementById('uploadedImage').style.display = 'none';
    document.getElementById('clearImageButton').classList.add('hidden');
    document.getElementById('extractedEquation').value = '';
    document.getElementById('solutionOutput').innerHTML = '';
    document.getElementById('initialInterface').classList.remove('hidden');
    document.getElementById('mainApplication').classList.add('hidden');
    document.querySelectorAll('.dynamic-height').forEach(element => {
        element.style.height = 'auto';
    });
});

document.getElementById('connectButton').addEventListener('click', function() {
    alert("AR connection not implemented.");
});

document.getElementById('showButton').addEventListener('click', function() {
    alert("AR display not implemented.");
});

window.MathJax = {
    tex: {
        inlineMath: [['\\(', '\\)']],
        displayMath: [['\\[', '\\]']],
        processEscapes: true,
        packages: {'[+]': ['ams']}
    },
    options: {
        ignoreHtmlClass: 'nostem|nolatex',
        processHtmlClass: 'math-display'
    }
};