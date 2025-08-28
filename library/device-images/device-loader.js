// Device Image/Canvas Hybrid Loader
// Handles both real device images and canvas fallbacks

class DeviceLoader {
    constructor() {
        this.devicesData = null;
        this.imageCache = new Map();
        this.canvasCache = new Map();
        this.devicesPath = './device-images/devices.json'; // Default path
    }

    async initialize() {
        try {
            const response = await fetch(this.devicesPath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            this.devicesData = await response.json();
            console.log('Device library loaded:', Object.keys(this.devicesData.devices).length, 'categories');
        } catch (error) {
            console.error('Failed to load device library:', error);
            console.error('Attempted path:', this.devicesPath);
        }
    }

    async loadDevice(categoryKey, deviceKey, targetElement, options = {}) {
        if (!this.devicesData) {
            await this.initialize();
        }

        const device = this.devicesData.devices[categoryKey]?.[deviceKey];
        if (!device) {
            console.error(`Device not found: ${categoryKey}/${deviceKey}`);
            return this.createPlaceholder(targetElement, deviceKey);
        }

        // Try to load image first
        const imageLoaded = await this.tryLoadImage(device, targetElement, options);
        if (imageLoaded) {
            return true;
        }

        // Fall back to canvas if no image available
        const canvasLoaded = await this.tryLoadCanvas(device, targetElement, options);
        if (canvasLoaded) {
            return true;
        }

        // Create placeholder if nothing works
        return this.createPlaceholder(targetElement, device.name || deviceKey);
    }

    async tryLoadImage(device, targetElement, options) {
        if (!device.images) return false;

        // Try different image formats in order of preference
        const formats = ['svg', 'png', 'webp', 'jpg'];
        
        for (const format of formats) {
            if (device.images[format]) {
                try {
                    const imagePath = `./device-images/${device.images[format]}`;
                    const success = await this.loadImageElement(imagePath, targetElement, device, options);
                    if (success) {
                        console.log(`Loaded ${device.name} from ${format} image`);
                        return true;
                    }
                } catch (error) {
                    console.warn(`Failed to load ${format} for ${device.name}:`, error);
                }
            }
        }
        return false;
    }

    async loadImageElement(imagePath, targetElement, device, options) {
        return new Promise((resolve) => {
            const img = new Image();
            
            img.onload = () => {
                // Clear target element
                targetElement.innerHTML = '';
                
                // Create image container with proper sizing
                const container = document.createElement('div');
                container.className = 'device-image-container';
                container.style.cssText = `
                    width: 100%;
                    height: ${device.rackUnits * 44}px; /* 44px per rack unit */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                `;
                
                // Style the image
                img.style.cssText = `
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    ${options.opacity ? `opacity: ${options.opacity};` : ''}
                `;
                
                container.appendChild(img);
                targetElement.appendChild(container);
                
                // Add device info as data attributes
                targetElement.dataset.deviceName = device.name;
                targetElement.dataset.deviceCategory = device.category;
                targetElement.dataset.rackUnits = device.rackUnits;
                
                resolve(true);
            };
            
            img.onerror = () => resolve(false);
            img.src = imagePath;
        });
    }

    async tryLoadCanvas(device, targetElement, options) {
        if (!device.fallback || device.fallback.type !== 'canvas') {
            return false;
        }

        try {
            // Load the canvas device script
            const scriptPath = `./device-images/${device.fallback.path}`;
            await this.loadScript(scriptPath);
            
            // Clear target element and create canvas
            targetElement.innerHTML = '';
            const canvas = document.createElement('canvas');
            canvas.width = options.width || 800;
            canvas.height = options.height || device.rackUnits * 44 * 10; // Scale for high resolution
            
            const container = document.createElement('div');
            container.className = 'device-canvas-container';
            container.style.cssText = `
                width: 100%;
                height: ${device.rackUnits * 44}px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            canvas.style.cssText = `
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                ${options.opacity ? `opacity: ${options.opacity};` : ''}
            `;
            
            container.appendChild(canvas);
            targetElement.appendChild(container);
            
            // Call the canvas drawing function
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            
            // Get the function from global scope
            const drawFunction = window[device.fallback.function];
            if (typeof drawFunction === 'function') {
                drawFunction(ctx, canvas.width, canvas.height);
                console.log(`Rendered ${device.name} with canvas fallback`);
                
                // Add device info
                targetElement.dataset.deviceName = device.name;
                targetElement.dataset.deviceCategory = device.category;
                targetElement.dataset.rackUnits = device.rackUnits;
                
                return true;
            } else {
                console.error(`Canvas function ${device.fallback.function} not found`);
                return false;
            }
            
        } catch (error) {
            console.error(`Canvas fallback failed for ${device.name}:`, error);
            return false;
        }
    }

    async loadScript(scriptPath) {
        if (this.canvasCache.has(scriptPath)) {
            return this.canvasCache.get(scriptPath);
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.onload = () => {
                this.canvasCache.set(scriptPath, true);
                resolve();
            };
            script.onerror = reject;
            script.src = scriptPath;
            document.head.appendChild(script);
        });
    }

    createPlaceholder(targetElement, deviceName) {
        targetElement.innerHTML = '';
        
        const placeholder = document.createElement('div');
        placeholder.className = 'device-placeholder';
        placeholder.style.cssText = `
            width: 100%;
            height: 44px; /* 1U default */
            background: linear-gradient(45deg, #f0f0f0 25%, #e0e0e0 25%, #e0e0e0 50%, #f0f0f0 50%, #f0f0f0 75%, #e0e0e0 75%);
            background-size: 20px 20px;
            border: 2px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #666;
            text-align: center;
        `;
        
        placeholder.textContent = deviceName || 'Device Not Found';
        targetElement.appendChild(placeholder);
        
        console.warn(`Created placeholder for: ${deviceName}`);
        return false;
    }

    // Get list of all available devices
    getDeviceList() {
        if (!this.devicesData) return {};
        
        const deviceList = {};
        for (const [category, devices] of Object.entries(this.devicesData.devices)) {
            deviceList[category] = Object.keys(devices).map(key => ({
                key,
                ...devices[key]
            }));
        }
        return deviceList;
    }

    // Get device specifications
    getDeviceSpec(categoryKey, deviceKey) {
        return this.devicesData?.devices[categoryKey]?.[deviceKey] || null;
    }
}

// Export for use in other modules
window.DeviceLoader = DeviceLoader;