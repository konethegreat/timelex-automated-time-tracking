/**
 * TimeLex — Automated Legal Time Capture
 * Copyright (c) [2026] [Kone Tshivhinda]
 * 
 * For assessment purposes only - not for production use
 * 
 * @license [MIT or Assessment-Specific]
 * @see LICENSE file in repository root
 */
/**
 * TimeLex — Automated Legal Time Capture
 * Copyright (c) 2026 Kone Tshivhinda
 * 
 * ASSESSMENT PROTOTYPE - NOT FOR PRODUCTION USE
 * Developed exclusively for MB Motsoeneng Bill Attorneys Software Engineer Assessment 2026
 * 
 * ALL RIGHTS RESERVED
 * This work is protected by copyright law. Submission of this assessment does not constitute 
 * transfer of ownership. All intellectual property rights remain with the creator.
 * 
 * This code may not be used in production without express written permission.
 * For commercial licensing inquiries, contact: kone.tshivhinda@example.com
 * 
 * IMPORTANT: This assessment submission is provided under Assessment-Specific License terms
 * as documented in the complete project repository. Intentional limitations exist for 
 * assessment purposes only (not for production implementation).
 * 
 * ASSESSMENT WATERMARK: Visible in print and screenshots to prevent unauthorized production use
 * This watermark appears when printing or capturing screenshots of the application
 */

/**
 * Activity capture engine for legal time tracking applications
 * 
 * Provides a modular, secure system for detecting and capturing billable activities:
 * - Email tracking (Outlook, Gmail)
 * - Calendar event monitoring (Meetings)
 * - Document activity detection (Word, PDF editors)
 * - Call logging (Teams, Zoom)
 * - Research activity tracking
 * 
 * Designed with legal industry requirements in mind:
 * - Privacy and confidentiality safeguards
 * - Matter association heuristics
 * - Billable vs. non-billable classification
 * - 6-minute billing unit conversion
 * 
 * Note: This is a simulated implementation for assessment purposes. A production
 * version would integrate with actual APIs and include additional security measures.
 */

/**
 * Capture engine configuration options
 * @typedef {Object} CaptureEngineConfig
 * @property {boolean} [enabled=true] - Whether capture is enabled
 * @property {number} [pollingInterval=8000] - Base polling interval in milliseconds
 * @property {number} [randomizationRange=7000] - Range for randomization of polling
 * @property {boolean} [autoApprove=false] - Whether to auto-approve captured activities
 * @property {string[]} [trackedApplications] - List of applications to monitor
 * @property {Object} [matterRules] - Matter association rules
 * @property {Object} [billableRules] - Billable classification rules
 */

/**
 * Activity type enum
 * @enum {string}
 */
export const ActivityType = {
  EMAIL: 'email',
  MEETING: 'meeting',
  DOCUMENT: 'doc',
  CALL: 'call',
  RESEARCH: 'research'
};

/**
 * Activity source enum
 * @enum {string}
 */
export const ActivitySource = {
  OUTLOOK: 'outlook',
  GMAIL: 'gmail',
  CALENDAR: 'calendar',
  WORD: 'word',
  DOCS: 'docs',
  TEAMS: 'teams',
  ZOOM: 'zoom',
  BROWSER: 'browser'
};

/**
 * Capture status enum
 * @enum {string}
 */
export const CaptureStatus = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  EXPIRED: 'expired',
  ERROR: 'error'
};

/**
 * Activity object structure
 * @typedef {Object} Activity
 * @property {string} id - Unique activity ID
 * @property {ActivityType} type - Type of activity
 * @property {string} title - Activity title/description
 * @property {number} units - Billable units (6-minute increments)
 * @property {string} matter - Matter number
 * @property {string} narration - Detailed description
 * @property {boolean} billable - Whether activity is billable
 * @property {string} time - Time of activity
 * @property {ActivitySource} source - Source application
 * @property {Date} timestamp - Timestamp of activity
 * @property {Object} [context] - Additional context data
 */

/**
 * Matter association rule
 * @typedef {Object} MatterRule
 * @property {string} pattern - Pattern to match (regex)
 * @property {string} matterNumber - Target matter number
 * @property {string} [description] - Rule description
 */

/**
 * Billable classification rule
 * @typedef {Object} BillableRule
 * @property {string} pattern - Pattern to match (regex)
 * @property {boolean} billable - Whether matched activities are billable
 * @property {string} [description] - Rule description
 */

/**
 * Capture engine class for monitoring and capturing billable activities
 */
export class CaptureEngine {
  /**
   * Creates a new CaptureEngine instance
   * @param {Object} dependencies - Dependencies object
   * @param {Object} dependencies.matters - Matters lookup object
   * @param {Function} dependencies.addActivity - Callback for adding activities
   * @param {CaptureEngineConfig} [config={}] - Configuration options
   */
  constructor({ matters, addActivity }, config = {}) {
    this.matters = matters;
    this.addActivity = addActivity;
    this.config = {
      enabled: true,
      pollingInterval: 8000,
      randomizationRange: 7000,
      autoApprove: false,
      trackedApplications: [
        'Microsoft Outlook',
        'Google Calendar',
        'Microsoft Word',
        'Google Docs',
        'Microsoft Teams',
        'Zoom'
      ],
      matterRules: this._getDefaultMatterRules(),
      billableRules: this._getDefaultBillableRules(),
      ...config
    };
    
    this.state = {
      status: CaptureStatus.PAUSED,
      intervalId: null,
      lastPoll: null,
      errorCount: 0,
      maxErrors: 5,
      assessmentWatermark: true
    };
    
    // Initialize integrations
    this.integrations = {
      outlook: new OutlookIntegration(this),
      googleCalendar: new GoogleCalendarIntegration(this),
      word: new WordIntegration(this),
      docs: new DocsIntegration(this),
      teams: new TeamsIntegration(this),
      zoom: new ZoomIntegration(this),
      browser: new BrowserIntegration(this)
    };
    
    // Add assessment expiration check
    this._checkAssessmentIntegrity();
  }
  
  /**
   * Gets default matter association rules
   * @returns {MatterRule[]} Default matter rules
   */
  _getDefaultMatterRules() {
    return [
      {
        pattern: /absa|nkosi/i,
        matterNumber: '2024/0512-LIT',
        description: 'Nkosi v Absa Bank matter'
      },
      {
        pattern: /urgent|dlamini/i,
        matterNumber: '2024/0888-LIT',
        description: 'Dlamini Urgent Application'
      },
      {
        pattern: /slareview|motlhabi/i,
        matterNumber: '2025/0103-COM',
        description: 'Motlhabi Holdings SLA Review'
      },
      {
        pattern: /labour|perivolaris/i,
        matterNumber: '2025/0217-LAB',
        description: 'Perivolaris Labour Matter'
      },
      {
        pattern: /property|botha/i,
        matterNumber: '2025/0391-CON',
        description: 'Botha Property Transfer'
      }
    ];
  }
  
  /**
   * Gets default billable classification rules
   * @returns {BillableRule[]} Default billable rules
   */
  _getDefaultBillableRules() {
    return [
      {
        pattern: /client|opposing|counsel|court|meeting|drafting|research/i,
        billable: true,
        description: 'Client-related activities are billable'
      },
      {
        pattern: /internal|team|admin|setup|configuration/i,
        billable: false,
        description: 'Internal activities are non-billable'
      }
    ];
  }
  
  /**
   * Checks if assessment period has expired
   */
  _checkAssessmentIntegrity() {
    const assessmentDate = new Date('2026-05-07');
    const today = new Date();
    
    if (today > assessmentDate) {
      this.state.assessmentWatermark = false;
      this.state.status = CaptureStatus.EXPIRED;
      this.stop();
    }
  }
  
  /**
   * Starts the capture engine
   */
  start() {
    if (!this.state.assessmentWatermark) {
      console.error('Assessment period has expired - capture engine disabled');
      return;
    }
    
    if (this.state.status === CaptureStatus.ACTIVE) {
      return;
    }
    
    // Initialize all integrations
    this._initializeIntegrations();
    
    // Start polling
    this._startPolling();
    
    this.state.status = CaptureStatus.ACTIVE;
    this.state.lastPoll = new Date();
    
    // Notify integrations that capture has started
    Object.values(this.integrations).forEach(integration => {
      if (integration.onCaptureStart) {
        integration.onCaptureStart();
      }
    });
  }
  
  /**
   * Initializes all integrations
   */
  _initializeIntegrations() {
    Object.entries(this.integrations).forEach(([name, integration]) => {
      try {
        if (integration.initialize) {
          integration.initialize();
        }
      } catch (error) {
        console.error(`Error initializing ${name} integration:`, error);
      }
    });
  }
  
  /**
   * Starts the polling mechanism
   */
  _startPolling() {
    // Clear existing interval if any
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
    }
    
    // First poll after a short delay
    setTimeout(() => {
      this._poll();
      
      // Set up regular polling with randomized interval
      this.state.intervalId = setInterval(() => {
        this._poll();
      }, this._getRandomizedInterval());
    }, 2000);
  }
  
  /**
   * Gets a randomized polling interval
   * @returns {number} Randomized interval in milliseconds
   */
  _getRandomizedInterval() {
    return this.config.pollingInterval + Math.floor(Math.random() * this.config.randomizationRange);
  }
  
  /**
   * Performs a poll for new activities
   */
  _poll() {
    if (!this.state.assessmentWatermark) return;
    
    try {
      // Check each integration for new activities
      Object.values(this.integrations).forEach(integration => {
        if (integration.poll && integration.isEnabled()) {
          const activities = integration.poll();
          activities.forEach(activity => this._processActivity(activity));
        }
      });
      
      this.state.lastPoll = new Date();
      this.state.errorCount = 0;
    } catch (error) {
      console.error('Capture engine polling error:', error);
      this.state.errorCount++;
      
      // Stop if too many errors
      if (this.state.errorCount >= this.config.maxErrors) {
        this.stop();
        console.error('Capture engine stopped due to repeated errors');
      }
    }
  }
  
  /**
   * Processes a detected activity
   * @param {Activity} activity - Activity to process
   */
  _processActivity(activity) {
    // Apply matter association rules
    activity.matter = this._determineMatter(activity);
    
    // Apply billable classification rules
    activity.billable = this._isBillable(activity);
    
    // Add to activity stream
    this.addActivity(activity);
  }
  
  /**
   * Determines the appropriate matter for an activity
   * @param {Activity} activity - Activity to classify
   * @returns {string} Matter number
   */
  _determineMatter(activity) {
    // Try to match against matter rules
    for (const rule of this.config.matterRules) {
      if (this._matchesPattern(activity, rule.pattern)) {
        return rule.matterNumber;
      }
    }
    
    // Try to extract matter number from title
    const matterMatch = activity.title.match(/(\d{4}\/\d{4}-[A-Z]{3,4})/i);
    if (matterMatch && this.matters[matterMatch[0]]) {
      return matterMatch[0];
    }
    
    // Default to first matter if available
    const matterKeys = Object.keys(this.matters);
    return matterKeys.length > 0 ? matterKeys[0] : '';
  }
  
  /**
   * Checks if activity matches a pattern
   * @param {Activity} activity - Activity to check
   * @param {string|RegExp} pattern - Pattern to match
   * @returns {boolean} True if activity matches pattern
   */
  _matchesPattern(activity, pattern) {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return regex.test(activity.title) || 
           (activity.narration && regex.test(activity.narration)) ||
           (activity.context && regex.test(JSON.stringify(activity.context)));
  }
  
  /**
   * Determines if an activity is billable
   * @param {Activity} activity - Activity to classify
   * @returns {boolean} True if activity is billable
   */
  _isBillable(activity) {
    // Check against billable rules
    for (const rule of this.config.billableRules) {
      if (this._matchesPattern(activity, rule.pattern)) {
        return rule.billable;
      }
    }
    
    // Default to billable for client-facing activities
    return true;
  }
  
  /**
   * Stops the capture engine
   */
  stop() {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.state.intervalId = null;
    }
    
    // Notify integrations that capture has stopped
    Object.values(this.integrations).forEach(integration => {
      if (integration.onCaptureStop) {
        integration.onCaptureStop();
      }
    });
    
    this.state.status = CaptureStatus.PAUSED;
  }
  
  /**
   * Toggles the capture engine state
   */
  toggle() {
    if (this.state.status === CaptureStatus.ACTIVE) {
      this.stop();
    } else {
      this.start();
    }
  }
  
  /**
   * Gets the current status of the capture engine
   * @returns {CaptureStatus} Current status
   */
  getStatus() {
    return this.state.status;
  }
  
  /**
   * Gets integration status
   * @returns {Object} Integration status object
   */
  getIntegrationStatus() {
    return Object.keys(this.integrations).reduce((status, name) => {
      status[name] = {
        connected: this.integrations[name].isConnected(),
        enabled: this.integrations[name].isEnabled(),
        lastActivity: this.integrations[name].getLastActivityTime()
      };
      return status;
    }, {});
  }
}

/**
 * Base integration class for application-specific activity detection
 */
class Integration {
  /**
   * Creates a new Integration instance
   * @param {CaptureEngine} engine - Capture engine instance
   */
  constructor(engine) {
    this.engine = engine;
    this.state = {
      connected: false,
      enabled: false,
      lastActivity: null
    };
  }
  
  /**
   * Initializes the integration
   */
  initialize() {
    this.state.connected = this._checkConnection();
    this.state.enabled = this.state.connected && this._isEnabledByConfig();
  }
  
  /**
   * Checks if the integration is connected
   * @returns {boolean} True if connected
   */
  isConnected() {
    return this.state.connected;
  }
  
  /**
   * Checks if the integration is enabled
   * @returns {boolean} True if enabled
   */
  isEnabled() {
    return this.state.enabled;
  }
  
  /**
   * Gets the last activity time
   * @returns {Date|null} Last activity time or null
   */
  getLastActivityTime() {
    return this.state.lastActivity;
  }
  
  /**
   * Polls for new activities
   * @returns {Activity[]} Array of new activities
   */
  poll() {
    if (!this.state.enabled) {
      return [];
    }
    
    try {
      const activities = this._pollForActivities();
      if (activities.length > 0) {
        this.state.lastActivity = new Date();
      }
      return activities;
    } catch (error) {
      console.error(`${this.getName()} integration error:`, error);
      this.state.connected = false;
      return [];
    }
  }
  
  /**
   * Gets the integration name
   * @returns {string} Integration name
   */
  getName() {
    return this.constructor.name.replace('Integration', '').toLowerCase();
  }
  
  /**
   * Checks if the integration is connected
   * @returns {boolean} True if connected
   * @private
   */
  _checkConnection() {
    // In production, this would check actual connection status
    // For assessment, we'll simulate connection based on browser environment
    try {
      // Simulate connection check
      return Math.random() > 0.2; // 80% chance of being connected
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Checks if integration is enabled by config
   * @returns {boolean} True if enabled
   * @private
   */
  _isEnabledByConfig() {
    return this.engine.config.trackedApplications.includes(this.getName());
  }
  
  /**
   * Polls for activities (to be implemented by subclasses)
   * @returns {Activity[]} Array of new activities
   * @private
   */
  _pollForActivities() {
    throw new Error('Must be implemented by subclass');
  }
}

/**
 * Outlook integration for email tracking
 */
class OutlookIntegration extends Integration {
  _pollForActivities() {
    // In a real implementation, this would connect to Outlook API
    // For assessment, we'll simulate activity detection
    
    if (Math.random() > 0.7) { // 30% chance of detecting activity
      const titles = [
        'Re: Discovery Documents — Nkosi v Absa',
        'FW: Settlement Proposal — Dlamini Matter',
        'RE: Heads of Argument — Perivolaris',
        'Client query: Trust account balance',
        'Opposing counsel: Postponement request',
        'RE: Botha transfer — FICA documents',
        'FW: Mediation date confirmation'
      ];
      
      const title = titles[Math.floor(Math.random() * titles.length)];
      const units = Math.floor(Math.random() * 2) + 1; // 1-2 units
      
      return [{
        id: `outlook-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: ActivityType.EMAIL,
        title,
        units,
        narration: `Attending to email: ${title.substring(0, 60)}`,
        source: ActivitySource.OUTLOOK,
        timestamp: new Date()
      }];
    }
    
    return [];
  }
}

/**
 * Google Calendar integration for meeting tracking
 */
class GoogleCalendarIntegration extends Integration {
  _pollForActivities() {
    // In a real implementation, this would connect to Google Calendar API
    // For assessment, we'll simulate activity detection
    
    if (Math.random() > 0.8) { // 20% chance of detecting activity
      const titles = [
        'Client consultation — Motlhabi Holdings',
        'Team debrief — Litigation matters',
        'Settlement conference — Dlamini',
        'Internal strategy session',
        'Call with counsel re: heads of argument'
      ];
      
      const title = titles[Math.floor(Math.random() * titles.length)];
      const units = Math.floor(Math.random() * 6) + 5; // 5-10 units
      
      return [{
        id: `calendar-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: ActivityType.MEETING,
        title,
        units,
        narration: `Attending meeting: ${title}`,
        source: ActivitySource.CALENDAR,
        timestamp: new Date()
      }];
    }
    
    return [];
  }
}

/**
 * Microsoft Word integration for document tracking
 */
class WordIntegration extends Integration {
  _pollForActivities() {
    // In a real implementation, this would connect to Word API
    // For assessment, we'll simulate activity detection
    
    if (Math.random() > 0.6) { // 40% chance of detecting activity
      const titles = [
        'Drafting founding affidavit — Nkosi v Absa',
        'Reviewing settlement agreement — Dlamini',
        'Amending heads of argument — Labour matter',
        'Preparing court bundle — 2024/0512-LIT',
        'Drafting letter of demand — Botha transfer'
      ];
      
      const title = titles[Math.floor(Math.random() * titles.length)];
      const units = Math.floor(Math.random() * 6) + 3; // 3-8 units
      
      return [{
        id: `word-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: ActivityType.DOCUMENT,
        title,
        units,
        narration: title,
        source: ActivitySource.WORD,
        timestamp: new Date()
      }];
    }
    
    return [];
  }
}

/**
 * Google Docs integration for document tracking
 */
class DocsIntegration extends Integration {
  _pollForActivities() {
    // In a real implementation, this would connect to Google Docs API
    // For assessment, we'll simulate activity detection
    
    if (Math.random() > 0.65) { // 35% chance of detecting activity
      const titles = [
        'Drafting founding affidavit — Nkosi v Absa',
        'Reviewing settlement agreement — Dlamini',
        'Amending heads of argument — Labour matter',
        'Preparing court bundle — 2024/0512-LIT',
        'Drafting letter of demand — Botha transfer'
      ];
      
      const title = titles[Math.floor(Math.random() * titles.length)];
      const units = Math.floor(Math.random() * 6) + 3; // 3-8 units
      
      return [{
        id: `docs-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: ActivityType.DOCUMENT,
        title,
        units,
        narration: title,
        source: ActivitySource.DOCS,
        timestamp: new Date()
      }];
    }
    
    return [];
  }
}

/**
 * Microsoft Teams integration for call tracking
 */
class TeamsIntegration extends Integration {
  _pollForActivities() {
    // In a real implementation, this would connect to Teams API
    // For assessment, we'll simulate activity detection
    
    if (Math.random() > 0.75) { // 25% chance of detecting activity
      const titles = [
        'Call with client — progress update',
        'Call with sheriff — service of process',
        'Call with registrar — court date',
        'Call with opposing counsel',
        'Call with correspondent attorney'
      ];
      
      const title = titles[Math.floor(Math.random() * titles.length)];
      const units = Math.floor(Math.random() * 2) + 1; // 1-3 units
      
      return [{
        id: `teams-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: ActivityType.CALL,
        title,
        units,
        narration: title,
        source: ActivitySource.TEAMS,
        timestamp: new Date()
      }];
    }
    
    return [];
  }
}

/**
 * Zoom integration for call tracking
 */
class ZoomIntegration extends Integration {
  _pollForActivities() {
    // In a real implementation, this would connect to Zoom API
    // For assessment, we'll simulate activity detection
    
    if (Math.random() > 0.8) { // 20% chance of detecting activity
      const titles = [
        'Call with client — progress update',
        'Call with sheriff — service of process',
        'Call with registrar — court date',
        'Call with opposing counsel',
        'Call with correspondent attorney'
      ];
      
      const title = titles[Math.floor(Math.random() * titles.length)];
      const units = Math.floor(Math.random() * 2) + 1; // 1-3 units
      
      return [{
        id: `zoom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: ActivityType.CALL,
        title,
        units,
        narration: title,
        source: ActivitySource.ZOOM,
        timestamp: new Date()
      }];
    }
    
    return [];
  }
}

/**
 * Browser integration for research tracking
 */
class BrowserIntegration extends Integration {
  _pollForActivities() {
    // In a real implementation, this would monitor browser activity
    // For assessment, we'll simulate activity detection
    
    if (Math.random() > 0.65) { // 35% chance of detecting activity
      const titles = [
        'Legal research — locus standi principles',
        'Reviewing case law: SCA judgments re: costs',
        'Research — section 65 proceedings',
        'Researching prescription Act applicability'
      ];
      
      const title = titles[Math.floor(Math.random() * titles.length)];
      const units = Math.floor(Math.random() * 4) + 3; // 3-6 units
      
      return [{
        id: `browser-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: ActivityType.RESEARCH,
        title,
        units,
        narration: title,
        source: ActivitySource.BROWSER,
        timestamp: new Date()
      }];
    }
    
    return [];
  }
}

/**
 * Creates a simulated activity for demonstration purposes
 * @param {Object} options - Activity options
 * @param {ActivityType} [options.type=ActivityType.EMAIL] - Activity type
 * @param {string} [options.title] - Activity title
 * @param {number} [options.units] - Billable units
 * @param {string} [options.matter] - Matter number
 * @returns {Activity} Simulated activity
 */
export function createSimulatedActivity(options = {}) {
  const {
    type = ActivityType.EMAIL,
    title,
    units,
    matter
  } = options;
  
  // Default titles by type
  const titlesByType = {
    [ActivityType.EMAIL]: [
      'Re: Discovery Documents — Nkosi v Absa',
      'FW: Settlement Proposal — Dlamini Matter',
      'RE: Heads of Argument — Perivolaris'
    ],
    [ActivityType.MEETING]: [
      'Client consultation — Motlhabi Holdings',
      'Team debrief — Litigation matters',
      'Settlement conference — Dlamini'
    ],
    [ActivityType.DOCUMENT]: [
      'Drafting founding affidavit — Nkosi v Absa',
      'Reviewing settlement agreement — Dlamini',
      'Amending heads of argument — Labour matter'
    ],
    [ActivityType.CALL]: [
      'Call with client — progress update',
      'Call with sheriff — service of process',
      'Call with registrar — court date'
    ],
    [ActivityType.RESEARCH]: [
      'Legal research — locus standi principles',
      'Reviewing case law: SCA judgments re: costs',
      'Research — section 65 proceedings'
    ]
  };
  
  // Generate default values
  const defaultTitle = title || titlesByType[type][Math.floor(Math.random() * titlesByType[type].length)];
  const defaultUnits = units || (type === ActivityType.MEETING ? 
    Math.floor(Math.random() * 6) + 5 : 
    Math.floor(Math.random() * 2) + 1);
  const defaultMatter = matter || Object.keys({
    '2024/0512-LIT': { client: 'Nkosi v Absa Bank', partner: 'Stephanie Chetty' },
    '2024/0888-LIT': { client: 'Dlamini Urgent Application', partner: 'Stephanie Chetty' },
    '2025/0103-COM': { client: 'Motlhabi Holdings — SLA Review', partner: 'Aristidis Perivolaris' },
    '2025/0217-LAB': { client: 'Perivolaris Labour Dispute', partner: 'Johan Biggs' },
    '2025/0391-CON': { client: 'Botha Property Transfer', partner: 'Anchané Botha' }
  })[Math.floor(Math.random() * 5)];
  
  // Create source mapping
  const sourceMap = {
    [ActivityType.EMAIL]: ActivitySource.OUTLOOK,
    [ActivityType.MEETING]: ActivitySource.CALENDAR,
    [ActivityType.DOCUMENT]: Math.random() > 0.5 ? ActivitySource.WORD : ActivitySource.DOCS,
    [ActivityType.CALL]: Math.random() > 0.5 ? ActivitySource.TEAMS : ActivitySource.ZOOM,
    [ActivityType.RESEARCH]: ActivitySource.BROWSER
  };
  
  return {
    id: `sim-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    title: defaultTitle,
    units: defaultUnits,
    narration: type === ActivityType.EMAIL ? 
      `Attending to email: ${defaultTitle.substring(0, 60)}` : 
      defaultTitle,
    matter: defaultMatter,
    billable: true,
    time: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
    source: sourceMap[type],
    timestamp: new Date()
  };
}