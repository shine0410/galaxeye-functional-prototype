// Tutorial Overlay Brightness Fix - 30% Opacity
// This script fixes the dark tutorial overlay issue by injecting improved CSS

(function() {
    // Create style element
    const style = document.createElement('style');
    style.textContent = `
        /* Tutorial Overlay Fix - 30% opacity background */
        .tutorial-overlay {
            background: rgba(0, 0, 0, 0.3) !important;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
        
        /* Glass-morphism effect for tutorial content */
        .tutorial-content {
            background: rgba(10, 14, 39, 0.95) !important;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 2px solid rgba(0, 212, 255, 0.3);
            box-shadow: 0 20px 60px rgba(0, 212, 255, 0.2), 
                        0 0 100px rgba(123, 44, 191, 0.1);
            position: relative;
            z-index: 10001;
        }
        
        /* Enhanced tutorial highlight visibility */
        .tutorial-highlight {
            position: fixed;
            pointer-events: none;
            z-index: 9999 !important;
            border: 3px solid #ffbe0b !important;
            border-radius: 15px;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.25) !important;
            animation: pulse-border 2s ease-in-out infinite;
        }
        
        @keyframes pulse-border {
            0%, 100% {
                border-color: #ffbe0b;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.25), 0 0 20px #ffbe0b;
            }
            50% {
                border-color: #00d4ff;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.25), 0 0 30px #00d4ff;
            }
        }
    `;
    
    // Inject the style into the document head
    document.head.appendChild(style);
    
    console.log('✅ Tutorial overlay brightness fix applied (30% opacity)');
})();
