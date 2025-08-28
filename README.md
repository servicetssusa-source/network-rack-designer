# Network Rack Layout Designer

A professional-grade web application for designing network rack layouts with visually accurate equipment representations, drag-and-drop functionality, and export capabilities.

## Features

### Core Functionality
- **Accurate Rack Modeling**: Chatsworth Products 2-post rack with real-world dimensions (19" × 7' × 3")
- **EIA-310 Compliance**: Proper rack unit spacing (1U = 1.75") and mounting hole patterns
- **Visual Equipment Library**: Photo-realistic equipment from top manufacturers
- **Drag & Drop Interface**: Intuitive equipment placement with snap-to-grid
- **Multi-Format Export**: PDF and PNG export with equipment lists

### Equipment Categories
- **Structure**: Racks, horizontal/vertical cable managers (Chatsworth, APC, Tripp Lite)
- **Networking**: Switches and routers (Cisco, Ubiquiti, NETGEAR, HP Aruba, Juniper)
- **Connectivity**: Patch panels and fiber panels (CommScope, Panduit, Belden, Corning, Leviton)
- **Power**: UPS systems and PDUs (APC, Eaton, Tripp Lite, CyberPower)
- **Audio/Visual**: Sound masking and paging systems (Biamp, QSC, Shure, Bosch)

### Manufacturer Support
Each category includes equipment from the top 5 manufacturers with their best-selling products:
- Real model numbers and specifications
- Accurate visual representations
- Filterable by manufacturer

### Technical Specifications
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Touch Support**: Mobile-friendly drag and drop
- **Grid System**: 20px grid with snap-to-grid functionality
- **Zoom Controls**: 10%-300% zoom with fit-to-screen
- **Canvas Export**: High-resolution PDF/PNG with equipment lists

## Installation & Usage

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server installation required - runs entirely in browser
- Internet connection for CDN libraries (Fabric.js, jsPDF, html2canvas)

### Quick Start

1. **Download the files** to a local folder on your computer:
   ```
   network-rack-designer/
   ├── index.html
   ├── styles.css
   ├── js/
   │   ├── rack-components.js
   │   ├── equipment-library.js
   │   ├── canvas-manager.js
   │   ├── export-manager.js
   │   └── app.js
   └── README.md
   ```

2. **Open the application**:
   - Double-click `index.html` to open in your default browser
   - OR right-click `index.html` → "Open with" → Choose your browser
   - OR drag `index.html` into any browser window

3. **Start designing**:
   - Browse equipment categories using the tabs
   - Filter by manufacturer using the dropdown
   - Drag equipment from the library to the canvas
   - Equipment automatically snaps to rack positions
   - Use zoom controls and grid toggle for precision
   - Export your design as PDF or PNG

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 90+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## How to Use

### Interface Overview
- **Left Panel**: Tabbed equipment library with manufacturer filtering
- **Center Canvas**: Design area with zoom and grid controls
- **Right Panel**: Properties for selected equipment
- **Top Bar**: Export buttons (PDF/PNG)

### Equipment Placement
1. Select equipment category tab (Structure, Networking, etc.)
2. Optionally filter by manufacturer
3. Drag equipment from library to canvas
4. Equipment automatically snaps to available rack positions
5. Use properties panel to rename or delete selected items

### Rack Management
- Add new racks using "Add New Rack" from Structure tab
- Add horizontal/vertical cable managers for organization
- Equipment automatically places in nearest available rack position
- Visual hints show available placement positions

### Export Options
- **PDF Export**: Includes equipment list with rack positions
- **PNG Export**: High-resolution image suitable for documentation
- **Automatic Scaling**: Exports fit content with proper margins

### Keyboard Shortcuts
- **Zoom In**: Ctrl/Cmd + Plus
- **Zoom Out**: Ctrl/Cmd + Minus
- **Fit to Screen**: Ctrl/Cmd + 0
- **Delete**: Delete/Backspace key (with item selected)

### Mobile Usage
- Touch-friendly interface with larger tap targets
- Pinch-to-zoom support
- Responsive layout adapts to screen size
- Alternative selection methods for small screens

## Technical Architecture

### Libraries Used
- **Fabric.js**: Canvas manipulation and object management
- **jsPDF**: PDF generation with equipment lists
- **html2canvas**: High-quality canvas to image conversion
- **Font Awesome**: Icons for UI elements

### Key Components
- **RackComponents**: Accurate rack modeling with EIA-310 standards
- **EquipmentLibrary**: Visual equipment creation with manufacturer data
- **CanvasManager**: Drag-drop, zoom, grid, and object management
- **ExportManager**: PDF/PNG export with automatic sizing

### Performance
- Hardware-accelerated canvas rendering
- Efficient object caching and reuse
- Optimized for 100+ equipment items per design
- Responsive grid system with minimal redraws

## Troubleshooting

### Common Issues

**Application won't load:**
- Ensure all files are in the same folder structure
- Check browser console for errors (F12)
- Try different browser
- Check internet connection (required for CDN libraries)

**Drag and drop not working:**
- Ensure browser supports HTML5 drag and drop
- Try refreshing the page
- Check if touch device - use tap and hold

**Export not working:**
- Disable popup blockers for the page
- Try different export format (PDF vs PNG)
- Ensure design has content to export

**Performance issues:**
- Reduce number of objects on canvas
- Disable grid if not needed
- Close other browser tabs
- Try smaller zoom levels

### Browser-Specific Notes
- **Safari**: May require allowing downloads in settings
- **Firefox**: Popup blocker may prevent exports
- **Mobile**: Use landscape orientation for better experience

## Support

This is a standalone application designed for local use. For issues:
1. Check browser compatibility
2. Verify all files are present
3. Check browser console for errors
4. Try different browser or device

## License

This tool is designed for professional network rack planning and documentation. All equipment representations are generic and do not include manufacturer logos or copyrighted designs.

---

**Version**: 1.0  
**Last Updated**: August 2025  
**Compatibility**: Modern web browsers with HTML5 Canvas support