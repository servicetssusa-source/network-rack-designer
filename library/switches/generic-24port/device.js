// Generic 24-Port Gigabit Switch Implementation
// MANDATORY: Must follow DESIGN_METHODOLOGY.md completely
// MANDATORY: Must follow DEVICE_DESIGN_BEST_PRACTICES.md completely
// 
// STANDARDIZED SWITCH FAMILY DESIGN:
// - Matches 12-port switch color scheme and styling
// - Single row layout (24 ports in 1 row as specified)
// - Same rack mounting system and proportions
// - Consistent LED placement and SFP layout
//

function createDevice() {
    console.log('Creating generic 24-port switch...');
    
    const canvasEl = document.getElementById('deviceCanvas');
    const ctx = canvasEl.getContext('2d');
    
    // PREVENT CANVAS BLUR - SHARP RENDERING
    ctx.imageSmoothingEnabled = false;
    
    // Clear canvas and set background
    ctx.fillStyle = '#fafbfc';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
    // Create switch immediately
    createGeneric24PortSwitch(ctx, canvasEl.width, canvasEl.height);
}

function createGeneric24PortSwitch(ctx, canvasWidth, canvasHeight) {
    console.log('Creating generic 24-port switch with standardized family styling...');
    
    // SCALABLE PROPORTIONS FOR 1U SWITCH (same as 12-port)
    const baseUnitHeight = Math.min(canvasHeight * 0.12, canvasWidth * 0.06);
    
    // 1U SWITCH BODY DIMENSIONS (no ears - body only fits between rails)
    const rackUnits = 1;
    const switchHeight = rackUnits * baseUnitHeight;
    const switchWidth = (465.1 / 44) * baseUnitHeight; // 465.1mm rail-to-rail width
    
    // CENTER THE SWITCH BODY ON CANVAS
    const startX = (canvasWidth - switchWidth) / 2;
    const startY = (canvasHeight - switchHeight) / 2;
    
    // NO MOUNTING EARS - body only (ears added separately as reusable components)
    
    // DRAW MAIN SWITCH FRAME (body only)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = Math.round(Math.max(1, baseUnitHeight * 0.02));
    ctx.strokeRect(Math.round(startX), Math.round(startY), Math.round(switchWidth), Math.round(switchHeight));
    
    // DRAW MAIN BODY WITH STANDARDIZED SWITCH COLOR SCHEME (same as 12-port)
    const bodyGradient = ctx.createLinearGradient(startX, startY, startX, startY + switchHeight);
    bodyGradient.addColorStop(0, '#e8e8e8'); // Light top edge
    bodyGradient.addColorStop(0.3, '#d0d0d0'); // Main body color
    bodyGradient.addColorStop(0.7, '#c0c0c0'); // Slight shadow
    bodyGradient.addColorStop(1, '#b0b0b0'); // Darker bottom edge
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(Math.round(startX), Math.round(startY), Math.round(switchWidth), Math.round(switchHeight));
    
    // NO STATUS LEDs - only port activity LEDs (removed power/system indicators)
    
    // DRAW 24 ETHERNET PORTS IN SINGLE ROW (as specified)
    const portAreaStart = startX + switchWidth * 0.05; // Start closer to left edge
    const sfpAreaWidth = switchWidth * 0.15; // Reserve space for SFP
    const ethernetAreaWidth = switchWidth * 0.75; // Larger ethernet area (no status LEDs)
    const portAreaY = startY + (switchHeight * 0.25);
    const portHeight = switchHeight * 0.5;
    
    // FIXED PORT SIZE - RJ45 ports are always 11.7mm regardless of device
    // Rack width: 465.1mm, Port width: 11.7mm = 2.52% of rack width
    const portWidth = switchWidth * (11.7 / 465.1); // Fixed 11.7mm proportion (SAME as 12-port)
    const realPortHeight = portWidth / 1.44; // Maintain RJ45 proportions
    const centeredPortY = portAreaY + (portHeight - realPortHeight) / 2;
    
    // Calculate port spacing - center 24 ports in available area
    const totalPortsWidth = 24 * portWidth;
    const availableSpace = ethernetAreaWidth - totalPortsWidth;
    const portSpacing = availableSpace / (24 + 1); // Equal spacing around ports
    
    // Draw 24 ethernet ports with proper spacing (SAME PORT SIZE as 12-port)
    for (let port = 0; port < 24; port++) {
        const portX = portAreaStart + portSpacing + (port * (portWidth + (availableSpace / 24)));
        
        // Draw RJ45 port using standardized function
        createNetworkPortDown(ctx, portX, centeredPortY, portWidth, realPortHeight, true);
    }
    
    // DRAW 4 SFP+ PORTS (same layout as 12-port)
    const sfpAreaX = startX + switchWidth - sfpAreaWidth;
    const sfpAreaY = startY + (switchHeight * 0.2);
    const sfpAreaHeight = switchHeight * 0.6;
    const sfpPortWidth = sfpAreaWidth / 2; // 2 columns
    const sfpPortHeight = sfpAreaHeight / 2; // 2 rows
    
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
            const sfpX = sfpAreaX + col * sfpPortWidth;
            const sfpY = sfpAreaY + row * sfpPortHeight;
            createGenericSFPPort(ctx, sfpX, sfpY, sfpPortWidth, sfpPortHeight);
        }
    }
    
    // NO EAR EDGES - body only
    
    console.log('Generic 24-port switch rendered with single row layout');
    console.log(`Single row: 24 ethernet ports + 4 SFP+ ports (2x2)`);
    console.log(`Port width: ${portWidth.toFixed(1)}px (tighter than 12-port for 24 ports)`);
}

// Import standardized RJ45 and SFP port functions (same as 12-port)
function createNetworkPortDown(ctx, x, y, width, height, showLEDs = false) {
    const actualWidth = width;
    const actualHeight = width / 1.44;
    
    const adjustedY = y + (height - actualHeight) / 2;
    const frameThickness = actualWidth * 0.04;
    const innerWidth = actualWidth - (2 * frameThickness);
    const innerHeight = actualHeight - (2 * frameThickness);
    const innerX = x + frameThickness;
    const innerY = adjustedY + frameThickness;
    
    const clipLevel1Height = innerHeight * 0.12;
    const clipLevel2Height = innerHeight * 0.12;
    const mainBodyHeight = innerHeight - clipLevel1Height - clipLevel2Height;
    
    const mainBodyEndY = innerY + mainBodyHeight;
    const clipLevel1EndY = mainBodyEndY + clipLevel1Height;
    const clipLevel2EndY = clipLevel1EndY + clipLevel2Height;
    
    // Draw black frame
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.rect(x, adjustedY, actualWidth, actualHeight);
    
    // Frame cutout shape
    ctx.moveTo(innerX, innerY);
    ctx.lineTo(innerX + innerWidth, innerY);
    ctx.lineTo(innerX + innerWidth, mainBodyEndY);
    ctx.lineTo(innerX + innerWidth * 0.8, mainBodyEndY);
    ctx.lineTo(innerX + innerWidth * 0.8, clipLevel1EndY);
    ctx.lineTo(innerX + innerWidth, clipLevel1EndY);
    ctx.lineTo(innerX + innerWidth, clipLevel2EndY);
    ctx.lineTo(innerX + innerWidth * 0.65, clipLevel2EndY);
    ctx.lineTo(innerX + innerWidth * 0.35, clipLevel2EndY);
    ctx.lineTo(innerX, clipLevel2EndY);
    ctx.lineTo(innerX, clipLevel1EndY);
    ctx.lineTo(innerX + innerWidth * 0.2, clipLevel1EndY);
    ctx.lineTo(innerX + innerWidth * 0.2, mainBodyEndY);
    ctx.lineTo(innerX, mainBodyEndY);
    ctx.closePath();
    ctx.fill();
    
    // Draw white port opening
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(innerX, innerY);
    ctx.lineTo(innerX + innerWidth, innerY);
    ctx.lineTo(innerX + innerWidth, mainBodyEndY);
    ctx.lineTo(innerX + innerWidth * 0.8, mainBodyEndY);
    ctx.lineTo(innerX + innerWidth * 0.8, clipLevel1EndY);
    ctx.lineTo(innerX + innerWidth * 0.65, clipLevel1EndY);
    ctx.lineTo(innerX + innerWidth * 0.65, clipLevel2EndY);
    ctx.lineTo(innerX + innerWidth * 0.35, clipLevel2EndY);
    ctx.lineTo(innerX + innerWidth * 0.35, clipLevel1EndY);
    ctx.lineTo(innerX + innerWidth * 0.2, clipLevel1EndY);
    ctx.lineTo(innerX + innerWidth * 0.2, mainBodyEndY);
    ctx.lineTo(innerX, mainBodyEndY);
    ctx.closePath();
    ctx.fill();
    
    // Add LED indicators if requested
    if (showLEDs) {
        const ledWidth = innerWidth * 0.162;
        const ledHeight = clipLevel2Height * 1.3;
        const ledY = clipLevel2EndY - ledHeight;
        const ledPadding = Math.min(ledWidth, ledHeight) * 0.05;
        
        // Green LED (left)
        const greenLedX = innerX;
        ctx.fillStyle = '#000000';
        ctx.fillRect(Math.round(greenLedX), Math.round(ledY), Math.round(ledWidth), Math.round(ledHeight));
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(
            Math.round(greenLedX + ledPadding), 
            Math.round(ledY + ledPadding), 
            Math.round(ledWidth - 2 * ledPadding), 
            Math.round(ledHeight - 2 * ledPadding)
        );
        
        // Amber LED (right)
        const amberLedX = innerX + innerWidth - ledWidth;
        ctx.fillStyle = '#000000';
        ctx.fillRect(Math.round(amberLedX), Math.round(ledY), Math.round(ledWidth), Math.round(ledHeight));
        ctx.fillStyle = '#ffaa00';
        ctx.fillRect(
            Math.round(amberLedX + ledPadding), 
            Math.round(ledY + ledPadding), 
            Math.round(ledWidth - 2 * ledPadding), 
            Math.round(ledHeight - 2 * ledPadding)
        );
    }
}

function createGenericSFPPort(ctx, x, y, width, height) {
    // Simple black rectangles, all same size
    const actualWidth = width * 0.8; // Uniform size
    const actualHeight = height * 0.8; // Uniform size
    const actualX = x + (width - actualWidth) / 2;
    const actualY = y + (height - actualHeight) / 2;
    
    // Draw simple black rectangle
    ctx.fillStyle = '#000000';
    ctx.fillRect(Math.round(actualX), Math.round(actualY), Math.round(actualWidth), Math.round(actualHeight));
}