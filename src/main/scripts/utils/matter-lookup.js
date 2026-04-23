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
 * TimeLex — Legal Time Capture
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
 * For commercial licensing inquiries, contact: erictshivhinda@gmail.com
 * 
 * IMPORTANT: This assessment submission is provided under Assessment-Specific License terms
 * as documented in the complete project repository. Intentional limitations exist for 
 * assessment purposes only (not for production implementation).
 */

/**
 * Matter lookup and search utilities for legal time tracking applications
 * 
 * Provides specialized functionality for:
 * - Matter autocomplete (search by matter number, client name, or partner)
 * - Matter formatting for display in time entries
 * - Matter validation according to legal industry standards
 * - Matter status tracking for billing purposes
 * 
 * Designed specifically for legal practice management with attention to:
 * - Matter number formatting conventions
 * - Client confidentiality requirements
 * - Integration with practice management systems
 */

/**
 * Matter data structure
 * @typedef {Object} Matter
 * @property {string} matterNumber - Official matter number (e.g., "2024/0512-LIT")
 * @property {string} client - Client name or case title
 * @property {string} partner - Responsible attorney/partner
 * @property {string} [status] - Matter status (e.g., "Active", "Closed", "Litigation")
 * @property {string} [department] - Department/category (e.g., "Litigation", "Corporate")
 * @property {Date} [openedDate] - Date matter was opened
 * @property {Date} [closedDate] - Date matter was closed (if applicable)
 */

/**
 * Matter search configuration options
 * @typedef {Object} MatterSearchOptions
 * @property {boolean} [byNumber=true] - Search by matter number
 * @property {boolean} [byClient=true] - Search by client/case name
 * @property {boolean} [byPartner=true] - Search by responsible attorney
 * @property {boolean} [byDepartment=false] - Search by department/category
 * @property {string} [statusFilter] - Filter by matter status
 * @property {number} [limit=10] - Maximum results to return
 */

/**
 * Validates if a matter number follows standard legal formatting
 * @param {string} matterNumber - Matter number to validate
 * @returns {boolean} True if valid matter number format
 * @example
 * // Returns true
 * isValidMatterNumber("2024/0512-LIT")
 * 
 * @example
 * // Returns false
 * isValidMatterNumber("ABC-123")
 */
export function isValidMatterNumber(matterNumber) {
  if (!matterNumber || typeof matterNumber !== 'string') return false;
  
  // Standard legal matter number format: YYYY/NNNN-TYPE
  // Where TYPE is typically 3-4 letters (LIT, COM, LAB, CON, etc.)
  const matterRegex = /^\d{4}\/\d{4}-[A-Z]{3,4}$/;
  return matterRegex.test(matterNumber.trim().toUpperCase());
}

/**
 * Formats a matter number for consistent display
 * @param {string} matterNumber - Raw matter number
 * @returns {string} Formatted matter number
 * @example
 * // Returns "2024/0512-LIT"
 * formatMatterNumber("2024/0512-lit")
 */
export function formatMatterNumber(matterNumber) {
  if (!matterNumber || typeof matterNumber !== 'string') return '';
  
  const clean = matterNumber.trim().toUpperCase();
  if (!isValidMatterNumber(clean)) return clean;
  
  // Extract components
  const parts = clean.split('/');
  const year = parts[0];
  const number = parts[1].split('-')[0].padStart(4, '0');
  const type = parts[1].split('-')[1];
  
  return `${year}/${number}-${type}`;
}

/**
 * Formats matter for display in time entries
 * @param {Matter} matter - Matter object
 * @returns {string} Formatted matter string
 * @example
 * // Returns "2024/0512-LIT — Nkosi v Absa Bank"
 * formatMatterDisplay({
 *   matterNumber: "2024/0512-LIT",
 *   client: "Nkosi v Absa Bank"
 * })
 */
export function formatMatterDisplay(matter) {
  if (!matter) return '';
  return `${formatMatterNumber(matter.matterNumber)} — ${matter.client || ''}`;
}

/**
 * Searches matters based on query and options
 * @param {Matter[]} matters - Array of matters to search
 * @param {string} query - Search query
 * @param {MatterSearchOptions} [options={}] - Search options
 * @returns {Matter[]} Array of matching matters
 */
export function searchMatters(matters, query, options = {}) {
  if (!query || query.trim() === '') return matters.slice(0, options.limit || 10);
  
  const {
    byNumber = true,
    byClient = true,
    byPartner = true,
    byDepartment = false,
    statusFilter,
    limit = 10
  } = options;
  
  const searchTerm = query.trim().toLowerCase();
  let results = [];
  
  for (const matter of matters) {
    // Skip if status filter is set and doesn't match
    if (statusFilter && matter.status !== statusFilter) continue;
    
    let match = false;
    
    // Search by matter number
    if (byNumber && matter.matterNumber && 
        matter.matterNumber.toLowerCase().includes(searchTerm)) {
      match = true;
    }
    
    // Search by client name
    if (!match && byClient && matter.client && 
        matter.client.toLowerCase().includes(searchTerm)) {
      match = true;
    }
    
    // Search by partner
    if (!match && byPartner && matter.partner && 
        matter.partner.toLowerCase().includes(searchTerm)) {
      match = true;
    }
    
    // Search by department
    if (!match && byDepartment && matter.department && 
        matter.department.toLowerCase().includes(searchTerm)) {
      match = true;
    }
    
    if (match) {
      results.push(matter);
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

/**
 * Creates a matter suggestion list for autocomplete
 * @param {Matter[]} matters - Array of matters
 * @param {string} query - Current input query
 * @param {number} [limit=5] - Maximum suggestions to return
 * @returns {Array<{value: string, label: string}>} Suggestion items
 */
export function getMatterSuggestions(matters, query, limit = 5) {
  const results = searchMatters(matters, query, { limit });
  return results.map(matter => ({
    value: matter.matterNumber,
    label: formatMatterDisplay(matter)
  }));
}

/**
 * Gets matters by status
 * @param {Matter[]} matters - Array of matters
 * @param {string} status - Status to filter by
 * @returns {Matter[]} Filtered matters
 */
export function getMattersByStatus(matters, status) {
  return matters.filter(matter => matter.status === status);
}

/**
 * Gets matters by partner/attorney
 * @param {Matter[]} matters - Array of matters
 * @param {string} partnerName - Partner name to filter by
 * @returns {Matter[]} Filtered matters
 */
export function getMattersByPartner(matters, partnerName) {
  return matters.filter(matter => 
    matter.partner && matter.partner.toLowerCase() === partnerName.toLowerCase()
  );
}

/**
 * Gets matters by department/category
 * @param {Matter[]} matters - Array of matters
 * @param {string} department - Department to filter by
 * @returns {Matter[]} Filtered matters
 */
export function getMattersByDepartment(matters, department) {
  return matters.filter(matter => 
    matter.department && matter.department.toLowerCase() === department.toLowerCase()
  );
}

/**
 * Converts matter data to datalist options HTML
 * @param {Matter[]} matters - Array of matters
 * @returns {string} HTML string for datalist
 */
export function mattersToDatalist(matters) {
  return matters.map(matter => `
    <option value="${matter.matterNumber}" label="${formatMatterDisplay(matter)}">
  `).join('');
}

/**
 * Creates a matter object from minimal data
 * @param {string} matterNumber - Matter number
 * @param {string} client - Client/case name
 * @param {string} [partner] - Responsible attorney
 * @param {Object} [additionalData] - Additional matter properties
 * @returns {Matter} Complete matter object
 */
export function createMatter(matterNumber, client, partner, additionalData = {}) {
  return {
    matterNumber: formatMatterNumber(matterNumber),
    client,
    partner,
    status: 'Active',
    department: additionalData.department || 'General',
    openedDate: additionalData.openedDate || new Date(),
    ...additionalData
  };
}

/**
 * Checks if a matter is billable based on its status
 * @param {Matter} matter - Matter to check
 * @returns {boolean} True if matter is billable
 */
export function isMatterBillable(matter) {
  if (!matter) return false;
  
  // Non-billable matter statuses
  const nonBillableStatuses = ['Closed', 'Conflict', 'Pro Bono'];
  return !nonBillableStatuses.includes(matter.status);
}

/**
 * Gets the appropriate hourly rate for a matter
 * @param {Matter} matter - Matter to check
 * @param {Object} [rateConfig] - Rate configuration
 * @param {number} [rateConfig.defaultRate=3500] - Default hourly rate
 * @param {Object} [rateConfig.departmentRates] - Department-specific rates
 * @returns {number} Hourly rate in Rands
 */
export function getMatterRate(matter, rateConfig = {}) {
  const { 
    defaultRate = 3500, 
    departmentRates = {} 
  } = rateConfig;
  
  if (matter.department && departmentRates[matter.department]) {
    return departmentRates[matter.department];
  }
  
  return defaultRate;
}

/**
 * Determines if a matter is active (accepting time entries)
 * @param {Matter} matter - Matter to check
 * @returns {boolean} True if matter is active
 */
export function isMatterActive(matter) {
  if (!matter) return false;
  
  // Active matter statuses
  const activeStatuses = ['Active', 'Litigation', 'In Progress', 'Open'];
  return activeStatuses.includes(matter.status);
}

/**
 * Sorts matters by recency (most recent first)
 * @param {Matter[]} matters - Array of matters
 * @returns {Matter[]} Sorted matters
 */
export function sortMattersByRecency(matters) {
  return [...matters].sort((a, b) => {
    const dateA = a.openedDate ? new Date(a.openedDate) : new Date(0);
    const dateB = b.openedDate ? new Date(b.openedDate) : new Date(0);
    return dateB - dateA;
  });
}

/**
 * Sorts matters alphabetically by client name
 * @param {Matter[]} matters - Array of matters
 * @returns {Matter[]} Sorted matters
 */
export function sortMattersByClient(matters) {
  return [...matters].sort((a, b) => {
    const clientA = (a.client || '').toLowerCase();
    const clientB = (b.client || '').toLowerCase();
    return clientA.localeCompare(clientB);
  });
}

/**
 * Gets the most recently used matters
 * @param {Matter[]} allMatters - All available matters
 * @param {Array<{matterNumber: string, timestamp: Date}>} usageHistory - Matter usage history
 * @param {number} [limit=5] - Number of matters to return
 * @returns {Matter[]} Recently used matters
 */
export function getRecentlyUsedMatters(allMatters, usageHistory, limit = 5) {
  // Sort usage history by timestamp (most recent first)
  const sortedHistory = [...usageHistory]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Get unique matter numbers in order of recent use
  const recentMatterNumbers = [...new Set(sortedHistory.map(item => item.matterNumber))];
  
  // Map to actual matter objects
  return recentMatterNumbers
    .slice(0, limit)
    .map(number => allMatters.find(m => m.matterNumber === number))
    .filter(Boolean);
}

/**
 * Normalizes matter data from various sources
 * @param {Object} rawData - Raw matter data from API or database
 * @returns {Matter} Normalized matter object
 */
export function normalizeMatterData(rawData) {
  return {
    matterNumber: formatMatterNumber(rawData.matterNumber || rawData.number || ''),
    client: rawData.client || rawData.caseTitle || rawData.clientName || '',
    partner: rawData.partner || rawData.responsibleAttorney || rawData.attorney || '',
    status: rawData.status || 'Active',
    department: rawData.department || rawData.practiceArea || 'General',
    openedDate: rawData.openedDate ? new Date(rawData.openedDate) : undefined,
    closedDate: rawData.closedDate ? new Date(rawData.closedDate) : undefined,
    ...(rawData.additionalData || {})
  };
}

/**
 * Validates a complete matter object
 * @param {Matter} matter - Matter to validate
 * @returns {boolean} True if valid matter
 */
export function validateMatter(matter) {
  if (!matter) return false;
  
  // Matter number is required and must be valid
  if (!matter.matterNumber || !isValidMatterNumber(matter.matterNumber)) return false;
  
  // Client name is required
  if (!matter.client || typeof matter.client !== 'string') return false;
  
  return true;
}