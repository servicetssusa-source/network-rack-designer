// Standard Network Device Port - Clip Up Orientation (Inverted)
// FINAL APPROVED DESIGN for all network equipment
// 
// SPECIFICATIONS:
// - Based on perfected switch port design
// - Clip points upward (inverted orientation)
// - Thin 4% frame outline
// - Optional LED indicators
// - Proper 11.7mm × 8.1mm proportions (1.44:1)

function createNetworkPortUp(ctx, x, y, width, height, showLEDs = false) {
    console.log('Drawing inverted network port (clip up)...');
    
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
    
    // Calculate proportions (same as original)
    const clipLevel1Height = innerHeight * 0.12; // 12%
    const clipLevel2Height = innerHeight * 0.12; // 12% 
    const mainBodyHeight = innerHeight - clipLevel1Height - clipLevel2Height; // 76%
    
    // INVERTED Y positions - exactly flipped from original
    const clipLevel2StartY = innerY; // Clip level 2 now at top
    const clipLevel2EndY = clipLevel2StartY + clipLevel2Height;
    const clipLevel1EndY = clipLevel2EndY + clipLevel1Height; 
    const mainBodyEndY = clipLevel1EndY + mainBodyHeight; // Main body now at bottom
    
    // Draw black frame (uniform thickness)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.rect(x, adjustedY, actualWidth, actualHeight);
    
    // Frame cutout shape (EXACTLY INVERTED from original with proper top border)
    ctx.moveTo(innerX, innerY); // Start at top left with full frame thickness
    ctx.lineTo(innerX + innerWidth, innerY); // Top right with full frame thickness
    ctx.lineTo(innerX + innerWidth, clipLevel1EndY); // Down to clip level 1 end
    ctx.lineTo(innerX + innerWidth * 0.8, clipLevel1EndY); // Left to clip level 1 start
    ctx.lineTo(innerX + innerWidth * 0.8, clipLevel2EndY); // Up to clip level 2 end
    ctx.lineTo(innerX + innerWidth * 0.65, clipLevel2EndY); // Left to center-right
    ctx.lineTo(innerX + innerWidth * 0.35, clipLevel2EndY); // Left to center-left
    ctx.lineTo(innerX + innerWidth * 0.2, clipLevel2EndY); // Left to clip level 2 end  
    ctx.lineTo(innerX + innerWidth * 0.2, clipLevel1EndY); // Up to clip level 1 start
    ctx.lineTo(innerX, clipLevel1EndY); // Left to main body start
    ctx.lineTo(innerX, mainBodyEndY); // Down to bottom
    ctx.lineTo(innerX + innerWidth, mainBodyEndY); // Right across bottom
    ctx.closePath();
    ctx.fill();
    
    // Draw white port opening (EXACTLY INVERTED from original)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(innerX, innerY); // Top left
    ctx.lineTo(innerX + innerWidth, innerY); // Top right
    ctx.lineTo(innerX + innerWidth, clipLevel1EndY); // Down to clip 1 end
    ctx.lineTo(innerX + innerWidth * 0.8, clipLevel1EndY); // Left to clip 1 start
    ctx.lineTo(innerX + innerWidth * 0.8, clipLevel2EndY); // Up to clip 2 end
    ctx.lineTo(innerX + innerWidth * 0.65, clipLevel2EndY); // Left to center-right
    ctx.lineTo(innerX + innerWidth * 0.35, clipLevel2EndY); // Left to center-left
    ctx.lineTo(innerX + innerWidth * 0.2, clipLevel2EndY); // Left to clip 2 end
    ctx.lineTo(innerX + innerWidth * 0.2, clipLevel1EndY); // Up to clip 1 start
    ctx.lineTo(innerX, clipLevel1EndY); // Left to main body
    ctx.lineTo(innerX, mainBodyEndY); // Down to bottom
    ctx.lineTo(innerX + innerWidth, mainBodyEndY); // Right across bottom
    ctx.closePath();
    ctx.fill();
    
    // Add LED indicators if requested (INVERTED - align with top clip area like original bottom)
    if (showLEDs) {
        const ledWidth = innerWidth * 0.162;
        const ledHeight = clipLevel2Height * 1.3;
        const ledY = clipLevel2EndY - ledHeight; // LEDs align with top of clip (inverted from bottom alignment)
        const ledPadding = Math.min(ledWidth, ledHeight) * 0.05;
        
        // Green LED (left) - same positioning as original
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
        
        // Amber LED (right) - same positioning as original
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
    console.log('Creating inverted network port (clip up)...');
    
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
    
    createNetworkPortUp(ctx, startX, startY, portWidth, portHeight, true); // Show LEDs for demo
    
    console.log('Inverted network port (clip up) created');
}