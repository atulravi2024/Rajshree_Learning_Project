# High-Fidelity Asset Sorting Implementation Plan

Transition the Assets Repository mockup from a static demonstration to a functional prototype by implementing real-time, client-side DOM sorting for all 30+ criteria.

## Proposed Changes

### [Mockup Infrastructure] Data Attribution & Sorting Engine

#### [MODIFY] [assets.html](file:///c:/Users/Atul%20Verma/.openclaw/workspace/RajShree_Project/Rajshree%20Learning%20Project/memory/06%20Internal%20Audit/v2.0/Mockups/assets/assets.html)
- Enrich each `.asset-card` with a comprehensive set of `data-*` attributes to support the new sorting engine:
    - `data-risk`: Numerical value (0-100) representing audit risk.
    - `data-size-bytes`: Numerical value for precise file size sorting (e.g., 1200000).
    - `data-commit-date`: ISO 8601 date string for modification/commit sorting (e.g., "2024-03-20").
    - `data-compliance`: Numerical (0 for fail, 1 for pass) for compliance status.
    - `data-vulnerability`: Numerical score (0-10) for security sorting.
    - `data-perf-score`: Numerical percentage (0-100) for performance sorting.

#### [MODIFY] [assets.js](file:///c:/Users/Atul%20Verma/.openclaw/workspace/RajShree_Project/Rajshree%20Learning%20Project/memory/06%20Internal%20Audit/v2.0/Mockups/assets/assets.js)
- Implement the `sortGallery(criteria)` function:
    - **Logic**: Select all `.asset-card` elements, convert the NodeList to an Array, and apply the `sort()` method based on the selected criteria (`data-*` values).
    - **DOM Updates**: Re-append the sorted cards to the `.assets-grid` to trigger the browser's reflow and maintain state.
- Wire all 30+ sorting options in the three dropdowns to trigger this function.
- Add a **holographic pulse animation** (300ms) to the grid during the sort to emphasize the system's "processing" of the data.

#### [MODIFY] [assets.css](file:///c:/Users/Atul%20Verma/.openclaw/workspace/RajShree_Project/Rajshree%20Learning%20Project/memory/06%20Internal%20Audit/v2.0/Mockups/assets/assets.css)
- Minor adjustments to ensure the grid transition feels smooth during re-ordering.

## Open Questions

- **Simulated Latency**: I will implement a subtle 300ms delay for aesthetic "Lead Auditor" feedback to make the sorting feel more substantive.

## Verification Plan

### Manual Verification
- Test "Alphabetical" sorting and ensure cards re-arrange correctly.
- Test "File Size (Largest)" and verify the PNG/MP3 assets move to the front.
- Test "Risk Level (Critical)" and verify the Audit Scans move to the front.
