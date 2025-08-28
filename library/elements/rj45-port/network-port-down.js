// Standard Network Device Port - Clip Down Orientation
// FINAL APPROVED DESIGN for all network equipment
// 
// SPECIFICATIONS:
// - Based on perfected switch port design
// - Clip points downward (standard orientation)
// - Thin 4% frame outline
// - Optional LED indicators
// - Proper 11.7mm × 8.1mm proportions (1.44:1)

function createNetworkPortDown(ctx, x, y, width, height, showLEDs = false) {
    console.log('Drawing standard network port (clip down)...');
    
    // Use actual RJ45 proportions: 11.7mm W × 8.1mm H
    const actualWidth = width;
    const actualHeight = width / 1.44; // Maintain proper proportions
    
    // Center vertically if provided height differs
    const adjustedY = y + (height - actualHeight) / 2;
    
    const frameThickness = actualWidth * 0.04; // Thin frame (perfected size)
    const innerWidth = actualWidth - (2 * frameThickness);
    const innerHeight = actualHeight - (2 * frameThickness);
    const innerX = x + frameThickness;
    const innerY = adjustedY + frameThickness;
    
    // Calculate proportions
    const clipLevel1Height = innerHeight * 0.12; // 12%
    const clipLevel2Height = innerHeight * 0.12; // 12%
    const mainBodyHeight = innerHeight - clipLevel1Height - clipLevel2Height; // 76%
    
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

function createDevice() {
    console.log('Creating standard network port (clip down)...');
    
    const canvasEl = document.getElementById('deviceCanvas');
    const ctx = canvasEl.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#fafbfc';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
    // Large scale for examination
    const portWidth = canvasEl.width * 0.5;
    const portHeight = portWidth / 1.44;
    const startX = (canvasEl.width - portWidth) / 2;
    const startY = (canvasEl.height - portHeight) / 2;
    
    createNetworkPortDown(ctx, startX, startY, portWidth, portHeight, true); // Show LEDs for demo
    
    console.log('Standard network port (clip down) created');
}