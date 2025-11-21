/**
 * BACKGROUND TEXT ENGINE
 * Handles the typing animation, randomization, and layout of the background layer.
 */

// --- 1. CONFIGURATION ---
const config = {
    // Animation Settings
    typingSpeed: 20,        // Milliseconds per character (Lower = Faster)
    repetitions: 2,         // How many times to loop through the phrase list
    
    // Feature: Random Colored Words
    maxColoredWords: 3,     // Maximum number of highlighted words per line (Random 0 to X)
    colors: [               // The Palette for highlighted words
        '#9B79B0', // Magenta
        '#4B6B87', // Cyan
        '#F7C2A4', // Yellow
        '#6A0D4A', // Red
        '#33ff33', // Lime Green
        '#ff9900'  // Orange
    ],

    // Geometric Randomization
    angleRange: { min: -25, max: 25 },     // Global rotation angle of the text block
    
    // Set these to 0 and 100 to disable overlapping and weird wrapping
    overlapRange: { min: -10, max: -20 },      // Negative margins to make lines overlap
    wrapVariance: { min: 90, max: 100 },  // Width % to force random line breaks
};

// --- 2. SETUP ---
const bgContainer = document.getElementById('bg-canvas');

// Utility: Get random integer between min and max
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Utility: Pick a random item from an array
function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Utility: Fisher-Yates Shuffle
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// --- 3. INITIALIZATION ---
function initBackground() {
    // A. Randomize Geometric Parameters
    const angle = random(config.angleRange.min, config.angleRange.max);
    const overlap = random(config.overlapRange.min, config.overlapRange.max);
    
    // B. FIX RESIZE JITTER
    // We calculate the dimensions based on the window size *at load time*.
    // Using fixed pixels (px) instead of viewport units (vw/vh) ensures 
    // the text container doesn't resize or reflow when the browser window changes.
    const fixedWidth = window.innerWidth * 1.5; 
    const fixedHeight = window.innerHeight * 1.5;

    bgContainer.style.width = `${fixedWidth}px`;
    bgContainer.style.height = `${fixedHeight}px`;
    
    // Apply rotation and scale
    bgContainer.style.transform = `rotate(${angle}deg) scale(1.2)`; 
    
    // C. Build the Content Queue
    let contentQueue = [];
    for (let i = 0; i < config.repetitions; i++) {
        const batch = shuffle([...phrases]); // Import 'phrases' from textData.js
        contentQueue = contentQueue.concat(batch);
    }

    // D. Start the Typing Loop
    typewriterLine(contentQueue, 0, overlap);
}

// --- 4. WORD PROCESSING ---
// Breaks a sentence into word objects and assigns random colors
function prepareLineData(text) {
    const words = text.split(" ");
    const totalWords = words.length;
    
    // Decide how many words to color in this specific line
    const numToColor = random(0, config.maxColoredWords);
    
    // Select unique indices to highlight
    const indicesToColor = new Set();
    while(indicesToColor.size < numToColor && indicesToColor.size < totalWords) {
        indicesToColor.add(random(0, totalWords - 1));
    }

    // Map words to objects containing logic
    return words.map((word, index) => {
        const isHighlighted = indicesToColor.has(index);
        return {
            text: word + " ", // Add the space back
            highlight: isHighlighted,
            // If highlighted, pick a random color immediately
            color: isHighlighted ? randomChoice(config.colors) : null
        };
    });
}

// --- 5. TYPEWRITER LOGIC ---

// Step A: Handle the Line (Div)
function typewriterLine(queue, lineIndex, overlapVal) {
    if (lineIndex >= queue.length) return; // Stop if queue is empty

    const rawText = queue[lineIndex];
    const wordData = prepareLineData(rawText); 
    
    // Create the container for this line
    const lineEl = document.createElement('div');
    lineEl.classList.add('bg-line');
    
    // Apply randomness to width (if configured)
    const wrapWidth = random(config.wrapVariance.min, config.wrapVariance.max);
    lineEl.style.width = `${wrapWidth}%`; 
    
    // Apply overlapping (if configured)
    if (lineIndex > 0) {
        lineEl.style.marginTop = `${overlapVal}px`;
    }

    bgContainer.appendChild(lineEl);

    // Start typing the words inside this line
    typewriterWord(wordData, 0, lineEl, () => {
        // Callback: When this line is done, start the next line
        typewriterLine(queue, lineIndex + 1, overlapVal);
    });
}

// Step B: Handle the Word (Span)
function typewriterWord(wordData, wordIndex, lineEl, onComplete) {
    if (wordIndex >= wordData.length) {
        onComplete(); // All words in this line are done
        return;
    }

    const currentObj = wordData[wordIndex];
    
    // Create a span for the word (allows coloring specific words)
    const span = document.createElement('span');
    
    // Apply styling if this word was chosen for highlighting
    if (currentObj.highlight) {
        span.classList.add('highlight-word');
        span.style.color = currentObj.color; 
    }
    
    lineEl.appendChild(span);

    let charIndex = 0;

    // Step C: Handle the Character (TextContent)
    function typeChar() {
        if (charIndex < currentObj.text.length) {
            span.textContent += currentObj.text.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, config.typingSpeed);
        } else {
            // Word finished, move to next word
            typewriterWord(wordData, wordIndex + 1, lineEl, onComplete);
        }
    }

    typeChar();
}

// Run when DOM is ready
window.addEventListener('DOMContentLoaded', initBackground);