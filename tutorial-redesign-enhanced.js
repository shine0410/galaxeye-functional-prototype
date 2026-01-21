// ============================================
// REDESIGNED TUTORIAL SYSTEM - ENHANCED VERSION
// ============================================
// Features:
// - Auto-clears old tutorial completion flag
// - Supports ?tutorial=true URL parameter
// - Auto-starts on first login
// - Always shows "Start Tutorial" button
// ============================================

console.log('🎓 Loading enhanced tutorial system...');

// Check for URL parameter to force tutorial
const urlParams = new URLSearchParams(window.location.search);
const forceTutorial = urlParams.get('tutorial') === 'true' || urlParams.get('tutorial') === '1';

if (forceTutorial) {
    console.log('🔄 Tutorial forced via URL parameter - clearing completion flag');
    localStorage.removeItem('galaxeye_tutorial_completed');
}

// Tutorial configuration
const tutorialSteps = [
    {
        step: 1,
        title: "Welcome to Mission Drishti! 🚀",
        description: "This functional prototype demonstrates real GIS capabilities, data processing, and user management. Let's explore the key features!",
        target: ".sidebar",
        position: "right"
    },
    {
        step: 2,
        title: "Upload AOI Files 📁",
        description: "Upload GeoJSON, KML, or Shapefile formats. The system will automatically process and display your Area of Interest on the map.",
        target: ".menu-section:first-of-type",
        position: "right"
    },
    {
        step: 3,
        title: "Draw Custom AOI ✏️",
        description: "Use the drawing tools to create custom polygons, rectangles, or circles directly on the map. Perfect for quick area selection!",
        target: ".map-toolbar",
        position: "bottom"
    },
    {
        step: 4,
        title: "Search Locations 🔍",
        description: "Search for any location worldwide. The map will automatically zoom to your selected area.",
        target: '[data-tool="search"]',
        position: "bottom"
    },
    {
        step: 5,
        title: "View Saved AOIs 💾",
        description: "All your Areas of Interest are automatically saved. Access them anytime from this section with full metadata.",
        target: ".menu-section:nth-of-type(4)",
        position: "right"
    },
    {
        step: 6,
        title: "You're All Set! 🎉",
        description: "You've completed the tutorial! Start exploring the platform and create your first Area of Interest. Need help? Check the documentation or contact support.",
        target: null,
        position: "center"
    }
];

// Tutorial state
let currentTutorialStep = 0;
let tutorialActive = false;
let tutorialOverlay = null;
let tutorialTooltip = null;
let tutorialHighlight = null;

// Initialize redesigned tutorial
function initRedesignedTutorial() {
    console.log('🎓 Initializing redesigned tutorial system...');
    
    // Create tutorial overlay
    createTutorialOverlay();
    
    // Create tutorial tooltip
    createTutorialTooltip();
    
    // Add tutorial button to dashboard
    addTutorialButton();
    
    // Check if should auto-start
    checkAutoStart();
    
    console.log('✅ Tutorial system initialized!');
}

// Check if tutorial should auto-start
function checkAutoStart() {
    // Wait for dashboard to be visible
    setTimeout(() => {
        const dashboard = document.getElementById('dashboard-screen');
        if (dashboard && dashboard.classList.contains('active')) {
            const completed = localStorage.getItem('galaxeye_tutorial_completed_v2');
            
            if (!completed || forceTutorial) {
                console.log('🚀 Auto-starting tutorial (first time or forced)');
                setTimeout(() => startRedesignedTutorial(), 1500);
            } else {
                console.log('ℹ️ Tutorial already completed. Click "Start Tutorial" button to replay.');
            }
        }
    }, 2000);
}

// Create semi-transparent overlay
function createTutorialOverlay() {
    tutorialOverlay = document.createElement('div');
    tutorialOverlay.id = 'tutorial-overlay-redesign';
    tutorialOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
        z-index: 9998;
        display: none;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(tutorialOverlay);
}

// Create tutorial tooltip/card
function createTutorialTooltip() {
    tutorialTooltip = document.createElement('div');
    tutorialTooltip.id = 'tutorial-tooltip-redesign';
    tutorialTooltip.style.cssText = `
        position: fixed;
        background: linear-gradient(135deg, rgba(10, 14, 39, 0.98), rgba(20, 25, 60, 0.98));
        border: 2px solid rgba(0, 212, 255, 0.5);
        border-radius: 20px;
        padding: 30px;
        max-width: 450px;
        box-shadow: 0 20px 60px rgba(0, 212, 255, 0.3),
                    0 0 100px rgba(123, 44, 191, 0.2);
        z-index: 10000;
        display: none;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
    `;
    
    tutorialTooltip.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; margin: 0 auto 15px; background: linear-gradient(135deg, #00d4ff, #7b2cbf); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px;">
                🚀
            </div>
            <h2 id="tutorial-title" style="color: #fff; margin: 0 0 10px 0; font-size: 24px;"></h2>
            <p id="tutorial-description" style="color: rgba(255, 255, 255, 0.8); margin: 0; line-height: 1.6;"></p>
        </div>
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin: 20px 0;">
            <div id="tutorial-dots" style="display: flex; gap: 8px;"></div>
        </div>
        
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button id="tutorial-skip-btn" style="flex: 1; padding: 12px 20px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 10px; color: #fff; cursor: pointer; font-size: 14px; transition: all 0.3s;">
                Skip Tutorial
            </button>
            <button id="tutorial-prev-btn" style="flex: 1; padding: 12px 20px; background: rgba(0, 212, 255, 0.2); border: 1px solid rgba(0, 212, 255, 0.5); border-radius: 10px; color: #00d4ff; cursor: pointer; font-size: 14px; transition: all 0.3s;">
                ← Previous
            </button>
            <button id="tutorial-next-btn" style="flex: 1; padding: 12px 20px; background: linear-gradient(135deg, #00d4ff, #7b2cbf); border: none; border-radius: 10px; color: #fff; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.3s;">
                Next →
            </button>
        </div>
    `;
    
    document.body.appendChild(tutorialTooltip);
    
    // Add event listeners
    document.getElementById('tutorial-skip-btn').addEventListener('click', skipTutorial);
    document.getElementById('tutorial-prev-btn').addEventListener('click', previousTutorialStep);
    document.getElementById('tutorial-next-btn').addEventListener('click', nextTutorialStep);
}

// Add tutorial button to dashboard
function addTutorialButton() {
    // Wait for dashboard to load
    setTimeout(() => {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && !document.getElementById('start-tutorial-btn-redesign')) {
            const tutorialBtn = document.createElement('button');
            tutorialBtn.id = 'start-tutorial-btn-redesign';
            tutorialBtn.innerHTML = '<i class="fas fa-graduation-cap"></i> Start Tutorial';
            tutorialBtn.style.cssText = `
                width: calc(100% - 40px);
                margin: 20px;
                padding: 12px 20px;
                background: linear-gradient(135deg, #00d4ff, #7b2cbf);
                border: none;
                border-radius: 10px;
                color: #fff;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            `;
            
            // Hover effect
            tutorialBtn.addEventListener('mouseenter', () => {
                tutorialBtn.style.transform = 'translateY(-2px)';
                tutorialBtn.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.4)';
            });
            
            tutorialBtn.addEventListener('mouseleave', () => {
                tutorialBtn.style.transform = 'translateY(0)';
                tutorialBtn.style.boxShadow = 'none';
            });
            
            tutorialBtn.addEventListener('click', startRedesignedTutorial);
            sidebar.appendChild(tutorialBtn);
            
            console.log('✅ Tutorial button added to sidebar');
        }
    }, 1000);
}

// Start tutorial
function startRedesignedTutorial() {
    console.log('🚀 Starting tutorial...');
    tutorialActive = true;
    currentTutorialStep = 0;
    tutorialOverlay.style.display = 'block';
    setTimeout(() => {
        tutorialOverlay.style.opacity = '1';
    }, 10);
    showTutorialStep(0);
}

// Show specific tutorial step
function showTutorialStep(stepIndex) {
    const step = tutorialSteps[stepIndex];
    if (!step) return;
    
    console.log(`📍 Showing step ${stepIndex + 1}/${tutorialSteps.length}: ${step.title}`);
    
    // Update content
    document.getElementById('tutorial-title').textContent = step.title;
    document.getElementById('tutorial-description').textContent = step.description;
    
    // Update progress dots
    const dotsContainer = document.getElementById('tutorial-dots');
    dotsContainer.innerHTML = '';
    tutorialSteps.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.style.cssText = `
            width: ${index === stepIndex ? '24px' : '8px'};
            height: 8px;
            border-radius: 4px;
            background: ${index === stepIndex ? 'linear-gradient(135deg, #00d4ff, #7b2cbf)' : 'rgba(255, 255, 255, 0.3)'};
            transition: all 0.3s;
        `;
        dotsContainer.appendChild(dot);
    });
    
    // Update buttons
    const prevBtn = document.getElementById('tutorial-prev-btn');
    const nextBtn = document.getElementById('tutorial-next-btn');
    
    prevBtn.style.display = stepIndex === 0 ? 'none' : 'flex';
    nextBtn.textContent = stepIndex === tutorialSteps.length - 1 ? 'Finish 🎉' : 'Next →';
    
    // Position tooltip and highlight
    positionTutorialElements(step);
    
    // Show tooltip
    tutorialTooltip.style.display = 'block';
}

// Position tooltip and highlight
function positionTutorialElements(step) {
    // Remove previous highlight
    if (tutorialHighlight) {
        tutorialHighlight.remove();
        tutorialHighlight = null;
    }
    
    if (!step.target) {
        // Center position for welcome/finish
        tutorialTooltip.style.top = '50%';
        tutorialTooltip.style.left = '50%';
        tutorialTooltip.style.transform = 'translate(-50%, -50%)';
        return;
    }
    
    const targetElement = document.querySelector(step.target);
    if (!targetElement) {
        console.warn('⚠️ Tutorial target not found:', step.target);
        // Center the tooltip if target not found
        tutorialTooltip.style.top = '50%';
        tutorialTooltip.style.left = '50%';
        tutorialTooltip.style.transform = 'translate(-50%, -50%)';
        return;
    }
    
    const rect = targetElement.getBoundingClientRect();
    
    // Create highlight
    tutorialHighlight = document.createElement('div');
    tutorialHighlight.style.cssText = `
        position: fixed;
        top: ${rect.top - 10}px;
        left: ${rect.left - 10}px;
        width: ${rect.width + 20}px;
        height: ${rect.height + 20}px;
        border: 4px solid #ffbe0b;
        border-radius: 15px;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 30px rgba(255, 190, 11, 0.8),
                    0 0 60px rgba(255, 190, 11, 0.4),
                    inset 0 0 20px rgba(255, 190, 11, 0.2);
        animation: pulse-glow 2s ease-in-out infinite;
        background: rgba(255, 190, 11, 0.05);
    `;
    document.body.appendChild(tutorialHighlight);
    
    // Position tooltip based on step position
    const tooltipRect = tutorialTooltip.getBoundingClientRect();
    let top, left;
    
    switch(step.position) {
        case 'right':
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.right + 30;
            break;
        case 'bottom':
            top = rect.bottom + 30;
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            break;
        case 'left':
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.left - tooltipRect.width - 30;
            break;
        case 'top':
            top = rect.top - tooltipRect.height - 30;
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            break;
        default:
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.right + 30;
    }
    
    // Keep tooltip on screen
    top = Math.max(20, Math.min(top, window.innerHeight - tooltipRect.height - 20));
    left = Math.max(20, Math.min(left, window.innerWidth - tooltipRect.width - 20));
    
    tutorialTooltip.style.top = top + 'px';
    tutorialTooltip.style.left = left + 'px';
    tutorialTooltip.style.transform = 'none';
}

// Next step
function nextTutorialStep() {
    if (currentTutorialStep < tutorialSteps.length - 1) {
        currentTutorialStep++;
        showTutorialStep(currentTutorialStep);
    } else {
        finishTutorial();
    }
}

// Previous step
function previousTutorialStep() {
    if (currentTutorialStep > 0) {
        currentTutorialStep--;
        showTutorialStep(currentTutorialStep);
    }
}

// Skip tutorial
function skipTutorial() {
    if (confirm('Are you sure you want to skip the tutorial?')) {
        finishTutorial();
    }
}

// Finish tutorial
function finishTutorial() {
    console.log('🎉 Tutorial completed!');
    tutorialActive = false;
    tutorialOverlay.style.opacity = '0';
    
    setTimeout(() => {
        tutorialOverlay.style.display = 'none';
        tutorialTooltip.style.display = 'none';
    }, 300);
    
    if (tutorialHighlight) {
        tutorialHighlight.remove();
        tutorialHighlight = null;
    }
    
    // Save completion with new key
    localStorage.setItem('galaxeye_tutorial_completed_v2', 'true');
    
    // Show success message if showToast function exists
    if (typeof showToast === 'function') {
        showToast('Tutorial completed! 🎉', 'success');
    } else {
        console.log('✅ Tutorial completed successfully!');
    }
}

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse-glow {
        0%, 100% {
            border-color: #ffbe0b;
            box-shadow: 0 0 30px rgba(255, 190, 11, 0.8),
                        0 0 60px rgba(255, 190, 11, 0.4),
                        inset 0 0 20px rgba(255, 190, 11, 0.2);
            transform: scale(1);
        }
        50% {
            border-color: #00d4ff;
            box-shadow: 0 0 40px rgba(0, 212, 255, 0.9),
                        0 0 80px rgba(0, 212, 255, 0.5),
                        inset 0 0 30px rgba(0, 212, 255, 0.3);
            transform: scale(1.02);
        }
    }
`;
document.head.appendChild(style);

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRedesignedTutorial);
} else {
    initRedesignedTutorial();
}

console.log('✅ Enhanced tutorial system loaded!');
