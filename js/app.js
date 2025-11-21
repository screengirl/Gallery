// --- Elements ---
const introScene = document.getElementById('intro-scene');
const tvTrigger = document.getElementById('tv-trigger');

const fileManager = document.getElementById('file-manager');
const fileGrid = document.getElementById('file-grid'); // This must exist in HTML
const closeManagerBtn = document.getElementById('close-manager-btn');
const itemCount = document.getElementById('item-count');

// View Toggles
const viewGridBtn = document.getElementById('view-grid-btn');
const viewListBtn = document.getElementById('view-list-btn');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('caption');
const closeLightboxBtn = document.getElementById('close-lightbox-btn');

// --- 1. Render Logic ---
function renderFiles() {
    // Safety check
    if (!fileGrid) {
        console.error("Error: #file-grid element not found in HTML");
        return;
    }

    fileGrid.innerHTML = ''; // Clear existing content
    
    galleryData.forEach(item => {
        // Create Item
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');
        
        // Thumbnail
        const img = document.createElement('img');
        img.src = `assets/images/${item.filename}`;
        img.classList.add('file-thumb');
        
        // Text Info
        const name = document.createElement('div');
        name.classList.add('file-name');
        name.textContent = item.title;

        const type = document.createElement('div');
        type.classList.add('file-type');
        type.textContent = "JPG Image";

        // Append
        fileItem.appendChild(img);
        fileItem.appendChild(name);
        fileItem.appendChild(type);

        // Click Event
        fileItem.addEventListener('click', () => openLightbox(item));

        fileGrid.appendChild(fileItem);
    });

    if(itemCount) itemCount.textContent = `${galleryData.length} objects`;
}

// --- 2. View Toggle Logic ---
function setView(mode) {
    if (mode === 'list') {
        fileGrid.classList.add('view-list');
        viewListBtn.classList.add('active');
        viewGridBtn.classList.remove('active');
    } else {
        fileGrid.classList.remove('view-list');
        viewGridBtn.classList.add('active');
        viewListBtn.classList.remove('active');
    }
}

if(viewGridBtn) viewGridBtn.addEventListener('click', () => setView('grid'));
if(viewListBtn) viewListBtn.addEventListener('click', () => setView('list'));

// --- 3. Navigation Logic ---

// Open Manager
tvTrigger.addEventListener('click', () => {
    introScene.classList.add('hidden');
    fileManager.classList.remove('hidden');
    renderFiles(); // Important: Render when opening
});

// Close Manager
closeManagerBtn.addEventListener('click', () => {
    fileManager.classList.add('hidden');
    introScene.classList.remove('hidden');
});

// Lightbox
function openLightbox(item) {
    lightbox.classList.remove('hidden');
    lightboxImg.src = `assets/images/${item.filename}`;
    caption.textContent = item.title;
}

function closeLightbox() {
    lightbox.classList.add('hidden');
}

if(closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Initial Render (optional, but good for testing)
// renderFiles();