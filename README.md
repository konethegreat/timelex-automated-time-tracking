# timelex-automated-time-tracking
## Ownership & Usage Rights

This project was developed by Kone Tshivhinda for the MB Motsoeneng Bill Attorneys 
Software Engineer Assessment 2026.

**Important Notice**: 
- This work is protected by copyright law
- Submission of this assessment does not constitute transfer of ownership
- All intellectual property rights remain with the creator
- This code may not be used in production without explicit written permission

This assessment submission is provided under [MIT/Assessment-Specific] license 
as specified in the LICENSE file.

# TimeLex: Automated Time Tracking Prototype

**Copyright (c) 2026 Kone Tshivhinda** *ASSESSMENT PROTOTYPE - NOT FOR PRODUCTION USE*

## Project Overview
TimeLex is an automated legal time capture system developed as a Software Engineering Assessment prototype for MB Motsoeneng Bill Attorneys. 

This system is designed specifically to address pain points identified in attorney surveys, moving away from manual time logging toward automated activity interception, drafting, and seamless invoicing.

## Features & Survey Fulfillment

This prototype actively addresses the following stakeholder requests:
- **Automated Capture Engine:** Intercepts emails, meetings, and calls in the background (Top request across multiple attorneys).
- **Draft & Approve Workflow:** Entries are drafted automatically; the attorney simply approves them rather than manually re-typing data.
- **Intelligent Autocomplete:** Quick matter assignment via contextual heuristics (`capture-engine.js`).
- **Real-Time Targeting:** Live dashboard tracking against daily/monthly targets (Requested by Lerato, Johan, Anchané).
- **Automated Invoicing:** Generates professional invoices directly from approved drafts without requiring secretarial intervention (Requested by Anchané).

## Repository Structure

\`\`\`text
timelex-automated-time-tracking/
└── src/
    └── main/
        ├── index.html          # Application entry point
        ├── styles/             # Modular CSS architecture
        └── scripts/
            ├── app.js               # Global state, routing, and assessment protections
            ├── capture-engine.js    # Activity interception logic
            ├── invoice-generator.js # PDF/DOM invoice formatting
            └── utils/               # Shared helpers (date, toast, lookup)
\`\`\`

## Assessment Protections & Limitations
As per the assessment constraints, this is a locked prototype:
1. **Time Bomb:** Core application functionality will automatically disable after **May 7, 2026**.
2. **Watermarking:** Persistent copyright watermarks are applied to all DOM views and print/PDF outputs.
3. **Usage Limits:** Automated background capturing is artificially limited per session to prevent unauthorized production deployment. 

## Local Development & Setup

This is a vanilla HTML/CSS/JS frontend application requiring no build steps for review.
1. Clone the repository: `git clone https://github.com/konethegreat/timelex-automated-time-tracking.git`
2. Serve the `src/main` directory using any local web server (e.g., VS Code Live Server, Python `http.server`).
3. Navigate to `index.html`.

---
*For licensing inquiries beyond the assessment period, please contact the repository owner.*