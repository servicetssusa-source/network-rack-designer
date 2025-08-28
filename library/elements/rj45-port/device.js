// RJ45 Ethernet Port Element - Realistic Reference Implementation
// MANDATORY: Must follow DESIGN_METHODOLOGY.md completely
// MANDATORY: Must follow DEVICE_DESIGN_BEST_PRACTICES.md completely
// 
// PURPOSE: Define the standard RJ45 port appearance for all network devices
// SCALE: Large scale for detailed examination and reference
//
// EXACT SPECIFICATIONS FROM RESEARCH:
// - Standard: 8P8C (8 Position 8 Contact) modular connector
// - Dimensions: 21.46mm W × 11.68mm H × 8.30mm D
// - Contacts: 8 equally spaced metallic pins
// - Shape: Rectangular with slightly rounded corners
// - Opening: Black recessed cavity with visible contacts
// - Frame: Plastic surround with subtle depth

function createDevice() {
    console.log('Creating realistic RJ45 ethernet port element...');
    
    // Get the canvas element
    const canvasEl = document.getElementById('deviceCanvas');
    const ctx = canvasEl.getContext('2d');
    
    // PREVENT CANVAS BLUR - SHARP RENDERING (Best Practices Phase 3.1)
    ctx.imageSmoothingEnabled = false;
    
    // Clear canvas and set background
    ctx.fillStyle = '#fafbfc';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
    // Create large-scale RJ45 port for detailed examination
    createRJ45Port(ctx, canvasEl.width, canvasEl.height);
}

function createRJ45Port(ctx, canvasWidth, canvasHeight) {
    console.log('Creating large-scale RJ45 port from official specifications...');
    
    // LARGE SCALE FOR DETAILED EXAMINATION
    // Port will be 40% of canvas width for clear visibility of all details
    const portWidth = canvasWidth * 0.4;
    
    // OFFICIAL RJ45 PROPORTIONS: 21.46mm W × 11.68mm H
    const widthToHeightRatio = 21.46 / 11.68; // ~1.84:1
    const portHeight = portWidth / widthToHeightRatio;
    
    // CENTER THE PORT ON CANVAS
    const startX = (canvasWidth - portWidth) / 2;
    const startY = (canvasHeight - portHeight) / 2;
    
    // DRAW OUTER PLASTIC FRAME (slightly larger than port opening)
    const frameThickness = portWidth * 0.08;
    const frameX = startX - frameThickness;
    const frameY = startY - frameThickness;
    const frameWidth = portWidth + (2 * frameThickness);
    const frameHeight = portHeight + (2 * frameThickness);
    
    // Frame gradient for 3D effect
    const frameGradient = ctx.createLinearGradient(frameX, frameY, frameX + frameWidth, frameY + frameHeight);
    frameGradient.addColorStop(0, '#4a4a4a'); // Lighter top-left
    frameGradient.addColorStop(0.5, '#3a3a3a'); // Base plastic color
    frameGradient.addColorStop(1, '#2a2a2a'); // Darker bottom-right
    
    ctx.fillStyle = frameGradient;
    ctx.fillRect(Math.round(frameX), Math.round(frameY), Math.round(frameWidth), Math.round(frameHeight));
    
    // Frame outline for definition
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.strokeRect(Math.round(frameX), Math.round(frameY), Math.round(frameWidth), Math.round(frameHeight));
    
    // DRAW MAIN PORT OPENING (black recessed area)
    ctx.fillStyle = '#000000'; // Deep black opening
    ctx.fillRect(Math.round(startX), Math.round(startY), Math.round(portWidth), Math.round(portHeight));
    
    // Add subtle inner shadow for depth
    const shadowGradient = ctx.createLinearGradient(startX, startY, startX + portWidth, startY);
    shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    shadowGradient.addColorStop(0.1, 'rgba(20, 20, 20, 1)');
    shadowGradient.addColorStop(0.9, 'rgba(20, 20, 20, 1)');
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    
    ctx.fillStyle = shadowGradient;
    ctx.fillRect(Math.round(startX), Math.round(startY), Math.round(portWidth), Math.round(portHeight));
    
    // DRAW 8 METALLIC CONTACT PINS
    const contactArea = {
        x: startX + portWidth * 0.1,
        y: startY + portHeight * 0.6, // Contacts in bottom 40% of port
        width: portWidth * 0.8,
        height: portHeight * 0.3
    };
    
    const contactWidth = contactArea.width / 10; // 8 contacts + spacing
    const contactHeight = contactArea.height * 0.8;
    const contactSpacing = contactArea.width / 8;
    
    // Draw each of the 8 contacts
    for (let i = 0; i < 8; i++) {
        const contactX = contactArea.x + (contactSpacing * i) + (contactSpacing - contactWidth) / 2;
        const contactY = contactArea.y + (contactArea.height - contactHeight) / 2;
        
        // Metallic gradient for realistic appearance
        const metalGradient = ctx.createLinearGradient(contactX, contactY, contactX + contactWidth, contactY + contactHeight);
        metalGradient.addColorStop(0, '#e8e8e8'); // Bright metallic highlight
        metalGradient.addColorStop(0.3, '#d0d0d0'); // Base metallic color
        metalGradient.addColorStop(0.7, '#b8b8b8'); // Mid tone
        metalGradient.addColorStop(1, '#a0a0a0'); // Darker metallic shadow
        
        ctx.fillStyle = metalGradient;
        ctx.fillRect(Math.round(contactX), Math.round(contactY), Math.round(contactWidth), Math.round(contactHeight));
        
        // Contact outline for definition
        ctx.strokeStyle = '#888888';
        ctx.lineWidth = 1;
        ctx.strokeRect(Math.round(contactX), Math.round(contactY), Math.round(contactWidth), Math.round(contactHeight));
        
        // Add tiny highlight on each contact for realism
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(Math.round(contactX + contactWidth * 0.1), Math.round(contactY + contactHeight * 0.1), 
                    Math.round(contactWidth * 0.3), Math.round(contactHeight * 0.2));
    }
    
    // DRAW PORT OPENING BEVEL (realistic depth effect)
    const bevelSize = portWidth * 0.02;
    
    // Top bevel (lighter)
    ctx.fillStyle = 'rgba(80, 80, 80, 0.8)';
    ctx.fillRect(Math.round(startX), Math.round(startY), Math.round(portWidth), Math.round(bevelSize));
    
    // Left bevel (lighter)
    ctx.fillStyle = 'rgba(70, 70, 70, 0.8)';
    ctx.fillRect(Math.round(startX), Math.round(startY), Math.round(bevelSize), Math.round(portHeight));
    
    // Bottom bevel (darker)
    ctx.fillStyle = 'rgba(40, 40, 40, 0.8)';
    ctx.fillRect(Math.round(startX), Math.round(startY + portHeight - bevelSize), Math.round(portWidth), Math.round(bevelSize));
    
    // Right bevel (darker)
    ctx.fillStyle = 'rgba(30, 30, 30, 0.8)';
    ctx.fillRect(Math.round(startX + portWidth - bevelSize), Math.round(startY), Math.round(bevelSize), Math.round(portHeight));
    
    // DRAW INNER GUIDE RAILS (plastic guides inside port)
    const guideHeight = portHeight * 0.15;
    const guideY = startY + portHeight * 0.2;
    
    // Top guide rail
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(Math.round(startX + portWidth * 0.1), Math.round(guideY), Math.round(portWidth * 0.8), Math.round(guideHeight * 0.6));
    
    // Bottom guide rail
    ctx.fillRect(Math.round(startX + portWidth * 0.1), Math.round(guideY + portHeight * 0.2), Math.round(portWidth * 0.8), Math.round(guideHeight * 0.6));
    
    // Add final port outline for crisp definition
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 2;
    ctx.strokeRect(Math.round(startX), Math.round(startY), Math.round(portWidth), Math.round(portHeight));
    
    // DISPLAY SPECIFICATIONS
    console.log('Large-scale RJ45 port rendered with realistic details');
    console.log(`Port size: ${Math.round(portWidth)}px × ${Math.round(portHeight)}px`);
    console.log(`Aspect ratio: ${widthToHeightRatio.toFixed(2)}:1 (accurate to RJ45 specs)`);
    console.log('Features: 8 metallic contacts, plastic frame, recessed opening, guide rails');
}

// Standardized RJ45 drawing function for use in other devices
function drawStandardRJ45Port(ctx, x, y, width, height) {
    // This function can be copied to other device files for consistent RJ45 appearance
    // Parameters: context, x position, y position, width, height
    
    // Frame (10% larger than port opening)
    const frameThickness = width * 0.05;
    const frameX = x - frameThickness;
    const frameY = y - frameThickness;
    const frameWidth = width + (2 * frameThickness);
    const frameHeight = height + (2 * frameThickness);
    
    // Frame gradient
    const frameGradient = ctx.createLinearGradient(frameX, frameY, frameX + frameWidth, frameY + frameHeight);
    frameGradient.addColorStop(0, '#4a4a4a');
    frameGradient.addColorStop(0.5, '#3a3a3a');
    frameGradient.addColorStop(1, '#2a2a2a');
    
    ctx.fillStyle = frameGradient;
    ctx.fillRect(Math.round(frameX), Math.round(frameY), Math.round(frameWidth), Math.round(frameHeight));
    
    // Port opening
    ctx.fillStyle = '#000000';
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
    
    // 8 metallic contacts
    const contactWidth = width / 10;
    const contactHeight = height * 0.2;
    const contactY = y + height * 0.7;
    
    for (let i = 0; i < 8; i++) {
        const contactX = x + (width / 8) * i + (width / 16);
        
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(Math.round(contactX), Math.round(contactY), Math.round(contactWidth * 0.7), Math.round(contactHeight));
    }
    
    // Port outline
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
}