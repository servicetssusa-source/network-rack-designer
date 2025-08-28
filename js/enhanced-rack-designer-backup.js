// Enhanced Rack Designer - Inspired by modern React approach
class EnhancedRackDesigner {
    constructor() {
        // Constants matching the example
        this.RACK_HEIGHT = 42; // 42U
        this.UNIT_HEIGHT = 24; // pixels per rack unit (original size)
        this.RACK_WIDTH = 240; // 19" rack width
        this.MANAGER_WIDTH_6 = 80; // 6" Vertical manager width  
        this.MANAGER_WIDTH_10 = 133; // 10" Vertical manager width (approximately 10/6 * 80)
        
        // State
        this.racks = [
            { id: 'rack-1', type: 'rack', x: 300, y: 200, height: 42, isEnclosed: false, mounting: 'floor' }
        ];
        this.floorBaseline = null; // Will be set by the first 42U rack
        this.managers = [];
        this.devices = [];
        this.selectedDevice = null;
        this.selectedInfrastructure = null;
        this.draggedDevice = null;
        this.dragPosition = { x: 0, y: 0 };
        this.validDropZones = [];
        this.isMouseDown = false;
        this.lastPanPoint = { x: 0, y: 0 };
        this.zoom = 1;
        this.pan = { x: 50, y: 50 };
        
        // Initialize floor baseline from initial 42U rack
        this.establishFloorBaseline();
        
        // Initialize
        this.initializeUI();
        this.setupEventListeners();
    }

    establishFloorBaseline() {
        // The floor baseline is defined by the bottom of the initial 42U rack's base plate
        const initialRack = this.racks[0];
        if (initialRack && initialRack.height === 42) {
            this.floorBaseline = initialRack.y + (initialRack.height * this.UNIT_HEIGHT) + 30; // +30 for thick base plate
        }
    }

    initializeUI() {
        // Clear existing canvas manager
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.innerHTML = `
                <div class="enhanced-rack-toolbar">
                    <div class="toolbar-left">
                        <button id="zoomIn" class="btn-icon" title="Zoom In">
                            <i class="fas fa-search-plus"></i>
                        </button>
                        <button id="zoomOut" class="btn-icon" title="Zoom Out">
                            <i class="fas fa-search-minus"></i>
                        </button>
                        <button id="zoomFit" class="btn-icon" title="Fit to Screen">
                            <i class="fas fa-expand-arrows-alt"></i>
                        </button>
                        <span class="zoom-level">100%</span>
                    </div>
                    <div class="toolbar-right">
                        <button id="gridToggle" class="btn-icon active" title="Toggle Grid">
                            <i class="fas fa-th"></i>
                        </button>
                    </div>
                </div>
                
                <div class="enhanced-canvas-wrapper">
                    <svg id="rackDesignSVG" class="rack-design-svg" viewBox="0 0 1200 800">
                        <defs>
                            <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#e2e8f0" stroke-width="1" opacity="0.3"/>
                            </pattern>
                            <linearGradient id="deviceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="white" stop-opacity="0.3"/>
                                <stop offset="100%" stop-color="white" stop-opacity="0.1"/>
                            </linearGradient>
                            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.2"/>
                            </filter>
                        </defs>
                        
                        <!-- Grid background -->
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        <!-- Main canvas group -->
                        <g id="mainCanvasGroup" transform="translate(50, 50) scale(1)">
                            <!-- Content will be rendered here -->
                        </g>
                    </svg>
                </div>
            `;
        }

        // Update sidebar to match the example style
        this.updateSidebar();
        
        // Initialize transform to sync with initial pan values
        this.updateTransform();
    }

    updateSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        sidebar.innerHTML = `
            <div class="enhanced-sidebar-header">
                <h3><i class="fas fa-th-large"></i> Component Library</h3>
            </div>
            
            <div class="enhanced-equipment-categories">
                <div class="category-section">
                    <div class="category-header" data-category="infrastructure">
                        <span class="category-icon">🏗️</span>
                        <span class="category-name">Infrastructure</span>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="category-items">
                        <div class="sub-category-section">
                            <div class="sub-category-header" data-subcategory="open-racks">
                                <span class="sub-category-icon">📦</span>
                                <span class="sub-category-name">Open Frame Racks</span>
                                <span class="sub-category-toggle">▼</span>
                            </div>
                            <div class="sub-category-items">
                                <div class="equipment-item" data-type="open-rack-42u" data-category="infrastructure">
                                    <div class="item-color" style="background-color: #374151;"></div>
                                    <div class="item-info">
                                        <div class="item-name">42U Open Rack</div>
                                        <div class="item-description">2-post open frame rack</div>
                                    </div>
                                </div>
                                <div class="equipment-item" data-type="open-rack-24u" data-category="infrastructure">
                                    <div class="item-color" style="background-color: #4B5563;"></div>
                                    <div class="item-info">
                                        <div class="item-name">24U Open Rack</div>
                                        <div class="item-description">2-post open frame rack</div>
                                    </div>
                                </div>
                                <div class="equipment-item" data-type="open-rack-12u" data-category="infrastructure">
                                    <div class="item-color" style="background-color: #6B7280;"></div>
                                    <div class="item-info">
                                        <div class="item-name">12U Open Rack</div>
                                        <div class="item-description">2-post wall mount rack</div>
                                    </div>
                                </div>
                                <div class="equipment-item" data-type="open-rack-9u" data-category="infrastructure">
                                    <div class="item-color" style="background-color: #9CA3AF;"></div>
                                    <div class="item-info">
                                        <div class="item-name">9U Open Rack</div>
                                        <div class="item-description">2-post compact rack</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="sub-category-section">
                            <div class="sub-category-header" data-subcategory="enclosed-racks">
                                <span class="sub-category-icon">🏢</span>
                                <span class="sub-category-name">Enclosed Racks</span>
                                <span class="sub-category-toggle">▼</span>
                            </div>
                            <div class="sub-category-items">
                                <div class="equipment-item" data-type="enclosed-rack-42u" data-category="infrastructure">
                                    <div class="item-color" style="background-color: #1F2937;"></div>
                                    <div class="item-info">
                                        <div class="item-name">42U Enclosed Rack</div>
                                        <div class="item-description">Full cabinet server rack</div>
                                    </div>
                                </div>
                                <div class="equipment-item" data-type="enclosed-rack-24u" data-category="infrastructure">
                                    <div class="item-color" style="background-color: #374151;"></div>
                                    <div class="item-info">
                                        <div class="item-name">24U Enclosed Rack</div>
                                        <div class="item-description">Half height cabinet rack</div>
                                    </div>
                                </div>
                                <div class="equipment-item" data-type="enclosed-rack-12u" data-category="infrastructure">
                                    <div class="item-color" style="background-color: #4B5563;"></div>
                                    <div class="item-info">
                                        <div class="item-name">12U Enclosed Rack</div>
                                        <div class="item-description">Wall mount cabinet rack</div>
                                    </div>
                                </div>
                                <div class="equipment-item" data-type="enclosed-rack-9u" data-category="infrastructure">
                                    <div class="item-color" style="background-color: #6B7280;"></div>
                                    <div class="item-info">
                                        <div class="item-name">9U Enclosed Rack</div>
                                        <div class="item-description">Compact cabinet rack</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="sub-category-section">
                            <div class="sub-category-header" data-subcategory="managers">
                                <span class="sub-category-icon">📚</span>
                                <span class="sub-category-name">Cable Managers</span>
                                <span class="sub-category-toggle">▼</span>
                            </div>
                            <div class="sub-category-items">
                                <div class="equipment-item" data-type="vertical-manager-6" data-category="infrastructure">
                                    <div class="item-color" style="background-color: #059669;"></div>
                                    <div class="item-info">
                                        <div class="item-name">6" Vertical Manager</div>
                                        <div class="item-description">Side cable management</div>
                                    </div>
                                </div>
                                <div class="equipment-item" data-type="vertical-manager-10" data-category="infrastructure">
                                    <div class="item-color" style="background-color: #047857;"></div>
                                    <div class="item-info">
                                        <div class="item-name">10" Vertical Manager</div>
                                        <div class="item-description">Large side cable management</div>
                                    </div>
                                </div>
                                <div class="equipment-item" data-type="horizontal-manager-1u" data-category="infrastructure" data-height="1">
                                    <div class="item-color" style="background-color: #0891B2;"></div>
                                    <div class="item-info">
                                        <div class="item-name">1U Horizontal Manager</div>
                                        <div class="item-description">Front cable management</div>
                                    </div>
                                </div>
                                <div class="equipment-item" data-type="horizontal-manager-2u" data-category="infrastructure" data-height="2">
                                    <div class="item-color" style="background-color: #1D4ED8;"></div>
                                    <div class="item-info">
                                        <div class="item-name">2U Horizontal Manager</div>
                                        <div class="item-description">Front cable management</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="category-section">
                    <div class="category-header" data-category="misc">
                        <span class="category-icon">🔧</span>
                        <span class="category-name">Miscellaneous</span>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="category-items">
                        <div class="equipment-item" data-type="blanking-plate-1u" data-category="misc" data-height="1">
                            <div class="item-color" style="background-color: #7C3AED;"></div>
                            <div class="item-info">
                                <div class="item-name">1U Blanking Plate</div>
                                <div class="item-description">Rack filler panel</div>
                            </div>
                        </div>
                        <div class="equipment-item" data-type="blanking-plate-2u" data-category="misc" data-height="2">
                            <div class="item-color" style="background-color: #BE185D;"></div>
                            <div class="item-info">
                                <div class="item-name">2U Blanking Plate</div>
                                <div class="item-description">Rack filler panel</div>
                            </div>
                        </div>
                        <div class="equipment-item" data-type="empty-space-1u" data-category="misc" data-height="1">
                            <div class="item-color" style="background-color: #F3F4F6;"></div>
                            <div class="item-info">
                                <div class="item-name">1U Empty Space</div>
                                <div class="item-description">Reserved rack unit</div>
                            </div>
                        </div>
                        <div class="equipment-item" data-type="shelf-1u" data-category="misc" data-height="1">
                            <div class="item-color" style="background-color: #92400E;"></div>
                            <div class="item-info">
                                <div class="item-name">1U Shelf</div>
                                <div class="item-description">Equipment shelf</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="category-section">
                    <div class="category-header" data-category="switches">
                        <span class="category-icon">🔌</span>
                        <span class="category-name">Switches</span>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="category-items">
                        <div class="equipment-item" data-type="cisco-c9200l-24t-4g" data-height="1">
                            <div class="item-color" style="background-color: #D1D5DB;"></div>
                            <div class="item-info">
                                <div class="item-name">Cisco 24-Port Switch</div>
                                <div class="item-description">1U • 24 ports</div>
                            </div>
                        </div>
                        <div class="equipment-item" data-type="cisco-c9200l-48p-4g" data-height="1">
                            <div class="item-color" style="background-color: #D1D5DB;"></div>
                            <div class="item-info">
                                <div class="item-name">Cisco 48-Port Switch</div>
                                <div class="item-description">1U • 48 ports</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="category-section">
                    <div class="category-header" data-category="routers">
                        <span class="category-icon">🚀</span>
                        <span class="category-name">Routers</span>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="category-items">
                        <div class="equipment-item" data-type="cisco-isr4331" data-height="1">
                            <div class="item-color" style="background-color: #60A5FA;"></div>
                            <div class="item-info">
                                <div class="item-name">Cisco ISR4331</div>
                                <div class="item-description">1U • Router</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="category-section">
                    <div class="category-header" data-category="firewalls">
                        <span class="category-icon">🔥</span>
                        <span class="category-name">Firewalls</span>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="category-items">
                        <div class="equipment-item" data-type="cisco-asa5516-x" data-height="1">
                            <div class="item-color" style="background-color: #EF4444;"></div>
                            <div class="item-info">
                                <div class="item-name">Cisco ASA5516-X</div>
                                <div class="item-description">1U • Firewall</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="category-section">
                    <div class="category-header" data-category="pdus">
                        <span class="category-icon">⚡</span>
                        <span class="category-name">Power Distribution</span>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="category-items">
                        <div class="equipment-item" data-type="apc-ap8941" data-height="2">
                            <div class="item-color" style="background-color: #F59E0B;"></div>
                            <div class="item-info">
                                <div class="item-name">APC AP8941 PDU</div>
                                <div class="item-description">2U • 30 outlets</div>
                            </div>
                        </div>
                        <div class="equipment-item" data-type="tripp-lite-pdumh30hvt" data-height="1">
                            <div class="item-color" style="background-color: #D97706;"></div>
                            <div class="item-info">
                                <div class="item-name">Tripp Lite PDU</div>
                                <div class="item-description">1U • 12 outlets</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="category-section">
                    <div class="category-header" data-category="connectivity">
                        <span class="category-icon">🔌</span>
                        <span class="category-name">Connectivity</span>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="category-items">
                        <div class="equipment-item" data-type="patch-panel-24-port" data-height="1">
                            <div class="item-color" style="background-color: #4A5568;"></div>
                            <div class="item-info">
                                <div class="item-name">24-Port Patch Panel</div>
                                <div class="item-description">1U • 24 ports</div>
                            </div>
                        </div>
                        <div class="equipment-item" data-type="patch-panel-48-port" data-height="2">
                            <div class="item-color" style="background-color: #4A5568;"></div>
                            <div class="item-info">
                                <div class="item-name">48-Port Patch Panel</div>
                                <div class="item-description">2U • 48 ports</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="selection-info">
                <div id="deviceSelected" class="selection-message" style="display: none;">
                    <p><strong>Device Selected</strong></p>
                    <button id="deleteDevice" class="delete-btn">Delete Device</button>
                    <p style="font-size: 11px; margin-top: 4px;">Or press Delete key</p>
                </div>
                <div id="infrastructureSelected" class="selection-message" style="display: none;">
                    <p><strong>Infrastructure Selected</strong></p>
                    <button id="deleteInfrastructure" class="delete-btn">Delete Infrastructure</button>
                    <p style="font-size: 11px; margin-top: 4px;">Or press Delete key</p>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const svg = document.getElementById('rackDesignSVG');
        if (!svg) return;

        // Mouse events for panning and selection
        svg.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        svg.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        svg.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        svg.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        svg.addEventListener('click', (e) => this.handleClick(e));

        // Drag and drop
        svg.addEventListener('dragover', (e) => this.handleDragOver(e));
        svg.addEventListener('drop', (e) => this.handleDrop(e));
        svg.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        document.addEventListener('dragend', (e) => this.handleDragEnd(e));

        // Sidebar interactions
        this.setupSidebarEvents();

        // Keyboard
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Zoom controls
        document.getElementById('zoomIn')?.addEventListener('click', () => this.handleZoom('in'));
        document.getElementById('zoomOut')?.addEventListener('click', () => this.handleZoom('out'));
        document.getElementById('zoomFit')?.addEventListener('click', () => this.handleFitAll());

        // Delete buttons
        document.getElementById('deleteDevice')?.addEventListener('click', () => {
            if (this.selectedDevice) {
                this.deleteDevice(this.selectedDevice);
            }
        });
        document.getElementById('deleteInfrastructure')?.addEventListener('click', () => {
            if (this.selectedInfrastructure) {
                this.deleteInfrastructure(this.selectedInfrastructure);
            }
        });

        // Initial render
        this.render();
    }

    setupSidebarEvents() {
        // Category toggles
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.toggleCategory(category);
            });
        });

        // Sub-category toggles
        document.querySelectorAll('.sub-category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const subcategory = e.currentTarget.dataset.subcategory;
                this.toggleSubCategory(subcategory);
            });
        });

        // Equipment items drag
        document.querySelectorAll('.equipment-item').forEach(item => {
            item.setAttribute('draggable', 'true');
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
        });
    }

    toggleCategory(category) {
        const header = document.querySelector(`[data-category="${category}"]`);
        const items = header.parentElement.querySelector('.category-items');
        const toggle = header.querySelector('.category-toggle');
        
        if (items.style.display === 'none') {
            items.style.display = 'block';
            toggle.textContent = '▼';
        } else {
            items.style.display = 'none';
            toggle.textContent = '▶';
        }
    }

    toggleSubCategory(subcategory) {
        const header = document.querySelector(`[data-subcategory="${subcategory}"]`);
        const items = header.parentElement.querySelector('.sub-category-items');
        const toggle = header.querySelector('.sub-category-toggle');
        
        if (items.style.display === 'none') {
            items.style.display = 'block';
            toggle.textContent = '▼';
        } else {
            items.style.display = 'none';
            toggle.textContent = '▶';
        }
    }

    handleDragStart(e) {
        const type = e.target.closest('.equipment-item').dataset.type;
        const height = parseInt(e.target.closest('.equipment-item').dataset.height) || 1;
        const isInfrastructure = e.target.closest('.equipment-item').dataset.category === 'infrastructure';

        this.draggedDevice = {
            type: type,
            height: height,
            isInfrastructure: isInfrastructure
        };

        // Store in dataTransfer as backup
        e.dataTransfer.setData('application/json', JSON.stringify(this.draggedDevice));
        e.dataTransfer.effectAllowed = 'copy';
        console.log('DataTransfer set with:', JSON.stringify(this.draggedDevice));

        // Create invisible drag image positioned at cursor
        const dragImage = document.createElement('div');
        dragImage.style.width = '1px';
        dragImage.style.height = '1px';
        dragImage.style.backgroundColor = 'transparent';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        
        // Clean up drag image after a short delay
        setTimeout(() => {
            if (document.body.contains(dragImage)) {
                document.body.removeChild(dragImage);
            }
        }, 1000);

        console.log('Drag started:', this.draggedDevice);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        // Only log occasionally to avoid spam
        if (Math.random() < 0.01) {
            console.log('DragOver - draggedDevice exists:', !!this.draggedDevice);
        }

        if (!this.draggedDevice) return;

        // Get SVG element and use its coordinate system  
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        
        // Calculate coordinates relative to the SVG, then transform to world coordinates
        const svgX = e.clientX - rect.left;
        const svgY = e.clientY - rect.top;
        
        // Apply inverse transform to get world coordinates
        const worldX = (svgX - this.pan.x) / this.zoom;
        const worldY = (svgY - this.pan.y) / this.zoom;

        this.dragPosition = { x: worldX, y: worldY };
        
        // Debug drag position
        if (Math.random() < 0.05) { // Log occasionally to avoid spam
            console.log('Drag position debug:', {
                clientX: e.clientX,
                clientY: e.clientY,
                rectLeft: rect.left,
                rectTop: rect.top,
                panX: this.pan.x,
                panY: this.pan.y,
                zoom: this.zoom,
                worldX: worldX,
                worldY: worldY
            });
        }

        // Calculate valid drop zones for devices
        if (!this.draggedDevice.isInfrastructure) {
            const targetRack = this.findRackAtPosition(worldX, worldY);
            if (targetRack) {
                this.validDropZones = this.calculateValidDropZones(this.draggedDevice.height, targetRack.id);
                // Only log occasionally to avoid spam
                if (Math.random() < 0.1) {
                    console.log(`Drag over rack ${targetRack.id}, valid zones:`, this.validDropZones);
                }
            } else {
                this.validDropZones = [];
            }
        }

        this.render();
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('=== DROP EVENT FIRED ===');
        console.log('Drop detected - draggedDevice:', this.draggedDevice);

        // Try to get device from instance variable first, then from dataTransfer
        let deviceData = this.draggedDevice;
        
        if (!deviceData) {
            try {
                const transferData = e.dataTransfer.getData('application/json');
                if (transferData) {
                    deviceData = JSON.parse(transferData);
                    console.log('Retrieved device from dataTransfer:', deviceData);
                }
            } catch (error) {
                console.error('Error parsing drag data:', error);
            }
        }

        if (!deviceData) {
            console.log('No dragged device found in instance or dataTransfer');
            return;
        }

        // Get SVG element and use its coordinate system
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        
        // Calculate coordinates relative to the SVG, then transform to world coordinates
        const svgX = e.clientX - rect.left;
        const svgY = e.clientY - rect.top;
        
        // Apply inverse transform to get world coordinates
        const worldX = (svgX - this.pan.x) / this.zoom;
        const worldY = (svgY - this.pan.y) / this.zoom;

        console.log(`Drop position: ${worldX}, ${worldY}`);

        if (deviceData.isInfrastructure) {
            console.log('Adding infrastructure');
            this.addInfrastructure(deviceData.type, worldX, worldY);
        } else {
            // For devices, ensure we snap to valid rack positions
            const targetRack = this.findRackAtPosition(worldX, worldY);
            console.log('Target rack:', targetRack);
            console.log('Valid drop zones:', this.validDropZones);
            
            if (targetRack && this.validDropZones.length > 0) {
                console.log('=== CALLING addDevice ===');
                console.log('Device data:', deviceData);
                console.log('Position:', worldX, worldY);
                this.addDevice(deviceData, worldX, worldY);
            } else {
                console.log('Invalid drop position - cancelling drag operation');
                console.log(`Target rack found: ${!!targetRack}, Valid zones: ${this.validDropZones.length}`);
                // Don't place device anywhere - just cancel the drag
            }
        }

        this.draggedDevice = null;
        this.validDropZones = [];
        this.render();
    }

    handleDragLeave(e) {
        // Only clear if leaving the SVG entirely (not just moving between child elements)
        if (!e.currentTarget.contains(e.relatedTarget)) {
            console.log('Drag left canvas area');
        }
    }

    handleDragEnd(e) {
        console.log('Drag operation ended');
        // Always clear drag state when drag ends, regardless of where it happened
        if (this.draggedDevice) {
            console.log('Cleaning up drag state');
            this.draggedDevice = null;
            this.validDropZones = [];
            this.render();
        }
    }

    addInfrastructure(type, x, y) {
        // Handle different rack types and sizes
        if (type.startsWith('open-rack') || type.startsWith('enclosed-rack')) {
            let rackHeight = 42; // Default to 42U
            let isEnclosed = type.startsWith('enclosed-rack');
            
            if (type.includes('24u')) rackHeight = 24;
            else if (type.includes('12u')) rackHeight = 12;
            else if (type.includes('9u')) rackHeight = 9;
            
            // Position new rack based on drop position relative to existing racks
            const existingRacks = this.racks;
            let newX = x; // Start with drop position
            let newY = existingRacks.length > 0 ? existingRacks[0].y : 200;
            
            if (existingRacks.length > 0) {
                // Find the nearest rack to determine placement
                const nearestRack = this.findNearestRack(x, y);
                
                if (nearestRack) {
                    const rackCenterX = nearestRack.x + this.RACK_WIDTH / 2;
                    
                    // Calculate the full rendered width of each rack including extensions
                    const getNearestRackWidth = () => {
                        if (nearestRack.isEnclosed) {
                            return this.RACK_WIDTH + 60; // Cabinet extends 30px each side
                        } else {
                            return this.RACK_WIDTH + 30; // Posts extend 15px each side
                        }
                    };
                    
                    const getNewRackWidth = () => {
                        if (isEnclosed) {
                            return this.RACK_WIDTH + 60; // Cabinet extends 30px each side
                        } else {
                            return this.RACK_WIDTH + 30; // Posts extend 15px each side
                        }
                    };
                    
                    // Calculate left and right edges of nearest rack
                    const nearestRackLeftEdge = nearestRack.isEnclosed ? 
                        nearestRack.x - 30 : nearestRack.x - 15;
                    const nearestRackRightEdge = nearestRackLeftEdge + getNearestRackWidth();
                    
                    console.log('Positioning debug:', {
                        nearestRack: nearestRack.id,
                        nearestRackX: nearestRack.x,
                        nearestRackLeftEdge,
                        nearestRackRightEdge,
                        newRackType: type,
                        isEnclosed,
                        newRackWidth: getNewRackWidth()
                    });
                    
                    // Check if there are managers that might need space
                    const hasManagers = this.managers.length > 0;
                    
                    if (hasManagers) {
                        // Find managers near the nearest rack to determine actual spacing needed
                        const managersNearRack = this.managers.filter(manager => {
                            const managerDistance = Math.abs(manager.x - nearestRack.x);
                            return managerDistance < 200; // Within 200px of the rack
                        });
                        
                        if (managersNearRack.length > 0) {
                            // There are managers near this rack, position carefully
                            if (x < rackCenterX) {
                                // Placing to the left - find leftmost manager and place rack to its left
                                const leftmostManager = managersNearRack.reduce((leftmost, manager) => 
                                    manager.x < leftmost.x ? manager : leftmost);
                                const managerWidth = leftmostManager.width || this.MANAGER_WIDTH_6;
                                // Manager's left edge should touch rack's right edge
                                const newRackWidth = getNewRackWidth();
                                newX = leftmostManager.x - newRackWidth + (isEnclosed ? 30 : 15);
                                console.log('Left manager positioning:', { leftmostManager: leftmostManager.id, managerX: leftmostManager.x, newRackWidth, newX });
                            } else {
                                // Placing to the right - find rightmost manager and place rack to its right
                                const rightmostManager = managersNearRack.reduce((rightmost, manager) => 
                                    manager.x > rightmost.x ? manager : rightmost);
                                const managerWidth = rightmostManager.width || this.MANAGER_WIDTH_6;
                                const rightEdge = rightmostManager.x + managerWidth;
                                newX = rightEdge + (isEnclosed ? 30 : 15);
                                console.log('Manager positioning:', { rightmostManager: rightmostManager.id, rightEdge, managerWidth, newX });
                            }
                        } else {
                            // No managers near this rack, use standard spacing
                            const spacing = this.RACK_WIDTH + 40; // Reduced spacing
                            if (x < rackCenterX) {
                                newX = nearestRack.x - spacing;
                            } else {
                                newX = nearestRack.x + spacing;
                            }
                        }
                    } else {
                        // Calculate edge-to-edge positioning
                        if (x < rackCenterX) {
                            // Place to the left - new rack's right edge should touch nearest rack's left edge
                            const newRackWidth = getNewRackWidth();
                            const newRackLeftEdge = nearestRackLeftEdge - newRackWidth;
                            // Convert from left edge to rack x position
                            newX = newRackLeftEdge + (isEnclosed ? 30 : 15);
                            console.log('Left placement:', { newRackLeftEdge, newX });
                        } else {
                            // Place to the right - new rack's left edge should touch nearest rack's right edge  
                            // Convert from edge position to rack x position
                            newX = nearestRackRightEdge + (isEnclosed ? 30 : 15);
                            console.log('Right placement:', { nearestRackRightEdge, newX });
                        }
                    }
                    // Align vertically, but respect floor baseline for 42U racks
                    if (rackHeight === 42 && this.floorBaseline) {
                        if (isEnclosed) {
                            // Enclosed 42U racks sit on top of the floor baseline  
                            newY = this.floorBaseline - (rackHeight * this.UNIT_HEIGHT) - 30; // -30 for base plate
                        } else {
                            // Open 42U racks share the same floor baseline
                            newY = this.floorBaseline - (rackHeight * this.UNIT_HEIGHT) - 30;
                        }
                    } else {
                        newY = nearestRack.y; // Align with nearest rack for smaller racks
                    }
                } else {
                    // No nearby rack, find rightmost and place to the right
                    const rightmostRack = existingRacks.reduce((rightmost, rack) => {
                        const rackRightEdge = rack.isEnclosed ? 
                            rack.x + this.RACK_WIDTH + 30 : rack.x + this.RACK_WIDTH + 15;
                        const rightmostRightEdge = rightmost.isEnclosed ? 
                            rightmost.x + this.RACK_WIDTH + 30 : rightmost.x + this.RACK_WIDTH + 15;
                        return rackRightEdge > rightmostRightEdge ? rack : rightmost;
                    });
                    
                    // Calculate rightmost rack's actual right edge
                    const rightmostRackWidth = rightmostRack.isEnclosed ? 
                        this.RACK_WIDTH + 60 : this.RACK_WIDTH + 30;
                    const rightmostRackLeftEdge = rightmostRack.isEnclosed ? 
                        rightmostRack.x - 30 : rightmostRack.x - 15;
                    const rightmostRackRightEdge = rightmostRackLeftEdge + rightmostRackWidth;
                    
                    // Position new rack just to the right of the rightmost rack
                    newX = rightmostRackRightEdge + (isEnclosed ? 30 : 15);
                }
            }

            // Determine mounting type for smaller racks (9U, 12U, 24U)
            let mounting = 'floor'; // Default to floor mounting
            if (rackHeight < 42) {
                // For smaller racks, determine mounting based on drop position
                const dropY = y;
                const canvasHeight = 800; // Assume canvas height
                const middleY = canvasHeight / 2;
                
                if (dropY < middleY) {
                    mounting = 'ceiling'; // Dropped in upper half
                } else {
                    mounting = 'floor'; // Dropped in lower half
                }
            }

            const newRack = {
                id: `rack-${Date.now()}`,
                type: 'rack',
                rackType: type,
                height: rackHeight,
                isEnclosed: isEnclosed,
                mounting: mounting,
                x: newX,
                y: newY
            };

            this.racks.push(newRack);
            console.log('Added new rack:', newRack);
        } else if (type === 'vertical-manager-6' || type === 'vertical-manager-10') {
            // Position manager to snap to the left edge of the nearest rack
            const nearestRack = this.findNearestRack(x, y);
            let newX = x;
            let newY = y;

            // Determine manager width based on type
            const managerWidth = type === 'vertical-manager-10' ? this.MANAGER_WIDTH_10 : this.MANAGER_WIDTH_6;

            if (nearestRack) {
                // Check if the nearest rack is enclosed - prevent manager placement
                if (nearestRack.isEnclosed) {
                    console.log('Cannot place vertical manager on enclosed rack:', nearestRack.id);
                    return; // Exit without placing the manager
                }

                // Determine if placing on left or right side based on drop position
                const rackCenterX = nearestRack.x + this.RACK_WIDTH / 2;
                if (x < rackCenterX) {
                    // Place on left side - position outside the left post
                    newX = nearestRack.x - 15 - managerWidth;
                } else {
                    // Place on right side - position outside the right post  
                    newX = nearestRack.x + this.RACK_WIDTH + 15;
                }
                // Align vertically with the rack
                newY = nearestRack.y;
            } else {
                // If no rack nearby, try to find any rack and position relative to it
                if (this.racks.length > 0) {
                    const firstRack = this.racks[0];
                    // Check if first rack is enclosed
                    if (firstRack.isEnclosed) {
                        console.log('Cannot place vertical manager - only enclosed racks available');
                        return; // Exit without placing the manager
                    }
                    newX = firstRack.x - 15 - managerWidth;
                    newY = firstRack.y;
                }
            }

            const newManager = {
                id: `manager-${Date.now()}`,
                type: 'manager',
                managerType: type,
                width: managerWidth,
                x: newX,
                y: newY
            };

            this.managers.push(newManager);
            console.log('Added new manager:', newManager);
        } else if (type.startsWith('horizontal-manager') || type.startsWith('blanking-plate') || type.startsWith('empty-space') || type.startsWith('shelf')) {
            // Handle horizontal managers and blanking plates - these go into racks like devices
            const targetRack = this.findRackAtPosition(x, y);
            if (targetRack) {
                const relativeY = y - targetRack.y;
                const targetUnit = Math.max(1, Math.min(targetRack.height || this.RACK_HEIGHT, 
                    Math.floor(relativeY / this.UNIT_HEIGHT) + 1));
                
                // Determine device height
                let deviceHeight = 1;
                if (type.includes('2u')) deviceHeight = 2;
                
                const newDevice = {
                    id: `${type}-${Date.now()}`,
                    type: type,
                    height: deviceHeight,
                    rackId: targetRack.id,
                    startUnit: targetUnit,
                    isInfrastructure: true
                };
                
                this.devices.push(newDevice);
                console.log('Added infrastructure device:', newDevice);
            }
        }
    }

    addDevice(draggedDevice, x, y) {
        console.log('addDevice called with:', draggedDevice, x, y);
        
        const targetRack = this.findRackAtPosition(x, y);
        console.log('Found target rack:', targetRack);
        
        if (!targetRack || this.validDropZones.length === 0) {
            console.log('Invalid drop position for device - no valid rack or zones');
            console.log(`Target rack: ${!!targetRack}, Valid zones: ${this.validDropZones.length}`);
            return;
        }

        // Calculate which rack unit the drop position corresponds to
        const relativeY = y - targetRack.y;
        const idealTargetUnit = Math.max(1, Math.min(this.RACK_HEIGHT - draggedDevice.height + 1, 
            Math.floor(relativeY / this.UNIT_HEIGHT) + 1));

        console.log(`Relative Y: ${relativeY}, Ideal target unit: ${idealTargetUnit}`);

        // Find the closest valid drop zone to the ideal position
        const targetUnit = this.findClosestValidZone(idealTargetUnit, this.validDropZones);
        console.log('Target unit after finding closest valid zone:', targetUnit);

        if (targetUnit) {
            console.log(`Placing device at rack unit ${targetUnit} in rack ${targetRack.id}`);
            
            const newDevice = {
                id: `${draggedDevice.type}-${Date.now()}`,
                type: draggedDevice.type,
                height: draggedDevice.height,
                rackId: targetRack.id,
                startUnit: targetUnit,
                x: targetRack.x,
                y: targetRack.y + (targetUnit - 1) * this.UNIT_HEIGHT,
                name: draggedDevice.type // Add name for display
            };

            this.devices.push(newDevice);
            console.log('Added new device to state:', newDevice);
            console.log('Total devices in state:', this.devices.length);
        } else {
            console.log('No valid unit position found for device');
        }
    }

    findRackAtPosition(x, y) {
        return this.racks.find(rack => {
            // Calculate actual rendered bounds of the rack
            const leftEdge = rack.isEnclosed ? rack.x - 30 : rack.x - 15;
            const rackWidth = rack.isEnclosed ? this.RACK_WIDTH + 60 : this.RACK_WIDTH + 30;
            const rightEdge = leftEdge + rackWidth;
            const topEdge = rack.y - 10;
            const bottomEdge = rack.y + (rack.height || this.RACK_HEIGHT) * this.UNIT_HEIGHT + 10;
            
            return x >= leftEdge && x <= rightEdge && y >= topEdge && y <= bottomEdge;
        });
    }

    findNearestRack(x, y) {
        if (this.racks.length === 0) return null;
        
        return this.racks.reduce((nearest, rack) => {
            const distance = Math.sqrt(Math.pow(rack.x - x, 2) + Math.pow(rack.y - y, 2));
            const nearestDistance = Math.sqrt(Math.pow(nearest.x - x, 2) + Math.pow(nearest.y - y, 2));
            return distance < nearestDistance ? rack : nearest;
        });
    }

    calculateValidDropZones(deviceHeight, rackId) {
        const rackDevices = this.devices.filter(d => d.rackId === rackId);
        const zones = [];
        
        const targetRack = this.racks.find(r => r.id === rackId);
        for (let unit = 1; unit <= (targetRack?.height || this.RACK_HEIGHT) - deviceHeight + 1; unit++) {
            let hasConflict = false;
            
            for (const device of rackDevices) {
                const existingStart = device.startUnit;
                const existingEnd = device.startUnit + device.height - 1;
                const newStart = unit;
                const newEnd = unit + deviceHeight - 1;
                
                if (newStart <= existingEnd && newEnd >= existingStart) {
                    hasConflict = true;
                    break;
                }
            }
            
            if (!hasConflict) {
                zones.push(unit);
            }
        }
        
        return zones;
    }

    findClosestValidZone(targetUnit, validZones) {
        if (validZones.length === 0) return null;
        
        return validZones.reduce((closest, zone) => {
            const currentDistance = Math.abs(zone - targetUnit);
            const closestDistance = Math.abs(closest - targetUnit);
            return currentDistance < closestDistance ? zone : closest;
        });
    }

    handleMouseDown(e) {
        if (e.button === 0 && !this.draggedDevice) {
            this.isMouseDown = true;
            this.lastPanPoint = { x: e.clientX, y: e.clientY };
        }
    }

    handleMouseMove(e) {
        if (this.isMouseDown) {
            const deltaX = e.clientX - this.lastPanPoint.x;
            const deltaY = e.clientY - this.lastPanPoint.y;
            
            this.pan.x += deltaX;
            this.pan.y += deltaY;
            
            this.lastPanPoint = { x: e.clientX, y: e.clientY };
            this.updateTransform();
        }
    }

    handleMouseUp(e) {
        this.isMouseDown = false;
    }

    handleClick(e) {
        // Don't handle clicks during drag operations or panning
        if (this.draggedDevice || this.isMouseDown) return;

        // Get the clicked element
        const target = e.target.closest('.device-element, .rack-element, .manager-element');
        
        if (target) {
            const elementId = target.getAttribute('data-id');
            const elementType = target.getAttribute('class');
            
            // Clear previous selections
            this.selectedDevice = null;
            this.selectedInfrastructure = null;
            
            if (elementType.includes('device-element')) {
                this.selectedDevice = elementId;
                console.log('Selected device:', elementId);
            } else if (elementType.includes('rack-element') || elementType.includes('manager-element')) {
                this.selectedInfrastructure = elementId;
                console.log('Selected infrastructure:', elementId);
            }
        } else {
            // Clicked on empty space, clear selections
            this.selectedDevice = null;
            this.selectedInfrastructure = null;
        }
        
        this.updateSelectionDisplay();
        this.render(); // Re-render to show selection highlights
    }

    handleZoom(direction) {
        const zoomFactor = 1.2;
        if (direction === 'in') {
            this.zoom = Math.min(this.zoom * zoomFactor, 3);
        } else if (direction === 'out') {
            this.zoom = Math.max(this.zoom / zoomFactor, 0.25);
        }
        this.updateTransform();
        this.updateZoomDisplay();
    }

    handleFitAll() {
        // Calculate bounds of all elements
        const allElements = [...this.racks, ...this.managers];
        if (allElements.length === 0) return;

        const bounds = allElements.reduce((acc, element) => {
            let width;
            if (element.type === 'rack') {
                width = this.RACK_WIDTH;
            } else {
                // Manager - use stored width or default to 6"
                width = element.width || this.MANAGER_WIDTH_6;
            }
            const height = this.RACK_HEIGHT * this.UNIT_HEIGHT;
            
            return {
                minX: Math.min(acc.minX, element.x),
                maxX: Math.max(acc.maxX, element.x + width),
                minY: Math.min(acc.minY, element.y),
                maxY: Math.max(acc.maxY, element.y + height)
            };
        }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });

        const svg = document.getElementById('rackDesignSVG');
        const svgRect = svg.getBoundingClientRect();
        
        const contentWidth = bounds.maxX - bounds.minX;
        const contentHeight = bounds.maxY - bounds.minY;
        const availableWidth = svgRect.width - 100;
        const availableHeight = svgRect.height - 100;
        
        const scaleX = availableWidth / contentWidth;
        const scaleY = availableHeight / contentHeight;
        this.zoom = Math.min(scaleX, scaleY, 1.5);
        
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;
        this.pan = {
            x: svgRect.width / 2 - centerX * this.zoom,
            y: svgRect.height / 2 - centerY * this.zoom
        };
        
        this.updateTransform();
        this.updateZoomDisplay();
    }

    handleKeyDown(e) {
        if (e.key === 'Delete') {
            if (this.selectedDevice) {
                this.deleteDevice(this.selectedDevice);
            } else if (this.selectedInfrastructure) {
                this.deleteInfrastructure(this.selectedInfrastructure);
            }
        } else if (e.key === 'Escape') {
            this.selectedDevice = null;
            this.selectedInfrastructure = null;
            this.updateSelectionDisplay();
        }
    }

    deleteDevice(deviceId) {
        this.devices = this.devices.filter(d => d.id !== deviceId);
        this.selectedDevice = null;
        this.updateSelectionDisplay();
        this.render();
    }

    deleteInfrastructure(infrastructureId) {
        this.racks = this.racks.filter(r => r.id !== infrastructureId);
        this.managers = this.managers.filter(m => m.id !== infrastructureId);
        this.selectedInfrastructure = null;
        this.updateSelectionDisplay();
        this.render();
    }

    updateTransform() {
        const mainGroup = document.getElementById('mainCanvasGroup');
        if (mainGroup) {
            mainGroup.setAttribute('transform', `translate(${this.pan.x}, ${this.pan.y}) scale(${this.zoom})`);
        }
    }

    updateZoomDisplay() {
        const zoomDisplay = document.querySelector('.zoom-level');
        if (zoomDisplay) {
            zoomDisplay.textContent = `${Math.round(this.zoom * 100)}%`;
        }
    }

    updateSelectionDisplay() {
        const deviceSelected = document.getElementById('deviceSelected');
        const infrastructureSelected = document.getElementById('infrastructureSelected');
        
        if (deviceSelected) {
            deviceSelected.style.display = this.selectedDevice ? 'block' : 'none';
        }
        if (infrastructureSelected) {
            infrastructureSelected.style.display = this.selectedInfrastructure ? 'block' : 'none';
        }
        
        // Re-attach delete button event listeners since the DOM may have been updated
        const deleteDeviceBtn = document.getElementById('deleteDevice');
        const deleteInfraBtn = document.getElementById('deleteInfrastructure');
        
        if (deleteDeviceBtn) {
            deleteDeviceBtn.onclick = () => {
                if (this.selectedDevice) {
                    this.deleteDevice(this.selectedDevice);
                }
            };
        }
        
        if (deleteInfraBtn) {
            deleteInfraBtn.onclick = () => {
                if (this.selectedInfrastructure) {
                    this.deleteInfrastructure(this.selectedInfrastructure);
                }
            };
        }
    }

    render() {
        const mainGroup = document.getElementById('mainCanvasGroup');
        if (!mainGroup) return;

        // Clear existing content
        mainGroup.innerHTML = '';

        // Render grid background
        const gridRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        gridRect.setAttribute('x', '-1000');
        gridRect.setAttribute('y', '-1000');
        gridRect.setAttribute('width', '3000');
        gridRect.setAttribute('height', '3000');
        gridRect.setAttribute('fill', 'url(#grid)');
        mainGroup.appendChild(gridRect);

        // Render valid drop zones
        this.renderValidDropZones(mainGroup);

        // Render racks
        this.racks.forEach(rack => this.renderRack(mainGroup, rack));

        // Render managers
        this.managers.forEach(manager => this.renderManager(mainGroup, manager));

        // Render devices
        console.log(`Rendering ${this.devices.length} devices:`, this.devices);
        this.devices.forEach(device => this.renderDevice(mainGroup, device));

        // Render drag preview
        if (this.draggedDevice) {
            this.renderDragPreview(mainGroup);
        }
    }

    renderValidDropZones(parent) {
        if (!this.draggedDevice || this.draggedDevice.isInfrastructure || this.validDropZones.length === 0) return;

        const targetRack = this.findRackAtPosition(this.dragPosition.x, this.dragPosition.y);
        if (!targetRack) return;

        this.validDropZones.forEach(unit => {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', targetRack.x - 12);
            rect.setAttribute('y', targetRack.y + (unit - 1) * this.UNIT_HEIGHT);
            rect.setAttribute('width', this.RACK_WIDTH + 24);
            rect.setAttribute('height', this.draggedDevice.height * this.UNIT_HEIGHT);
            rect.setAttribute('fill', '#22c55e');
            rect.setAttribute('fill-opacity', '0.3');
            rect.setAttribute('stroke', '#22c55e');
            rect.setAttribute('stroke-width', '2');
            rect.setAttribute('stroke-dasharray', '8,4');
            rect.setAttribute('rx', '4');
            parent.appendChild(rect);
        });
    }

    renderRack(parent, rack) {
        const rackGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        rackGroup.setAttribute('class', 'rack-element');
        rackGroup.setAttribute('data-id', rack.id);

        // Make rack group clickable
        rackGroup.style.pointerEvents = 'auto';
        rackGroup.style.cursor = 'pointer';

        if (rack.isEnclosed) {
            // For enclosed racks, render cabinet shell first
            this.renderCabinetShell(rackGroup, rack);
            
            // Render mounting rails inside the cabinet (not posts)
            const leftRail = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            leftRail.setAttribute('x', rack.x - 8);
            leftRail.setAttribute('y', rack.y);
            leftRail.setAttribute('width', '8');
            leftRail.setAttribute('height', (rack.height || this.RACK_HEIGHT) * this.UNIT_HEIGHT);
            leftRail.setAttribute('fill', '#4A5568'); // Steel gray for rails
            leftRail.setAttribute('rx', '1');
            rackGroup.appendChild(leftRail);

            const rightRail = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rightRail.setAttribute('x', rack.x + this.RACK_WIDTH);
            rightRail.setAttribute('y', rack.y);
            rightRail.setAttribute('width', '8');
            rightRail.setAttribute('height', (rack.height || this.RACK_HEIGHT) * this.UNIT_HEIGHT);
            rightRail.setAttribute('fill', '#4A5568'); // Steel gray for rails
            rightRail.setAttribute('rx', '1');
            rackGroup.appendChild(rightRail);
        } else {
            // For open racks, render traditional posts and plates
            const leftPost = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            leftPost.setAttribute('x', rack.x - 15);
            leftPost.setAttribute('y', rack.y - 10);
            leftPost.setAttribute('width', '15');
            leftPost.setAttribute('height', (rack.height || this.RACK_HEIGHT) * this.UNIT_HEIGHT + 20);
            leftPost.setAttribute('fill', '#1f2937');
            leftPost.setAttribute('rx', '2');
            rackGroup.appendChild(leftPost);

            const rightPost = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rightPost.setAttribute('x', rack.x + this.RACK_WIDTH);
            rightPost.setAttribute('y', rack.y - 10);
            rightPost.setAttribute('width', '15');
            rightPost.setAttribute('height', (rack.height || this.RACK_HEIGHT) * this.UNIT_HEIGHT + 20);
            rightPost.setAttribute('fill', '#1f2937');
            rightPost.setAttribute('rx', '2');
            rackGroup.appendChild(rightPost);

            // Top and bottom plates for open racks only
            const topPlate = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            topPlate.setAttribute('x', rack.x - 15);
            topPlate.setAttribute('y', rack.y - 10);
            topPlate.setAttribute('width', this.RACK_WIDTH + 30);
            topPlate.setAttribute('height', '10');
            topPlate.setAttribute('fill', '#1f2937');
            topPlate.setAttribute('rx', '2');
            rackGroup.appendChild(topPlate);

            const bottomPlate = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bottomPlate.setAttribute('x', rack.x - 15);
            bottomPlate.setAttribute('y', rack.y + (rack.height || this.RACK_HEIGHT) * this.UNIT_HEIGHT);
            bottomPlate.setAttribute('width', this.RACK_WIDTH + 30);
            bottomPlate.setAttribute('height', '30'); // Tripled from 10 to 30
            bottomPlate.setAttribute('fill', '#1f2937');
            bottomPlate.setAttribute('rx', '2');
            rackGroup.appendChild(bottomPlate);
        }

        // Add mounting indicators for smaller racks (but only subtle brackets, no lines for open racks)
        if ((rack.height || this.RACK_HEIGHT) < 42 && rack.mounting) {
            if (rack.mounting === 'ceiling') {
                // Ceiling mounting brackets only for enclosed racks
                if (rack.isEnclosed) {
                    const ceilingBracket1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    ceilingBracket1.setAttribute('x', rack.x - 25);
                    ceilingBracket1.setAttribute('y', rack.y - 20);
                    ceilingBracket1.setAttribute('width', '10');
                    ceilingBracket1.setAttribute('height', '15');
                    ceilingBracket1.setAttribute('fill', '#374151');
                    ceilingBracket1.setAttribute('rx', '2');
                    rackGroup.appendChild(ceilingBracket1);

                    const ceilingBracket2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    ceilingBracket2.setAttribute('x', rack.x + this.RACK_WIDTH + 15);
                    ceilingBracket2.setAttribute('y', rack.y - 20);
                    ceilingBracket2.setAttribute('width', '10');
                    ceilingBracket2.setAttribute('height', '15');
                    ceilingBracket2.setAttribute('fill', '#374151');
                    ceilingBracket2.setAttribute('rx', '2');
                    rackGroup.appendChild(ceilingBracket2);

                    // Ceiling line only for enclosed racks
                    const ceilingLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    ceilingLine.setAttribute('x1', rack.x - 30);
                    ceilingLine.setAttribute('y1', rack.y - 25);
                    ceilingLine.setAttribute('x2', rack.x + this.RACK_WIDTH + 30);
                    ceilingLine.setAttribute('y2', rack.y - 25);
                    ceilingLine.setAttribute('stroke', '#6B7280');
                    ceilingLine.setAttribute('stroke-width', '3');
                    rackGroup.appendChild(ceilingLine);
                }
            } else if (rack.mounting === 'floor') {
                // Floor mounting feet only for enclosed racks
                if (rack.isEnclosed) {
                    const actualRackHeight = (rack.height || this.RACK_HEIGHT);
                    const floorFoot1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    floorFoot1.setAttribute('x', rack.x - 25);
                    floorFoot1.setAttribute('y', rack.y + actualRackHeight * this.UNIT_HEIGHT + 10);
                    floorFoot1.setAttribute('width', '10');
                    floorFoot1.setAttribute('height', '8');
                    floorFoot1.setAttribute('fill', '#374151');
                    floorFoot1.setAttribute('rx', '2');
                    rackGroup.appendChild(floorFoot1);

                    const floorFoot2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    floorFoot2.setAttribute('x', rack.x + this.RACK_WIDTH + 15);
                    floorFoot2.setAttribute('y', rack.y + actualRackHeight * this.UNIT_HEIGHT + 10);
                    floorFoot2.setAttribute('width', '10');
                    floorFoot2.setAttribute('height', '8');
                    floorFoot2.setAttribute('fill', '#374151');
                    floorFoot2.setAttribute('rx', '2');
                    rackGroup.appendChild(floorFoot2);

                    // Floor line only for enclosed racks
                    const floorLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    floorLine.setAttribute('x1', rack.x - 30);
                    floorLine.setAttribute('y1', rack.y + actualRackHeight * this.UNIT_HEIGHT + 23);
                    floorLine.setAttribute('x2', rack.x + this.RACK_WIDTH + 30);
                    floorLine.setAttribute('y2', rack.y + actualRackHeight * this.UNIT_HEIGHT + 23);
                    floorLine.setAttribute('stroke', '#6B7280');
                    floorLine.setAttribute('stroke-width', '3');
                    rackGroup.appendChild(floorLine);
                }
            }
        }

        // Rack unit guides and mounting holes
        for (let i = 0; i < (rack.height || this.RACK_HEIGHT); i++) {
            const unitY = rack.y + i * this.UNIT_HEIGHT;
            
            // Unit separation lines (every rack unit)
            if (i > 0) {
                const unitLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                unitLine.setAttribute('x1', rack.x);
                unitLine.setAttribute('y1', unitY);
                unitLine.setAttribute('x2', rack.x + this.RACK_WIDTH);
                unitLine.setAttribute('y2', unitY);
                unitLine.setAttribute('stroke', '#e5e7eb');
                unitLine.setAttribute('stroke-width', '0.5');
                unitLine.setAttribute('opacity', '0.5');
                rackGroup.appendChild(unitLine);
            }
            
            // Unit numbers (every 5th unit)
            if ((i + 1) % 5 === 0) {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', rack.x - 20);
                text.setAttribute('y', unitY + 12);
                text.setAttribute('fill', '#6b7280');
                text.setAttribute('font-size', '8');
                text.setAttribute('text-anchor', 'middle');
                text.textContent = (rack.height || this.RACK_HEIGHT) - i;
                rackGroup.appendChild(text);
            }
            
            // Mounting holes with correct EIA-310 pattern
            // Each rack unit (1U) contains 3 holes with specific spacing:
            // - 1/4" from rack unit start to center of first hole
            // - 5/8" from center of first hole to center of second hole  
            // - 5/8" from center of second hole to center of third hole
            // - 1/4" from center of third hole to end of rack unit
            // - 1/2" total gap between last hole of one unit and first hole of next unit
            const holeRadius = 1.5; // Reduced by 25% (2 * 0.75 = 1.5)
            const pixelsPerInch = this.UNIT_HEIGHT / 1.75; // 24 pixels / 1.75 inches
            const quarterInch = 0.25 * pixelsPerInch;   // 3.43 pixels
            const fiveEighthsInch = 0.625 * pixelsPerInch; // 8.57 pixels
            
            // Calculate hole positions within each rack unit
            const hole1Y = unitY + quarterInch;                     // First hole: 1/4" from unit start
            const hole2Y = hole1Y + fiveEighthsInch;                // Second hole: 5/8" after first
            const hole3Y = hole2Y + fiveEighthsInch;                // Third hole: 5/8" after second
            
            const holePositions = [hole1Y, hole2Y, hole3Y];
            
            for (let j = 0; j < 3; j++) {
                // For enclosed racks, holes are on the rails; for open racks, holes are on posts
                const leftHoleX = rack.isEnclosed ? rack.x - 4 : rack.x - 5; // Rails vs posts
                const rightHoleX = rack.isEnclosed ? rack.x + this.RACK_WIDTH + 4 : rack.x + this.RACK_WIDTH + 5; // Rails vs posts
                
                // Left mounting holes
                const leftHole = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                leftHole.setAttribute('cx', leftHoleX);
                leftHole.setAttribute('cy', holePositions[j]);
                leftHole.setAttribute('r', holeRadius);
                leftHole.setAttribute('fill', rack.isEnclosed ? '#2D3748' : '#374151'); // Darker for rail holes
                rackGroup.appendChild(leftHole);
                
                // Right mounting holes
                const rightHole = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                rightHole.setAttribute('cx', rightHoleX);
                rightHole.setAttribute('cy', holePositions[j]);
                rightHole.setAttribute('r', holeRadius);
                rightHole.setAttribute('fill', rack.isEnclosed ? '#2D3748' : '#374151'); // Darker for rail holes
                rackGroup.appendChild(rightHole);
            }
        }

        // Add selection highlight if this rack is selected
        if (this.selectedInfrastructure === rack.id) {
            const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            const highlightWidth = rack.isEnclosed ? this.RACK_WIDTH + 90 : this.RACK_WIDTH + 60;
            const highlightHeight = (rack.height || this.RACK_HEIGHT) * this.UNIT_HEIGHT + 40;
            const highlightX = rack.isEnclosed ? rack.x - 45 : rack.x - 30;
            const highlightY = rack.y - 20;
            
            highlight.setAttribute('x', highlightX);
            highlight.setAttribute('y', highlightY);
            highlight.setAttribute('width', highlightWidth);
            highlight.setAttribute('height', highlightHeight);
            highlight.setAttribute('fill', 'none');
            highlight.setAttribute('stroke', '#3B82F6');
            highlight.setAttribute('stroke-width', '3');
            highlight.setAttribute('stroke-dasharray', '8,4');
            highlight.setAttribute('rx', '4');
            rackGroup.appendChild(highlight);
        }

        parent.appendChild(rackGroup);
    }

    renderCabinetShell(parent, rack) {
        // Based on real server cabinet design: just a cabinet enclosure with rails mounted inside
        // No top/bottom plates - just the cabinet walls and mounting rails
        
        const cabinetWidth = this.RACK_WIDTH + 100; // Real cabinets are wider (typically 600mm vs 19" equipment)
        const cabinetHeight = (rack.height || this.RACK_HEIGHT) * this.UNIT_HEIGHT + 40;
        const cabinetX = rack.x - 50; // Center the 19" rack space in the wider cabinet

        // Main cabinet enclosure - outer shell
        const cabinet = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        cabinet.setAttribute('x', cabinetX);
        cabinet.setAttribute('y', rack.y - 20);
        cabinet.setAttribute('width', cabinetWidth);
        cabinet.setAttribute('height', cabinetHeight);
        cabinet.setAttribute('fill', '#374151'); // Dark cabinet color
        cabinet.setAttribute('stroke', '#1F2937'); // Even darker border
        cabinet.setAttribute('stroke-width', '3');
        cabinet.setAttribute('rx', '6');
        parent.appendChild(cabinet);

        // Interior space - darker to show enclosed nature
        const interior = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        interior.setAttribute('x', cabinetX + 8);
        interior.setAttribute('y', rack.y - 12);
        interior.setAttribute('width', cabinetWidth - 16);
        interior.setAttribute('height', cabinetHeight - 16);
        interior.setAttribute('fill', '#1F2937'); // Very dark interior
        interior.setAttribute('rx', '4');
        parent.appendChild(interior);

        // Equipment mounting area (19" space where devices mount)
        const mountingArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        mountingArea.setAttribute('x', rack.x - 5);
        mountingArea.setAttribute('y', rack.y);
        mountingArea.setAttribute('width', this.RACK_WIDTH + 10);
        mountingArea.setAttribute('height', (rack.height || this.RACK_HEIGHT) * this.UNIT_HEIGHT);
        mountingArea.setAttribute('fill', '#2D3748'); // Slightly lighter for equipment area
        mountingArea.setAttribute('rx', '2');
        parent.appendChild(mountingArea);
    }

    renderManager(parent, manager) {
        const managerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        managerGroup.setAttribute('class', 'manager-element');
        managerGroup.setAttribute('data-id', manager.id);
        
        // Make manager group clickable
        managerGroup.style.pointerEvents = 'auto';
        managerGroup.style.cursor = 'pointer';

        const managerWidth = manager.width || this.MANAGER_WIDTH_6; // Default to 6" if not specified
        
        // Calculate manager height based on the tallest rack, or default to 42U
        const tallestRackHeight = this.racks.length > 0 ? 
            Math.max(...this.racks.map(r => r.height || this.RACK_HEIGHT)) : this.RACK_HEIGHT;
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', manager.x);
        rect.setAttribute('y', manager.y - 5);
        rect.setAttribute('width', managerWidth);
        rect.setAttribute('height', tallestRackHeight * this.UNIT_HEIGHT + 5);
        rect.setAttribute('fill', '#374151');
        rect.setAttribute('rx', '6');
        managerGroup.appendChild(rect);

        // Add selection highlight if this manager is selected
        if (this.selectedInfrastructure === manager.id) {
            const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            highlight.setAttribute('x', manager.x - 3);
            highlight.setAttribute('y', manager.y - 8);
            highlight.setAttribute('width', managerWidth + 6);
            highlight.setAttribute('height', tallestRackHeight * this.UNIT_HEIGHT + 11);
            highlight.setAttribute('fill', 'none');
            highlight.setAttribute('stroke', '#3B82F6');
            highlight.setAttribute('stroke-width', '3');
            highlight.setAttribute('stroke-dasharray', '8,4');
            highlight.setAttribute('rx', '6');
            managerGroup.appendChild(highlight);
        }

        parent.appendChild(managerGroup);
    }

    renderDevice(parent, device) {
        const rack = this.racks.find(r => r.id === device.rackId);
        if (!rack) return;

        const deviceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        deviceGroup.setAttribute('class', 'device-element');
        deviceGroup.setAttribute('data-id', device.id);
        
        // Make device group clickable
        deviceGroup.style.pointerEvents = 'auto';
        deviceGroup.style.cursor = 'pointer';

        const y = rack.y + (device.startUnit - 1) * this.UNIT_HEIGHT;
        const height = device.height * this.UNIT_HEIGHT;
        // Use proper device width with properly cropped images
        // Now that images are properly cropped, use realistic width
        const deviceWidth = 259; // Reduced by 1.5" total (0.75" each side)
        const railSpan = this.RACK_WIDTH + 30; // 270px rail-to-rail span
        const deviceX = rack.x - 15 + (railSpan - deviceWidth) / 2; // Center device in rail span
        
        // Use full rack unit height with 5% increase to better fill space
        const deviceHeight = device.height * this.UNIT_HEIGHT; // Original size
        
        console.log('RACK_WIDTH:', this.RACK_WIDTH);
        console.log('Device X position:', deviceX);
        console.log('Device width:', deviceWidth);
        console.log('Rail span:', railSpan);
        console.log('Device centering offset:', (railSpan - deviceWidth) / 2);
        
        // Add selection highlight if this device is selected
        if (this.selectedDevice === device.id) {
            const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            highlight.setAttribute('x', deviceX - 3);
            highlight.setAttribute('y', y - 3);
            highlight.setAttribute('width', deviceWidth + 6);
            highlight.setAttribute('height', deviceHeight + 6);
            highlight.setAttribute('fill', 'none');
            highlight.setAttribute('stroke', '#3B82F6');
            highlight.setAttribute('stroke-width', '3');
            highlight.setAttribute('stroke-dasharray', '8,4');
            highlight.setAttribute('rx', '4');
            deviceGroup.appendChild(highlight);
        }

        // Check if this is a horizontal manager or misc item and render it with custom styling
        if (device.type.startsWith('horizontal-manager') || device.type.startsWith('blanking-plate') || device.type.startsWith('empty-space') || device.type.startsWith('shelf')) {
            const deviceRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            deviceRect.setAttribute('x', deviceX + 6); // Slight inset from device edges
            deviceRect.setAttribute('y', y + 2);
            deviceRect.setAttribute('width', deviceWidth - 12); // Slightly smaller than full width
            deviceRect.setAttribute('height', deviceHeight - 4);
            deviceRect.setAttribute('rx', '4'); // Rounded corners
            
            // Different colors and styling based on type
            if (device.type.startsWith('horizontal-manager')) {
                deviceRect.setAttribute('fill', '#374151'); // Dark gray for managers
            } else if (device.type.startsWith('blanking-plate')) {
                deviceRect.setAttribute('fill', '#6B7280'); // Medium gray for blanking plates
                deviceRect.setAttribute('stroke', '#4B5563');
                deviceRect.setAttribute('stroke-width', '1');
            } else if (device.type.startsWith('empty-space')) {
                deviceRect.setAttribute('fill', 'none'); // Transparent for empty space
                deviceRect.setAttribute('stroke', '#D1D5DB');
                deviceRect.setAttribute('stroke-width', '1');
                deviceRect.setAttribute('stroke-dasharray', '4,4');
            } else if (device.type.startsWith('shelf')) {
                deviceRect.setAttribute('fill', '#D97706'); // Brown/orange for shelf
                deviceRect.setAttribute('stroke', '#92400E');
                deviceRect.setAttribute('stroke-width', '1');
            }
            
            deviceGroup.appendChild(deviceRect);
        } else {
            // No background container - device image will be placed directly

            // Try to load device image with full height
            this.loadDeviceImageForRender(deviceGroup, device, deviceX, y, deviceWidth, deviceHeight);
        }

        parent.appendChild(deviceGroup);
    }
    
    loadDeviceImageForRender(deviceGroup, device, x, y, width, height) {
        const deviceImagePath = this.getDeviceImagePath(device.type);
        
        console.log('Loading device image:', device.type);
        console.log('Image path:', deviceImagePath);
        console.log('Image dimensions - x:', x, 'y:', y, 'width:', width, 'height:', height);
        console.log('UNIT_HEIGHT:', this.UNIT_HEIGHT);
        console.log('Device height in units:', device.height);
        
        if (deviceImagePath) {
            // Create image element
            const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', deviceImagePath);
            image.setAttribute('x', x);
            image.setAttribute('y', y);
            image.setAttribute('width', width);
            image.setAttribute('height', height);
            image.setAttribute('preserveAspectRatio', 'none'); // Allow stretching to fill specified dimensions
            
            // Handle image load errors
            image.addEventListener('error', () => {
                console.warn(`Failed to load image for device: ${device.type}`);
                // Add fallback text
                this.addDeviceFallbackText(deviceGroup, device, x, y, width, height);
            });
            
            deviceGroup.appendChild(image);
        } else {
            // No image available, use fallback text
            this.addDeviceFallbackText(deviceGroup, device, x, y, width, height);
        }
    }
    
    addDeviceFallbackText(deviceGroup, device, x, y, width, height) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + width / 2);
        text.setAttribute('y', y + height / 2);
        text.setAttribute('fill', '#1f2937');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.textContent = device.type;
        deviceGroup.appendChild(text);
    }

    renderDragPreview(parent) {
        if (this.draggedDevice.isInfrastructure) {
            if (this.draggedDevice.type.startsWith('open-rack') || this.draggedDevice.type.startsWith('enclosed-rack')) {
                // Render rack preview
                const previewGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                previewGroup.setAttribute('opacity', '0.7');

                // Determine rack height and type for preview
                let previewRackHeight = this.RACK_HEIGHT; // Default 42U
                let isEnclosedPreview = this.draggedDevice.type.startsWith('enclosed-rack');
                if (this.draggedDevice.type.includes('24u')) previewRackHeight = 24;
                else if (this.draggedDevice.type.includes('12u')) previewRackHeight = 12;
                else if (this.draggedDevice.type.includes('9u')) previewRackHeight = 9;

                // For enclosed racks, render cabinet shell first
                if (isEnclosedPreview) {
                    const cabinetWidth = this.RACK_WIDTH + 60;
                    const cabinetHeight = previewRackHeight * this.UNIT_HEIGHT + 40;

                    // Main cabinet body
                    const cabinet = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    cabinet.setAttribute('x', this.dragPosition.x - cabinetWidth/2);
                    cabinet.setAttribute('y', this.dragPosition.y - cabinetHeight/2);
                    cabinet.setAttribute('width', cabinetWidth);
                    cabinet.setAttribute('height', cabinetHeight);
                    cabinet.setAttribute('fill', '#9CA3AF');
                    cabinet.setAttribute('stroke', '#6B7280');
                    cabinet.setAttribute('stroke-width', '2');
                    cabinet.setAttribute('rx', '4');
                    previewGroup.appendChild(cabinet);

                    // Background fill for enclosed rack preview
                    const backgroundFill = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    backgroundFill.setAttribute('x', this.dragPosition.x - (this.RACK_WIDTH + 40)/2);
                    backgroundFill.setAttribute('y', this.dragPosition.y - (previewRackHeight * this.UNIT_HEIGHT + 20)/2);
                    backgroundFill.setAttribute('width', this.RACK_WIDTH + 40);
                    backgroundFill.setAttribute('height', previewRackHeight * this.UNIT_HEIGHT + 20);
                    backgroundFill.setAttribute('fill', '#4B5563'); // Darker background for preview too
                    backgroundFill.setAttribute('rx', '2');
                    previewGroup.appendChild(backgroundFill);

                    // Interior opening
                    const interior = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    interior.setAttribute('x', this.dragPosition.x - (this.RACK_WIDTH + 40)/2);
                    interior.setAttribute('y', this.dragPosition.y - (previewRackHeight * this.UNIT_HEIGHT + 20)/2);
                    interior.setAttribute('width', this.RACK_WIDTH + 40);
                    interior.setAttribute('height', previewRackHeight * this.UNIT_HEIGHT + 20);
                    interior.setAttribute('fill', '#F3F4F6');
                    interior.setAttribute('rx', '2');
                    previewGroup.appendChild(interior);
                }

                const leftPost = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                leftPost.setAttribute('x', this.dragPosition.x - this.RACK_WIDTH/2 - 15);
                leftPost.setAttribute('y', this.dragPosition.y - (previewRackHeight * this.UNIT_HEIGHT)/2 - 10);
                leftPost.setAttribute('width', '15');
                leftPost.setAttribute('height', previewRackHeight * this.UNIT_HEIGHT + 20);
                leftPost.setAttribute('fill', '#1f2937');
                leftPost.setAttribute('rx', '2');
                previewGroup.appendChild(leftPost);

                const rightPost = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rightPost.setAttribute('x', this.dragPosition.x + this.RACK_WIDTH/2);
                rightPost.setAttribute('y', this.dragPosition.y - (previewRackHeight * this.UNIT_HEIGHT)/2 - 10);
                rightPost.setAttribute('width', '15');
                rightPost.setAttribute('height', previewRackHeight * this.UNIT_HEIGHT + 20);
                rightPost.setAttribute('fill', '#1f2937');
                rightPost.setAttribute('rx', '2');
                previewGroup.appendChild(rightPost);

                // Add top plate
                const topPlate = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                topPlate.setAttribute('x', this.dragPosition.x - this.RACK_WIDTH/2 - 15);
                topPlate.setAttribute('y', this.dragPosition.y - (previewRackHeight * this.UNIT_HEIGHT)/2 - 10);
                topPlate.setAttribute('width', this.RACK_WIDTH + 30);
                topPlate.setAttribute('height', '10');
                topPlate.setAttribute('fill', '#1f2937');
                topPlate.setAttribute('rx', '2');
                previewGroup.appendChild(topPlate);

                // Add bottom plate
                const bottomPlate = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bottomPlate.setAttribute('x', this.dragPosition.x - this.RACK_WIDTH/2 - 15);
                bottomPlate.setAttribute('y', this.dragPosition.y + (previewRackHeight * this.UNIT_HEIGHT)/2);
                bottomPlate.setAttribute('width', this.RACK_WIDTH + 30);
                bottomPlate.setAttribute('height', '10');
                bottomPlate.setAttribute('fill', '#1f2937');
                bottomPlate.setAttribute('rx', '2');
                previewGroup.appendChild(bottomPlate);

                parent.appendChild(previewGroup);
            } else if (this.draggedDevice.type === 'vertical-manager-6' || this.draggedDevice.type === 'vertical-manager-10') {
                // Render manager preview with correct width
                const managerWidth = this.draggedDevice.type === 'vertical-manager-10' ? this.MANAGER_WIDTH_10 : this.MANAGER_WIDTH_6;
                
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', this.dragPosition.x - managerWidth/2);
                rect.setAttribute('y', this.dragPosition.y - (this.RACK_HEIGHT * this.UNIT_HEIGHT)/2 - 5);
                rect.setAttribute('width', managerWidth);
                rect.setAttribute('height', this.RACK_HEIGHT * this.UNIT_HEIGHT + 5);
                rect.setAttribute('fill', '#374151');
                rect.setAttribute('opacity', '0.7');
                rect.setAttribute('rx', '6');
                parent.appendChild(rect);
            }
        } else {
            // Render device preview with image if possible
            this.renderDevicePreview(parent);
        }
    }
    
    renderDevicePreview(parent) {
        if (!this.draggedDevice) return;
        
        const previewGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        previewGroup.setAttribute('class', 'device-preview');
        previewGroup.setAttribute('opacity', '0.8');
        
        // Position preview to match device positioning with increased width
        const deviceWidth = 259; // Match device width reduced by 1.5" total
        const x = this.dragPosition.x - deviceWidth / 2;
        const y = this.dragPosition.y - (this.draggedDevice.height * this.UNIT_HEIGHT) / 2;
        const width = deviceWidth;
        const height = this.draggedDevice.height * this.UNIT_HEIGHT; // Original size
        
        // Check if this is a horizontal manager or misc item for custom preview
        if (this.draggedDevice.type.startsWith('horizontal-manager') || this.draggedDevice.type.startsWith('blanking-plate') || this.draggedDevice.type.startsWith('empty-space') || this.draggedDevice.type.startsWith('shelf')) {
            const previewRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            previewRect.setAttribute('x', x + 6);
            previewRect.setAttribute('y', y + 2);
            previewRect.setAttribute('width', width - 12);
            previewRect.setAttribute('height', height - 4);
            previewRect.setAttribute('opacity', '0.8');
            previewRect.setAttribute('rx', '4');
            
            // Apply same styling as rendering
            if (this.draggedDevice.type.startsWith('horizontal-manager')) {
                previewRect.setAttribute('fill', '#374151');
            } else if (this.draggedDevice.type.startsWith('blanking-plate')) {
                previewRect.setAttribute('fill', '#6B7280');
                previewRect.setAttribute('stroke', '#4B5563');
                previewRect.setAttribute('stroke-width', '1');
            } else if (this.draggedDevice.type.startsWith('empty-space')) {
                previewRect.setAttribute('fill', 'none');
                previewRect.setAttribute('stroke', '#D1D5DB');
                previewRect.setAttribute('stroke-width', '1');
                previewRect.setAttribute('stroke-dasharray', '4,4');
            } else if (this.draggedDevice.type.startsWith('shelf')) {
                previewRect.setAttribute('fill', '#D97706');
                previewRect.setAttribute('stroke', '#92400E');
                previewRect.setAttribute('stroke-width', '1');
            }
            
            previewGroup.appendChild(previewRect);
        } else {
            // Use simple device mapping for preview without external dependencies
            const deviceImagePath = this.getDeviceImagePath(this.draggedDevice.type);
            
            if (deviceImagePath) {
                // Create image element for preview
                const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', deviceImagePath);
                image.setAttribute('x', x);
                image.setAttribute('y', y);
                image.setAttribute('width', width);
                image.setAttribute('height', height);
                image.setAttribute('preserveAspectRatio', 'none'); // Allow stretching to fill specified dimensions
                image.setAttribute('opacity', '0.8');
                
                // Handle image load errors gracefully
                image.addEventListener('error', () => {
                    // Fallback to text label
                    this.addDevicePreviewLabel(previewGroup, x, y, width, height, this.draggedDevice.type);
                });
                
                previewGroup.appendChild(image);
            } else {
                // No image path, use text label
                this.addDevicePreviewLabel(previewGroup, x, y, width, height, this.draggedDevice.type);
            }
        }
        
        parent.appendChild(previewGroup);
    }
    
    getDeviceImagePath(deviceType) {
        // Simple device image mapping
        const deviceImages = {
            'cisco-c9200l-24t-4g': 'library/device-images/switches/24-port-switch.png',
            'cisco-c9200l-48p-4g': 'library/device-images/switches/48-port-switch.png',
            'cisco-isr4331': 'library/device-images/routers/cisco-isr4331.png',
            'cisco-asa5516-x': 'library/device-images/firewalls/cisco-asa5516-x.png',
            'apc-ap8941': 'library/device-images/pdus/apc-ap8941.png',
            'tripp-lite-pdumh30hvt': 'library/device-images/pdus/tripp-lite-pdumh30hvt.png',
            'patch-panel-24-port': 'library/device-images/patch-panels/24-port-patch-panel.png',
            'patch-panel-48-port': 'library/device-images/patch-panels/48-port-patch-panel.png',
            // Infrastructure devices
            'horizontal-manager-1u': 'library/device-images/cable-managers/horizontal-1u.png',
            'horizontal-manager-2u': 'library/device-images/cable-managers/horizontal-2u.png',
            'blanking-plate-1u': 'library/device-images/blanking-plates/1u-plate.png',
            'blanking-plate-2u': 'library/device-images/blanking-plates/2u-plate.png'
        };
        
        return deviceImages[deviceType] || null;
    }
    
    addDevicePreviewLabel(previewGroup, x, y, width, height, deviceType) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + width / 2);
        text.setAttribute('y', y + height / 2);
        text.setAttribute('fill', '#2c3e50');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.textContent = deviceType;
        previewGroup.appendChild(text);
    }
}

// Initialize the enhanced rack designer
window.enhancedRackDesigner = new EnhancedRackDesigner();