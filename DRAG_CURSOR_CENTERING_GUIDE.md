# Drag Preview Cursor Centering Guide - Network Rack Designer

## Overview
This document explains how drag preview cursor centering works and how to fix issues when drag previews are not properly centered on the mouse cursor.

## Current Working Configuration
- **Cursor Positioning**: Perfect centering achieved in v2.3
- **File Location**: `js/enhanced-rack-designer.js` 
- **Key Methods**: `handleDragOver()` and drag preview creation

## How Cursor Centering Works

### 1. Coordinate System Transformation
```javascript
// Get SVG element and use its coordinate system  
const svg = e.currentTarget;
const rect = svg.getBoundingClientRect();

// Calculate coordinates relative to the SVG - FIXED 1:1 scaling, no zoom transformation
const svgX = e.clientX - rect.left;
const svgY = e.clientY - rect.top;

// Simple coordinate translation - no zoom scaling needed with fixed 1:1 rendering
const worldX = svgX - this.pan.x;
const worldY = svgY - this.pan.y;
```

### 2. Drag Preview Positioning (~line 555)
```javascript
this.dragPosition = { x: worldX, y: worldY };

// Debug drag position (useful for troubleshooting)
console.log('Drag position debug:', {
    clientX: e.clientX,
    clientY: e.clientY,
    rectLeft: rect.left,
    rectTop: rect.top,
    panX: this.pan.x,
    panY: this.pan.y,
    worldX: worldX,
    worldY: worldY
});
```

### 3. Custom Drag Preview Creation
```javascript
// Create preview container
this.customPreview = document.createElement('div');
this.customPreview.className = 'custom-drag-preview';
this.customPreview.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 100000;
    transform: translate(-50%, -50%);  // THIS IS KEY FOR CENTERING
`;
```

## Key Components for Perfect Centering

### 1. Transform Centering
The critical CSS transform that centers the preview on the cursor:
```css
transform: translate(-50%, -50%);
```
This moves the preview so its center point aligns with the cursor position.

### 2. Invisible Native Drag Image
```javascript
// Remove browser's default drag image to prevent dual previews
const invisibleDragImage = document.createElement('div');
invisibleDragImage.style.width = '1px';
invisibleDragImage.style.height = '1px';
invisibleDragImage.style.backgroundColor = 'transparent';
invisibleDragImage.style.position = 'absolute';
invisibleDragImage.style.top = '-1000px';
document.body.appendChild(invisibleDragImage);
e.dataTransfer.setDragImage(invisibleDragImage, 0, 0);
```

### 3. Coordinate Calculation
```javascript
// Fixed 1:1 pixel-perfect coordinate system
const worldX = svgX - this.pan.x;
const worldY = svgY - this.pan.y;
```
**Important**: No zoom scaling applied - direct 1:1 coordinate mapping.

## Common Centering Issues & Fixes

### Problem: Preview Offset from Cursor
**Cause**: Incorrect transform or coordinate calculation
**Fix**: Verify the CSS transform is exactly `translate(-50%, -50%)`

### Problem: Dual Drag Images
**Cause**: Browser's native drag image not disabled
**Fix**: Ensure invisible drag image is set in `handleDragStart()`

### Problem: Preview Jumps or Jitters
**Cause**: Coordinate system mismatch or zoom scaling issues
**Fix**: Verify 1:1 coordinate mapping without zoom transformations

### Problem: Preview Not Following Mouse Smoothly
**Cause**: Incorrect world coordinate calculation
**Fix**: Check pan offset calculation in `handleDragOver()`

## Code Locations for Centering

### 1. Drag Start Handler (~line 500)
Sets up invisible native drag image to prevent browser default behavior.

### 2. Drag Over Handler (~line 536) 
Calculates cursor position and updates preview location:
```javascript
handleDragOver(e) {
    // Get cursor position relative to SVG
    const svgX = e.clientX - rect.left;
    const svgY = e.clientY - rect.top;
    
    // Convert to world coordinates (no zoom scaling)
    const worldX = svgX - this.pan.x;
    const worldY = svgY - this.pan.y;
    
    this.dragPosition = { x: worldX, y: worldY };
}
```

### 3. Preview Creation (~line 764)
Creates the custom drag preview with centering transform:
```javascript
this.customPreview.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 100000;
    transform: translate(-50%, -50%);  // Centers on cursor
`;
```

## Coordinate System Details

### Fixed 1:1 Scaling System
- **No zoom transformations** applied to drag coordinates
- **Direct pixel mapping** between cursor and preview position  
- **Pan offset handling** for canvas scrolling/panning
- **SVG coordinate system** used for consistent positioning

### Debug Information
Enable coordinate debugging by checking console logs during drag:
```javascript
console.log('MOVEMENT DEBUG:');
console.log('Mouse cursor at SVG coords:', svgX, svgY);
console.log('Crosshair will be placed at world coords:', worldX, worldY);
```

## Testing Checklist for Centering
- [ ] Preview appears exactly centered on cursor
- [ ] No dual drag images visible
- [ ] Preview follows cursor smoothly
- [ ] Centering works with canvas panning
- [ ] Centering consistent across different rack sizes
- [ ] No jumping or jittering during drag

## Troubleshooting Steps
1. **Check browser console** for coordinate debug information
2. **Verify CSS transform** is `translate(-50%, -50%)`
3. **Confirm invisible drag image** setup in drag start
4. **Test without browser cache** (use incognito mode)
5. **Verify coordinate calculations** match 1:1 system

## Advanced Debugging
To debug coordinate issues, temporarily add this to `handleDragOver()`:
```javascript
console.log('Cursor Debug:', {
    mouseX: e.clientX,
    mouseY: e.clientY, 
    svgX: svgX,
    svgY: svgY,
    worldX: worldX,
    worldY: worldY,
    panOffset: this.pan
});
```