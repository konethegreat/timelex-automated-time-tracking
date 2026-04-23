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
 * For commercial licensing inquiries, contact: erictshivhinda@gmail.com
 * 
 * IMPORTANT: This assessment submission is provided under Assessment-Specific License terms
 * as documented in the complete project repository. Intentional limitations exist for 
 * assessment purposes only (not for production implementation).
 * 
 * ASSESSMENT WATERMARK: Visible in print and screenshots to prevent unauthorized production use
 * This watermark appears when printing or capturing screenshots of the application
 */

/**
 * Invoice generation module for legal time tracking applications
 * 
 * Provides professional invoice generation capabilities:
 * - Invoice preview rendering
 * - PDF export functionality
 * - Ghost Practice integration
 * - Customizable invoice templates
 * 
 * Designed specifically for legal industry requirements with attention to:
 * - Legal billing standards
 * - Matter-specific formatting
 * - VAT calculations
 * - Assessment-specific limitations for prototype purposes
 * 
 * Note: This is a simulated implementation for assessment purposes. A production
 * version would include actual PDF generation and enhanced Ghost Practice integration.
 */

/**
 * Invoice type enum
 * @enum {string}
 */
export const InvoiceType = {
  PRO_FORMA: 'Pro-Forma',
  FINAL: 'Final Invoice'
};

/**
 * Invoice configuration options
 * @typedef {Object} InvoiceConfig
 * @property {string} [firmName='MOTSOENENG BILL ATTORNEYS'] - Law firm name
 * @property {string} [firmAddress='Houghton Estate, Johannesburg'] - Firm address
 * @property {string} [firmContact='Tel: +27 11 463 9401 · www.mb.co.za'] - Firm contact info
 * @property {number} [defaultRate=3500] - Default hourly rate
 * @property {number} [defaultVatRate=15] - Default VAT rate
 * @property {string} [currency='R'] - Currency symbol
 * @property {Object} [rateOverrides] - Matter-specific rate overrides
 */

/**
 * Invoice object structure
 * @typedef {Object} Invoice
 * @property {string} id - Invoice ID
 * @property {InvoiceType} type - Invoice type
 * @property {string} matterNumber - Matter number
 * @property {string} clientName - Client name
 * @property {Date} date - Invoice date
 * @property {Object[]} entries - Invoice line items
 * @property {number} rate - Hourly rate
 * @property {number} vatRate - VAT rate
 * @property {number} subtotal - Subtotal amount
 * @property {number} vat - VAT amount
 * @property {number} total - Total amount
 */

/**
 * Invoice line item object
 * @typedef {Object} InvoiceLineItem
 * @property {string} time - Time entry timestamp
 * @property {string} narration - Description of work
 * @property {number} units - Billable units
 * @property {number} hours - Hours (units * 0.1)
 * @property {number} amount - Amount (hours * rate)
 */

/**
 * Invoice generator class for creating professional legal invoices
 */
export class InvoiceGenerator {
  /**
   * Creates a new InvoiceGenerator instance
   * @param {Object} dependencies - Dependencies object
   * @param {Function} dependencies.toast - Toast notification function
   * @param {Object} [config={}] - Configuration options
   */
  constructor({ toast }, config = {}) {
    this.toast = toast;
    this.config = {
      firmName: 'MOTSOENENG BILL ATTORNEYS',
      firmAddress: 'Houghton Estate, Johannesburg',
      firmContact: 'Tel: +27 11 463 9401 · www.mb.co.za',
      defaultRate: 3500,
      defaultVatRate: 15,
      currency: 'R',
      rateOverrides: {},
      ...config
    };
    
    this.state = {
      currentInvoice: null,
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
      this.toast('Assessment period has expired - Invoice generation disabled', 'error');
    }
  }
  
  /**
   * Generates an invoice preview
   * @param {Object} options - Invoice options
   * @param {string} options.matterNumber - Matter number to filter by
   * @param {InvoiceType} options.type - Invoice type
   * @param {number} options.rate - Hourly rate
   * @param {number} options.vatRate - VAT rate
   * @param {Object[]} options.entries - Time entries to include
   * @returns {Invoice} Generated invoice
   */
  generateInvoicePreview({ matterNumber, type, rate, vatRate, entries }) {
    if (!this.state.assessmentWatermark) {
      this.toast('Assessment period has expired - Invoice generation disabled', 'error');
      return null;
    }
    
    try {
      // Filter entries based on matter
      const filteredEntries = matterNumber === 'all' 
        ? entries 
        : entries.filter(e => e.matter === matterNumber);
      
      // Calculate invoice amounts
      const subtotal = this._calculateSubtotal(filteredEntries, rate);
      const vat = this._calculateVat(subtotal, vatRate);
      const total = subtotal + vat;
      
      // Get client name and matter reference
      let clientName = 'Multiple Clients (Consolidated)';
      let matterRef = 'All Active Matters';
      
      if (matterNumber !== 'all') {
        const matter = this._getMatterDetails(matterNumber);
        clientName = matter ? matter.client : 'Client Name';
        matterRef = `Matter: ${matterNumber}`;
      }
      
      // Generate invoice ID
      const invoiceId = this._generateInvoiceId(type);
      
      // Create invoice object
      const invoice = {
        id: invoiceId,
        type,
        matterNumber,
        clientName,
        matterRef,
        date: new Date(),
        entries: this._formatInvoiceEntries(filteredEntries),
        rate,
        vatRate,
        subtotal,
        vat,
        total
      };
      
      this.state.currentInvoice = invoice;
      return invoice;
    } catch (error) {
      console.error('Invoice generation error:', error);
      this.toast('Failed to generate invoice preview', 'error');
      return null;
    }
  }
  
  /**
   * Gets matter details for invoice
   * @param {string} matterNumber - Matter number
   * @returns {Object|null} Matter details or null
   * @private
   */
  _getMatterDetails(matterNumber) {
    // In production, this would fetch from a matter database
    // For assessment, we'll use a simulated lookup
    
    const matters = {
      '2024/0512-LIT': { client: 'Nkosi v Absa Bank', partner: 'Stephanie Chetty' },
      '2024/0888-LIT': { client: 'Dlamini Urgent Application', partner: 'Stephanie Chetty' },
      '2025/0103-COM': { client: 'Motlhabi Holdings — SLA Review', partner: 'Aristidis Perivolaris' },
      '2025/0217-LAB': { client: 'Perivolaris Labour Dispute', partner: 'Johan Biggs' },
      '2025/0391-CON': { client: 'Botha Property Transfer', partner: 'Anchané Botha' }
    };
    
    return matters[matterNumber] || null;
  }
  
  /**
   * Formats time entries for invoice display
   * @param {Object[]} entries - Time entries
   * @returns {InvoiceLineItem[]} Formatted line items
   * @private
   */
  _formatInvoiceEntries(entries) {
    return entries.map(e => ({
      time: e.time,
      narration: e.narration,
      units: e.units,
      hours: e.units * 0.1,
      amount: e.units * 0.1 * this.config.defaultRate
    }));
  }
  
  /**
   * Calculates invoice subtotal
   * @param {Object[]} entries - Time entries
   * @param {number} rate - Hourly rate
   * @returns {number} Subtotal amount
   * @private
   */
  _calculateSubtotal(entries, rate) {
    return entries.reduce((sum, e) => {
      return sum + (e.units * 0.1 * rate);
    }, 0);
  }
  
  /**
   * Calculates VAT amount
   * @param {number} subtotal - Subtotal amount
   * @param {number} vatRate - VAT rate
   * @returns {number} VAT amount
   * @private
   */
  _calculateVat(subtotal, vatRate) {
    return subtotal * (vatRate / 100);
  }
  
  /**
   * Generates a unique invoice ID
   * @param {InvoiceType} type - Invoice type
   * @returns {string} Invoice ID
   * @private
   */
  _generateInvoiceId(type) {
    const prefix = type === InvoiceType.PRO_FORMA ? 'PF' : 'INV';
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const rand = String(Math.floor(Math.random() * 900) + 100);
    
    return `#${prefix}-${year}-${month}-${rand}`;
  }
  
  /**
   * Renders the invoice preview in the UI
   * @param {Invoice} invoice - Invoice to render
   */
  renderInvoicePreview(invoice) {
    if (!invoice) {
      this._clearInvoicePreview();
      return;
    }
    
    // Update header
    document.getElementById('inv-client-name').textContent = invoice.clientName;
    document.getElementById('inv-matter-ref').textContent = invoice.matterRef;
    document.getElementById('inv-label').textContent = 
      invoice.type === InvoiceType.PRO_FORMA ? 'PRO-FORMA INVOICE' : 'TAX INVOICE';
    document.getElementById('inv-number').textContent = invoice.id;
    document.getElementById('inv-date').textContent = 
      `Date: ${this._formatDate(invoice.date)}`;
    
    // Update line items
    const tbody = document.getElementById('inv-lines');
    if (invoice.entries.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="color:#999;text-align:center;padding:16px">
            No approved billable entries for this matter
          </td>
        </tr>
      `;
      document.getElementById('inv-subtotal').textContent = 'R 0.00';
      document.getElementById('inv-vat-amount').textContent = 'R 0.00';
      document.getElementById('inv-total').textContent = 'R 0.00';
      return;
    }
    
    tbody.innerHTML = invoice.entries.map(e => `
      <tr>
        <td>${e.time}</td>
        <td>${e.narration}</td>
        <td style="text-align:center">${e.units}</td>
        <td style="text-align:center">${e.hours.toFixed(1)}</td>
        <td>${this.config.currency} ${e.amount.toFixed(2)}</td>
      </tr>
    `).join('');
    
    // Update totals
    document.getElementById('inv-subtotal').textContent = 
      `${this.config.currency} ${invoice.subtotal.toFixed(2)}`;
    document.getElementById('inv-vat-amount').textContent = 
      `${this.config.currency} ${invoice.vat.toFixed(2)}`;
    document.getElementById('inv-total').textContent = 
      `${this.config.currency} ${invoice.total.toFixed(2)}`;
  }
  
  /**
   * Formats a date for invoice display
   * @param {Date} date - Date to format
   * @returns {string} Formatted date
   * @private
   */
  _formatDate(date) {
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  /**
   * Clears the invoice preview
   * @private
   */
  _clearInvoicePreview() {
    document.getElementById('inv-client-name').textContent = 'Client Name';
    document.getElementById('inv-matter-ref').textContent = 'Matter: —';
    document.getElementById('inv-label').textContent = 'PRO-FORMA INVOICE';
    document.getElementById('inv-number').textContent = '#PF-2026-0422';
    document.getElementById('inv-date').textContent = 'Date: 22 April 2026';
    
    const tbody = document.getElementById('inv-lines');
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="color:#999;text-align:center;padding:16px">
          No approved billable entries for this matter
        </td>
      </tr>
    `;
    
    document.getElementById('inv-subtotal').textContent = 'R 0.00';
    document.getElementById('inv-vat-amount').textContent = 'R 0.00';
    document.getElementById('inv-total').textContent = 'R 0.00';
  }
  
  /**
   * Prints the current invoice
   */
  printInvoice() {
    if (!this.state.assessmentWatermark) {
      alert('This is an assessment prototype only - contact Kone Tshivhinda for licensing');
      return;
    }
    
    if (!this.state.currentInvoice) {
      this.toast('No invoice to print - please generate a preview first', 'warning');
      return;
    }
    
    window.print();
  }
  
  /**
   * Pushes the current invoice to Ghost Practice
   * @param {Object} gpIntegration - Ghost Practice integration instance
   */
  async pushToGP(gpIntegration) {
    if (!this.state.assessmentWatermark) {
      this.toast('This is an assessment prototype only - contact Kone Tshivhinda for licensing', 'error');
      return;
    }
    
    if (!this.state.currentInvoice) {
      this.toast('No invoice to push - please generate a preview first', 'warning');
      return;
    }
    
    // Get approved billable entries
    const approvedEntries = this._getApprovedBillableEntries();
    
    if (approvedEntries.length === 0) {
      this.toast('No approved billable entries to push', 'warning');
      return;
    }
    
    try {
      // Create GP time entries
      const gpEntries = this._createGPTimeEntries(approvedEntries);
      
      // Push to GP
      const result = await gpIntegration.pushTimeEntries(gpEntries);
      
      // Show summary
      if (result.success > 0) {
        this.toast(`Successfully pushed ${result.success} time entry${result.success > 1 ? 's' : ''} to Ghost Practice`, 'success');
        
        // Clear pushed entries if all were successful
        if (result.success === approvedEntries.length) {
          this._clearApprovedEntries();
        }
      }
    } catch (error) {
      this.toast(`Failed to push entries to Ghost Practice: ${error.message}`, 'error');
    }
  }
  
  /**
   * Gets approved billable entries from application state
   * @returns {Object[]} Approved billable entries
   * @private
   */
  _getApprovedBillableEntries() {
    // This would be implemented by the application
    // For the module, we assume it will be provided by the application
    if (typeof window.App !== 'undefined' && window.App.getApprovedBillableEntries) {
      return window.App.getApprovedBillableEntries();
    }
    return [];
  }
  
  /**
   * Clears approved billable entries from application state
   * @private
   */
  _clearApprovedEntries() {
    // This would be implemented by the application
    // For the module, we assume it will be provided by the application
    if (typeof window.App !== 'undefined' && window.App.clearApprovedEntries) {
      window.App.clearApprovedEntries();
    }
  }
  
  /**
   * Creates GP time entries from TimeLex entries
   * @param {Object[]} timeLexEntries - TimeLex entry objects
   * @returns {Object[]} GP time entries
   * @private
   */
  _createGPTimeEntries(timeLexEntries) {
    return timeLexEntries.map(entry => ({
      id: '',
      matterNumber: entry.matter,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      time: entry.time,
      units: entry.units,
      narration: entry.narration,
      billable: entry.billable,
      type: entry.type,
      source: 'TimeLex'
    }));
  }
  
  /**
   * Initializes the invoice generator with legacy functions
   * For backward compatibility with existing code
   * @param {Object} dependencies - Dependencies object
   * @param {Function} dependencies.toast - Toast notification function
   * @param {Object} dependencies.gpIntegration - Ghost Practice integration
   */
  initLegacyFunctions({ toast, gpIntegration }) {
    // Create legacy updateInvoicePreview function
    window.updateInvoicePreview = () => {
      if (!this.state.assessmentWatermark) {
        toast('This is an assessment prototype only - contact Kone Tshivhinda for licensing', 'error');
        return;
      }
      
      const matterFilter = document.getElementById('inv-matter').value;
      const rate = parseFloat(document.getElementById('inv-rate').value) || 3500;
      const vatPct = parseFloat(document.getElementById('inv-vat').value) / 100 || 0.15;
      const type = document.getElementById('inv-type').value;
      
      const invoice = this.generateInvoicePreview({
        matterNumber: matterFilter,
        type,
        rate,
        vatRate: vatPct * 100,
        entries: this._getApprovedBillableEntries()
      });
      
      this.renderInvoicePreview(invoice);
    };
    
    // Create legacy printInvoice function
    window.printInvoice = () => {
      this.printInvoice();
    };
    
    // Create legacy pushToGP function
    window.pushToGP = async () => {
      await this.pushToGP(gpIntegration);
    };
  }
}