# Device Design Best Practices
## Mandatory Process for All Equipment Designs

**⚠️ CRITICAL: This document MUST be consulted before beginning any device design work. Failure to follow these practices will result in design errors and wasted time.**

---

## Phase 1: Research Requirements (MANDATORY FIRST STEPS)

### 1.1 Primary Sources (IN THIS ORDER)
1. **Official manufacturer datasheets** - Search for exact model number specifications
2. **Technical drawings/PDFs** - Provided by user or manufacturer 
3. **Official product pages** - Manufacturer websites only
4. **CAD files/stencils** - Engineering drawings when available

### 1.2 What to Extract from Each Source
**From Datasheets:**
- Exact physical dimensions (height, width, depth)
- Material specifications
- Mounting hole specifications (thread type, diameter, spacing)
- Weight and load capacity
- Color/finish options

**From Technical Drawings:**
- Precise proportional relationships
- Front view vs side view distinctions
- Mounting hole positioning within rails/posts
- Structural element relationships

### 1.3 Research Red Flags (STOP AND ASK USER)
- Cannot find manufacturer-specific data
- Generic industry standards only available
- Conflicting measurements between sources
- Missing critical dimensions

---

## Phase 2: User Specification Analysis

### 2.1 Document Requirements
- **User-provided files** (PDFs, CAD, images) take absolute priority
- **User corrections** override all research findings
- **User measurements** are definitive when provided

### 2.2 Critical Questions to Ask User
- "Do you have official technical drawings or datasheets?"
- "What specific model number should I research?"
- "Are there any manufacturer specifications I should prioritize?"
- "Should I focus on front view, side view, or specific perspective?"
- "Can you describe the visual appearance of key elements (handles, latches, features)?"
- "Are there specific details that differ from what technical documents show?"

### 2.3 User Feedback Integration
- **Immediately implement** user corrections
- **Ask for clarification** when research conflicts with user input
- **Document** all user-provided specifications as authoritative

---

## Phase 3: Technical Implementation Standards

### 3.1 Rendering Technology Choice
**Default: Native Canvas**
- Use `ctx.imageSmoothingEnabled = false` for crisp rendering
- Round all coordinates with `Math.round()` for pixel-perfect positioning
- Avoid Fabric.js unless specifically needed for interaction

### 3.2 Scaling and Proportions
**Scalable Vector Approach:**
```javascript
// Base everything on a fundamental unit
const baseUnit = Math.min(canvasHeight * scaleFactor, canvasWidth * scaleFactor);

// All measurements as ratios/proportions
const elementWidth = baseUnit * proportionRatio;
const elementHeight = baseUnit * heightRatio;
```

**Scaling Requirements:**
- Must look crisp at 25% to 400% zoom
- All elements scale proportionally
- Text and line weights scale appropriately

### 3.3 Interactive Zoom Implementation (MANDATORY)
**All device viewers MUST include interactive zoom functionality:**

**HTML Structure:**
```html
<div class="zoom-controls">
    <button class="zoom-btn" onclick="zoomIn()">Zoom In (+)</button>
    <button class="zoom-btn" onclick="zoomOut()">Zoom Out (-)</button>
    <button class="zoom-btn" onclick="resetZoom()">Reset (100%)</button>
</div>
```

**JavaScript Implementation:**
```javascript
let currentZoom = 1;
let baseCanvasWidth = 600;
let baseCanvasHeight = 800;

function zoomIn() {
    currentZoom = Math.min(currentZoom * 1.5, 5); // Max 5x zoom
    applyZoom();
}

function zoomOut() {
    currentZoom = Math.max(currentZoom / 1.5, 0.5); // Min 0.5x zoom
    applyZoom();
}

function resetZoom() {
    currentZoom = 1;
    applyZoom();
}

function applyZoom() {
    const canvas = document.getElementById('deviceCanvas');
    const newWidth = Math.round(baseCanvasWidth * currentZoom);
    const newHeight = Math.round(baseCanvasHeight * currentZoom);
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    canvas.style.width = newWidth + 'px';
    canvas.style.height = newHeight + 'px';
    
    // Re-render at new resolution for crisp display
    if (typeof createDevice === 'function') {
        createDevice();
    }
}

// Keyboard shortcuts: +/- for zoom, 0 for reset
document.addEventListener('keydown', (e) => {
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn(); }
    else if (e.key === '-') { e.preventDefault(); zoomOut(); }
    else if (e.key === '0') { e.preventDefault(); resetZoom(); }
});
```

**Zoom Requirements:**
- **True canvas re-rendering** (not CSS scaling to avoid blur)
- **50% to 500% zoom range** with 1.5x increments
- **Keyboard shortcuts** (+, -, 0) and button controls
- **Crisp rendering** at all zoom levels
- **Maintained proportions** and sharp edges

### 3.4 Color and Finish Standards
**Research-Based Colors:**
- Search for actual product photos
- Use manufacturer color specifications
- Apply realistic gradients for depth
- Ensure sufficient contrast for visibility

---

## Phase 4: Dimensional Accuracy Requirements

### 4.1 Measurement Hierarchy (Highest to Lowest Priority)
1. **User-provided measurements** (absolute authority)
2. **Official manufacturer datasheets** 
3. **Technical drawings/CAD files**
4. **Industry standards** (EIA-310, etc.)
5. **Generic estimates** (avoid if possible)

### 4.2 Critical Calculations
**Always verify:**
- Total physical dimensions vs usable space
- Rail/post positioning and thickness
- Mounting hole placement and sizing
- Proportional relationships between elements

### 4.3 Measurement Validation
- **Calculate differences** between specifications (e.g., outside vs inside measurements)
- **Verify proportions** match provided drawings
- **Ask user to confirm** critical dimensions

---

## Phase 5: Design Validation Process

### 5.1 Mandatory Checks Before Completion
- [ ] Matches user-provided technical drawings exactly
- [ ] Uses manufacturer-specific measurements
- [ ] Renders crisply at multiple zoom levels
- [ ] Maintains accurate proportions
- [ ] Uses realistic colors based on research
- [ ] All mounting holes correctly positioned
- [ ] User feedback incorporated completely

### 5.2 User Review Protocol
- Present design for user feedback
- Implement corrections immediately  
- Ask specific questions about accuracy
- **Expect multiple iterative adjustments** for visual details
- **Validate positioning and sizing** of small elements
- Document any user preferences for future designs

---

## Phase 6: Common Failure Modes to Avoid

### 6.1 Research Failures
❌ **Starting with generic standards instead of specific manufacturer data**
❌ **Making assumptions about standard dimensions**
❌ **Using approximate measurements when exact ones are available**
❌ **Ignoring user-provided technical documentation**

### 6.2 Technical Implementation Failures
❌ **Using inappropriate rendering technology**
❌ **Poor scaling causing blur or pixelation**
❌ **Fixed pixel measurements instead of proportional scaling**
❌ **Incorrect coordinate systems or positioning**

### 6.3 Design Accuracy Failures
❌ **Confusing different views (front vs side vs perspective)**
❌ **Incorrect proportional relationships**
❌ **Poor color choices reducing visibility**
❌ **Ignoring manufacturer-specific design elements**
❌ **Assuming cut sheet visuals match actual front appearance**
❌ **Not validating visual details with user corrections**

---

## Enforcement Rules

### Mandatory Process Gates
1. **Cannot begin implementation** without completing Phase 1 research
2. **Cannot finalize design** without user validation
3. **Must document** all measurement sources and user feedback
4. **Must test** scaling and visibility before submission

### Process Violations
- **Missing manufacturer research** = Restart from Phase 1
- **Ignoring user corrections** = Immediate implementation required
- **Poor scaling/visibility** = Technical rework required
- **Inaccurate proportions** = Dimensional analysis rework required

---

## Success Metrics

A successful device design:
✅ **Exactly matches** user-provided specifications
✅ **Uses manufacturer-accurate** measurements and proportions
✅ **Renders professionally** at all zoom levels
✅ **Maintains visual clarity** with appropriate contrast
✅ **Integrates seamlessly** with the rack design tool
✅ **User approves** final appearance and accuracy

---

**Version**: 1.0  
**Created**: August 2025  
**Status**: Mandatory Standard  

**This document must be consulted before beginning any device design work.**