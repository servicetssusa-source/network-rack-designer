// Enhanced Equipment Library for SVG-based rack designer
class EnhancedEquipmentLibrary {
    constructor() {
        this.devicesCache = null;
        this.imageCache = new Map();
        this.basePath = 'library/device-images/';
        
        this.RACK_WIDTH = 240;
        this.UNIT_HEIGHT = 24;
        
        this.loadDevicesConfig();
    }
    
    async loadDevicesConfig() {
        // Use internal device configuration instead of external JSON
        this.devicesCache = this.getInternalDeviceConfig();
        console.log('Enhanced equipment library loaded successfully');
    }

    getInternalDeviceConfig() {
        return {
            switches: {
                'cisco-c9200l-24t-4g': {
                    name: 'Cisco Catalyst C9200L-24T-4G',
                    rackUnits: 1,
                    category: 'switches',
                    imagePath: 'library/device-images/switches/24-port-switch.png'
                },
                'cisco-c9200l-48p-4g': {
                    name: 'Cisco Catalyst C9200L-48P-4G',
                    rackUnits: 1,
                    category: 'switches',
                    imagePath: 'library/device-images/switches/48-port-switch.png'
                }
            },
            routers: {
                'cisco-isr4331': {
                    name: 'Cisco ISR 4331',
                    rackUnits: 1,
                    category: 'routers',
                    imagePath: 'library/device-images/routers/cisco-isr4331.png'
                },
            },
            firewalls: {
                'cisco-asa5516-x': {
                    name: 'Cisco ASA 5516-X',
                    rackUnits: 1,
                    category: 'firewalls',
                    imagePath: 'library/device-images/firewalls/cisco-asa5516-x.png'
                },
            },
            pdus: {
                'apc-ap8941': {
                    name: 'APC AP8941 PDU',
                    rackUnits: 2,
                    category: 'pdus',
                    imagePath: 'library/device-images/pdus/apc-ap8941.png'
                },
                'tripp-lite-pdumh30hvt': {
                    name: 'Tripp Lite PDUMH30HVT',
                    rackUnits: 1,
                    category: 'pdus',
                    imagePath: 'library/device-images/pdus/tripp-lite-pdumh30hvt.png'
                }
            },
            'patch-panels': {
                'patch-panel-24-port': {
                    name: '24-Port Patch Panel',
                    rackUnits: 1,
                    category: 'patch-panels',
                    imagePath: 'library/device-images/patch-panels/24-port-patch-panel.png'
                },
                'patch-panel-48-port': {
                    name: '48-Port Patch Panel',
                    rackUnits: 2,
                    category: 'patch-panels',
                    imagePath: 'library/device-images/patch-panels/48-port-patch-panel.png'
                }
            }
        };
    }
    
    async createEquipment(deviceType, x, y) {
        if (!this.devicesCache) {
            await this.loadDevicesConfig();
        }
        
        const deviceConfig = this.findDeviceConfig(deviceType);
        if (!deviceConfig) {
            console.warn(`Device type ${deviceType} not found in configuration`);
            return this.createFallbackDevice(deviceType, x, y);
        }
        
        // Try to load device image
        const imageElement = await this.loadDeviceImage(deviceConfig);
        
        if (imageElement) {
            // Create SVG group with image
            const deviceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            deviceGroup.setAttribute('class', 'device-element');
            deviceGroup.setAttribute('data-type', deviceType);
            
            // Background rectangle for mounting
            const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bgRect.setAttribute('x', x - 12);
            bgRect.setAttribute('y', y);
            bgRect.setAttribute('width', this.RACK_WIDTH + 24);
            bgRect.setAttribute('height', deviceConfig.rackUnits * this.UNIT_HEIGHT);
            bgRect.setAttribute('fill', 'rgba(255, 255, 255, 0.9)');
            bgRect.setAttribute('stroke', '#ccc');
            bgRect.setAttribute('stroke-width', '1');
            bgRect.setAttribute('rx', '4');
            deviceGroup.appendChild(bgRect);
            
            // Device image
            const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imageElement.src);
            image.setAttribute('x', x - 6);
            image.setAttribute('y', y + 2);
            image.setAttribute('width', this.RACK_WIDTH + 12);
            image.setAttribute('height', (deviceConfig.rackUnits * this.UNIT_HEIGHT) - 4);
            image.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            deviceGroup.appendChild(image);
            
            return {
                element: deviceGroup,
                deviceType: deviceType,
                rackUnits: deviceConfig.rackUnits,
                name: deviceConfig.name
            };
        }
        
        return this.createFallbackDevice(deviceType, x, y, deviceConfig);
    }
    
    findDeviceConfig(deviceType) {
        if (!this.devicesCache) return null;
        
        const categories = ['switches', 'routers', 'firewalls', 'pdus', 'patch-panels', 'servers', 'accessories'];
        
        for (const category of categories) {
            if (this.devicesCache[category] && this.devicesCache[category][deviceType]) {
                return this.devicesCache[category][deviceType];
            }
        }
        
        return null;
    }
    
    async loadDeviceImage(deviceConfig) {
        if (!deviceConfig.imagePath) return null;
        
        const imagePath = deviceConfig.imagePath;
        
        // Check cache first
        if (this.imageCache.has(imagePath)) {
            return this.imageCache.get(imagePath);
        }
        
        try {
            const imageElement = await this.loadImage(imagePath);
            this.imageCache.set(imagePath, imageElement);
            return imageElement;
        } catch (error) {
            console.warn(`Failed to load image: ${imagePath}`, error);
            return null;
        }
    }
    
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
        });
    }
    
    createFallbackDevice(deviceType, x, y, deviceConfig = null) {
        const rackUnits = deviceConfig ? deviceConfig.rackUnits : 1;
        const name = deviceConfig ? deviceConfig.name : deviceType;
        const category = deviceConfig ? deviceConfig.category : 'unknown';
        
        // Choose colors based on device category
        let fillColor = '#e3f2fd';
        let strokeColor = '#2196f3';
        let textColor = '#1976d2';
        
        switch (category) {
            case 'router':
                fillColor = '#dbeafe';
                strokeColor = '#3b82f6';
                textColor = '#1d4ed8';
                break;
            case 'firewall':
                fillColor = '#fee2e2';
                strokeColor = '#ef4444';
                textColor = '#dc2626';
                break;
            case 'pdu':
                fillColor = '#fef3c7';
                strokeColor = '#f59e0b';
                textColor = '#d97706';
                break;
            case 'switch':
                fillColor = '#f3f4f6';
                strokeColor = '#6b7280';
                textColor = '#4b5563';
                break;
            case 'patch_panel':
                fillColor = '#f1f5f9';
                strokeColor = '#64748b';
                textColor = '#475569';
                break;
            case 'server':
                fillColor = '#f0fdf4';
                strokeColor = '#22c55e';
                textColor = '#16a34a';
                break;
        }
        
        const deviceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        deviceGroup.setAttribute('class', 'device-element fallback');
        deviceGroup.setAttribute('data-type', deviceType);
        
        // Background rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x - 12);
        rect.setAttribute('y', y);
        rect.setAttribute('width', this.RACK_WIDTH + 24);
        rect.setAttribute('height', rackUnits * this.UNIT_HEIGHT);
        rect.setAttribute('fill', fillColor);
        rect.setAttribute('stroke', strokeColor);
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('rx', '6');
        deviceGroup.appendChild(rect);
        
        // Device label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + this.RACK_WIDTH / 2);
        text.setAttribute('y', y + (rackUnits * this.UNIT_HEIGHT) / 2);
        text.setAttribute('fill', textColor);
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.textContent = name;
        deviceGroup.appendChild(text);
        
        return {
            element: deviceGroup,
            deviceType: deviceType,
            rackUnits: rackUnits,
            name: name
        };
    }
    
    // Get available device types for the UI
    getAvailableDevices() {
        if (!this.devicesCache) return {};
        
        const organized = {
            switches: [],
            routers: [],
            firewalls: [],
            pdus: [],
            patch_panels: [],
            servers: [],
            accessories: []
        };
        
        Object.keys(this.devicesCache.devices).forEach(category => {
            if (organized[category]) {
                Object.keys(this.devicesCache.devices[category]).forEach(deviceType => {
                    const device = this.devicesCache.devices[category][deviceType];
                    organized[category].push({
                        type: deviceType,
                        name: device.name,
                        description: device.description || '',
                        rackUnits: device.rackUnits || 1,
                        category: device.category
                    });
                });
            }
        });
        
        return organized;
    }
}