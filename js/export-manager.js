// Export Manager - Handles PDF and PNG export functionality
class ExportManager {
    constructor(canvas) {
        this.canvas = canvas;
    }

    // Export canvas as PNG
    async exportToPNG() {
        try {
            // Hide grid and placement hints for export
            const gridObjects = this.canvas.getObjects().filter(obj => obj.isGrid || obj.isPlacementHint);
            gridObjects.forEach(obj => obj.set('visible', false));
            
            this.canvas.renderAll();
            
            // Get canvas data URL
            const dataURL = this.canvas.toDataURL({
                format: 'png',
                quality: 1,
                multiplier: 2 // Higher resolution
            });
            
            // Create download link
            const link = document.createElement('a');
            link.download = `rack-design-${new Date().getTime()}.png`;
            link.href = dataURL;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Restore grid visibility
            gridObjects.forEach(obj => obj.set('visible', true));
            this.canvas.renderAll();
            
            return true;
        } catch (error) {
            console.error('PNG export failed:', error);
            alert('Failed to export PNG. Please try again.');
            return false;
        }
    }

    // Export canvas as PDF
    async exportToPDF() {
        try {
            // Hide grid and placement hints for export
            const gridObjects = this.canvas.getObjects().filter(obj => obj.isGrid || obj.isPlacementHint);
            gridObjects.forEach(obj => obj.set('visible', false));
            
            this.canvas.renderAll();
            
            // Calculate content bounds
            const objects = this.canvas.getObjects().filter(obj => !obj.isGrid && !obj.isPlacementHint && obj.visible);
            if (objects.length === 0) {
                alert('No content to export');
                return false;
            }
            
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            
            objects.forEach(obj => {
                const bounds = obj.getBoundingRect();
                minX = Math.min(minX, bounds.left);
                minY = Math.min(minY, bounds.top);
                maxX = Math.max(maxX, bounds.left + bounds.width);
                maxY = Math.max(maxY, bounds.top + bounds.height);
            });
            
            const contentWidth = maxX - minX;
            const contentHeight = maxY - minY;
            const padding = 50;
            
            // Create temporary canvas for export
            const tempCanvas = document.createElement('canvas');
            const exportWidth = contentWidth + padding * 2;
            const exportHeight = contentHeight + padding * 2;
            
            tempCanvas.width = exportWidth * 2; // Higher resolution
            tempCanvas.height = exportHeight * 2;
            
            const tempFabricCanvas = new fabric.Canvas(tempCanvas, {
                backgroundColor: '#ffffff',
                width: exportWidth,
                height: exportHeight
            });
            
            // Clone objects to temp canvas
            const clonedObjects = [];
            for (const obj of objects) {
                const cloned = await this.cloneObject(obj);
                if (cloned) {
                    cloned.set({
                        left: cloned.left - minX + padding,
                        top: cloned.top - minY + padding
                    });
                    tempFabricCanvas.add(cloned);
                    clonedObjects.push(cloned);
                }
            }
            
            tempFabricCanvas.renderAll();
            
            // Convert to image data
            const imageData = tempCanvas.toDataURL('image/png', 1.0);
            
            // Create PDF
            const { jsPDF } = window.jspdf;
            
            // Determine PDF orientation and size
            const isLandscape = exportWidth > exportHeight;
            const orientation = isLandscape ? 'landscape' : 'portrait';
            
            // Calculate PDF dimensions (A4 = 210mm x 297mm)
            const maxWidth = isLandscape ? 297 : 210;
            const maxHeight = isLandscape ? 210 : 297;
            
            const aspectRatio = exportWidth / exportHeight;
            let pdfWidth, pdfHeight;
            
            if (aspectRatio > (maxWidth / maxHeight)) {
                pdfWidth = maxWidth;
                pdfHeight = maxWidth / aspectRatio;
            } else {
                pdfHeight = maxHeight;
                pdfWidth = maxHeight * aspectRatio;
            }
            
            const pdf = new jsPDF({
                orientation: orientation,
                unit: 'mm',
                format: 'a4'
            });
            
            // Add title
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Network Rack Layout Design', 20, 20);
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
            
            // Add rack diagram
            const imageY = 40;
            pdf.addImage(imageData, 'PNG', 20, imageY, pdfWidth - 40, (pdfWidth - 40) / aspectRatio);
            
            // Add equipment list
            const equipmentList = this.generateEquipmentList(objects);
            if (equipmentList.length > 0) {
                const listStartY = imageY + (pdfWidth - 40) / aspectRatio + 20;
                
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Equipment List:', 20, listStartY);
                
                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'normal');
                
                let currentY = listStartY + 10;
                equipmentList.forEach((item, index) => {
                    if (currentY > maxHeight - 20) {
                        pdf.addPage();
                        currentY = 20;
                    }
                    
                    pdf.text(`${index + 1}. ${item.name} (${item.type})${item.position ? ` - Position: ${item.position}` : ''}`, 25, currentY);
                    currentY += 5;
                });
            }
            
            // Save PDF
            pdf.save(`rack-design-${new Date().getTime()}.pdf`);
            
            // Cleanup
            tempFabricCanvas.dispose();
            
            // Restore grid visibility
            gridObjects.forEach(obj => obj.set('visible', true));
            this.canvas.renderAll();
            
            return true;
        } catch (error) {
            console.error('PDF export failed:', error);
            alert('Failed to export PDF. Please try again.');
            return false;
        }
    }

    // Clone fabric object (async for complex objects)
    async cloneObject(obj) {
        return new Promise((resolve) => {
            obj.clone((cloned) => {
                resolve(cloned);
            });
        });
    }

    // Generate equipment list for PDF
    generateEquipmentList(objects) {
        const equipment = [];
        
        objects.forEach(obj => {
            if (obj.equipmentName || obj.equipmentType) {
                const item = {
                    name: obj.equipmentName || 'Unnamed Equipment',
                    type: obj.equipmentType || 'Unknown Type',
                    position: null
                };
                
                // Add rack position if available
                if (obj.rackPosition) {
                    item.position = `${obj.rackPosition}U`;
                }
                
                // Add rack information if it's a rack
                if (obj.rackType) {
                    item.name = `${obj.rackType} Rack`;
                    item.type = `${obj.rackUnits}U Rack`;
                }
                
                equipment.push(item);
            }
        });
        
        // Sort by rack position, then by name
        equipment.sort((a, b) => {
            if (a.position && b.position) {
                const posA = parseInt(a.position);
                const posB = parseInt(b.position);
                if (posA !== posB) return posA - posB;
            } else if (a.position && !b.position) {
                return -1;
            } else if (!a.position && b.position) {
                return 1;
            }
            
            return a.name.localeCompare(b.name);
        });
        
        return equipment;
    }

    // Export canvas data as JSON (for saving/loading designs)
    exportToJSON() {
        try {
            const canvasData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                canvas: this.canvas.toObject(),
                metadata: {
                    zoom: this.canvas.getZoom(),
                    width: this.canvas.getWidth(),
                    height: this.canvas.getHeight()
                }
            };
            
            const dataStr = JSON.stringify(canvasData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.download = `rack-design-${new Date().getTime()}.json`;
            link.href = URL.createObjectURL(blob);
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(link.href);
            
            return true;
        } catch (error) {
            console.error('JSON export failed:', error);
            alert('Failed to export design file. Please try again.');
            return false;
        }
    }

    // Import canvas data from JSON
    async importFromJSON(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (!data.canvas) {
                throw new Error('Invalid design file format');
            }
            
            // Clear current canvas
            this.canvas.clear();
            
            // Load design
            return new Promise((resolve, reject) => {
                this.canvas.loadFromJSON(data.canvas, () => {
                    // Restore metadata if available
                    if (data.metadata) {
                        if (data.metadata.zoom) {
                            this.canvas.setZoom(data.metadata.zoom);
                        }
                    }
                    
                    this.canvas.renderAll();
                    resolve(true);
                }, (obj, error) => {
                    console.error('Object loading error:', error);
                    reject(error);
                });
            });
        } catch (error) {
            console.error('JSON import failed:', error);
            alert('Failed to import design file. Please check the file format.');
            return false;
        }
    }
}