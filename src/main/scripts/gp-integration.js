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
 * Ghost Practice integration module for legal time tracking applications
 * 
 * Provides secure, reliable integration with Ghost Practice practice management system:
 * - Time entry synchronization
 * - Matter data retrieval
 * - Invoice generation
 * - Authentication and authorization
 * 
 * Designed specifically for legal industry requirements with attention to:
 * - Data privacy and security
 * - Error handling and recovery
 * - Rate limiting and API constraints
 * - Assessment-specific limitations for prototype purposes
 * 
 * Note: This is a simulated implementation for assessment purposes. A production
 * version would include actual API credentials management and enhanced security.
 */

/**
 * Ghost Practice API endpoint configuration
 * @typedef {Object} GPApiConfig
 * @property {string} baseUrl - Base URL for GP API
 * @property {string} authEndpoint - Authentication endpoint
 * @property {string} timeEntriesEndpoint - Time entries endpoint
 * @property {string} mattersEndpoint - Matters endpoint
 * @property {string} invoicesEndpoint - Invoices endpoint
 */

/**
 * Authentication token object
 * @typedef {Object} AuthToken
 * @property {string} accessToken - Access token
 * @property {string} refreshToken - Refresh token
 * @property {number} expiresIn - Token expiration in seconds
 * @property {number} obtainedAt - Timestamp when token was obtained
 */

/**
 * Integration status enum
 * @enum {string}
 */
export const GPIntegrationStatus = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
  EXPIRED: 'expired'
};

/**
 * Time entry object structure for Ghost Practice
 * @typedef {Object} GPTimeEntry
 * @property {string} id - Time entry ID (empty for new entries)
 * @property {string} matterNumber - Matter number in GP format
 * @property {string} date - Date of entry (YYYY-MM-DD)
 * @property {string} time - Time of entry (HH:mm)
 * @property {number} units - Billable units (6-minute increments)
 * @property {string} narration - Detailed description of work
 * @property {boolean} billable - Whether entry is billable
 * @property {string} [type] - Entry type (optional)
 * @property {string} [source] - Source of entry (e.g., "TimeLex")
 */

/**
 * Matter object structure from Ghost Practice
 * @typedef {Object} GPMatter
 * @property {string} matterNumber - Official matter number
 * @property {string} client - Client name
 * @property {string} partner - Responsible attorney
 * @property {string} status - Matter status
 * @property {string} [department] - Department/category
 * @property {Date} [openedDate] - Date matter was opened
 */

/**
 * Ghost Practice integration class
 */
export class GhostPracticeIntegration {
  /**
   * Creates a new GhostPracticeIntegration instance
   * @param {Object} dependencies - Dependencies object
   * @param {Function} dependencies.toast - Toast notification function
   * @param {Object} [config={}] - Configuration options
   */
  constructor({ toast }, config = {}) {
    this.toast = toast;
    this.config = {
      baseUrl: 'https://api.ghostpractice.com/v1',
      clientId: 'timel-ex-assessment',
      clientSecret: 'assessment-only-secret',
      scope: 'time_entries:write matters:read invoices:write',
      ...config
    };
    
    this.state = {
      status: GPIntegrationStatus.DISCONNECTED,
      authToken: null,
      lastSync: null,
      errorCount: 0,
      maxErrors: 3,
      assessmentWatermark: true
    };
    
    // Check assessment integrity
    this._checkAssessmentIntegrity();
  }
  
  /**
   * Checks if assessment period has expired
   */
  _checkAssessmentIntegrity() {
    const assessmentDate = new Date('2026-05-07');
    const today = new Date();
    
    if (today > assessmentDate) {
      this.state.assessmentWatermark = false;
      this.state.status = GPIntegrationStatus.EXPIRED;
      this.toast('Assessment period has expired - GP integration disabled', 'error');
    }
  }
  
  /**
   * Gets the current integration status
   * @returns {GPIntegrationStatus} Current status
   */
  getStatus() {
    return this.state.status;
  }
  
  /**
   * Checks if integration is connected
   * @returns {boolean} True if connected
   */
  isConnected() {
    return this.state.status === GPIntegrationStatus.CONNECTED;
  }
  
  /**
   * Authenticates with Ghost Practice API
   * @returns {Promise<boolean>} True if authentication successful
   */
  async authenticate() {
    if (!this.state.assessmentWatermark) {
      this.toast('Assessment period has expired - GP integration disabled', 'error');
      return false;
    }
    
    this.state.status = GPIntegrationStatus.CONNECTING;
    
    try {
      // In production, this would make a real API call to authenticate
      // For assessment, we'll simulate authentication
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For assessment purposes, always "succeed" authentication
      this.state.authToken = {
        accessToken: 'assessment-token-' + Math.random().toString(36).substr(2, 10),
        refreshToken: 'assessment-refresh-' + Math.random().toString(36).substr(2, 10),
        expiresIn: 3600,
        obtainedAt: Date.now()
      };
      
      this.state.status = GPIntegrationStatus.CONNECTED;
      this.state.lastSync = new Date();
      this.state.errorCount = 0;
      
      this.toast('Connected to Ghost Practice', 'success');
      return true;
    } catch (error) {
      console.error('GP authentication error:', error);
      this.state.errorCount++;
      this.state.status = GPIntegrationStatus.ERROR;
      
      if (this.state.errorCount >= this.config.maxErrors) {
        this.toast('Failed to connect to Ghost Practice after multiple attempts', 'error');
      } else {
        this.toast(`Connection attempt ${this.state.errorCount} failed`, 'error');
      }
      
      return false;
    }
  }
  
  /**
   * Checks if access token is valid
   * @returns {boolean} True if token is valid
   */
  _isTokenValid() {
    if (!this.state.authToken) return false;
    
    const expiresIn = this.state.authToken.expiresIn * 1000;
    const obtainedAt = this.state.authToken.obtainedAt;
    const now = Date.now();
    
    return (now - obtainedAt) < expiresIn;
  }
  
  /**
   * Gets a valid access token (refreshing if necessary)
   * @returns {Promise<string>} Access token
   * @private
   */
  async _getValidToken() {
    if (!this._isTokenValid()) {
      // In production, this would refresh the token
      // For assessment, we'll just re-authenticate
      await this.authenticate();
    }
    
    return this.state.authToken.accessToken;
  }
  
  /**
   * Makes an API request to Ghost Practice
   * @param {string} endpoint - API endpoint
   * @param {Object} [options={}] - Request options
   * @returns {Promise<Object>} API response
   * @private
   */
  async _apiRequest(endpoint, options = {}) {
    if (!this.state.assessmentWatermark) {
      throw new Error('Assessment period has expired - GP integration disabled');
    }
    
    if (!this.isConnected()) {
      throw new Error('Not connected to Ghost Practice');
    }
    
    try {
      const token = await this._getValidToken();
      const url = `${this.config.baseUrl}${endpoint}`;
      
      // In production, this would make a real fetch request
      // For assessment, we'll simulate the API call
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
      
      // Simulate API response based on endpoint
      if (endpoint.includes('/time-entries')) {
        if (options.method === 'POST') {
          return {
            success: true,
            id: 'gp-' + Math.random().toString(36).substr(2, 10),
            message: 'Time entry created successfully'
          };
        }
      } else if (endpoint.includes('/matters')) {
        return this._getSimulatedMattersResponse();
      }
      
      // Default successful response
      return {
        success: true,
        data: {}
      };
    } catch (error) {
      console.error('GP API request error:', error);
      this.state.errorCount++;
      
      if (this.state.errorCount >= this.config.maxErrors) {
        this.state.status = GPIntegrationStatus.ERROR;
        throw new Error('GP API error: ' + error.message);
      }
      
      throw error;
    }
  }
  
  /**
   * Gets simulated matters response for assessment
   * @returns {Object} Simulated API response
   * @private
   */
  _getSimulatedMattersResponse() {
    const matters = [
      {
        matterNumber: '2024/0512-LIT',
        client: 'Nkosi v Absa Bank',
        partner: 'Stephanie Chetty',
        status: 'Active',
        department: 'Litigation'
      },
      {
        matterNumber: '2024/0888-LIT',
        client: 'Dlamini Urgent Application',
        partner: 'Stephanie Chetty',
        status: 'Active',
        department: 'Litigation'
      },
      {
        matterNumber: '2025/0103-COM',
        client: 'Motlhabi Holdings — SLA Review',
        partner: 'Aristidis Perivolaris',
        status: 'Active',
        department: 'Corporate'
      },
      {
        matterNumber: '2025/0217-LAB',
        client: 'Perivolaris Labour Dispute',
        partner: 'Johan Biggs',
        status: 'Active',
        department: 'Labour'
      },
      {
        matterNumber: '2025/0391-CON',
        client: 'Botha Property Transfer',
        partner: 'Anchané Botha',
        status: 'Active',
        department: 'Contractual'
      }
    ];
    
    return {
      success: true,
      data: matters,
      count: matters.length
    };
  }
  
  /**
   * Syncs matters from Ghost Practice
   * @returns {Promise<GPMatter[]>} Array of matters
   */
  async syncMatters() {
    if (!this.state.assessmentWatermark) {
      this.toast('Assessment period has expired - GP integration disabled', 'error');
      return [];
    }
    
    if (!this.isConnected()) {
      const success = await this.authenticate();
      if (!success) {
        return [];
      }
    }
    
    try {
      // For assessment, return simulated matters
      const response = this._getSimulatedMattersResponse();
      
      if (response.success) {
        this.state.lastSync = new Date();
        this.state.errorCount = 0;
        return response.data;
      }
      
      throw new Error('Failed to sync matters');
    } catch (error) {
      console.error('Matter sync error:', error);
      this.toast('Failed to sync matters from Ghost Practice', 'error');
      return [];
    }
  }
  
  /**
   * Pushes a single time entry to Ghost Practice
   * @param {GPTimeEntry} entry - Time entry to push
   * @returns {Promise<boolean>} True if push successful
   */
  async pushTimeEntry(entry) {
    if (!this.state.assessmentWatermark) {
      this.toast('Assessment period has expired - GP integration disabled', 'error');
      return false;
    }
    
    if (!this.isConnected()) {
      const success = await this.authenticate();
      if (!success) {
        return false;
      }
    }
    
    try {
      // In production, this would make a real API call
      // For assessment, we'll simulate the push
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // For assessment, always succeed
      this.state.lastSync = new Date();
      this.state.errorCount = 0;
      
      this.toast(`Time entry pushed to Ghost Practice: ${entry.narration.substring(0, 30)}...`, 'success');
      return true;
    } catch (error) {
      console.error('Time entry push error:', error);
      this.toast(`Failed to push time entry to Ghost Practice: ${error.message}`, 'error');
      return false;
    }
  }
  
  /**
   * Pushes multiple time entries to Ghost Practice
   * @param {GPTimeEntry[]} entries - Time entries to push
   * @returns {Promise<{success: number, failed: number}>} Result summary
   */
  async pushTimeEntries(entries) {
    if (!this.state.assessmentWatermark) {
      this.toast('Assessment period has expired - GP integration disabled', 'error');
      return { success: 0, failed: entries.length };
    }
    
    if (entries.length === 0) {
      return { success: 0, failed: 0 };
    }
    
    if (!this.isConnected()) {
      const success = await this.authenticate();
      if (!success) {
        this.toast('Cannot push time entries - not connected to Ghost Practice', 'error');
        return { success: 0, failed: entries.length };
      }
    }
    
    let successCount = 0;
    let failedCount = 0;
    
    // Process entries sequentially with delays to simulate API rate limits
    for (const entry of entries) {
      try {
        const success = await this.pushTimeEntry(entry);
        if (success) {
          successCount++;
        } else {
          failedCount++;
        }
        
        // Simulate rate limiting delay between entries
        if (entries.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        failedCount++;
        console.error('Failed to push entry:', error);
      }
    }
    
    // Show summary notification
    if (successCount > 0 && failedCount === 0) {
      this.toast(`Successfully pushed ${successCount} time entry${successCount > 1 ? 's' : ''} to Ghost Practice`, 'success');
    } else if (successCount > 0) {
      this.toast(`Pushed ${successCount} of ${entries.length} time entries to Ghost Practice`, 'warning');
    } else {
      this.toast(`Failed to push ${failedCount} time entry${failedCount > 1 ? 's' : ''} to Ghost Practice`, 'error');
    }
    
    return { success: successCount, failed: failedCount };
  }
  
  /**
   * Generates an invoice in Ghost Practice
   * @param {Object} invoiceData - Invoice data
   * @param {string} invoiceData.matterNumber - Matter number
   * @param {string} invoiceData.invoiceType - Type of invoice (Pro-Forma, Final)
   * @param {Object[]} invoiceData.entries - Time entries to include
   * @param {number} invoiceData.rate - Hourly rate
   * @param {number} invoiceData.vatRate - VAT rate
   * @returns {Promise<string>} Invoice number
   */
  async generateInvoice(invoiceData) {
    if (!this.state.assessmentWatermark) {
      this.toast('Assessment period has expired - GP integration disabled', 'error');
      return '';
    }
    
    if (!this.isConnected()) {
      const success = await this.authenticate();
      if (!success) {
        this.toast('Cannot generate invoice - not connected to Ghost Practice', 'error');
        return '';
      }
    }
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For assessment, always succeed
      const invoiceNumber = invoiceData.invoiceType === 'Pro-Forma' 
        ? `#PF-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 900) + 100)}`
        : `#INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 900) + 100)}`;
      
      this.state.lastSync = new Date();
      this.state.errorCount = 0;
      
      this.toast(`Invoice ${invoiceNumber} generated successfully`, 'success');
      return invoiceNumber;
    } catch (error) {
      console.error('Invoice generation error:', error);
      this.toast(`Failed to generate invoice: ${error.message}`, 'error');
      return '';
    }
  }
  
  /**
   * Gets the last sync timestamp
   * @returns {Date|null} Last sync timestamp or null
   */
  getLastSyncTime() {
    return this.state.lastSync;
  }
  
  /**
   * Disconnects from Ghost Practice
   */
  disconnect() {
    this.state.authToken = null;
    this.state.status = GPIntegrationStatus.DISCONNECTED;
    this.toast('Disconnected from Ghost Practice', 'info');
  }
}

/**
 * Creates a GP time entry from a TimeLex entry
 * @param {Object} timeLexEntry - TimeLex entry object
 * @param {string} timeLexEntry.matter - Matter number
 * @param {string} timeLexEntry.narration - Entry narration
 * @param {number} timeLexEntry.units - Billable units
 * @param {string} timeLexEntry.time - Time of entry
 * @param {boolean} timeLexEntry.billable - Whether entry is billable
 * @returns {GPTimeEntry} GP time entry
 */
export function createGPTimeEntry(timeLexEntry) {
  // Parse the timeLexEntry.time which is in format "HH:mm"
  const [hours, minutes] = timeLexEntry.time.split(':');
  const entryDate = new Date();
  entryDate.setHours(parseInt(hours, 10));
  entryDate.setMinutes(parseInt(minutes, 10));
  entryDate.setSeconds(0);
  entryDate.setMilliseconds(0);
  
  return {
    id: '',
    matterNumber: timeLexEntry.matter,
    date: entryDate.toISOString().split('T')[0], // YYYY-MM-DD
    time: timeLexEntry.time,
    units: timeLexEntry.units,
    narration: timeLexEntry.narration,
    billable: timeLexEntry.billable,
    type: timeLexEntry.type,
    source: 'TimeLex'
  };
}

/**
 * Creates multiple GP time entries from TimeLex entries
 * @param {Object[]} timeLexEntries - Array of TimeLex entry objects
 * @returns {GPTimeEntry[]} Array of GP time entries
 */
export function createGPTimeEntries(timeLexEntries) {
  return timeLexEntries.map(createGPTimeEntry);
}

/**
 * Initializes the GP integration with legacy pushToGP function
 * For backward compatibility with existing code
 * @param {Object} dependencies - Dependencies object
 * @param {Function} dependencies.toast - Toast notification function
 * @param {Function} dependencies.pushTimeEntries - Function to push time entries
 */
export function initLegacyGPIntegration({ toast, pushTimeEntries }) {
  // Create a legacy pushToGP function that matches the existing implementation
  window.pushToGP = async () => {
    if (!window.App) {
      toast('Application not initialized', 'error');
      return;
    }
    
    // Get approved billable entries
    const approvedEntries = window.App.getApprovedBillableEntries();
    
    if (approvedEntries.length === 0) {
      toast('No approved billable entries to push', 'warning');
      return;
    }
    
    try {
      // Create GP time entries
      const gpEntries = createGPTimeEntries(approvedEntries);
      
      // Push to GP
      const result = await pushTimeEntries(gpEntries);
      
      // Show summary
      if (result.success > 0) {
        toast(`Successfully pushed ${result.success} time entry${result.success > 1 ? 's' : ''} to Ghost Practice`, 'success');
        
        // Clear pushed entries
        if (result.success === approvedEntries.length) {
          window.App.clearApprovedEntries();
        }
      }
    } catch (error) {
      toast(`Failed to push entries to Ghost Practice: ${error.message}`, 'error');
    }
  };
}