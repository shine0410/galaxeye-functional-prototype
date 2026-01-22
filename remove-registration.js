// ============================================
// REMOVE REGISTRATION SCREEN
// ============================================
// This script removes the registration screen
// and the "Request Access" button from login
// ============================================

console.log('🗑️ Removing registration screen...');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeRegistration);
} else {
    removeRegistration();
}

function removeRegistration() {
    console.log('🔍 Searching for registration elements...');
    
    // 1. Remove the entire registration screen
    const registerScreen = document.getElementById('register-screen');
    if (registerScreen) {
        console.log('✅ Found registration screen - REMOVING IT!');
        registerScreen.remove();
        console.log('🗑️ Registration screen removed from DOM!');
    } else {
        console.log('ℹ️ Registration screen not found');
    }
    
    // 2. Remove the "Request Access" button from login screen
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        // Find all buttons with onclick="showScreen('register-screen')"
        const buttons = loginScreen.querySelectorAll('button[onclick*="register-screen"]');
        buttons.forEach(button => {
            console.log('✅ Found "Request Access" button - REMOVING IT!');
            button.remove();
        });
        
        // Also remove the divider above it ("New to GalaxEye?")
        const dividers = loginScreen.querySelectorAll('.divider');
        dividers.forEach(divider => {
            if (divider.textContent.includes('New to GalaxEye')) {
                console.log('✅ Found divider - REMOVING IT!');
                divider.remove();
            }
        });
    }
    
    // 3. Disable showScreen function for register-screen
    const originalShowScreen = window.showScreen;
    window.showScreen = function(screenId) {
        if (screenId === 'register-screen') {
            console.log('⚠️ Attempt to show registration screen blocked!');
            return false;
        }
        if (originalShowScreen) {
            return originalShowScreen(screenId);
        }
    };
    
    // 4. Add CSS to hide any remaining registration elements
    const style = document.createElement('style');
    style.textContent = `
        #register-screen,
        .register-screen {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            z-index: -9999 !important;
        }
        
        /* Hide any buttons that link to registration */
        button[onclick*="register-screen"] {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Registration screen completely removed!');
    console.log('🎉 Users can now only login, not register!');
}
