# Network Rack Designer - Project Handoff Document

## Project Overview

The Network Rack Designer is an SVG-based web application for designing server room rack layouts. Users can drag and drop various rack types, network equipment, and cable management components to create professional rack diagrams.

## Current Status: CRITICAL FLOOR MOUNTING ISSUE

**IMMEDIATE ISSUE:** All racks are mounting high instead of to the floor level, despite recent attempts to fix this.

### Root Cause Analysis
- **Problem:** Multiple Y position assignments throughout the codebase are overriding floor mounting logic
- **Latest Fix Attempt:** Lines 787-788 in enhanced-rack-designer.js were setting `newY = y` (drop position) instead of floor level
- **Status:** Fixed this instance but issue may persist due to other Y position overrides

## Project Goals & Requirements

### Core Functionality
1. **Rack Management**
   - Support for 9U, 12U, 24U, and 42U racks (both open and enclosed)
   - All racks must mount to floor level (Y=200) unless stacking
   - Stacking allowed but total height cannot exceed 42U
   - Visual selection with blue dashed outline when clicked

2. **Equipment Management**
   - Drag & drop devices into racks
   - Automatic rack unit snapping
   - Device deletion with rack cleanup

3. **Infrastructure Components**
   - Vertical cable managers (6" and 10" widths)
   - Horizontal managers, blanking plates, shelves
   - Manager mounting restricted to 42U and 24U open racks only

4. **Visual Standards**
   - Default zoom: 70% of original (displayed as 100%)
   - Zoom range: 40% to 400%
   - Enclosed racks show feet when floor-mounted
   - Robust feet design (20px wide, 12px tall)

## File Structure

### Core Files
- **enhanced-test.html** - Main enhanced designer interface
- **index.html** - Standard designer interface (loads same enhanced JS)
- **js/enhanced-rack-designer.js** - Main application logic (2100+ lines)
- **js/enhanced-equipment-library.js** - Equipment definitions
- **styles.css** - Application styling

### Documentation
- **DEVICE_DESIGN_BEST_PRACTICES.md** - Mandatory device design standards
- **PROJECT_HANDOFF.md** - This document

## Recent Work Completed

### ✅ Successfully Implemented
1. **Infrastructure Organization**
   - Managers moved to dropdown in infrastructure section
   - Added misc section with rack blanks, empty space, shelf

2. **Enclosed Rack Redesign**
   - Based on real EIA-310 cabinet structure research
   - Rails mounted inside cabinet enclosure (not 2-post in container)
   - Cabinet width: RACK_WIDTH + 100px, offset -50px for centering

3. **Zoom System Overhaul**
   - Default zoom changed from 100% to 70% (displayed as 100%)
   - Range: 40%-400% with proper scaling and display

4. **Manager Mounting Rules**
   - Only mount to 42U and 24U open racks
   - Auto-height adjustment (24U managers = 24U height)
   - Collision detection prevents overlapping

5. **Selection & Deletion System**
   - Click selection with visual highlighting
   - Delete buttons appear in sidebar when items selected
   - Rack deletion includes device confirmation dialog

6. **Feet System for Enclosed Racks**
   - 42U enclosed: Always show feet (robust 20px wide)
   - 24U enclosed: Feet only when floor-mounted
   - Positioned at cabinet corners for realistic appearance

## Critical Issues Requiring Immediate Attention

### 🚨 PRIMARY ISSUE: Floor Mounting Failure
**Problem:** All racks mounting high instead of floor level
**Location:** js/enhanced-rack-designer.js lines 785-788 and other Y position assignments
**Impact:** Breaks core functionality - racks should mount to Y=200 (floor) by default

**What to Check:**
1. Line 787: Should be `newY = 200;` not `newY = y;`
2. Initial position logic around lines 681-688
3. Any other `newY = y;` assignments that use drop position
4. Mounting logic around lines 840-860

### Known Working Components
- Horizontal positioning (X coordinates) works correctly
- Stacking logic and 42U height validation works
- Selection and deletion systems functional
- Zoom and pan controls working
- Equipment drag & drop operational

## Technical Architecture

### Main Class: EnhancedRackDesigner
**Key Properties:**
- `this.racks[]` - Array of rack objects
- `this.devices[]` - Array of device objects  
- `this.managers[]` - Array of manager objects
- `this.floorBaseline` - Y=200, represents floor level
- `this.zoom` - Current zoom level (default 0.7)
- `this.selectedInfrastructure` - Currently selected item ID

**Key Methods:**
- `addInfrastructure(type, x, y, svgY)` - Main rack/manager creation
- `findNearestRack(x, y)` - Proximity detection for stacking
- `calculateStackHeight(rack)` - Validates 42U height limit
- `deleteInfrastructure(id)` - Handles deletion with device cleanup
- `render()` - Main SVG rendering pipeline

### Coordinate Systems
- **SVG Coordinates:** Direct canvas positions (used for mounting decisions)
- **World Coordinates:** Transformed by zoom/pan (used for positioning)
- **Floor Level:** Y=200 in world coordinates

## Mounting Logic Flow

### Current (Broken) Flow:
1. Initial Y position set to drop position (`newY = y`)
2. Mounting logic tries to override to floor level
3. Multiple Y assignments create conflicts

### Intended Flow:
1. **Default:** `newY = 200` (floor level)
2. **Stacking Check:** If near rack + height ≤ 42U → stack above/below
3. **Final Position:** Apply mounting type (floor=200, stack=calculated)

## Recent Bug Fixes Attempted

### Floor Mounting Attempts:
1. **Simplified mounting logic** - Removed ceiling mounting entirely
2. **Fixed coordinate system** - SVG vs world coordinate conflicts
3. **Updated Y assignments** - Multiple attempts to force floor level
4. **Added 42U validation** - Prevents impossible stacking configurations

### Debugging Tools Added:
- Console logging for mounting decisions
- Stack height validation feedback
- Position coordinate tracking

## User Workflow

### Expected Behavior:
1. **Drop rack anywhere** → Mounts to floor (Y=200)
2. **Drop near existing rack** → Stacks if total ≤ 42U, otherwise side-by-side at floor
3. **Click any item** → Shows selection outline + delete button
4. **Delete rack** → Confirms if devices present, removes all

### Current Broken Behavior:
- Racks mount high in air instead of floor
- Stacking may work but from wrong baseline

## Code Quality Notes

### Well-Structured:
- Modular SVG rendering system
- Clean separation of concerns
- Comprehensive event handling
- Good collision detection logic

### Areas Needing Attention:
- **Y position assignments scattered throughout code**
- Complex mounting logic with multiple override points
- Legacy ceiling mounting code remnants
- Inconsistent coordinate system usage

## Testing Strategy

### Quick Test Cases:
1. **Floor Mounting:** Drop 24U rack → Should be at Y=200
2. **42U Floor:** Drop 42U rack → Should be at Y=200 with feet
3. **Stacking:** Drop 12U on 24U → Should stack (total 36U ≤ 42U)
4. **Stack Limit:** Drop 24U on 24U → Should place beside (48U > 42U)
5. **Selection:** Click rack → Should show blue outline + delete button

### Debug Tools:
- Browser console shows mounting decisions
- Use browser dev tools to inspect SVG Y coordinates
- Check `rack.y` values in console after placement

## Immediate Action Plan

### Step 1: Fix Floor Mounting (HIGH PRIORITY)
1. Search for all `newY = y` assignments in enhanced-rack-designer.js
2. Replace with `newY = 200` unless specifically for stacking
3. Ensure mounting logic at lines 840-860 correctly applies floor level
4. Test with 24U and 42U racks

### Step 2: Validate Stacking
1. Test rack stacking with height validation
2. Verify 42U limit enforcement
3. Check feet display logic for stacked racks

### Step 3: Complete Feature Testing
1. Test selection and deletion workflows
2. Verify manager mounting restrictions
3. Validate zoom and pan functionality

## Key Configuration Values

```javascript
// Floor and positioning
this.floorBaseline = 200;        // Floor Y coordinate
const floorLevel = 200;          // Standard floor position

// Rack dimensions  
this.RACK_WIDTH = 120;           // 19" rack width
this.UNIT_HEIGHT = 24;           // 1U = 24 pixels

// Manager widths
this.MANAGER_WIDTH_6 = 80;       // 6" manager width
this.MANAGER_WIDTH_10 = 133;     // 10" manager width

// Cabinet dimensions (enclosed racks)
const cabinetWidth = this.RACK_WIDTH + 100;  // Cabinet wider than rack
const cabinetOffset = -50;                   // Center rack in cabinet

// Feet dimensions (enclosed racks)
const footWidth = 20;            // Robust feet width
const footHeight = 12;           // Robust feet height

// Zoom settings
default zoom = 0.7;              // Displayed as 100%
zoom range = 0.28 to 2.8;        // 40% to 400% display
```

## Contact & Handoff

This project requires someone familiar with:
- JavaScript/SVG manipulation
- Coordinate system transformations
- Event-driven UI architecture
- Debugging complex positioning logic

**Priority 1:** Fix floor mounting by finding and correcting Y position assignments
**Priority 2:** Complete testing of all functionality
**Priority 3:** Clean up debug logging and optimize performance

The codebase is well-structured but has accumulated complexity around positioning logic. The floor mounting issue is the primary blocker to a functional tool.

---

**Document Version:** 1.0  
**Created:** August 2025  
**Status:** Active Development - Critical Issue Present  
**Next Action:** Fix floor mounting Y coordinate assignments