# Drag Preview Sizing Guide - Network Rack Designer

## Overview
This document explains how drag preview sizing works in the Network Rack Designer and how to fix sizing issues when drag previews appear too large or too small.

## Current Working Configuration
- **Perfect Scale Factor**: `0.51` (as of v2.3)
- **File Location**: `js/enhanced-rack-designer.js`
- **Lines to Modify**: ~820 and ~865

## How Drag Preview Sizing Works

### 1. Rack Preview Sizing (Line ~820)
```javascript
// Calculate visual dimensions for rack previews
const visualWidth = rawWidth * 0.51;  // Perfect drag preview size
const visualHeight = rawHeight * 0.51; // Perfect drag preview size

// Apply to SVG element
svg.setAttribute('width', visualWidth + 'px');
svg.setAttribute('height', visualHeight + 'px');
```

### 2. Device Preview Sizing (Line ~865)
```javascript
// Calculate visual dimensions for device previews  
const rawWidth = 259; // Device width from renderDevice
const rawHeight = (this.draggedDevice.height || 1) * 24;
const visualWidth = rawWidth * 0.51;  // Perfect drag preview size
const visualHeight = rawHeight * 0.51; // Perfect drag preview size
```

## Scale Factor History & Testing Process
The optimal scale factor was determined through iterative testing:

| Scale | Result | Notes |
|-------|--------|-------|
| 0.7   | Too large | Original baseline |
| 0.668 | Too large | 2% reduction |
| 0.55  | Too large | Further reduction |
| 0.51  | Perfect ✅ | Final optimal size |
| 0.5   | Too small | Went too far |

## How to Fix Sizing Issues

### Problem: Drag Previews Too Large
1. **Locate the scale factors** in `js/enhanced-rack-designer.js`
2. **Find both instances** (rack and device preview sections)
3. **Reduce the multiplier** (e.g., from 0.51 to 0.48)
4. **Update cache-buster** in HTML file to force browser refresh
5. **Test in incognito mode** to bypass cache

### Problem: Drag Previews Too Small  
1. **Increase the multiplier** (e.g., from 0.51 to 0.53)
2. **Test incrementally** - small changes make big visual differences
3. **Always update both rack AND device preview sections**

### Code Locations to Modify

#### Rack Preview Section (~line 820):
```javascript
// Look for this pattern:
const visualWidth = rawWidth * [SCALE_FACTOR];
const visualHeight = rawHeight * [SCALE_FACTOR];
```

#### Device Preview Section (~line 865):
```javascript
// Look for this pattern:
const visualWidth = rawWidth * [SCALE_FACTOR];  
const visualHeight = rawHeight * [SCALE_FACTOR];
```

## Cache Busting for Testing
When making changes, always update the version parameter in the HTML file:

```html
<script src="js/enhanced-rack-designer.js?v=YOUR_VERSION_HERE"></script>
```

## Testing Checklist
- [ ] Both rack AND device previews updated with same scale factor
- [ ] Cache-buster parameter updated in HTML
- [ ] Tested in incognito mode
- [ ] Previews are properly centered on cursor
- [ ] Scale looks good for both large (42U) and small (9U) racks
- [ ] Device previews also properly sized

## Scale Factor Recommendations
- **Start with 0.51** as the baseline
- **Make small adjustments** (±0.02 increments)
- **Test with different rack sizes** (9U, 12U, 24U, 42U)
- **Verify both rack and device drag previews**

## Troubleshooting
- **No size change visible**: Browser cache issue - use incognito mode
- **Only racks change size**: Forgot to update device preview section  
- **Previews completely broken**: Check JavaScript console for errors
- **Wrong code section**: Search for "rawWidth \* 0\." to find all instances