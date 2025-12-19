/**
 * Admin Panel Logic
 * Handles Authentication, File Uploads, and Link Generation.
 */

// Elements
const authOverlay = document.getElementById('authOverlay');
const dashboard = document.getElementById('dashboard');
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('musicFileInput');
const loadingBar = document.getElementById('loadingBar');
const uploadStatus = document.getElementById('uploadStatus');
const musicUrlInput = document.getElementById('musicUrlInput');
const resultArea = document.getElementById('resultArea');
const resultLink = document.getElementById('resultLink');
const loginError = document.getElementById('loginError');

/**
 * Handle Login (Hashed Security)
 */
async function attemptLogin() {
    const user = document.getElementById('adminUsername').value;
    const pass = document.getElementById('adminPassword').value;

    const isValid = await Security.verifyCredentials(user, pass);

    if (isValid) {
        // Success
        loginError.style.display = 'none';
        authOverlay.style.opacity = '0';
        setTimeout(() => {
            authOverlay.classList.add('hidden');
            dashboard.style.display = 'block';
        }, 500);
    } else {
        // Fail
        loginError.style.display = 'block';
    }
}

// Allow Enter Key for Login
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !authOverlay.classList.contains('hidden')) {
        attemptLogin();
    }
});


/**
 * Handle File Upload (Cloudinary)
 */
function initDropZone() {
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFileUpload(fileInput.files[0]);
        }
    });
}

async function handleFileUpload(file) {
    if (!file) return;

    // UI Update
    uploadStatus.textContent = "Uploading Song... 0%";
    loadingBar.style.width = '30%'; // Fake progress start

    // FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', CLOUDINARY_FOLDER);

    try {
        // use 'auto' resource type in URL to allow audio/video/images
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.secure_url) {
            // Success Handling
            musicUrlInput.value = data.secure_url;
            uploadStatus.textContent = "Upload Complete! ✅";
            loadingBar.style.width = '100%';
            console.log("Uploaded URL:", data.secure_url);
        } else {
            throw new Error(data.error?.message || "Cloudinary Error");
        }

    } catch (error) {
        console.error(error);
        uploadStatus.textContent = "Upload Failed. Check Console.";
        loadingBar.style.width = '0%';
        alert("Upload Error: " + error.message + "\n\nTip: Check if your Cloudinary quota is full or internet is down.");
    }
}

/**
 * Generate Link & QR Code
 */
function generateLink() {
    // 1. Harvest Data
    const params = {
        guest: document.getElementById('guestName').value.trim(),
        b: document.getElementById('brideName').value.trim(),
        g: document.getElementById('groomName').value.trim(),
        d: document.getElementById('eventDate').value.trim(),
        t: document.getElementById('eventTime').value.trim(),
        v: (document.getElementById('venueName').value.trim() + (document.getElementById('venueAddress').value.trim() ? ", " + document.getElementById('venueAddress').value.trim() : "")).trim(),
        a: "", // Address merged into venue for this template
    };

    const music = musicUrlInput.value.trim();
    const presetMusic = document.getElementById('presetMusic').value;

    // 2. Validation
    if (!params.guest) {
        alert("Please enter a Guest Name.");
        return;
    }

    // 3. Construct URL
    const baseUrl = window.location.href.replace('admin.html', 'index.html');
    const urlParams = new URLSearchParams();

    // Add all non-empty params
    for (const [key, value] of Object.entries(params)) {
        if (value) urlParams.set(key, value);
    }

    // Logic for Music
    let finalMusic = music || presetMusic;
    if (finalMusic && finalMusic !== "assets/media/shehnai.mp3") {
        urlParams.set('song', finalMusic);
    }

    const fullUrl = `${baseUrl}?${urlParams.toString()}`;

    // 4. Display Link
    resultLink.textContent = fullUrl;
    resultArea.style.display = 'block';

    // 5. Generate QR Code
    generateQR(fullUrl);
}

function generateQR(url) {
    const qrContainer = document.getElementById('qrContainer');
    if (!qrContainer) return;

    // Use QuickChart QR API (Reliable & Free)
    // encoded URL
    const encodedUrl = encodeURIComponent(url);
    const qrSrc = `https://quickchart.io/qr?text=${encodedUrl}&size=200&margin=1&ecLevel=M`;

    qrContainer.innerHTML = `
        <p style="color: #888; margin-bottom: 10px; font-size: 0.9rem;">Scan to Open Invitation:</p>
        <img src="${qrSrc}" alt="QR Code" style="border: 2px solid var(--gold); border-radius: 10px; padding: 5px; background: white;">
    `;
}

function copyLink() {
    App.copyToClipboard(resultLink.textContent);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    initDropZone();

    // PERMANENT BYPASS (As requested)
    authOverlay.style.display = 'none';
    dashboard.style.display = 'block';
});
