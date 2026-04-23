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
 * Date and time utility functions for time tracking applications
 * 
 * Provides specialized helpers for legal time tracking including:
 * - 6-minute billing unit conversions
 * - Time formatting for legal billing standards
 * - Date range calculations for reporting periods
 * - Day of week helpers for business day calculations
 * 
 * Designed specifically for legal time tracking requirements where precision 
 * and compliance with billing standards are critical.
 */

/**
 * Converts minutes to 6-minute billing units (standard in legal industry)
 * @param {number} minutes - Total minutes to convert
 * @returns {number} Number of 6-minute billing units (rounded up)
 * @example
 * // Returns 2 (12 minutes = 2 units)
 * toBillingUnits(12)
 * 
 * @example
 * // Returns 3 (13 minutes = 2.17 units → rounded up to 3 units)
 * toBillingUnits(13)
 */
export function toBillingUnits(minutes) {
  // Legal industry standard: round up to nearest 6-minute unit
  return Math.ceil(minutes / 6);
}

/**
 * Converts billing units back to minutes
 * @param {number} units - Number of billing units
 * @returns {number} Total minutes
 * @example
 * // Returns 12 (2 units × 6 minutes)
 * toMinutes(2)
 */
export function toMinutes(units) {
  return units * 6;
}

/**
 * Formats time in billing units for display
 * @param {number} units - Number of billing units
 * @returns {string} Formatted string (e.g., "2 units", "1 unit")
 */
export function formatBillingUnits(units) {
  return `${units} unit${units === 1 ? '' : 's'}`;
}

/**
 * Formats time entry duration for display in legal context
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 * @example
 * // Returns "12m (2 units)"
 * formatDuration(12)
 * 
 * @example
 * // Returns "13m (3 units)"
 * formatDuration(13)
 */
export function formatDuration(minutes) {
  const units = toBillingUnits(minutes);
  return `${minutes}m (${units} ${units === 1 ? 'unit' : 'units'})`;
}

/**
 * Gets current time formatted for legal time entries
 * @returns {string} Current time in HH:mm format
 */
export function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-ZA', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Gets current date in ISO format (YYYY-MM-DD)
 * @returns {string} Current date in ISO format
 */
export function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Gets the start of the current billing period (1st of current month)
 * @returns {Date} Start date of current billing period
 */
export function getBillingPeriodStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

/**
 * Gets the end of the current billing period (last day of current month)
 * @returns {Date} End date of current billing period
 */
export function getBillingPeriodEnd() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0);
}

/**
 * Checks if a date is a business day (Monday-Friday)
 * @param {Date} date - Date to check
 * @returns {boolean} True if business day, false otherwise
 */
export function isBusinessDay(date) {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday to Friday
}

/**
 * Gets the number of business days between two dates (inclusive)
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} Number of business days
 */
export function getBusinessDaysBetween(startDate, endDate) {
  let count = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    if (isBusinessDay(currentDate)) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return count;
}

/**
 * Formats a date for display in legal context
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string (e.g., "Wednesday, 22 April 2026")
 */
export function formatDate(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Date(date).toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formats a date specifically for invoice generation
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string (e.g., "22 April 2026")
 */
export function formatInvoiceDate(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Date(date).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Gets the ISO week number for a date
 * @param {Date} date - Date to check
 * @returns {number} ISO week number
 */
export function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  // January 4 is always in week 1
  const week1 = new Date(d.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

/**
 * Gets the date range for the current ISO week
 * @returns {Object} Object containing start and end dates of the current week
 */
export function getCurrentWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is Sunday
  
  const start = new Date(now.setDate(diff));
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return {
    start,
    end
  };
}

/**
 * Determines if two dates are in the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if dates are in the same day
 */
export function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

/**
 * Adds days to a date
 * @param {Date} date - Original date
 * @param {number} days - Number of days to add
 * @returns {Date} New date with days added
 */
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Gets the month name for a date
 * @param {Date} date - Date to check
 * @returns {string} Month name
 */
export function getMonthName(date) {
  return date.toLocaleDateString('en-ZA', { month: 'long' });
}

/**
 * Gets the year for a date
 * @param {Date} date - Date to check
 * @returns {number} Year
 */
export function getYear(date) {
  return date.getFullYear();
}

/**
 * Formats hours in decimal format to hours and minutes
 * @param {number} decimalHours - Hours in decimal format (e.g., 1.5)
 * @returns {string} Formatted string (e.g., "1h 30m")
 */
export function formatDecimalHours(decimalHours) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}h ${minutes}m`;
}

/**
 * Calculates the progress percentage toward a monthly target
 * @param {number} currentHours - Current hours billed
 * @param {number} targetHours - Monthly target hours
 * @returns {number} Progress percentage (0-100)
 */
export function calculateProgress(currentHours, targetHours) {
  return Math.min(100, Math.round((currentHours / targetHours) * 100));
}

/**
 * Gets the billing period label for a date (e.g., "April 2026")
 * @param {Date} date - Date to check
 * @returns {string} Billing period label
 */
export function getBillingPeriodLabel(date) {
  return `${getMonthName(date)} ${getYear(date)}`;
}

/**
 * Validates if a date string is in ISO format (YYYY-MM-DD)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid ISO date string
 */
export function isValidISODate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10) === dateString;
}

/**
 * Gets the number of days in the current month
 * @param {Date} [date=new Date()] - Optional date to check
 * @returns {number} Number of days in the month
 */
export function getDaysInMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}