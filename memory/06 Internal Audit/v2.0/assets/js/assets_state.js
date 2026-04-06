// State Management
let currentSearchTerm = '';
let currentSortCriteria = 'alpha_az';
let currentCategory = 'all';
let lastActiveSectionId = 'section-preview'; // Persistent HUD selection memory

// Performance Constants
const MAX_PREVIEW_CHARS = 100000; // ~100KB for DOM safety
const HEAVY_FILE_THRESHOLD = 1500000; // 1.5MB for iframe/warning safety
