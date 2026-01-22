// ============================================
// REMOVE OLD TUTORIAL SYSTEM COMPLETELY
// ============================================
// This script removes the old tutorial HTML
// from the DOM immediately on page load
// ============================================

console.log('🗑️ Removing old tutorial system...');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeOldTutorial);
} else {
    removeOldTutorial();
}

function removeOldTutorial() {
    console.log('🔍 Searching for old tutorial overlay...');
    
    // Find and REMOVE the old tutorial overlay completely
    const oldTutorialOverlay = document.getElementById('tutorial-overlay');
    if (oldTutorialOverlay) {
        console.log('✅ Found old tutorial overlay - REMOVING IT!');
        oldTutorialOverlay.remove(); // DELETE IT FROM DOM
        console.log('🗑️ Old tutorial HTML removed from DOM!');
    } else {
        console.log('ℹ️ Old tutorial overlay not found (already removed or doesn't exist)');
    }
    
    // Disable old tutorial functions to prevent errors
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
        return false;
    };
    
    window.completeTutorial = function() {
        console.log('⚠️ Old tutorial function called but disabled');
        return false;
    };
    
    // Add CSS to hide any remaining old tutorial elements
    const style = document.createElement('style');
    style.textContent = `
        #tutorial-overlay,
        .tutorial-overlay {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            z-index: -9999 !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Old tutorial system completely removed!');
    console.log('🎓 New tutorial system will load next...');
}
