// Device Image Manager - Integrates image library with equipment system
class DeviceImageManager {
    constructor() {
        this.deviceLoader = null;
        this.devices = null;
        this.loadPromise = this.loadDeviceData();
    }

    async loadDeviceData() {
        try {
            // Load devices.json
            const response = await fetch('library/device-images/devices.json');
            this.devices = await response.json();
            
            // Initialize device loader
            this.deviceLoader = new DeviceLoader();
            
            console.log('Device image manager loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load device data:', error);
            return false;
        }
    }

    async createDeviceElement(categoryKey, deviceKey, width = 400, height = 100) {
        await this.loadPromise;
        
        if (!this.devices || !this.deviceLoader) {
            console.error('Device data not loaded');
            return null;
        }

        const device = this.devices.devices[categoryKey]?.[deviceKey];
        if (!device) {
            console.error(`Device not found: ${categoryKey}/${deviceKey}`);
            return null;
        }

        // Create a temporary container for image loading
        const container = document.createElement('div');
        container.style.width = width + 'px';
        container.style.height = height + 'px';
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        document.body.appendChild(container);

        try {
            // Load device using hybrid system
            await this.deviceLoader.loadDevice(categoryKey, deviceKey, container, {
                width: width,
                height: height,
                showLabel: false
            });

            // Convert to canvas for Fabric.js
            const canvas = await this.htmlToCanvas(container);
            document.body.removeChild(container);

            return {
                canvas: canvas,
                device: device,
                width: width,
                height: height
            };
        } catch (error) {
            console.error('Failed to create device element:', error);
            document.body.removeChild(container);
            return null;
        }
    }

    async htmlToCanvas(element) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const rect = element.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;

            // Check if there's an image in the element
            const img = element.querySelector('img');
            if (img && img.complete) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas);
            } else if (img) {
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
            } else {
                // Handle canvas fallback case
                const canvasElement = element.querySelector('canvas');
                if (canvasElement) {
                    ctx.drawImage(canvasElement, 0, 0);
                    resolve(canvas);
                } else {
                    reject(new Error('No image or canvas found'));
                }
            }
        });
    }

    getDeviceCategories() {
        if (!this.devices) return [];
        return Object.keys(this.devices.devices);
    }

    getDevicesInCategory(category) {
        if (!this.devices) return [];
        return Object.keys(this.devices.devices[category] || {});
    }

    getDeviceInfo(categoryKey, deviceKey) {
        if (!this.devices) return null;
        return this.devices.devices[categoryKey]?.[deviceKey];
    }
}

// Enhanced Equipment Library with Image Integration
class LegacyEnhancedEquipmentLibrary extends EquipmentLibrary {
    constructor() {
        super();
        this.deviceImageManager = new DeviceImageManager();
        this.RACK_UNIT = 40; // pixels per U
        this.STANDARD_WIDTH = 340; // Rack equipment width (19" - posts)
    }

    async createEquipmentFromImage(categoryKey, deviceKey, x = 0, y = 0) {
        const deviceInfo = this.deviceImageManager.getDeviceInfo(categoryKey, deviceKey);
        if (!deviceInfo) {
            console.error(`Device not found: ${categoryKey}/${deviceKey}`);
            return null;
        }

        const rackUnits = deviceInfo.rackUnits || 1;
        const equipmentHeight = rackUnits * this.RACK_UNIT;
        
        try {
            // Try to create device with image
            const deviceElement = await this.deviceImageManager.createDeviceElement(
                categoryKey, 
                deviceKey, 
                this.STANDARD_WIDTH, 
                equipmentHeight
            );

            if (deviceElement) {
                // Create Fabric.js image object
                const fabricImage = new fabric.Image(deviceElement.canvas, {
                    left: x,
                    top: y,
                    selectable: true,
                    hasControls: true,
                    hasBorders: true,
                    lockScalingFlip: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockRotation: true,  // Prevent rotation
                    lockSkewingX: true,  // Prevent skewing
                    lockSkewingY: true,  // Prevent skewing
                    centeredRotation: false,
                    centeredScaling: false,
                    rackUnits: rackUnits,
                    equipmentType: categoryKey + '-' + deviceKey,
                    equipmentName: deviceInfo.name || deviceKey,
                    deviceCategory: categoryKey,
                    deviceKey: deviceKey,
                    width: this.STANDARD_WIDTH,
                    height: equipmentHeight
                });

                return fabricImage;
            }
        } catch (error) {
            console.error('Failed to create equipment from image:', error);
        }

        // Fallback to canvas-drawn equipment
        return this.createFallbackEquipment(categoryKey, deviceKey, deviceInfo, x, y);
    }

    createFallbackEquipment(categoryKey, deviceKey, deviceInfo, x = 0, y = 0) {
        const rackUnits = deviceInfo.rackUnits || 1;
        const equipmentHeight = rackUnits * this.RACK_UNIT;

        // Create basic equipment representation
        const group = new fabric.Group([], {
            left: x,
            top: y,
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            lockScalingX: true,
            lockScalingY: true,
            rackUnits: rackUnits,
            equipmentType: categoryKey + '-' + deviceKey,
            equipmentName: deviceInfo.name || deviceKey,
            deviceCategory: categoryKey,
            deviceKey: deviceKey
        });

        // Basic chassis
        const chassis = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.STANDARD_WIDTH,
            height: equipmentHeight,
            fill: this.getCategoryColor(categoryKey),
            stroke: '#2c3e50',
            strokeWidth: 2,
            selectable: false,
            rx: 2,
            ry: 2
        });

        // Label
        const label = new fabric.Text(deviceInfo.name || deviceKey, {
            left: this.STANDARD_WIDTH / 2,
            top: equipmentHeight / 2,
            fontSize: Math.min(12, equipmentHeight / 3),
            fontFamily: 'Arial, sans-serif',
            fill: '#ecf0f1',
            selectable: false,
            originX: 'center',
            originY: 'center'
        });

        group.addWithUpdate(chassis);
        group.addWithUpdate(label);

        return group;
    }

    getCategoryColor(category) {
        const colors = {
            'switches': '#2c3e50',
            'patch_panels': '#7f8c8d',
            'routers': '#34495e',
            'servers': '#8e44ad',
            'power': '#e67e22',
            'firewalls': '#e74c3c',
            'nvr': '#16a085'
        };
        return colors[category] || '#95a5a6';
    }

    // Enhanced createEquipment method that ONLY uses images - no fallbacks
    async createEquipment(type, x = 0, y = 0) {
        // Parse type into category and device key
        const parts = type.split('-');
        if (parts.length >= 2) {
            const categoryKey = parts[0] === 'patch' && parts[1] === 'panel' ? 'patch_panels' : parts[0] + 's';
            const deviceKey = type;

            // Only create if device has actual images
            const deviceInfo = this.deviceImageManager.getDeviceInfo(categoryKey, deviceKey);
            if (deviceInfo && deviceInfo.images) {
                const imageEquipment = await this.createEquipmentFromImage(categoryKey, deviceKey, x, y);
                if (imageEquipment) {
                    return imageEquipment;
                }
            }
        }

        // No fallback - return null if no image available
        console.warn(`No image available for device: ${type}`);
        return null;
    }

    // Get available equipment for sidebar - ONLY devices with images
    async getAvailableEquipment() {
        await this.deviceImageManager.loadPromise;
        
        const equipment = {};
        const categories = this.deviceImageManager.getDeviceCategories();
        
        for (const category of categories) {
            const devices = this.deviceImageManager.getDevicesInCategory(category);
            // Filter to only devices that have actual images
            const devicesWithImages = devices.filter(deviceKey => {
                const deviceInfo = this.deviceImageManager.getDeviceInfo(category, deviceKey);
                return deviceInfo && deviceInfo.images;
            }).map(deviceKey => {
                const deviceInfo = this.deviceImageManager.getDeviceInfo(category, deviceKey);
                return {
                    key: deviceKey,
                    name: deviceInfo.name || deviceKey,
                    rackUnits: deviceInfo.rackUnits || 1,
                    description: deviceInfo.description || '',
                    category: category,
                    hasImage: true
                };
            });
            
            // Only include categories that have devices with images
            if (devicesWithImages.length > 0) {
                equipment[category] = devicesWithImages;
            }
        }

        return equipment;
    }
}

// Load device loader script if not already loaded
if (typeof DeviceLoader === 'undefined') {
    const script = document.createElement('script');
    script.src = 'library/device-images/device-loader.js';
    script.onload = () => console.log('DeviceLoader loaded');
    script.onerror = () => console.error('Failed to load DeviceLoader');
    document.head.appendChild(script);
}