// Standard RJ45 Port Element - Clean Reference Design
// FINAL APPROVED VERSION - Use this for all basic patch panels and ports
// 
// SPECIFICATIONS:
// - Dimensions: 11.7mm W × 8.1mm H (1.44:1 ratio)
// - Main body: 76% of height
// - Clip level 1: 12% of height
// - Clip level 2: 12% of height
// - Clean geometric shape, no LEDs or indicators

function createStandardRJ45Port(ctx, x, y, width, height) {
    console.log('Drawing standard clean RJ45 port...');
    
    // Use actual RJ45 proportions: 11.7mm W × 8.1mm H
    const actualWidth = width;
    const actualHeight = width / 1.44; // Maintain proper proportions
    
    // Center vertically if provided height differs
    const adjustedY = y + (height - actualHeight) / 2;
    
    const frameThickness = actualWidth * 0.04; // Matches switch port frame thickness
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
}

function createDevice() {
    console.log('Creating standard RJ45 port reference...');
    
    const canvasEl = document.getElementById('deviceCanvas');
    const ctx = canvasEl.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#fafbfc';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
    // Large scale for reference
    const portWidth = canvasEl.width * 0.5;
    const portHeight = portWidth / 1.44;
    const startX = (canvasEl.width - portWidth) / 2;
    const startY = (canvasEl.height - portHeight) / 2;
    
    createStandardRJ45Port(ctx, startX, startY, portWidth, portHeight);
    
    console.log('Standard RJ45 port reference created - save this for all basic ports');
}