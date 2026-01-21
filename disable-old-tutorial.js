// ============================================
// DISABLE OLD TUTORIAL SYSTEM
// ============================================
// This script disables the old tutorial HTML
// and prevents it from showing
// ============================================

console.log('🚫 Disabling old tutorial system...');

// Immediately hide the old tutorial overlay
const oldTutorialOverlay = document.getElementById('tutorial-overlay');
if (oldTutorialOverlay) {
    oldTutorialOverlay.style.display = 'none';
    oldTutorialOverlay.style.visibility = 'hidden';
    oldTutorialOverlay.style.opacity = '0';
    oldTutorialOverlay.style.pointerEvents = 'none';
    oldTutorialOverlay.style.zIndex = '-9999';
    console.log('✅ Old tutorial overlay hidden');
}

// Disable old tutorial functions
window.showTutorialStep = function() {
    console.log('⚠️ Old tutorial function called but disabled');
    return false;
};

window.nextTutorialStep = function() {
    console.log('⚠️ Old tutorial function called but disabled');
    return false;
};

window.previousTutorialStep = function() {
    console.log('⚠️ Old tutorial function called but disabled');
    return false;
};

window.skipTutorial = function() {
    console.log('⚠️ Old tutorial function called but disabled');
    if (oldTutorialOverlay) {
        oldTutorialOverlay.style.display = 'none';
    }
    return false;
};

window.completeTutorial = function() {
    console.log('⚠️ Old tutorial function called but disabled');
    if (oldTutorialOverlay) {
        oldTutorialOverlay.style.display = 'none';
    }
    return false;
};

// Add CSS to permanently hide old tutorial
const style = document.createElement('style');
style.textContent = `
    #tutorial-overlay {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        z-index: -9999 !important;
    }
`;
document.head.appendChild(style);

console.log('✅ Old tutorial system disabled!');
console.log('🎓 New tutorial system will load next...');
