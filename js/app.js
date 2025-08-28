// Main Application - Initialize and coordinate all components
class NetworkRackDesigner {
    constructor() {
        this.canvasManager = null;
        this.enhancedRackDesigner = null;
        this.exportManager = null;
        this.currentTab = 'structure';
        this.currentManufacturer = 'all';
        this.isEnhancedMode = false;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        try {
            // Initialize canvas manager
            this.canvasManager = new CanvasManager('designCanvas');
            this.exportManager = new ExportManager(this.canvasManager.canvas);
            
            // Setup event handlers
            this.setupEventHandlers();
            this.setupTabSystem();
            this.populateEquipmentLibrary();
            
            console.log('Network Rack Designer initialized successfully');
            console.log('Current tab:', this.currentTab);
            console.log('Equipment library populated for:', this.currentTab);
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to initialize the application. Please refresh and try again.');
        }
    }

    setupEventHandlers() {
        // Enhanced mode toggle
        const toggleEnhancedBtn = document.getElementById('toggleEnhanced');
        if (toggleEnhancedBtn) {
            toggleEnhancedBtn.addEventListener('click', () => {
                this.toggleEnhancedMode();
            });
        }
        
        // Export buttons
        const exportPDFBtn = document.getElementById('exportPDF');
        const exportPNGBtn = document.getElementById('exportPNG');
        
        if (exportPDFBtn) {
            exportPDFBtn.addEventListener('click', () => this.handleExportPDF());
        }
        
        if (exportPNGBtn) {
            exportPNGBtn.addEventListener('click', () => this.handleExportPNG());
        }

        // Zoom controls
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');
        const zoomFitBtn = document.getElementById('zoomFit');
        
        if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.canvasManager.zoomIn());
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.canvasManager.zoomOut());
        if (zoomFitBtn) zoomFitBtn.addEventListener('click', () => this.canvasManager.zoomToFit());

        // Grid and snap toggles
        const gridToggleBtn = document.getElementById('gridToggle');
        const snapToggleBtn = document.getElementById('snapToggle');
        
        if (gridToggleBtn) gridToggleBtn.addEventListener('click', () => this.canvasManager.toggleGrid());
        if (snapToggleBtn) snapToggleBtn.addEventListener('click', () => this.canvasManager.toggleSnap());

        // Properties panel
        const itemNameInput = document.getElementById('itemName');
        const deleteBtn = document.getElementById('deleteItem');
        
        if (itemNameInput) {
            itemNameInput.addEventListener('change', (e) => this.handleNameChange(e.target.value));
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.canvasManager.deleteSelectedObject());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // File import (for future feature)
        this.setupFileImport();
    }

    setupTabSystem() {
        // Create tab buttons dynamically
        const categories = document.querySelector('.equipment-categories');
        if (!categories) return;

        // Clear existing content
        categories.innerHTML = '';

        // Create tab navigation
        const tabNav = document.createElement('div');
        tabNav.className = 'tab-navigation';
        tabNav.innerHTML = `
            <button class="tab-btn active" data-tab="structure">
                <i class="fas fa-warehouse"></i> Structure
            </button>
            <button class="tab-btn" data-tab="networking">
                <i class="fas fa-network-wired"></i> Networking
            </button>
            <button class="tab-btn" data-tab="connectivity">
                <i class="fas fa-plug"></i> Connectivity
            </button>
        `;
        categories.appendChild(tabNav);

        // Create manufacturer filter
        const manufacturerFilter = document.createElement('div');
        manufacturerFilter.className = 'manufacturer-filter';
        manufacturerFilter.innerHTML = `
            <label>Manufacturer:</label>
            <select id="manufacturerSelect">
                <option value="all">All Manufacturers</option>
            </select>
        `;
        categories.appendChild(manufacturerFilter);

        // Create tab content container
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        tabContent.id = 'equipmentTabContent';
        categories.appendChild(tabContent);

        // Setup tab click handlers
        const tabBtns = tabNav.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.closest('.tab-btn').getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Setup manufacturer filter
        const manufacturerSelect = document.getElementById('manufacturerSelect');
        if (manufacturerSelect) {
            manufacturerSelect.addEventListener('change', (e) => {
                this.currentManufacturer = e.target.value;
                this.populateEquipmentLibrary();
            });
        }
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update tab buttons
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
        });

        // Update manufacturer options
        this.updateManufacturerFilter();
        
        // Refresh equipment library
        this.populateEquipmentLibrary();
    }

    updateManufacturerFilter() {
        const manufacturerSelect = document.getElementById('manufacturerSelect');
        if (!manufacturerSelect) return;

        const manufacturers = this.getManufacturersForTab(this.currentTab);
        
        manufacturerSelect.innerHTML = '<option value="all">All Manufacturers</option>';
        manufacturers.forEach(mfg => {
            const option = document.createElement('option');
            option.value = mfg.id;
            option.textContent = mfg.name;
            manufacturerSelect.appendChild(option);
        });

        manufacturerSelect.value = this.currentManufacturer;
    }

    getManufacturersForTab(tab) {
        const manufacturerData = {
            structure: [
                { id: 'chatsworth', name: 'Chatsworth Products' },
                { id: 'apc', name: 'APC by Schneider Electric' },
                { id: 'tripp-lite', name: 'Tripp Lite' },
                { id: 'startech', name: 'StarTech.com' },
                { id: 'kendall-howard', name: 'Kendall Howard' }
            ],
            networking: [
                { id: 'cisco', name: 'Cisco' },
                { id: 'ubiquiti', name: 'Ubiquiti' },
                { id: 'netgear', name: 'NETGEAR' },
                { id: 'hp-aruba', name: 'HP Aruba' },
                { id: 'juniper', name: 'Juniper Networks' }
            ],
            connectivity: [
                { id: 'commscope', name: 'CommScope' },
                { id: 'panduit', name: 'Panduit' },
                { id: 'belden', name: 'Belden' },
                { id: 'corning', name: 'Corning' },
                { id: 'leviton', name: 'Leviton' }
            ],
            power: [
                { id: 'apc', name: 'APC by Schneider Electric' },
                { id: 'eaton', name: 'Eaton' },
                { id: 'tripp-lite', name: 'Tripp Lite' },
                { id: 'cyberpower', name: 'CyberPower' },
                { id: 'liebert', name: 'Liebert (Vertiv)' }
            ],
            audio: [
                { id: 'biamp', name: 'Biamp' },
                { id: 'qsc', name: 'QSC' },
                { id: 'shure', name: 'Shure' },
                { id: 'bosch', name: 'Bosch' },
                { id: 'clearone', name: 'ClearOne' }
            ]
        };

        return manufacturerData[tab] || [];
    }

    populateEquipmentLibrary() {
        const tabContent = document.getElementById('equipmentTabContent');
        if (!tabContent) {
            // Enhanced designer is active, skip populating classic equipment library
            console.log('Enhanced designer is active, skipping classic equipment library population');
            return;
        }

        const equipment = this.getEquipmentForTab(this.currentTab);
        console.log(`Populating ${this.currentTab} tab with ${equipment.length} categories`);
        
        tabContent.innerHTML = '';

        equipment.forEach(category => {
            if (this.currentManufacturer !== 'all' && category.manufacturer !== this.currentManufacturer) {
                return;
            }

            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            
            categorySection.innerHTML = `
                <h4><i class="${category.icon}"></i> ${category.name}</h4>
                <div class="equipment-grid">
                    ${category.items.map(item => `
                        <div class="equipment-item" data-type="${item.type}" data-height="${item.height}" data-manufacturer="${item.manufacturer}">
                            <div class="equipment-preview ${item.previewClass}"></div>
                            <span>${item.name}</span>
                            <small>${item.manufacturerName} - ${item.model}</small>
                        </div>
                    `).join('')}
                </div>
            `;
            
            tabContent.appendChild(categorySection);
        });

        // Re-setup drag and drop for new elements
        if (this.canvasManager && this.canvasManager.setupDragAndDrop) {
            setTimeout(() => {
                this.canvasManager.setupDragAndDrop();
            }, 100);
        }
    }

    getEquipmentForTab(tab) {
        const equipmentData = {
            structure: [
                {
                    name: 'Racks & Frames',
                    icon: 'fas fa-warehouse',
                    manufacturer: 'all',
                    items: [
                        { type: 'new-rack', height: 0, name: '2-Post Rack (45U)', previewClass: 'rack-preview', manufacturer: 'chatsworth', manufacturerName: 'Chatsworth', model: 'Universal Rack' },
                        { type: 'horizontal-manager', height: 1, name: 'Horizontal Manager (1U)', previewClass: 'manager-preview', manufacturer: 'apc', manufacturerName: 'APC', model: 'AR8136BLK' },
                        { type: 'vertical-manager', height: 0, name: 'Vertical Manager', previewClass: 'manager-preview', manufacturer: 'tripp-lite', manufacturerName: 'Tripp Lite', model: 'SRCABLEDUCT' }
                    ]
                }
            ],
            networking: [
                {
                    name: 'Switches',
                    icon: 'fas fa-network-wired',
                    manufacturer: 'all',
                    items: [
                        { type: 'cisco-c9200l-24t-4g', height: 1, name: 'Cisco Catalyst C9200L-24T-4G', previewClass: 'switch-preview', manufacturer: 'cisco', manufacturerName: 'Cisco', model: 'C9200L-24T-4G' },
                        { type: 'cisco-c9200l-48p-4g', height: 1, name: 'Cisco Catalyst C9200L-48P-4G', previewClass: 'switch-preview', manufacturer: 'cisco', manufacturerName: 'Cisco', model: 'C9200L-48P-4G' }
                    ]
                }
            ],
            connectivity: [
                {
                    name: 'Patch Panels',
                    icon: 'fas fa-plug',
                    manufacturer: 'all',
                    items: [
                        { type: 'patch-panel-24-port', height: 1, name: '24-Port Patch Panel', previewClass: 'patch-panel-preview', manufacturer: 'generic', manufacturerName: 'Generic', model: '24-Port' },
                        { type: 'patch-panel-48-port', height: 2, name: '48-Port Patch Panel', previewClass: 'patch-panel-preview', manufacturer: 'generic', manufacturerName: 'Generic', model: '48-Port' }
                    ]
                }
            ]
        };

        let categories = equipmentData[tab] || [];
        
        // Filter by manufacturer if selected
        if (this.currentManufacturer !== 'all') {
            categories = categories.map(category => ({
                ...category,
                items: category.items.filter(item => item.manufacturer === this.currentManufacturer)
            })).filter(category => category.items.length > 0);
        }

        return categories;
    }

    setupFileImport() {
        // Create hidden file input for JSON import
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                const success = await this.exportManager.importFromJSON(file);
                if (success) {
                    this.showSuccess('Design imported successfully!');
                }
            }
        });
        
        document.body.appendChild(fileInput);
        this.fileInput = fileInput;
    }

    handleExportPDF() {
        const button = document.getElementById('exportPDF');
        if (button) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
        }

        this.exportManager.exportToPDF().then(success => {
            if (success) {
                this.showSuccess('PDF exported successfully!');
            }
        }).finally(() => {
            if (button) {
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-file-pdf"></i> Export PDF';
            }
        });
    }

    handleExportPNG() {
        const button = document.getElementById('exportPNG');
        if (button) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
        }

        this.exportManager.exportToPNG().then(success => {
            if (success) {
                this.showSuccess('PNG exported successfully!');
            }
        }).finally(() => {
            if (button) {
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-image"></i> Export PNG';
            }
        });
    }

    handleNameChange(newName) {
        if (this.canvasManager.selectedObject) {
            this.canvasManager.selectedObject.set('equipmentName', newName);
            this.canvasManager.canvas.renderAll();
        }
    }

    handleKeyboard(e) {
        // Delete key
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (this.canvasManager.selectedObject && 
                !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                e.preventDefault();
                this.canvasManager.deleteSelectedObject();
            }
        }

        // Zoom shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '=':
                case '+':
                    e.preventDefault();
                    this.canvasManager.zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    this.canvasManager.zoomOut();
                    break;
                case '0':
                    e.preventDefault();
                    this.canvasManager.zoomToFit();
                    break;
            }
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Position notification
        const notifications = document.querySelectorAll('.notification');
        const offset = (notifications.length - 1) * 60;
        notification.style.top = `${20 + offset}px`;

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                this.removeNotification(notification);
            }
        }, 5000);

        // Close button handler
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.removeNotification(notification));
    }

    removeNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    toggleEnhancedMode() {
        this.isEnhancedMode = !this.isEnhancedMode;
        const toggleBtn = document.getElementById('toggleEnhanced');
        
        if (this.isEnhancedMode) {
            // Switch to enhanced mode
            console.log('Switching to enhanced mode');
            
            // Destroy current canvas manager
            if (this.canvasManager) {
                this.canvasManager.canvas.dispose();
                this.canvasManager = null;
            }
            
            // Initialize enhanced rack designer
            this.enhancedRackDesigner = new EnhancedRackDesigner();
            
            // Update button
            if (toggleBtn) {
                toggleBtn.innerHTML = '<i class="fas fa-magic"></i> Switch to Classic Designer';
                toggleBtn.className = 'btn btn-warning';
            }
            
            this.showSuccess('Switched to Enhanced SVG-based Designer!');
            
        } else {
            // Switch back to classic mode
            console.log('Switching to classic mode');
            
            // Destroy enhanced designer (if needed)
            this.enhancedRackDesigner = null;
            
            // Re-initialize classic canvas manager
            this.canvasManager = new CanvasManager('designCanvas');
            this.exportManager = new ExportManager(this.canvasManager.canvas);
            
            // Update button
            if (toggleBtn) {
                toggleBtn.innerHTML = '<i class="fas fa-magic"></i> Switch to Enhanced Designer';
                toggleBtn.className = 'btn btn-info';
            }
            
            this.showSuccess('Switched to Classic Fabric.js Designer!');
        }
    }
}

// Initialize the application
window.addEventListener('load', () => {
    window.rackDesigner = new NetworkRackDesigner();
});