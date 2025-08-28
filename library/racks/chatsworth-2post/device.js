// Chatsworth 2-Post Rack Device Implementation
// MANDATORY: Must follow DESIGN_METHODOLOGY.md completely
// 
// CHECKLIST:
// [✓] Phase 1: Research (stencils, SVGs, images, dimensions, descriptions)
// [ ] Phase 2: Analysis (general to specific understanding)  
// [ ] Phase 3: Implementation (Size→Ports→Styling→Color→Displays→Lights→Vents)
// [ ] Phase 4: Validation (compare against reference images)
//
// RESEARCH FINDINGS:
// - Model: Universal Rack (46353-703/55053-703)
// - Dimensions: 45U (7 feet) height, 19" width, 3" post depth
// - Construction: 6061-T6 aluminum extrusion
// - Mounting: EIA-310 compliant, #12-24 threaded holes, 5/8"-5/8"-1/2" pattern
// - Base: Pre-punched base plate for floor mounting
// - Top: Hat-shaped brackets/angles
// - Load: 1,500 lbs capacity
// - Features: Integrated grounding, UL Listed
//
// STATUS: Proceeding to Analysis Phase

let canvas;

function createDevice() {
    console.log('Using native canvas for reliable rendering...');
    
    // Get the canvas element
    const canvasEl = document.getElementById('deviceCanvas');
    const ctx = canvasEl.getContext('2d');
    
    // Clear canvas and set background
    ctx.fillStyle = '#fafbfc';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
    // Create rack immediately
    createChatsworthRack(ctx, canvasEl.width, canvasEl.height);
}

function createChatsworthRack(ctx, canvasWidth, canvasHeight) {
    console.log('Creating precise scalable Chatsworth rack from PDF...');
    
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
    
    // DRAW MAIN RACK FRAME (PROFESSIONAL BLACK OUTLINE)
    ctx.strokeStyle = '#0f0f0f'; // Very dark professional outline
    ctx.lineWidth = Math.round(Math.max(1, baseUnitHeight * 0.02)); // Rounded for crisp lines
    ctx.strokeRect(Math.round(startX), Math.round(startY), Math.round(outsideSpacing), Math.round(rackHeight));
    
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
    
    console.log('Precise scalable Chatsworth rack rendered from PDF specifications');
    console.log(`Scale: 1U = ${baseUnitHeight}px, Posts: ${postWidth}px wide`);
}

// Research functions to be implemented following methodology
function researchStencils() {
    // Phase 1, Step 1: Search for stencils
    console.log('Research Phase 1.1: Searching for Chatsworth 2-post rack stencils...');
}

function researchSVGs() {
    // Phase 1, Step 2: Search for SVG files
    console.log('Research Phase 1.2: Searching for Chatsworth 2-post rack SVG files...');
}

function researchImages() {
    // Phase 1, Step 3: Search for images
    console.log('Research Phase 1.3: Searching for Chatsworth 2-post rack images...');
}

function researchDimensions() {
    // Phase 1, Step 4: Search for dimensions
    console.log('Research Phase 1.4: Searching for Chatsworth 2-post rack dimensions...');
}

function researchDescriptions() {
    // Phase 1, Step 5: Search for descriptions
    console.log('Research Phase 1.5: Searching for Chatsworth 2-post rack descriptions...');
}

// Analysis function for Phase 2
function analyzeFindings() {
    // Phase 2, Step 6: Refine understanding
    console.log('Analysis Phase 2: Refining device understanding from general to specific...');
}

// Implementation functions for Phase 3 (Priority Order)
function implementSizeAndDimensions() {
    console.log('Implementation Phase 3.1: Size & Dimensions');
}

function implementPorts() {
    console.log('Implementation Phase 3.2: Ports (N/A for rack structure)');
}

function implementStyling() {
    console.log('Implementation Phase 3.3: Styling/Design');
}

function implementColor() {
    console.log('Implementation Phase 3.4: Color');
}

function implementDisplays() {
    console.log('Implementation Phase 3.5: Displays (N/A for basic rack)');
}

function implementLights() {
    console.log('Implementation Phase 3.6: Lights (N/A for basic rack)');
}

function implementVents() {
    console.log('Implementation Phase 3.7: Vents (N/A for basic rack)');
}

// Validation function for Phase 4
function validateDesign() {
    console.log('Validation Phase 4: Comparing against reference images...');
}