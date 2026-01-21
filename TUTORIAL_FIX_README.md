# Tutorial Overlay Brightness Fix

## Problem
The tutorial overlay is too dark (`rgba(0, 0, 0, 0.9)`) making it hard to see the highlighted elements during the tutorial.

## Solution
Add the following code to your `index.html` file right after the `<link rel="stylesheet" href="styles.css">` line (around line 10):

```html
<style>
    /* Tutorial Overlay Brightness Fix */
    .tutorial-overlay {
        background: rgba(0, 0, 0, 0.75) !important;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }
    
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
    
    .tutorial-highlight {
        position: fixed;
        pointer-events: none;
        z-index: 9999 !important;
        border: 3px solid #ffbe0b !important;
        border-radius: 15px;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6) !important;
        animation: pulse-border 2s ease-in-out infinite;
    }
    
    @keyframes pulse-border {
        0%, 100% {
            border-color: #ffbe0b;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 20px #ffbe0b;
        }
        50% {
            border-color: #00d4ff;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 30px #00d4ff;
        }
    }
</style>
```

## Alternative: Use the JavaScript Fix
Include the `tutorial-overlay-fix.js` script before the closing `</body>` tag:

```html
<script src="tutorial-overlay-fix.js"></script>
```

## What This Fixes
1. **Less Dark Overlay**: Changes opacity from 0.9 to 0.75 (25% brighter)
2. **Glass-Morphism Effect**: Adds beautiful backdrop blur to tutorial content
3. **Better Visibility**: Highlighted elements are now clearly visible
4. **Enhanced Borders**: Pulsing animation on highlighted elements
5. **Proper Z-Index**: Ensures tutorial elements layer correctly

## Before vs After
- **Before**: Dark overlay (90% black) obscures everything
- **After**: Lighter overlay (75% black) with blur effect, highlighted elements clearly visible

The tutorial will now properly spotlight the elements being explained while keeping the interface visible enough to understand the context.
