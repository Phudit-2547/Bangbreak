# BangBreak 💥👁️

**Rest your eyes with a _flashbang_ :D**

A Chrome extension that forces you to take eye breaks with customizable visual flashbangs and random audio alerts. Perfect for developers who forget to blink!

## 🚀 Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the BangBreak folder
5. Extension ready! 🎉

## 📱 How to Use

1. **Set Timer**: Click extension icon → set break interval (HH:MM:SS format)
2. **Pick Color**: Choose flashbang color (red, green, blue, yellow, or custom)
3. **Enable "Extra Care"**: Toggle for strobing animation (⚠️ epilepsy warning)
4. **Auto Mode**: Toggle "Auto Bang" for breaks every minute
5. **Start**: Click "Start Timer" and get back to coding!

When timer expires = full-screen flashbang + random audio + forced break! 💥

## 📁 Project Structure

```
BangBreak/
├── manifest.json          # Extension config
├── background.js          # Timer logic & alarms
├── popup.html/css        # Extension UI
├── main.js               # Popup controls  
├── white.html/js         # Flashbang screen
└── audio/               # Random break sounds
    ├── maiwaileaw.mp3
    └── trump_rest.mp3
```

## 🎵 Adding More Audio

Drop MP3 files in `audio/` folder, then update `white.js`:
```javascript
const AUDIO_FILES = [
  "audio/maiwaileaw.mp3",
  "audio/trump_rest.mp3",
  "audio/your_meme_sound.mp3"  // Add here!
];
```

## ⚠️ Warning

This extension literally flashbangs your screen. Don't use if you have epilepsy or hate being productive! 

---

**Stop coding. Touch grass. Save your eyes! 👀✨** 
