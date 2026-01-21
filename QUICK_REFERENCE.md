# ⚡ Quick Reference - Tutorial Fix

## 🎯 The Problem
Tutorial shows black screen because of this line in `script.js`:
```javascript
highlight.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0.7)';
```

## ✅ The Solution
Use the enhanced tutorial system!

---

## 🚀 Implementation (30 Seconds)

### Step 1: Open `index.html`

### Step 2: Add ONE line before `</body>`:

```html
<script src="tutorial-redesign-enhanced.js"></script>
```

### Step 3: Save and refresh!

**Done!** 🎉

---

## 🔄 If Tutorial Not Showing

### Quick Fix:
Press `F12` → Console → Paste:
```javascript
localStorage.clear(); location.reload();
```

### Or use URL:
```
?tutorial=true
```

---

## 📁 Files to Use

| File | Purpose | Use When |
|------|---------|----------|
| **tutorial-redesign-enhanced.js** ⭐ | Auto-start + URL support | **RECOMMENDED** |
| tutorial-redesign.js | Basic version | Manual start only |

---

## 🎨 What You Get

✅ Visible UI (40% transparent)  
✅ Bright glowing highlights  
✅ Floating tutorial card  
✅ Auto-start on first login  
✅ "Start Tutorial" button  
✅ 6 complete steps  

---

## 🧪 Quick Test

1. Add script line
2. Save & refresh (Ctrl+F5)
3. Login
4. Tutorial auto-starts! 🚀

---

## 📞 Need Help?

| Issue | Solution |
|-------|----------|
| Tutorial not showing | `localStorage.clear(); location.reload();` |
| Black screen | Use enhanced version |
| Button not appearing | Wait 1-2 seconds after login |
| Force tutorial | Add `?tutorial=true` to URL |

---

## 📚 Full Documentation

- `FINAL_INSTRUCTIONS.md` - Complete guide
- `FORCE_TUTORIAL.md` - Clear localStorage
- `TUTORIAL_QUICK_START.md` - Quick start
- `TUTORIAL_REDESIGN_README.md` - Full docs

---

## ✨ That's It!

**Add one line → Save → Refresh → Done!**

🎉 **Your tutorial is ready!**
