// Global Variables
let map;
let drawControl;
let drawnItems;
let currentScreen = 'login-screen';
let currentUser = null;
let savedAOIs = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check for existing session
    checkSession();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Update time
    updateTime();
    setInterval(updateTime, 1000);
}

function checkSession() {
    const session = db.getCurrentSession();
    if (session) {
        currentUser = db.getCurrentUser();
        if (currentUser) {
            showScreen('dashboard-screen');
            loadUserData();
        }
    }
}

function loadUserData() {
    if (!currentUser) return;
    
    // Update UI with user info
    document.getElementById('user-name').textContent = currentUser.fullName;
    
    // Load saved AOIs
    savedAOIs = db.getAOIs(currentUser.id);
    updateSavedCount();
    
    // Update statistics
    updateStatistics();
}

function updateStatistics() {
    const stats = db.getStatistics(currentUser.id);
    document.getElementById('aoi-count').textContent = stats.totalAOIs;
    document.getElementById('total-area').textContent = stats.totalArea.toLocaleString() + ' km²';
}

function updateSavedCount() {
    document.getElementById('saved-count').textContent = savedAOIs.length;
}

// Update Current Time
function updateTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toUTCString().split(' ')[4] + ' UTC';
    }
}

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    
    if (screenId === 'dashboard-screen') {
        setTimeout(() => {
            initializeMap();
            if (savedAOIs.length === 0) {
                setTimeout(startTutorial, 500);
            }
        }, 100);
    }
}

// Event Listeners
function initializeEventListeners() {
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    // Upload Area
    const uploadArea = document.getElementById('upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('click', () => document.getElementById('file-input').click());
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleFileDrop);
    }
    
    // File Input
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
}

// Login Handler
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const captcha = document.getElementById('captcha').checked;
    const attemptsDiv = document.getElementById('login-attempts');
    
    if (!captcha) {
        showToast('Please complete the CAPTCHA verification', 'warning');
        return;
    }
    
    // Authenticate user
    const result = db.authenticateUser(email, password);
    
    if (!result.success) {
        if (result.attempts) {
            attemptsDiv.innerHTML = `
                <div style="background: rgba(255, 190, 11, 0.1); border: 1px solid rgba(255, 190, 11, 0.3); padding: 12px; border-radius: 10px; color: #ffbe0b; margin-top: 15px;">
                    <i class="fas fa-exclamation-triangle"></i> Login attempt ${result.attempts}/4
                </div>
            `;
        } else {
            attemptsDiv.innerHTML = `
                <div style="background: rgba(255, 0, 110, 0.1); border: 1px solid rgba(255, 0, 110, 0.3); padding: 15px; border-radius: 10px; color: #ff006e; margin-top: 15px;">
                    <i class="fas fa-lock"></i> <strong>${result.message}</strong>
                </div>
            `;
        }
        return;
    }
    
    // Success
    currentUser = result.user;
    attemptsDiv.innerHTML = `
        <div style="background: rgba(6, 255, 165, 0.1); border: 1px solid rgba(6, 255, 165, 0.3); padding: 12px; border-radius: 10px; color: #06ffa5; margin-top: 15px;">
            <i class="fas fa-check-circle"></i> Login successful! Welcome back, ${currentUser.fullName}
        </div>
    `;
    
    setTimeout(() => {
        showScreen('dashboard-screen');
        loadUserData();
        showToast(`Welcome back, ${currentUser.fullName}!`, 'success');
    }, 1000);
}

// Registration Handler
function handleRegistration(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const countryCode = document.getElementById('country-code').value;
    const contactNumber = document.getElementById('contact-number').value;
    const orgName = document.getElementById('org-name').value;
    const orgAddress = document.getElementById('org-address').value;
    const captcha = document.getElementById('register-captcha').checked;
    
    // Validate full name
    if (!/^[A-Za-z\s]+$/.test(fullName)) {
        showToast('Full Name must contain only alphabetic characters', 'error');
        return;
    }
    
    // Validate email domain
    const allowedDomains = ['organization.com', 'company.com', 'gov.in', 'edu', 'space'];
    const emailDomain = email.split('@')[1];
    if (!allowedDomains.some(domain => emailDomain?.includes(domain))) {
        showToast('Email must be from an approved organizational domain', 'error');
        return;
    }
    
    if (!captcha) {
        showToast('Please complete the CAPTCHA verification', 'warning');
        return;
    }
    
    // Check subscriptions
    const subscriptions = Array.from(document.querySelectorAll('input[name="subscription"]:checked'))
        .map(cb => cb.value);
    
    if (subscriptions.length === 0) {
        showToast('Please select at least one data subscription', 'warning');
        return;
    }
    
    // Check if user already exists
    if (db.getUserByEmail(email)) {
        showToast('An account with this email already exists', 'error');
        return;
    }
    
    // Create user
    const userData = {
        fullName,
        email,
        password: 'temp_' + Math.random().toString(36).substr(2, 9), // Temporary password
        phone: countryCode + contactNumber,
        organization: orgName,
        address: orgAddress,
        subscriptions
    };
    
    const newUser = db.createUser(userData);
    
    if (newUser) {
        document.getElementById('success-modal').classList.add('active');
    }
}

// Map Initialization
function initializeMap() {
    if (map) return;
    
    map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        zoomControl: false,
        attributionControl: false
    });
    
    // Dark theme tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
    }).addTo(map);
    
    // Initialize FeatureGroup for drawn items
    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    
    // Initialize draw control
    drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
            polyline: false,
            circle: false,
            circlemarker: false,
            marker: false
        },
        edit: {
            featureGroup: drawnItems,
            remove: true
        }
    });
    
    // Handle draw events
    map.on(L.Draw.Event.CREATED, function(e) {
        const layer = e.layer;
        drawnItems.addLayer(layer);
        
        // Calculate area
        const geoJSON = layer.toGeoJSON();
        const area = turf.area(geoJSON) / 1000000; // Convert to sq km
        
        // Validate
        const isValid = area >= 1 && area <= 10000;
        
        // Style based on validation
        if (layer instanceof L.Rectangle || layer instanceof L.Polygon) {
            layer.setStyle({
                color: isValid ? '#06ffa5' : '#ff006e',
                weight: 3,
                fillOpacity: 0.2
            });
        }
        
        // Update AOI info
        updateAOIInfo(area, isValid, layer);
        
        // Save AOI
        if (isValid) {
            saveAOI(layer, area);
        }
    });
    
    map.on(L.Draw.Event.DELETED, function(e) {
        updateAOIInfo(0, false, null);
        document.getElementById('export-btn').disabled = true;
        document.getElementById('report-btn').disabled = true;
    });
    
    // Load saved AOIs
    loadSavedAOIsOnMap();
}

function saveAOI(layer, area) {
    const geoJSON = layer.toGeoJSON();
    const bounds = layer.getBounds();
    
    const aoiData = {
        name: `AOI_${Date.now()}`,
        type: layer instanceof L.Rectangle ? 'rectangle' : 'polygon',
        area: Math.round(area),
        bounds: {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest()
        },
        geoJSON: geoJSON
    };
    
    const saved = db.createAOI(aoiData);
    if (saved) {
        savedAOIs.push(saved);
        updateSavedCount();
        updateStatistics();
        showToast('AOI saved successfully!', 'success');
        
        // Enable export buttons
        document.getElementById('export-btn').disabled = false;
        document.getElementById('report-btn').disabled = false;
    }
}

function loadSavedAOIsOnMap() {
    savedAOIs.forEach(aoi => {
        if (aoi.geoJSON) {
            const layer = L.geoJSON(aoi.geoJSON, {
                style: {
                    color: '#00d4ff',
                    weight: 2,
                    fillOpacity: 0.1
                }
            });
            drawnItems.addLayer(layer);
        }
    });
}

function updateAOIInfo(area, isValid, layer) {
    const infoBox = document.getElementById('aoi-info');
    
    if (!layer) {
        infoBox.className = 'info-box glass-effect';
        infoBox.innerHTML = `
            <p><i class="fas fa-map-marker-alt"></i> No AOI selected</p>
            <p class="info-hint">Draw or upload an area to begin</p>
        `;
        return;
    }
    
    const bounds = layer.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    
    infoBox.className = 'info-box glass-effect ' + (isValid ? 'valid' : 'invalid');
    infoBox.innerHTML = `
        <p><i class="fas fa-map-marked-alt"></i> <strong>AOI Selected</strong></p>
        <p style="margin-top: 10px;"><strong>Area:</strong> ${Math.round(area).toLocaleString()} km²</p>
        <p><strong>Status:</strong> ${isValid ? '<i class="fas fa-check-circle"></i> Valid' : '<i class="fas fa-times-circle"></i> Invalid'}</p>
        <p style="font-size: 0.85rem; margin-top: 8px; color: var(--text-muted);">
            Bounds: ${sw.lat.toFixed(4)}, ${sw.lng.toFixed(4)} to ${ne.lat.toFixed(4)}, ${ne.lng.toFixed(4)}
        </p>
        ${!isValid ? '<p style="color: #ff006e; margin-top: 8px;"><small><i class="fas fa-exclamation-triangle"></i> Area must be between 1 and 10,000 km²</small></p>' : ''}
    `;
}

// Drawing Tools
function activateDrawTool() {
    if (!map) return;
    new L.Draw.Rectangle(map, drawControl.options.draw.rectangle).enable();
    showToast('Draw a rectangle on the map', 'info');
}

function activatePolygonTool() {
    if (!map) return;
    new L.Draw.Polygon(map, drawControl.options.draw.polygon).enable();
    showToast('Click to draw polygon vertices. Double-click to finish', 'info');
}

function activateMeasureTool() {
    showToast('Measurement tool: Draw a shape to see its area', 'info');
    activatePolygonTool();
}

// Map Controls
function zoomIn() {
    if (map) map.zoomIn();
}

function zoomOut() {
    if (map) map.zoomOut();
}

function resetView() {
    if (map) {
        map.setView([20, 0], 2);
        drawnItems.clearLayers();
        updateAOIInfo(0, false, null);
        document.getElementById('export-btn').disabled = true;
        document.getElementById('report-btn').disabled = true;
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function toggleLayer(layerType) {
    showToast(`${layerType} layer toggled`, 'info');
}

// File Upload
function showUploadDialog() {
    document.getElementById('upload-dialog').classList.add('active');
}

function closeUploadDialog() {
    document.getElementById('upload-dialog').classList.remove('active');
    document.getElementById('upload-status').innerHTML = '';
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('dragover');
}

function handleFileDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function processFile(file) {
    const validExtensions = ['.kml', '.kmz', '.geojson', '.json', '.txt', '.zip'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    
    const statusDiv = document.getElementById('upload-status');
    
    if (!validExtensions.includes(fileExt)) {
        statusDiv.innerHTML = `
            <div style="background: rgba(255, 0, 110, 0.1); border: 1px solid rgba(255, 0, 110, 0.3); padding: 15px; border-radius: 10px; color: #ff006e; margin-top: 15px;">
                <i class="fas fa-times-circle"></i> Invalid file format
            </div>
        `;
        return;
    }
    
    statusDiv.innerHTML = `
        <div style="background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); padding: 15px; border-radius: 10px; margin-top: 15px;">
            <i class="fas fa-spinner fa-spin"></i> Processing ${file.name}...
        </div>
    `;
    
    // Simulate file processing
    setTimeout(() => {
        statusDiv.innerHTML = `
            <div style="background: rgba(6, 255, 165, 0.1); border: 1px solid rgba(6, 255, 165, 0.3); padding: 15px; border-radius: 10px; color: #06ffa5; margin-top: 15px;">
                <i class="fas fa-check-circle"></i> File uploaded successfully!
            </div>
        `;
        
        setTimeout(() => {
            closeUploadDialog();
            showToast('AOI loaded from file', 'success');
        }, 1500);
    }, 2000);
}

// Search
function showSearchDialog() {
    document.getElementById('search-dialog').classList.add('active');
}

function closeSearchDialog() {
    document.getElementById('search-dialog').classList.remove('active');
    document.getElementById('search-results').innerHTML = '';
}

function searchLocation() {
    const query = document.getElementById('location-search').value;
    const resultsDiv = document.getElementById('search-results');
    
    if (!query) {
        showToast('Please enter a location name', 'warning');
        return;
    }
    
    resultsDiv.innerHTML = `
        <div style="background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); padding: 15px; border-radius: 10px; margin-top: 15px;">
            <i class="fas fa-spinner fa-spin"></i> Searching for "${query}"...
        </div>
    `;
    
    // Simulate search
    setTimeout(() => {
        const locations = {
            'delhi': [28.6139, 77.2090],
            'mumbai': [19.0760, 72.8777],
            'bangalore': [12.9716, 77.5946],
            'new york': [40.7128, -74.0060],
            'london': [51.5074, -0.1278],
            'tokyo': [35.6762, 139.6503]
        };
        
        const coords = locations[query.toLowerCase()] || [20, 0];
        
        resultsDiv.innerHTML = `
            <div style="background: rgba(6, 255, 165, 0.1); border: 1px solid rgba(6, 255, 165, 0.3); padding: 15px; border-radius: 10px; margin-top: 15px; color: #06ffa5;">
                <p><i class="fas fa-map-marker-alt"></i> <strong>${query}</strong></p>
                <p style="font-size: 0.9rem; margin-top: 5px;">Location found! Navigating...</p>
            </div>
        `;
        
        setTimeout(() => {
            if (map) {
                map.setView(coords, 10);
            }
            closeSearchDialog();
            showToast(`Navigated to ${query}`, 'success');
        }, 1000);
    }, 1000);
}

// Saved AOIs
function showSavedAOIs() {
    const dialog = document.getElementById('saved-aois-dialog');
    const listDiv = document.getElementById('saved-aois-list');
    
    if (savedAOIs.length === 0) {
        listDiv.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px;">No saved AOIs yet. Create one to get started!</p>';
    } else {
        listDiv.innerHTML = savedAOIs.map(aoi => `
            <div class="saved-aoi-item glass-effect">
                <div class="aoi-header">
                    <h4><i class="fas fa-map-marked-alt"></i> ${aoi.name}</h4>
                    <span class="aoi-type">${aoi.type}</span>
                </div>
                <div class="aoi-details">
                    <p><strong>Area:</strong> ${aoi.area.toLocaleString()} km²</p>
                    <p><strong>Created:</strong> ${new Date(aoi.createdAt).toLocaleString()}</p>
                </div>
                <div class="aoi-actions">
                    <button class="btn btn-small" onclick="loadAOI('${aoi.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-small" onclick="deleteAOI('${aoi.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    dialog.classList.add('active');
}

function closeSavedAOIs() {
    document.getElementById('saved-aois-dialog').classList.remove('active');
}

function loadAOI(aoiId) {
    const aoi = savedAOIs.find(a => a.id === aoiId);
    if (aoi && map) {
        const bounds = L.latLngBounds(
            [aoi.bounds.south, aoi.bounds.west],
            [aoi.bounds.north, aoi.bounds.east]
        );
        map.fitBounds(bounds);
        closeSavedAOIs();
        showToast('AOI loaded on map', 'success');
    }
}

function deleteAOI(aoiId) {
    if (confirm('Are you sure you want to delete this AOI?')) {
        db.deleteAOI(aoiId);
        savedAOIs = db.getAOIs(currentUser.id);
        updateSavedCount();
        updateStatistics();
        showSavedAOIs();
        showToast('AOI deleted', 'success');
    }
}

// Export & Reports
function exportAOI() {
    if (savedAOIs.length === 0) {
        showToast('No AOIs to export', 'warning');
        return;
    }
    
    const data = JSON.stringify(savedAOIs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `galaxeye_aois_${Date.now()}.json`;
    a.click();
    
    showToast('AOIs exported successfully', 'success');
}

function generateReport() {
    showToast('Generating PDF report...', 'info');
    
    setTimeout(() => {
        showToast('Report generated! (Demo mode)', 'success');
    }, 2000);
}

// Utility Functions
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        button.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

function showUserMenu() {
    showToast('User settings coming soon!', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        db.endSession();
        currentUser = null;
        savedAOIs = [];
        showScreen('login-screen');
        showToast('Logged out successfully', 'success');
    }
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
    showScreen('login-screen');
}

function showPasswordReset() {
    showToast('Password reset: Contact admin@galaxeye.space', 'info');
}

// Tutorial
function startTutorial() {
    document.getElementById('tutorial-overlay').classList.add('active');
}

function skipTutorial() {
    document.getElementById('tutorial-overlay').classList.remove('active');
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'times-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas fa-${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Close modals on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

console.log('🛰️ GalaxEye Space - Functional Prototype Loaded');