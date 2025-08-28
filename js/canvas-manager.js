// Canvas Manager - Handles fabric.js canvas operations and interactions
class CanvasManager {
    constructor(canvasId) {
        this.canvas = new fabric.Canvas(canvasId, {
            backgroundColor: '#fafbfc',
            selection: true,
            preserveObjectStacking: true
        });
        
        this.rackComponents = new RackComponents();
        this.equipmentLibrary = new LegacyEnhancedEquipmentLibrary();
        this.selectedObject = null;
        this.snapToGrid = true;
        this.showGrid = true;
        this.gridSize = 20;
        this.zoom = 1;
        this.dragPreview = null;
        this.isDraggingFromLibrary = false;
        this.isDropping = false;
        
        this.setupEventHandlers();
        this.setupCanvas();
        this.addInitialRack();
    }

    setupCanvas() {
        // Enable retina/high DPI support
        this.canvas.enableRetinaScaling = true;
        
        // Set canvas size
        this.resizeCanvas();
        
        // Setup grid
        this.drawGrid();
        
        // Setup zoom bounds
        this.canvas.zoomToPoint = this.canvas.zoomToPoint.bind(this.canvas);
    }

    setupEventHandlers() {
        // Object selection
        this.canvas.on('selection:created', (e) => {
            this.selectedObject = e.selected[0];
            this.updatePropertiesPanel();
        });

        this.canvas.on('selection:updated', (e) => {
            this.selectedObject = e.selected[0];
            this.updatePropertiesPanel();
        });

        this.canvas.on('selection:cleared', () => {
            this.selectedObject = null;
            this.updatePropertiesPanel();
        });

        // Object movement with snapping
        this.canvas.on('object:moving', (e) => {
            if (this.snapToGrid) {
                this.snapObjectToGrid(e.target);
            }
            this.updateRackPlacement(e.target);
        });

        // Object modification
        this.canvas.on('object:modified', (e) => {
            this.updateRackPlacement(e.target);
        });

        // Mouse wheel zoom
        this.canvas.on('mouse:wheel', (opt) => {
            const delta = opt.e.deltaY;
            let zoom = this.canvas.getZoom();
            zoom *= 0.999 ** delta;
            
            if (zoom > 3) zoom = 3;
            if (zoom < 0.1) zoom = 0.1;
            
            this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            this.zoom = zoom;
            this.updateZoomDisplay();
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });

        // Drag and drop from equipment library - delay setup
        setTimeout(() => {
            this.setupDragAndDrop();
        }, 1000);

        // Window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }

    setupDragAndDrop() {
        const equipmentItems = document.querySelectorAll('.equipment-item');
        
        equipmentItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                const equipmentType = item.getAttribute('data-type');
                const equipmentHeight = item.getAttribute('data-height');
                
                e.dataTransfer.setData('application/json', JSON.stringify({
                    type: equipmentType,
                    height: parseInt(equipmentHeight)
                }));
                
                // Create drag image
                const dragImage = item.cloneNode(true);
                dragImage.style.transform = 'rotate(-5deg)';
                dragImage.style.opacity = '0.8';
                document.body.appendChild(dragImage);
                e.dataTransfer.setDragImage(dragImage, 0, 0);
                
                setTimeout(() => document.body.removeChild(dragImage), 0);
            });
            
            item.setAttribute('draggable', 'true');
        });

        // Canvas drop zone
        const canvasContainer = this.canvas.getElement().parentElement;
        
        canvasContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        canvasContainer.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Prevent multiple drops
            if (this.isDropping) {
                console.log('Drop already in progress, ignoring');
                return;
            }
            
            this.isDropping = true;
            
            try {
                const data = JSON.parse(e.dataTransfer.getData('application/json'));
                
                // Convert screen coordinates to canvas coordinates
                const pointer = this.canvas.getPointer(e);
                
                console.log(`Dropping ${data.type} at position:`, pointer);
                
                await this.addEquipmentToCanvas(data.type, pointer.x, pointer.y);
            } catch (error) {
                console.error('Error handling drop:', error);
            } finally {
                // Reset drop flag after a short delay
                setTimeout(() => {
                    this.isDropping = false;
                }, 500);
            }
        });
    }

    async addEquipmentToCanvas(type, x, y) {
        let equipment;
        
        // Handle special cases
        switch (type) {
            case 'new-rack':
                // Smart positioning for new racks
                const rackPosition = this.getSmartRackPosition(x, y);
                equipment = this.rackComponents.createRack(rackPosition.x, rackPosition.y);
                break;
            case 'horizontal-manager':
                equipment = this.rackComponents.createHorizontalManager();
                equipment.set({ left: x, top: y });
                break;
            case 'vertical-manager':
                // Smart positioning for vertical managers
                const managerPosition = this.getSmartManagerPosition(x, y);
                equipment = this.rackComponents.createVerticalManager();
                equipment.set({ left: managerPosition.x, top: managerPosition.y });
                break;
            default:
                // Use enhanced equipment library for async image loading
                equipment = await this.equipmentLibrary.createEquipment(type, x, y);
                break;
        }
        
        if (equipment) {
            // Snap to rack units if it's equipment, otherwise snap to grid
            if (equipment.rackUnits && equipment.rackUnits > 0) {
                this.snapEquipmentToRackUnits(equipment);
            } else if (this.snapToGrid) {
                this.snapObjectToGrid(equipment);
            }
            
            this.canvas.add(equipment);
            this.canvas.setActiveObject(equipment);
            this.canvas.renderAll();
            
            // Try to place in nearest rack if it's equipment
            if (equipment.rackUnits && equipment.rackUnits > 0) {
                this.tryAutoPlaceInRack(equipment);
            }
            
            console.log(`Added ${type} to canvas at position:`, equipment.left, equipment.top);
        }
    }

    getSmartRackPosition(x, y) {
        const existingRacks = this.canvas.getObjects().filter(obj => obj.rackType === 'chatsworth-2post');
        
        if (existingRacks.length === 0) {
            // First rack - center it
            return { x: 100, y: 100 };
        }
        
        // Find the rightmost rack
        let rightmostRack = existingRacks[0];
        existingRacks.forEach(rack => {
            const rackBounds = rack.getBoundingRect();
            const rightmostBounds = rightmostRack.getBoundingRect();
            if (rackBounds.left + rackBounds.width > rightmostBounds.left + rightmostBounds.width) {
                rightmostRack = rack;
            }
        });
        
        const rightmostBounds = rightmostRack.getBoundingRect();
        const spacing = 100; // Space between racks
        
        return {
            x: rightmostBounds.left + rightmostBounds.width + spacing,
            y: rightmostBounds.top
        };
    }

    getSmartManagerPosition(x, y) {
        const existingRacks = this.canvas.getObjects().filter(obj => obj.rackType === 'chatsworth-2post');
        const existingManagers = this.canvas.getObjects().filter(obj => obj.equipmentType === 'vertical-manager');
        
        if (existingRacks.length === 0) {
            // No racks - place at drop position
            return { x, y };
        }
        
        // Find the leftmost rack
        let leftmostRack = existingRacks[0];
        existingRacks.forEach(rack => {
            const rackBounds = rack.getBoundingRect();
            const leftmostBounds = leftmostRack.getBoundingRect();
            if (rackBounds.left < leftmostBounds.left) {
                leftmostRack = rack;
            }
        });
        
        const leftmostBounds = leftmostRack.getBoundingRect();
        const managerWidth = 80; // Typical vertical manager width
        const spacing = 50; // Space between manager and rack
        
        return {
            x: leftmostBounds.left - managerWidth - spacing,
            y: leftmostBounds.top
        };
    }

    tryAutoPlaceInRack(equipment) {
        const racks = this.canvas.getObjects().filter(obj => obj.rackType === 'chatsworth-2post');
        let bestRack = null;
        let bestDistance = Infinity;
        
        // Find nearest rack
        racks.forEach(rack => {
            const distance = this.getDistance(equipment, rack);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestRack = rack;
            }
        });
        
        if (bestRack && bestDistance < 200) { // Within reasonable distance
            const snapPositions = this.rackComponents.getRackSnapPositions(bestRack);
            
            // Find first available position that can fit the equipment
            for (const position of snapPositions) {
                if (position.available && 
                    this.rackComponents.canFitEquipment(bestRack, position.unit, equipment.rackUnits)) {
                    
                    if (this.rackComponents.placeEquipment(bestRack, equipment, position.unit)) {
                        this.canvas.renderAll();
                        break;
                    }
                }
            }
        }
    }

    updateRackPlacement(object) {
        // If object is equipment being moved near a rack, show placement hints
        if (object.rackUnits && object.rackUnits > 0) {
            const racks = this.canvas.getObjects().filter(obj => obj.rackType === 'chatsworth-2post');
            
            racks.forEach(rack => {
                const distance = this.getDistance(object, rack);
                if (distance < 100) {
                    // Show visual feedback for potential placement
                    this.showRackPlacementHints(rack, object);
                } else {
                    this.hideRackPlacementHints(rack);
                }
            });
        }
    }

    showRackPlacementHints(rack, equipment) {
        // Remove existing hints
        this.hideRackPlacementHints(rack);
        
        const snapPositions = this.rackComponents.getRackSnapPositions(rack);
        const hints = [];
        
        for (const position of snapPositions) {
            if (position.available && 
                this.rackComponents.canFitEquipment(rack, position.unit, equipment.rackUnits)) {
                
                const hint = new fabric.Rect({
                    left: position.x,
                    top: position.y,
                    width: this.equipmentLibrary.STANDARD_WIDTH - 40,
                    height: equipment.rackUnits * this.rackComponents.RACK_UNIT,
                    fill: 'rgba(52, 152, 219, 0.3)',
                    stroke: '#3498db',
                    strokeWidth: 2,
                    strokeDashArray: [5, 5],
                    selectable: false,
                    evented: false,
                    isPlacementHint: true
                });
                
                hints.push(hint);
                this.canvas.add(hint);
            }
        }
        
        rack.placementHints = hints;
        this.canvas.renderAll();
    }

    hideRackPlacementHints(rack) {
        if (rack.placementHints) {
            rack.placementHints.forEach(hint => this.canvas.remove(hint));
            rack.placementHints = [];
            this.canvas.renderAll();
        }
    }

    getDistance(obj1, obj2) {
        const bounds1 = obj1.getBoundingRect();
        const bounds2 = obj2.getBoundingRect();
        
        const centerX1 = bounds1.left + bounds1.width / 2;
        const centerY1 = bounds1.top + bounds1.height / 2;
        const centerX2 = bounds2.left + bounds2.width / 2;
        const centerY2 = bounds2.top + bounds2.height / 2;
        
        return Math.sqrt(Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2));
    }

    snapObjectToGrid(object) {
        const gridSize = this.gridSize;
        const bounds = object.getBoundingRect();
        
        const snappedLeft = Math.round(bounds.left / gridSize) * gridSize;
        const snappedTop = Math.round(bounds.top / gridSize) * gridSize;
        
        object.set({
            left: snappedLeft,
            top: snappedTop
        });
        
        object.setCoords();
    }

    snapEquipmentToRackUnits(equipment) {
        const racks = this.canvas.getObjects().filter(obj => obj.rackType === 'chatsworth-2post');
        let nearestRack = null;
        let nearestDistance = Infinity;
        
        // Find the nearest rack
        racks.forEach(rack => {
            const distance = this.getDistance(equipment, rack);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestRack = rack;
            }
        });
        
        if (nearestRack && nearestDistance < 150) {
            // Snap to rack unit boundaries
            const snapPositions = this.rackComponents.getRackSnapPositions(nearestRack);
            let bestPosition = null;
            let bestDistance = Infinity;
            
            const equipmentBounds = equipment.getBoundingRect();
            const equipmentCenterY = equipmentBounds.top + equipmentBounds.height / 2;
            
            snapPositions.forEach(position => {
                const positionCenterY = position.y + (equipment.rackUnits * this.rackComponents.RACK_UNIT) / 2;
                const distance = Math.abs(equipmentCenterY - positionCenterY);
                
                if (distance < bestDistance && 
                    this.rackComponents.canFitEquipment(nearestRack, position.unit, equipment.rackUnits)) {
                    bestDistance = distance;
                    bestPosition = position;
                }
            });
            
            if (bestPosition) {
                equipment.set({
                    left: bestPosition.x,
                    top: bestPosition.y
                });
                equipment.setCoords();
            }
        } else if (this.snapToGrid) {
            // Fall back to grid snapping if no rack is nearby
            this.snapObjectToGrid(equipment);
        }
    }

    drawGrid() {
        if (!this.showGrid) return;
        
        const canvasWidth = this.canvas.getWidth();
        const canvasHeight = this.canvas.getHeight();
        const gridSize = this.gridSize;
        
        // Remove existing grid
        const existingGrid = this.canvas.getObjects().filter(obj => obj.isGrid);
        existingGrid.forEach(line => this.canvas.remove(line));
        
        // Draw vertical lines
        for (let i = 0; i <= canvasWidth; i += gridSize) {
            const line = new fabric.Line([i, 0, i, canvasHeight], {
                stroke: 'rgba(52, 152, 219, 0.1)',
                strokeWidth: 1,
                selectable: false,
                evented: false,
                isGrid: true
            });
            this.canvas.add(line);
            this.canvas.sendToBack(line);
        }
        
        // Draw horizontal lines
        for (let i = 0; i <= canvasHeight; i += gridSize) {
            const line = new fabric.Line([0, i, canvasWidth, i], {
                stroke: 'rgba(52, 152, 219, 0.1)',
                strokeWidth: 1,
                selectable: false,
                evented: false,
                isGrid: true
            });
            this.canvas.add(line);
            this.canvas.sendToBack(line);
        }
        
        this.canvas.renderAll();
    }

    addInitialRack() {
        const rack = this.rackComponents.createRack(100, 100);
        this.canvas.add(rack);
        this.canvas.renderAll();
    }

    resizeCanvas() {
        const container = this.canvas.getElement().parentElement;
        const containerRect = container.getBoundingClientRect();
        
        this.canvas.setDimensions({
            width: containerRect.width,
            height: containerRect.height
        });
        
        if (this.showGrid) {
            this.drawGrid();
        }
    }

    updatePropertiesPanel() {
        const noSelection = document.getElementById('noSelection');
        const itemProperties = document.getElementById('itemProperties');
        
        if (!this.selectedObject) {
            noSelection.style.display = 'block';
            itemProperties.style.display = 'none';
            return;
        }
        
        noSelection.style.display = 'none';
        itemProperties.style.display = 'block';
        
        // Update property fields
        document.getElementById('itemName').value = this.selectedObject.equipmentName || this.selectedObject.rackType || 'Unnamed';
        document.getElementById('itemType').textContent = this.selectedObject.equipmentType || this.selectedObject.rackType || 'Unknown';
        document.getElementById('itemHeight').textContent = this.selectedObject.rackUnits ? `${this.selectedObject.rackUnits}U` : 'N/A';
        
        const bounds = this.selectedObject.getBoundingRect();
        document.getElementById('itemPosition').textContent = `${Math.round(bounds.left)}, ${Math.round(bounds.top)}`;
    }

    updateZoomDisplay() {
        const zoomDisplay = document.querySelector('.zoom-level');
        if (zoomDisplay) {
            zoomDisplay.textContent = `${Math.round(this.zoom * 100)}%`;
        }
    }

    // Zoom controls
    zoomIn() {
        let zoom = this.canvas.getZoom();
        zoom = zoom * 1.1;
        if (zoom > 3) zoom = 3;
        
        this.canvas.setZoom(zoom);
        this.zoom = zoom;
        this.updateZoomDisplay();
    }

    zoomOut() {
        let zoom = this.canvas.getZoom();
        zoom = zoom / 1.1;
        if (zoom < 0.1) zoom = 0.1;
        
        this.canvas.setZoom(zoom);
        this.zoom = zoom;
        this.updateZoomDisplay();
    }

    zoomToFit() {
        const objects = this.canvas.getObjects().filter(obj => !obj.isGrid && !obj.isPlacementHint);
        if (objects.length === 0) return;
        
        // Calculate bounding box of all objects
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        objects.forEach(obj => {
            const bounds = obj.getBoundingRect();
            minX = Math.min(minX, bounds.left);
            minY = Math.min(minY, bounds.top);
            maxX = Math.max(maxX, bounds.left + bounds.width);
            maxY = Math.max(maxY, bounds.top + bounds.height);
        });
        
        const width = maxX - minX;
        const height = maxY - minY;
        const centerX = minX + width / 2;
        const centerY = minY + height / 2;
        
        // Calculate zoom to fit with padding
        const canvasWidth = this.canvas.getWidth();
        const canvasHeight = this.canvas.getHeight();
        const padding = 50;
        
        const zoomX = (canvasWidth - padding * 2) / width;
        const zoomY = (canvasHeight - padding * 2) / height;
        const zoom = Math.min(zoomX, zoomY, 3);
        
        this.canvas.setZoom(zoom);
        this.canvas.absolutePan({
            x: canvasWidth / 2 - centerX * zoom,
            y: canvasHeight / 2 - centerY * zoom
        });
        
        this.zoom = zoom;
        this.updateZoomDisplay();
    }

    toggleGrid() {
        this.showGrid = !this.showGrid;
        
        if (this.showGrid) {
            this.drawGrid();
        } else {
            const gridLines = this.canvas.getObjects().filter(obj => obj.isGrid);
            gridLines.forEach(line => this.canvas.remove(line));
            this.canvas.renderAll();
        }
        
        // Update button state
        const gridButton = document.getElementById('gridToggle');
        if (gridButton) {
            gridButton.classList.toggle('active', this.showGrid);
        }
    }

    toggleSnap() {
        this.snapToGrid = !this.snapToGrid;
        
        // Update button state
        const snapButton = document.getElementById('snapToggle');
        if (snapButton) {
            snapButton.classList.toggle('active', this.snapToGrid);
        }
    }

    deleteSelectedObject() {
        if (this.selectedObject) {
            // If it's equipment in a rack, remove it from the rack first
            if (this.selectedObject.parentRack) {
                this.rackComponents.removeEquipment(this.selectedObject.parentRack, this.selectedObject);
            }
            
            this.canvas.remove(this.selectedObject);
            this.selectedObject = null;
            this.updatePropertiesPanel();
            this.canvas.renderAll();
        }
    }

    // Get canvas data for export
    getCanvasData() {
        return {
            objects: this.canvas.toObject(),
            zoom: this.zoom,
            width: this.canvas.getWidth(),
            height: this.canvas.getHeight()
        };
    }

    // Load canvas data
    loadCanvasData(data) {
        this.canvas.loadFromJSON(data.objects, () => {
            this.canvas.renderAll();
            if (data.zoom) {
                this.canvas.setZoom(data.zoom);
                this.zoom = data.zoom;
                this.updateZoomDisplay();
            }
        });
    }
}