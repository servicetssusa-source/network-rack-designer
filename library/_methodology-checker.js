// Design Methodology Enforcement
// This file ensures all device designs follow DESIGN_METHODOLOGY.md

class MethodologyChecker {
    constructor() {
        this.phases = {
            research: {
                1: 'Search for stencils',
                2: 'Search for SVG files', 
                3: 'Search for images',
                4: 'Search for dimensions',
                5: 'Search for descriptions'
            },
            analysis: {
                6: 'Refine device understanding from general to specific'
            },
            implementation: {
                7.1: 'Size & Dimensions',
                7.2: 'Ports',
                7.3: 'Styling/Design', 
                7.4: 'Color',
                7.5: 'Displays',
                7.6: 'Lights',
                7.7: 'Vents'
            },
            validation: {
                8: 'Compare against reference images'
            }
        };
        
        this.completed = {
            research: [],
            analysis: [],
            implementation: [],
            validation: []
        };
    }

    enforceMethodology() {
        console.warn('🚨 METHODOLOGY REMINDER 🚨');
        console.warn('Before designing any device, you must:');
        console.warn('1. Read DESIGN_METHODOLOGY.md');
        console.warn('2. Complete all research phases (1-5)');
        console.warn('3. Follow priority order (7.1-7.7)');
        console.warn('4. Validate against references (8)');
        
        return false; // Prevents device creation until methodology followed
    }

    checkPhaseComplete(phase, step) {
        return this.completed[phase].includes(step);
    }

    markPhaseComplete(phase, step) {
        if (!this.completed[phase].includes(step)) {
            this.completed[phase].push(step);
            console.log(`✅ Methodology Phase ${phase}.${step} completed`);
        }
    }

    canProceedToImplementation() {
        const researchComplete = this.completed.research.length >= 5;
        const analysisComplete = this.completed.analysis.length >= 1;
        
        if (!researchComplete) {
            console.error('❌ Cannot proceed: Research phase incomplete');
            return false;
        }
        
        if (!analysisComplete) {
            console.error('❌ Cannot proceed: Analysis phase incomplete');
            return false;
        }
        
        return true;
    }
}

// Global methodology enforcer
window.methodologyChecker = new MethodologyChecker();

// Methodology reference prompt
function requireMethodologyReview() {
    const msg = `
    🔍 DESIGN METHODOLOGY REQUIRED
    
    Before proceeding with device design, please:
    
    1. Open and review: DESIGN_METHODOLOGY.md
    2. Complete Phase 1 Research (steps 1-5)
    3. Complete Phase 2 Analysis (step 6)
    4. Follow Phase 3 Priority Order (7.1-7.7)
    5. Complete Phase 4 Validation (step 8)
    
    Use this checklist for every device!
    `;
    
    console.log(msg);
    alert(msg);
    
    return false;
}

// Auto-check on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        requireMethodologyReview();
    }, 1000);
});