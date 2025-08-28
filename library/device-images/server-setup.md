# Web Server Setup for Device Loader

## The CORS Issue
Modern browsers block `file://` protocol from loading JSON files via fetch(). You need to serve the files through a web server.

## Quick Solutions:

### Option 1: Simple Python Server (Recommended)
```bash
# Navigate to the device-images folder
cd "C:\Users\thisi\Documents\Jonathan Apps\network-rack-designer\library\device-images"

# Python 3 (most common)
python -m http.server 8000

# Python 2 (if needed)
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000/test-device-loader.html`

### Option 2: Node.js Server
```bash
# Install a simple server
npm install -g http-server

# Run in device-images folder
cd "C:\Users\thisi\Documents\Jonathan Apps\network-rack-designer\library\device-images"
http-server -p 8000
```

### Option 3: Use Simple Test
Open `simple-test.html` directly in browser - this doesn't require JSON loading and tests:
- Image loading (if you've extracted the switch images)
- Canvas fallback rendering

### Option 4: Visual Studio Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `test-device-loader.html`
3. Select "Open with Live Server"

## Testing Steps:
1. **Start any web server above**
2. **Open the test page in browser**
3. **Extract switch images** from PDF to switches folder
4. **Test both image loading and canvas fallbacks**

## Expected Results:
- ✅ **With images**: Real Cisco switch photos load
- ✅ **Without images**: Canvas fallbacks render automatically
- ❌ **No server**: CORS errors in console