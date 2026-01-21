// Tutorial Overlay Brightness Fix - Visible UI Elements
// This script fixes the dark tutorial overlay issue by removing the dark box-shadow

(function() {
    // Create style element
    const style = document.createElement('style');
    style.textContent = `
        /* Tutorial Overlay Fix - Transparent background with visible UI */
        .tutorial-overlay {
            background: rgba(0, 0, 0, 0.5) !important;
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
        }
        
        /* Glass-morphism effect for tutorial content */
        .tutorial-content {
            background: rgba(10, 14, 39, 0.98) !important;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 2px solid rgba(0, 212, 255, 0.5);
            box-shadow: 0 20px 60px rgba(0, 212, 255, 0.3), 
                        0 0 100px rgba(123, 44, 191, 0.2);
            position: relative;
            z-index: 10001;
        }
        
        /* Enhanced tutorial highlight - NO DARK BOX SHADOW */
        .tutorial-highlight {
            position: fixed;
            pointer-events: none;
            z-index: 10002 !important;
            border: 4px solid #ffbe0b !important;
            border-radius: 15px;
            /* Bright glow instead of dark shadow */
            box-shadow: 0 0 30px rgba(255, 190, 11, 0.8),
                        0 0 60px rgba(255, 190, 11, 0.4),
                        inset 0 0 20px rgba(255, 190, 11, 0.2) !important;
            animation: pulse-highlight 2s ease-in-out infinite;
            background: rgba(255, 190, 11, 0.1) !important;
        }
        
        @keyframes pulse-highlight {
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
    
    // Inject the style into the document head
    document.head.appendChild(style);
    
    console.log('✅ Tutorial overlay fix applied - UI elements now visible!');
})();
