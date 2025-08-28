// Equipment Library - Visually accurate network equipment
class EquipmentLibrary {
    constructor() {
        this.RACK_UNIT = 40; // pixels per U (same as RackComponents)
        this.STANDARD_WIDTH = 19 * 20; // 19" rack width in pixels
    }

    // Create equipment based on type
    createEquipment(type, x = 0, y = 0) {
        const equipmentMap = {
            'switch-24': () => this.createSwitch24Port(),
            'switch-48': () => this.createSwitch48Port(),
            'router': () => this.createRouter(),
            'patch-panel-24': () => this.createPatchPanel24(),
            'patch-panel-48': () => this.createPatchPanel48(),
            'fiber-panel': () => this.createFiberPanel(),
            'ups-1u': () => this.createUPS1U(),
            'ups-2u': () => this.createUPS2U(),
            'pdu': () => this.createPDU(),
            'sound-masking': () => this.createSoundMasking(),
            'paging-system': () => this.createPagingSystem()
        };

        const createFunction = equipmentMap[type];
        if (!createFunction) {
            console.warn(`Unknown equipment type: ${type}`);
            return null;
        }

        const equipment = createFunction();
        equipment.set({
            left: x,
            top: y,
            equipmentType: type
        });

        return equipment;
    }

    // 24-Port Network Switch (1U)
    createSwitch24Port() {
        const group = new fabric.Group([], {
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            rackUnits: 1,
            equipmentName: '24-Port Switch'
        });

        // Main chassis
        const chassis = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.STANDARD_WIDTH - 40, // Slightly narrower than rack
            height: this.RACK_UNIT,
            fill: '#2c3e50',
            stroke: '#1a252f',
            strokeWidth: 2,
            selectable: false,
            rx: 2,
            ry: 2
        });

        // Port section
        const portCount = 24;
        const portWidth = 12;
        const portHeight = 8;
        const portSpacing = (chassis.width - 40) / portCount;

        for (let i = 0; i < portCount; i++) {
            const portX = 20 + (i * portSpacing) + (portSpacing - portWidth) / 2;
            const portY = chassis.height - portHeight - 4;

            const port = new fabric.Rect({
                left: portX,
                top: portY,
                width: portWidth,
                height: portHeight,
                fill: '#34495e',
                stroke: '#2c3e50',
                strokeWidth: 1,
                selectable: false,
                rx: 1,
                ry: 1
            });
            group.addWithUpdate(port);

            // LED indicator
            const led = new fabric.Circle({
                left: portX + portWidth/2,
                top: portY - 6,
                radius: 2,
                fill: Math.random() > 0.5 ? '#27ae60' : '#95a5a6',
                selectable: false,
                originX: 'center',
                originY: 'center'
            });
            group.addWithUpdate(led);
        }

        // Power LED
        const powerLED = new fabric.Circle({
            left: chassis.width - 15,
            top: 8,
            radius: 3,
            fill: '#27ae60',
            selectable: false,
            originX: 'center',
            originY: 'center'
        });
        group.addWithUpdate(powerLED);

        // Brand panel (simplified)
        const brandPanel = new fabric.Rect({
            left: 10,
            top: 5,
            width: 80,
            height: 12,
            fill: '#34495e',
            stroke: '#2c3e50',
            strokeWidth: 1,
            selectable: false,
            rx: 1,
            ry: 1
        });
        group.addWithUpdate(brandPanel);

        group.addWithUpdate(chassis);
        return group;
    }

    // 48-Port Network Switch (1U)
    createSwitch48Port() {
        const group = new fabric.Group([], {
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            rackUnits: 1,
            equipmentName: '48-Port Switch'
        });

        const chassis = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.STANDARD_WIDTH - 40,
            height: this.RACK_UNIT,
            fill: '#2c3e50',
            stroke: '#1a252f',
            strokeWidth: 2,
            selectable: false,
            rx: 2,
            ry: 2
        });

        // 48 ports arranged in 2 rows
        const portCount = 48;
        const portsPerRow = 24;
        const portWidth = 10;
        const portHeight = 6;
        const portSpacing = (chassis.width - 40) / portsPerRow;

        for (let row = 0; row < 2; row++) {
            for (let i = 0; i < portsPerRow; i++) {
                const portX = 20 + (i * portSpacing) + (portSpacing - portWidth) / 2;
                const portY = chassis.height - (row + 1) * (portHeight + 2) - 4;

                const port = new fabric.Rect({
                    left: portX,
                    top: portY,
                    width: portWidth,
                    height: portHeight,
                    fill: '#34495e',
                    stroke: '#2c3e50',
                    strokeWidth: 1,
                    selectable: false,
                    rx: 1,
                    ry: 1
                });
                group.addWithUpdate(port);
            }
        }

        group.addWithUpdate(chassis);
        return group;
    }

    // Router (2U)
    createRouter() {
        const group = new fabric.Group([], {
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            rackUnits: 2,
            equipmentName: 'Network Router'
        });

        const chassis = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.STANDARD_WIDTH - 40,
            height: this.RACK_UNIT * 2,
            fill: '#34495e',
            stroke: '#2c3e50',
            strokeWidth: 2,
            selectable: false,
            rx: 2,
            ry: 2
        });

        // Interface modules
        const moduleCount = 3;
        const moduleWidth = 80;
        const moduleHeight = 25;
        const moduleSpacing = (chassis.width - moduleCount * moduleWidth) / (moduleCount + 1);

        for (let i = 0; i < moduleCount; i++) {
            const moduleX = moduleSpacing + i * (moduleWidth + moduleSpacing);
            const moduleY = chassis.height / 2 - moduleHeight / 2;

            const module = new fabric.Rect({
                left: moduleX,
                top: moduleY,
                width: moduleWidth,
                height: moduleHeight,
                fill: '#2c3e50',
                stroke: '#1a252f',
                strokeWidth: 1,
                selectable: false,
                rx: 2,
                ry: 2
            });
            group.addWithUpdate(module);

            // Module ports
            for (let p = 0; p < 4; p++) {
                const portX = moduleX + 10 + p * 15;
                const portY = moduleY + moduleHeight - 8;

                const port = new fabric.Rect({
                    left: portX,
                    top: portY,
                    width: 10,
                    height: 6,
                    fill: '#f39c12',
                    stroke: '#d68910',
                    strokeWidth: 1,
                    selectable: false,
                    rx: 1,
                    ry: 1
                });
                group.addWithUpdate(port);
            }
        }

        // Status LEDs
        const statusLEDs = ['PWR', 'SYS', 'ACT'];
        for (let i = 0; i < statusLEDs.length; i++) {
            const led = new fabric.Circle({
                left: chassis.width - 80 + i * 25,
                top: 15,
                radius: 3,
                fill: i === 0 ? '#27ae60' : '#f39c12',
                selectable: false,
                originX: 'center',
                originY: 'center'
            });
            group.addWithUpdate(led);
        }

        group.addWithUpdate(chassis);
        return group;
    }

    // 24-Port Patch Panel (1U)
    createPatchPanel24() {
        const group = new fabric.Group([], {
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            rackUnits: 1,
            equipmentName: '24-Port Patch Panel'
        });

        const chassis = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.STANDARD_WIDTH - 40,
            height: this.RACK_UNIT,
            fill: '#7f8c8d',
            stroke: '#5d6d7e',
            strokeWidth: 2,
            selectable: false,
            rx: 2,
            ry: 2
        });

        // Port section with colored coding
        const portCount = 24;
        const portWidth = 12;
        const portHeight = 20;
        const portSpacing = (chassis.width - 40) / portCount;

        for (let i = 0; i < portCount; i++) {
            const portX = 20 + (i * portSpacing) + (portSpacing - portWidth) / 2;
            const portY = (chassis.height - portHeight) / 2;

            // Port body
            const port = new fabric.Rect({
                left: portX,
                top: portY,
                width: portWidth,
                height: portHeight,
                fill: '#2c3e50',
                stroke: '#1a252f',
                strokeWidth: 1,
                selectable: false,
                rx: 1,
                ry: 1
            });
            group.addWithUpdate(port);

            // Color coding strip
            const colorIndex = Math.floor(i / 4) % 6;
            const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#3498db', '#9b59b6'];
            
            const colorStrip = new fabric.Rect({
                left: portX + 1,
                top: portY + 1,
                width: portWidth - 2,
                height: 3,
                fill: colors[colorIndex],
                selectable: false
            });
            group.addWithUpdate(colorStrip);

            // Port number
            const portNumber = new fabric.Text(`${i + 1}`, {
                left: portX + portWidth/2,
                top: portY + portHeight + 2,
                fontSize: 6,
                fontFamily: 'Arial, sans-serif',
                fill: '#2c3e50',
                selectable: false,
                originX: 'center',
                originY: 'top'
            });
            group.addWithUpdate(portNumber);
        }

        group.addWithUpdate(chassis);
        return group;
    }

    // 48-Port Patch Panel (2U)
    createPatchPanel48() {
        const group = new fabric.Group([], {
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            rackUnits: 2,
            equipmentName: '48-Port Patch Panel'
        });

        const chassis = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.STANDARD_WIDTH - 40,
            height: this.RACK_UNIT * 2,
            fill: '#7f8c8d',
            stroke: '#5d6d7e',
            strokeWidth: 2,
            selectable: false,
            rx: 2,
            ry: 2
        });

        // 48 ports in 2 rows
        const portsPerRow = 24;
        const portWidth = 12;
        const portHeight = 20;
        const portSpacing = (chassis.width - 40) / portsPerRow;

        for (let row = 0; row < 2; row++) {
            for (let i = 0; i < portsPerRow; i++) {
                const portNum = row * portsPerRow + i + 1;
                const portX = 20 + (i * portSpacing) + (portSpacing - portWidth) / 2;
                const portY = 10 + row * (this.RACK_UNIT - 5);

                const port = new fabric.Rect({
                    left: portX,
                    top: portY,
                    width: portWidth,
                    height: portHeight,
                    fill: '#2c3e50',
                    stroke: '#1a252f',
                    strokeWidth: 1,
                    selectable: false,
                    rx: 1,
                    ry: 1
                });
                group.addWithUpdate(port);

                // Color coding
                const colorIndex = Math.floor((portNum - 1) / 4) % 6;
                const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#3498db', '#9b59b6'];
                
                const colorStrip = new fabric.Rect({
                    left: portX + 1,
                    top: portY + 1,
                    width: portWidth - 2,
                    height: 3,
                    fill: colors[colorIndex],
                    selectable: false
                });
                group.addWithUpdate(colorStrip);
            }
        }

        group.addWithUpdate(chassis);
        return group;
    }

    // Fiber Patch Panel (1U)
    createFiberPanel() {
        const group = new fabric.Group([], {
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            rackUnits: 1,
            equipmentName: 'Fiber Patch Panel'
        });

        const chassis = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.STANDARD_WIDTH - 40,
            height: this.RACK_UNIT,
            fill: '#8e44ad',
            stroke: '#6c3483',
            strokeWidth: 2,
            selectable: false,
            rx: 2,
            ry: 2
        });

        // Fiber adapter panels
        const panelCount = 4;
        const panelWidth = 70;
        const panelHeight = 25;
        const panelSpacing = (chassis.width - panelCount * panelWidth) / (panelCount + 1);

        for (let i = 0; i < panelCount; i++) {
            const panelX = panelSpacing + i * (panelWidth + panelSpacing);
            const panelY = (chassis.height - panelHeight) / 2;

            const panel = new fabric.Rect({
                left: panelX,
                top: panelY,
                width: panelWidth,
                height: panelHeight,
                fill: '#2c3e50',
                stroke: '#1a252f',
                strokeWidth: 1,
                selectable: false,
                rx: 2,
                ry: 2
            });
            group.addWithUpdate(panel);

            // Fiber connectors (6 per panel)
            for (let j = 0; j < 6; j++) {
                const connX = panelX + 5 + (j % 3) * 20;
                const connY = panelY + 5 + Math.floor(j / 3) * 15;

                const connector = new fabric.Circle({
                    left: connX,
                    top: connY,
                    radius: 4,
                    fill: '#f1c40f',
                    stroke: '#f39c12',
                    strokeWidth: 1,
                    selectable: false,
                    originX: 'center',
                    originY: 'center'
                });
                group.addWithUpdate(connector);
            }
        }

        group.addWithUpdate(chassis);
        return group;
    }

    // UPS 1U
    createUPS1U() {
        const group = new fabric.Group([], {
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            rackUnits: 1,
            equipmentName: 'UPS 1U'
        });

        const chassis = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.STANDARD_WIDTH - 40,
            height: this.RACK_UNIT,
            fill: '#e67e22',
            stroke: '#a04000',
            strokeWidth: 2,
            selectable: false,
            rx: 2,
            ry: 2
        });

        // LCD Display
        const display = new fabric.Rect({
            left: 20,
            top: 8,
            width: 80,
            height: 24,
            fill: '#2c3e50',
            stroke: '#1a252f',
            strokeWidth: 1,
            selectable: false,
            rx: 2,
            ry: 2
        });
        group.addWithUpdate(display);

        // Display text
        const displayText = new fabric.Text('100% ONLINE', {
            left: 60,
            top: 20,
            fontSize: 8,
            fontFamily: 'monospace',
            fill: '#27ae60',
            selectable: false,
            originX: 'center',
            originY: 'center'
        });
        group.addWithUpdate(displayText);

        // Status LEDs
        const ledLabels = ['PWR', 'BATT', 'LOAD'];
        const ledColors = ['#27ae60', '#f39c12', '#27ae60'];
        
        for (let i = 0; i < ledLabels.length; i++) {
            const led = new fabric.Circle({
                left: 120 + i * 30,
                top: 20,
                radius: 4,
                fill: ledColors[i],
                stroke: '#2c3e50',
                strokeWidth: 1,
                selectable: false,
                originX: 'center',
                originY: 'center'
            });
            group.addWithUpdate(led);
        }

        // Outlets
        for (let i = 0; i < 4; i++) {
            const outletX = chassis.width - 120 + i * 25;
            const outlet = new fabric.Rect({
                left: outletX,
                top: 12,
                width: 15,
                height: 16,
                fill: '#2c3e50',
                stroke: '#1a252f',
                strokeWidth: 1,
                selectable: false,
                rx: 2,
                ry: 2
            });
            group.addWithUpdate(outlet);
        }

        group.addWithUpdate(chassis);
        return group;
    }

    // UPS 2U
    createUPS2U() {
        const group = new fabric.Group([], {
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            rackUnits: 2,
            equipmentName: 'UPS 2U'
        });

        const chassis = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.STANDARD_WIDTH - 40,
            height: this.RACK_UNIT * 2,
            fill: '#e67e22',
            stroke: '#a04000',
            strokeWidth: 2,
            selectable: false,
            rx: 2,
            ry: 2
        });

        // Larger LCD Display
        const display = new fabric.Rect({
            left: 20,
            top: 15,
            width: 120,
            height: 50,
            fill: '#2c3e50',
            stroke: '#1a252f',
            strokeWidth: 1,
            selectable: false,
            rx: 3,
            ry: 3
        });
        group.addWithUpdate(display);

        // Multiple lines of display text
        const displayLines = ['ONLINE MODE', 'LOAD: 45%', 'BATT: 100%', 'TIME: 25min'];
        for (let i = 0; i < displayLines.length; i++) {
            const line = new fabric.Text(displayLines[i], {
                left: 80,
                top: 25 + i * 10,
                fontSize: 7,
                fontFamily: 'monospace',
                fill: '#27ae60',
                selectable: false,
                originX: 'center',
                originY: 'center'
            });
            group.addWithUpdate(line);
        }

        // More outlets (8 total)
        for (let i = 0; i < 8; i++) {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const outletX = chassis.width - 140 + col * 30;
            const outletY = 15 + row * 25;
            
            const outlet = new fabric.Rect({
                left: outletX,
                top: outletY,
                width: 20,
                height: 20,
                fill: '#2c3e50',
                stroke: '#1a252f',
                strokeWidth: 1,
                selectable: false,
                rx: 3,
                ry: 3
            });
            group.addWithUpdate(outlet);
        }

        group.addWithUpdate(chassis);
        return group;
    }

    // PDU (1U)
    createPDU() {
        const group = new fabric.Group([], {
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            rackUnits: 1,
            equipmentName: 'PDU 1U'
        });

        const chassis = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.STANDARD_WIDTH - 40,
            height: this.RACK_UNIT,
            fill: '#2c3e50',
            stroke: '#1a252f',
            strokeWidth: 2,
            selectable: false,
            rx: 2,
            ry: 2
        });

        // Power outlets (8 outlets)
        const outletCount = 8;
        const outletSpacing = (chassis.width - 60) / outletCount;
        
        for (let i = 0; i < outletCount; i++) {
            const outletX = 30 + i * outletSpacing;
            const outletY = (chassis.height - 16) / 2;

            const outlet = new fabric.Rect({
                left: outletX,
                top: outletY,
                width: 25,
                height: 16,
                fill: '#e74c3c',
                stroke: '#c0392b',
                strokeWidth: 1,
                selectable: false,
                rx: 2,
                ry: 2
            });
            group.addWithUpdate(outlet);

            // Outlet indicator LED
            const led = new fabric.Circle({
                left: outletX + 12.5,
                top: outletY - 5,
                radius: 2,
                fill: '#27ae60',
                selectable: false,
                originX: 'center',
                originY: 'center'
            });
            group.addWithUpdate(led);
        }

        // Circuit breaker
        const breaker = new fabric.Rect({
            left: chassis.width - 25,
            top: 8,
            width: 15,
            height: 24,
            fill: '#34495e',
            stroke: '#2c3e50',
            strokeWidth: 1,
            selectable: false,
            rx: 2,
            ry: 2
        });
        group.addWithUpdate(breaker);

        group.addWithUpdate(chassis);
        return group;
    }

    // Sound Masking System (1U)
    createSoundMasking() {
        const group = new fabric.Group([], {
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            rackUnits: 1,
            equipmentName: 'Sound Masking System'
        });

        const chassis = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.STANDARD_WIDTH - 40,
            height: this.RACK_UNIT,
            fill: '#16a085',
            stroke: '#117a65',
            strokeWidth: 2,
            selectable: false,
            rx: 2,
            ry: 2
        });

        // Control interface
        const controlInterface = new fabric.Rect({
            left: 20,
            top: 8,
            width: 100,
            height: 24,
            fill: '#2c3e50',
            stroke: '#1a252f',
            strokeWidth: 1,
            selectable: false,
            rx: 2,
            ry: 2
        });
        group.addWithUpdate(controlInterface);

        // Volume controls (4 zones)
        for (let i = 0; i < 4; i++) {
            const knobX = 140 + i * 40;
            const knob = new fabric.Circle({
                left: knobX,
                top: 20,
                radius: 8,
                fill: '#34495e',
                stroke: '#2c3e50',
                strokeWidth: 2,
                selectable: false,
                originX: 'center',
                originY: 'center'
            });
            group.addWithUpdate(knob);

            // Knob indicator
            const indicator = new fabric.Line([knobX, knobX - 5, knobX, knobX + 2], {
                stroke: '#f1c40f',
                strokeWidth: 2,
                selectable: false,
                originX: 'center',
                originY: 'center'
            });
            group.addWithUpdate(indicator);

            // Zone label
            const label = new fabric.Text(`Z${i + 1}`, {
                left: knobX,
                top: 35,
                fontSize: 8,
                fontFamily: 'Arial, sans-serif',
                fill: '#ecf0f1',
                selectable: false,
                originX: 'center',
                originY: 'center'
            });
            group.addWithUpdate(label);
        }

        // Output connections
        for (let i = 0; i < 4; i++) {
            const connX = chassis.width - 80 + i * 15;
            const connector = new fabric.Circle({
                left: connX,
                top: 20,
                radius: 4,
                fill: '#f39c12',
                stroke: '#e67e22',
                strokeWidth: 1,
                selectable: false,
                originX: 'center',
                originY: 'center'
            });
            group.addWithUpdate(connector);
        }

        group.addWithUpdate(chassis);
        return group;
    }

    // Paging System (2U)
    createPagingSystem() {
        const group = new fabric.Group([], {
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            rackUnits: 2,
            equipmentName: 'VRS Paging System'
        });

        const chassis = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.STANDARD_WIDTH - 40,
            height: this.RACK_UNIT * 2,
            fill: '#16a085',
            stroke: '#117a65',
            strokeWidth: 2,
            selectable: false,
            rx: 2,
            ry: 2
        });

        // Main display
        const display = new fabric.Rect({
            left: 20,
            top: 15,
            width: 140,
            height: 50,
            fill: '#2c3e50',
            stroke: '#1a252f',
            strokeWidth: 1,
            selectable: false,
            rx: 3,
            ry: 3
        });
        group.addWithUpdate(display);

        // Display content
        const displayText = new fabric.Text('PAGING SYSTEM\nZONE: ALL\nVOL: 75%', {
            left: 90,
            top: 40,
            fontSize: 8,
            fontFamily: 'monospace',
            fill: '#27ae60',
            selectable: false,
            originX: 'center',
            originY: 'center'
        });
        group.addWithUpdate(displayText);

        // Zone selection buttons
        for (let i = 0; i < 8; i++) {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const buttonX = 180 + col * 30;
            const buttonY = 20 + row * 25;

            const button = new fabric.Rect({
                left: buttonX,
                top: buttonY,
                width: 25,
                height: 20,
                fill: i < 3 ? '#e74c3c' : '#34495e',
                stroke: '#2c3e50',
                strokeWidth: 1,
                selectable: false,
                rx: 2,
                ry: 2
            });
            group.addWithUpdate(button);

            const buttonLabel = new fabric.Text(`${i + 1}`, {
                left: buttonX + 12.5,
                top: buttonY + 10,
                fontSize: 8,
                fontFamily: 'Arial, sans-serif',
                fill: '#ecf0f1',
                selectable: false,
                originX: 'center',
                originY: 'center'
            });
            group.addWithUpdate(buttonLabel);
        }

        // Audio input/output connections
        const ioCount = 6;
        for (let i = 0; i < ioCount; i++) {
            const ioX = chassis.width - 60 + (i % 3) * 15;
            const ioY = 20 + Math.floor(i / 3) * 25;

            const connector = new fabric.Circle({
                left: ioX,
                top: ioY,
                radius: 5,
                fill: '#f39c12',
                stroke: '#e67e22',
                strokeWidth: 1,
                selectable: false,
                originX: 'center',
                originY: 'center'
            });
            group.addWithUpdate(connector);
        }

        group.addWithUpdate(chassis);
        return group;
    }
}