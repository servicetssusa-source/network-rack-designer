// Rack Components - Accurate Chatsworth 2-post rack implementation
class RackComponents {
    constructor() {
        // Rack Unit standard: 1U = 1.75 inches = 44.45mm
        // For display: 1U = 40 pixels (scaling for screen display)
        this.RACK_UNIT = 40; // pixels per U
        this.RACK_HOLE_SPACING = {
            first: 0.5 * this.RACK_UNIT / 1.75,  // 0.5"
            second: 0.625 * this.RACK_UNIT / 1.75, // 0.625"
            third: 0.625 * this.RACK_UNIT / 1.75   // 0.625"
        };
        
        // Chatsworth 2-post rack dimensions (scaled)
        this.RACK_DIMENSIONS = {
            width: 19 * 20, // 19" = 380px
            height: 45 * this.RACK_UNIT, // 45U = 1800px (7 feet)
            postWidth: 3 * 20, // 3" = 60px
            baseHeight: 4 * this.RACK_UNIT, // Taller base section
            topHeight: 2 * this.RACK_UNIT   // Smaller top bracket
        };
    }

    // Create Chatsworth 2-post rack with accurate proportions from our design
    createRack(x = 50, y = 50) {
        // Use canvas-based rendering for the precise Chatsworth rack
        const rackCanvas = this.createChatsworthRackCanvas();
        
        const rackImage = new fabric.Image(rackCanvas, {
            left: x,
            top: y,
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            lockScalingX: true,
            lockScalingY: true,
            rackType: 'chatsworth-2post',
            rackUnits: 45,
            equipmentSlots: new Array(45).fill(null),
            // Store original dimensions for calculations
            originalWidth: rackCanvas.width,
            originalHeight: rackCanvas.height
        });
        
        return rackImage;
    }

    // Create the precise Chatsworth rack using our designed implementation
    createChatsworthRackCanvas() {
        const canvasWidth = 600;
        const canvasHeight = 800;
        
        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');
        
        // Set transparent background
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Use our precise Chatsworth rack implementation
        this.createChatsworthRack(ctx, canvasWidth, canvasHeight);
        
        return canvas;
    }

    // Precise Chatsworth rack implementation from our design
    createChatsworthRack(ctx, canvasWidth, canvasHeight) {
        // PREVENT CANVAS BLUR - SHARP RENDERING
        ctx.imageSmoothingEnabled = false;
        
        // SCALABLE PROPORTIONS FROM PDF ANALYSIS
        // Base unit: 1U height - everything scales from this
        const baseUnitHeight = Math.min(canvasHeight * 0.018, canvasWidth * 0.1); // Responsive scaling
        
        // PDF PRECISE MEASUREMENTS (as ratios)
        const totalUnits = 45; // 45U usable rack space
        const usableRackHeight = totalUnits * baseUnitHeight; // 78.75"
        const totalRackHeight = baseUnitHeight * 48; // 84" total physical height
        const structuralSpace = totalRackHeight - usableRackHeight; // 5.25" for top/bottom
        const rackHeight = totalRackHeight;
        const rackWidth = rackHeight * 0.167; // PDF ratio: width ≈ 1/6 of height
        
        // POST DIMENSIONS FROM CHATSWORTH DATASHEET
        // Outside to outside: 20.32", Inside to inside: 17.79"
        // Rail thickness: (20.32" - 17.79") ÷ 2 = 1.265"
        const postWidthInches = 1.265; // Actual Chatsworth rail thickness
        const postWidth = postWidthInches * (baseUnitHeight / 1.75); // Scale to canvas
        const insideSpacing = 17.79 * (baseUnitHeight / 1.75); // Inside rail to inside rail
        const outsideSpacing = 20.32 * (baseUnitHeight / 1.75); // Outside rail to outside rail
        
        // BASE AND TOP PLATE HEIGHTS FROM DATASHEET
        const baseHeightInches = 3.88; // Base plate extends 3.88" from floor
        const baseHeight = baseHeightInches * (baseUnitHeight / 1.75); // Scale to canvas
        const topHeight = baseUnitHeight * 0.6; // ~1+ inch tall
        
        // MOUNTING HOLE SPECIFICATIONS FROM DATASHEET
        const holeDiameterInches = 0.216; // #12-24 thread diameter
        const holeRadius = (holeDiameterInches * (baseUnitHeight / 1.75)) / 2; // Scale to canvas
        const holeSpacingRatio1 = 0.286; // 1/2" ÷ 1.75" = 0.286
        const holeSpacingRatio2 = 0.643; // 1.125" ÷ 1.75" = 0.643  
        const holeSpacingRatio3 = 0.929; // 1.625" ÷ 1.75" = 0.929
        
        // CENTER THE RACK ON CANVAS
        const startX = (canvasWidth - outsideSpacing) / 2;
        const startY = (canvasHeight - rackHeight) / 2;
        
        // CALCULATE POST POSITIONS USING DATASHEET MEASUREMENTS
        const leftPostX = startX;
        const rightPostX = startX + outsideSpacing - postWidth;
        
        // DRAW LEFT MOUNTING POST (BLACK ALUMINUM FINISH)
        ctx.fillStyle = '#2a2a2a'; // Professional black aluminum
        ctx.fillRect(Math.round(leftPostX), Math.round(startY + topHeight), Math.round(postWidth), Math.round(rackHeight - topHeight - baseHeight));
        
        // Add metallic highlight for depth
        const gradient1 = ctx.createLinearGradient(leftPostX, 0, leftPostX + postWidth, 0);
        gradient1.addColorStop(0, '#2a2a2a'); // Darker left edge
        gradient1.addColorStop(0.3, '#3a3a3a'); // Base color (lighter)
        gradient1.addColorStop(0.7, '#4a4a4a'); // Slight highlight (lighter)
        gradient1.addColorStop(1, '#2a2a2a'); // Darker right edge
        ctx.fillStyle = gradient1;
        ctx.fillRect(Math.round(leftPostX), Math.round(startY + topHeight), Math.round(postWidth), Math.round(rackHeight - topHeight - baseHeight));
        
        ctx.strokeStyle = '#0f0f0f'; // Very dark outline
        ctx.lineWidth = Math.round(Math.max(0.5, baseUnitHeight * 0.01));
        ctx.strokeRect(Math.round(leftPostX), Math.round(startY + topHeight), Math.round(postWidth), Math.round(rackHeight - topHeight - baseHeight));
        
        // DRAW RIGHT MOUNTING POST (BLACK ALUMINUM FINISH)
        const gradient2 = ctx.createLinearGradient(rightPostX, 0, rightPostX + postWidth, 0);
        gradient2.addColorStop(0, '#2a2a2a'); // Darker left edge
        gradient2.addColorStop(0.3, '#3a3a3a'); // Base color (lighter)
        gradient2.addColorStop(0.7, '#4a4a4a'); // Slight highlight (lighter)
        gradient2.addColorStop(1, '#2a2a2a'); // Darker right edge
        ctx.fillStyle = gradient2;
        ctx.fillRect(Math.round(rightPostX), Math.round(startY + topHeight), Math.round(postWidth), Math.round(rackHeight - topHeight - baseHeight));
        ctx.strokeRect(Math.round(rightPostX), Math.round(startY + topHeight), Math.round(postWidth), Math.round(rackHeight - topHeight - baseHeight));
        
        // DRAW TOP PLATE (BLACK ALUMINUM WITH METALLIC FINISH)
        const topGradient = ctx.createLinearGradient(startX, startY, startX, startY + topHeight);
        topGradient.addColorStop(0, '#4a4a4a'); // Lighter top edge
        topGradient.addColorStop(0.5, '#3a3a3a'); // Base color (lighter)
        topGradient.addColorStop(1, '#2a2a2a'); // Darker bottom edge
        ctx.fillStyle = topGradient;
        ctx.fillRect(Math.round(startX), Math.round(startY), Math.round(outsideSpacing), Math.round(topHeight));
        ctx.strokeStyle = '#0f0f0f';
        ctx.lineWidth = Math.round(Math.max(0.5, baseUnitHeight * 0.01));
        ctx.strokeRect(Math.round(startX), Math.round(startY), Math.round(outsideSpacing), Math.round(topHeight));
        
        // DRAW BASE PLATE (BLACK ALUMINUM WITH METALLIC FINISH)
        const baseGradient = ctx.createLinearGradient(startX, startY + rackHeight - baseHeight, startX, startY + rackHeight);
        baseGradient.addColorStop(0, '#2a2a2a'); // Darker top edge
        baseGradient.addColorStop(0.5, '#3a3a3a'); // Base color (lighter)
        baseGradient.addColorStop(1, '#4a4a4a'); // Lighter bottom edge
        ctx.fillStyle = baseGradient;
        ctx.fillRect(Math.round(startX), Math.round(startY + rackHeight - baseHeight), Math.round(outsideSpacing), Math.round(baseHeight));
        ctx.strokeStyle = '#0f0f0f';
        ctx.strokeRect(Math.round(startX), Math.round(startY + rackHeight - baseHeight), Math.round(outsideSpacing), Math.round(baseHeight));
        
        // DRAW PRECISE EIA-310 MOUNTING HOLES (VERY DARK THREADED HOLES)
        ctx.fillStyle = '#000000'; // Pure black for maximum contrast
        
        const postStartY = startY + topHeight;
        const postHeight = rackHeight - topHeight - baseHeight;
        const unitsInPostArea = Math.floor(postHeight / baseUnitHeight);
        
        for (let u = 0; u < unitsInPostArea; u++) {
            const uStartY = postStartY + (u * baseUnitHeight);
            
            // EXACT HOLE POSITIONS FROM PDF PATTERN
            const hole1Y = uStartY + (baseUnitHeight * holeSpacingRatio1);
            const hole2Y = uStartY + (baseUnitHeight * holeSpacingRatio2);
            const hole3Y = uStartY + (baseUnitHeight * holeSpacingRatio3);
            
            // LEFT POST HOLES (positioned toward interior third of rail)
            const leftHoleX = leftPostX + (postWidth * 2/3); // Interior third position
            ctx.beginPath();
            ctx.arc(Math.round(leftHoleX), Math.round(hole1Y), holeRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(Math.round(leftHoleX), Math.round(hole2Y), holeRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(Math.round(leftHoleX), Math.round(hole3Y), holeRadius, 0, 2 * Math.PI);
            ctx.fill();
            
            // RIGHT POST HOLES (positioned toward interior third of rail)
            const rightHoleX = rightPostX + (postWidth * 1/3); // Interior third position
            ctx.beginPath();
            ctx.arc(Math.round(rightHoleX), Math.round(hole1Y), holeRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(Math.round(rightHoleX), Math.round(hole2Y), holeRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(Math.round(rightHoleX), Math.round(hole3Y), holeRadius, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Store dimensions for later calculations
        this.chatsworthDimensions = {
            baseUnitHeight,
            outsideSpacing,
            rackHeight,
            startX,
            startY,
            postWidth,
            leftPostX,
            rightPostX,
            topHeight,
            baseHeight,
            insideSpacing
        };
        
        console.log('Precise scalable Chatsworth rack rendered from our design');
        console.log(`Scale: 1U = ${baseUnitHeight}px, Posts: ${postWidth}px wide`);
    }

    createRackParts() {
        const parts = [];
        const { width, height, postWidth, baseHeight, topHeight } = this.RACK_DIMENSIONS;
        
        // Base plate (taller section)
        const basePlate = new fabric.Rect({
            left: 0,
            top: height - baseHeight,
            width: width,
            height: baseHeight,
            fill: '#2c3e50',
            stroke: '#1a252f',
            strokeWidth: 2,
            selectable: false
        });
        parts.push(basePlate);

        // Top bracket (smaller)
        const topBracket = new fabric.Rect({
            left: width * 0.2,
            top: 0,
            width: width * 0.6,
            height: topHeight,
            fill: '#34495e',
            stroke: '#1a252f',
            strokeWidth: 2,
            selectable: false
        });
        parts.push(topBracket);

        // Left post with mounting holes
        const leftPost = this.createPost(0, topHeight, height - baseHeight - topHeight);
        parts.push(...leftPost);

        // Right post with mounting holes
        const rightPost = this.createPost(width - postWidth, topHeight, height - baseHeight - topHeight);
        parts.push(...rightPost);

        // Add rack unit markings
        const markings = this.createRackUnitMarkings(width, height);
        parts.push(...markings);

        return parts;
    }

    createPost(x, startY, postHeight) {
        const parts = [];
        const { postWidth } = this.RACK_DIMENSIONS;
        
        // Main post
        const post = new fabric.Rect({
            left: x,
            top: startY,
            width: postWidth,
            height: postHeight,
            fill: '#34495e',
            stroke: '#1a252f',
            strokeWidth: 2,
            selectable: false
        });
        parts.push(post);

        // Mounting holes (3 holes per U, following EIA-310 standard)
        const totalUnits = 42; // 42U of usable space (excluding base and top)
        for (let u = 0; u < totalUnits; u++) {
            const uStartY = startY + (u * this.RACK_UNIT);
            
            // Three holes per rack unit
            const holePositions = [
                uStartY + this.RACK_HOLE_SPACING.first,
                uStartY + this.RACK_HOLE_SPACING.first + this.RACK_HOLE_SPACING.second,
                uStartY + this.RACK_HOLE_SPACING.first + this.RACK_HOLE_SPACING.second + this.RACK_HOLE_SPACING.third
            ];

            holePositions.forEach(holeY => {
                const hole = new fabric.Circle({
                    left: x + postWidth / 2,
                    top: holeY,
                    radius: 3,
                    fill: '#1a252f',
                    stroke: '#0f1419',
                    strokeWidth: 1,
                    selectable: false,
                    originX: 'center',
                    originY: 'center'
                });
                parts.push(hole);
            });
        }

        return parts;
    }

    createRackUnitMarkings(rackWidth, rackHeight) {
        const markings = [];
        const { postWidth, baseHeight, topHeight } = this.RACK_DIMENSIONS;
        
        // Add U markings on the left side
        for (let u = 1; u <= 42; u++) {
            const y = rackHeight - baseHeight - (u * this.RACK_UNIT);
            
            const uNumber = new fabric.Text(`${u}U`, {
                left: -25,
                top: y - 8,
                fontSize: 10,
                fontFamily: 'Arial, sans-serif',
                fill: '#7f8c8d',
                selectable: false,
                fontWeight: 'bold'
            });
            markings.push(uNumber);

            // Horizontal guide line
            const guideLine = new fabric.Line([
                postWidth, y,
                rackWidth - postWidth, y
            ], {
                stroke: '#bdc3c7',
                strokeWidth: 0.5,
                strokeDashArray: [2, 2],
                selectable: false,
                opacity: 0.6
            });
            markings.push(guideLine);
        }

        return markings;
    }

    // Create horizontal cable manager
    createHorizontalManager(width = this.RACK_DIMENSIONS.width, height = 1) {
        const managerHeight = height * this.RACK_UNIT;
        
        const manager = new fabric.Group([], {
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            equipmentType: 'horizontal-manager',
            rackUnits: height
        });

        // Main body
        const body = new fabric.Rect({
            left: 0,
            top: 0,
            width: width,
            height: managerHeight,
            fill: '#95a5a6',
            stroke: '#7f8c8d',
            strokeWidth: 2,
            selectable: false
        });

        // Cable management slots
        const slotCount = 4;
        const slotWidth = width / slotCount * 0.7;
        const slotHeight = managerHeight * 0.3;
        
        for (let i = 0; i < slotCount; i++) {
            const slotX = (width / slotCount) * i + (width / slotCount - slotWidth) / 2;
            const slotY = (managerHeight - slotHeight) / 2;
            
            const slot = new fabric.Rect({
                left: slotX,
                top: slotY,
                width: slotWidth,
                height: slotHeight,
                fill: '#34495e',
                stroke: '#2c3e50',
                strokeWidth: 1,
                selectable: false,
                rx: 2,
                ry: 2
            });
            manager.addWithUpdate(slot);
        }

        manager.addWithUpdate(body);
        return manager;
    }

    // Create vertical cable manager
    createVerticalManager(height = this.RACK_DIMENSIONS.height * 0.8) {
        const manager = new fabric.Group([], {
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true,
            equipmentType: 'vertical-manager',
            rackUnits: 0
        });

        const width = 80; // Fixed width for vertical managers

        // Main body
        const body = new fabric.Rect({
            left: 0,
            top: 0,
            width: width,
            height: height,
            fill: '#95a5a6',
            stroke: '#7f8c8d',
            strokeWidth: 2,
            selectable: false
        });

        // Vertical cable channels
        const channelCount = 3;
        const channelWidth = 8;
        
        for (let i = 0; i < channelCount; i++) {
            const channelX = width * 0.2 + (i * (width * 0.6 / channelCount));
            
            const channel = new fabric.Rect({
                left: channelX,
                top: height * 0.1,
                width: channelWidth,
                height: height * 0.8,
                fill: '#34495e',
                stroke: '#2c3e50',
                strokeWidth: 1,
                selectable: false,
                rx: 1,
                ry: 1
            });
            manager.addWithUpdate(channel);
        }

        manager.addWithUpdate(body);
        return manager;
    }

    // Get snap positions for equipment placement using our Chatsworth rack
    getRackSnapPositions(rack) {
        const positions = [];
        const rackBounds = rack.getBoundingRect();
        
        // Use stored Chatsworth dimensions if available, otherwise calculate
        let dimensions;
        if (this.chatsworthDimensions) {
            dimensions = this.chatsworthDimensions;
        } else {
            // Fallback calculations based on rack bounds
            const baseUnitHeight = Math.min(rackBounds.height * 0.018, rackBounds.width * 0.1);
            const postWidthInches = 1.265;
            const postWidth = postWidthInches * (baseUnitHeight / 1.75);
            const insideSpacing = 17.79 * (baseUnitHeight / 1.75);
            const topHeight = baseUnitHeight * 0.6;
            
            dimensions = {
                baseUnitHeight,
                postWidth,
                insideSpacing,
                topHeight,
                startX: rackBounds.left + (rackBounds.width - insideSpacing) / 2,
                startY: rackBounds.top
            };
        }
        
        // Calculate equipment mounting area (between the posts)
        const equipmentStartX = rackBounds.left + dimensions.postWidth + 5; // Small margin from post
        const equipmentWidth = dimensions.insideSpacing - 10; // Leave margins on both sides
        const usableStartY = rackBounds.top + dimensions.topHeight;
        
        // Generate positions for each rack unit
        for (let u = 0; u < 45; u++) {
            const snapY = usableStartY + (u * this.RACK_UNIT);
            positions.push({
                x: equipmentStartX,
                y: snapY,
                unit: u + 1,
                width: equipmentWidth,
                height: this.RACK_UNIT,
                available: rack.equipmentSlots[u] === null
            });
        }
        
        return positions;
    }

    // Check if equipment can fit at position
    canFitEquipment(rack, startUnit, heightInU) {
        if (startUnit < 1 || startUnit + heightInU - 1 > 45) return false;
        
        for (let u = startUnit - 1; u < startUnit - 1 + heightInU; u++) {
            if (rack.equipmentSlots[u] !== null) return false;
        }
        
        return true;
    }

    // Place equipment in rack
    placeEquipment(rack, equipment, startUnit) {
        const heightInU = equipment.rackUnits || 1;
        
        if (!this.canFitEquipment(rack, startUnit, heightInU)) {
            return false;
        }

        // Mark slots as occupied
        for (let u = startUnit - 1; u < startUnit - 1 + heightInU; u++) {
            rack.equipmentSlots[u] = equipment;
        }

        // Get snap position for this unit
        const snapPositions = this.getRackSnapPositions(rack);
        const targetPosition = snapPositions.find(pos => pos.unit === startUnit);
        
        if (targetPosition) {
            equipment.set({
                left: targetPosition.x,
                top: targetPosition.y,
                rackPosition: startUnit,
                parentRack: rack
            });
        }

        return true;
    }

    // Remove equipment from rack
    removeEquipment(rack, equipment) {
        const startUnit = equipment.rackPosition;
        const heightInU = equipment.rackUnits || 1;
        
        if (startUnit) {
            for (let u = startUnit - 1; u < startUnit - 1 + heightInU; u++) {
                if (u >= 0 && u < rack.equipmentSlots.length) {
                    rack.equipmentSlots[u] = null;
                }
            }
        }

        equipment.set({
            rackPosition: null,
            parentRack: null
        });
    }
}