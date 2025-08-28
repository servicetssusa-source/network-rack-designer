# Device Images Library

This folder contains device images for the network rack designer tool.

## Folder Structure

- **switches/** - Network switches (managed, unmanaged, PoE)
- **patch-panels/** - Patch panels (angled, straight, various port counts)
- **racks/** - Rack frames (2-post, 4-post, wall-mount)
- **servers/** - Servers and NAS devices
- **cables/** - Cable management accessories
- **accessories/** - Other rack accessories (shelves, blanks, etc.)

## Image Guidelines

### File Naming
- Use lowercase letters with hyphens
- Include manufacturer and model when possible
- Example: `ubiquiti-usw-pro-48-poe.png`

### Image Requirements
- **Resolution**: High resolution preferred (300+ DPI)
- **Format**: PNG (preferred), SVG, or WebP
- **Background**: Transparent or clean white background
- **Perspective**: Front view for rack equipment
- **Size**: Images will be auto-scaled to rack units

### Adding New Devices

1. Place image file in appropriate category folder
2. Update `devices.json` with device specifications:
   - Name, manufacturer, model
   - Rack units (height)
   - Physical dimensions
   - Port counts and specifications
   - Image file paths

### Example Device Entry

```json
{
  "cisco-sg350-48": {
    "name": "Cisco SG350-48",
    "manufacturer": "Cisco",
    "model": "SG350-48",
    "category": "switch",
    "rackUnits": 1,
    "width": 440,
    "height": 44,
    "depth": 257,
    "dimensions_unit": "mm",
    "ports": {
      "ethernet": 48,
      "sfp": 2
    },
    "images": {
      "png": "switches/cisco-sg350-48.png"
    },
    "mounting": "rack"
  }
}
```

## Hybrid Image/Canvas System

The tool supports two rendering modes:

### 1. Image-based (Preferred)
- Real device photos/renders
- Faster loading and more realistic
- Use when actual device images are available

### 2. Canvas-based (Fallback)  
- Programmatically drawn devices
- Used when no real image is available
- Our custom-designed accurate representations

### Priority Order
1. Check for image files (PNG, SVG, WebP)
2. If no image found, use canvas fallback
3. If no fallback defined, show placeholder

### Adding Fallback Support

```json
{
  "cisco-sg350-48": {
    "name": "Cisco SG350-48",
    "images": {
      "png": "switches/cisco-sg350-48.png"
    },
    "fallback": {
      "type": "canvas",
      "path": "../switches/cisco-sg350-48/device.js", 
      "function": "createCiscoSG350"
    }
  }
}
```

## Usage

The rack designer tool will automatically:
1. Try to load real device images first
2. Fall back to canvas rendering if no image exists
3. Provide the best visual representation available