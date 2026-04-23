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
 * Toast notification system for legal time tracking applications
 * 
 * Provides a flexible, user-friendly notification system with:
 * - Multiple notification types (success, error, info, warning)
 * - Customizable duration and positioning
 * - Smooth animations for better user experience
 * - Accessibility features for compliant UI
 * 
 * Designed specifically for legal applications where clear, non-intrusive 
 * notifications are essential during time-sensitive work.
 */

/**
 * Notification type enum
 * @enum {string}
 */
export const ToastType = {
  DEFAULT: 'default',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * Toast notification configuration options
 * @typedef {Object} ToastOptions
 * @property {number} [duration=3000] - Duration in milliseconds before auto-dismissal
 * @property {string} [position='bottom-right'] - Position on screen ('bottom-right', 'bottom-left', 'top-right', 'top-left')
 * @property {boolean} [closable=true] - Whether the toast can be manually dismissed
 * @property {function} [onDismiss] - Callback function when toast is dismissed
 * @property {boolean} [persistent=false] - If true, toast won't auto-dismiss
 */

/**
 * Creates the toast container element if it doesn't exist
 * @returns {HTMLElement} The toast container element
 */
function ensureToastContainer() {
  let container = document.getElementById('toast-container');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 350px;
      padding: 10px;
      pointer-events: none;
    `;
    
    // Default to bottom-right position
    container.style.bottom = '24px';
    container.style.right = '24px';
    
    document.body.appendChild(container);
  }
  
  return container;
}

/**
 * Creates a toast notification element
 * @param {string} message - The notification message
 * @param {ToastType} [type=ToastType.DEFAULT] - The notification type
 * @param {ToastOptions} [options={}] - Configuration options
 * @returns {HTMLElement} The created toast element
 */
function createToastElement(message, type = ToastType.DEFAULT, options = {}) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.style.cssText = `
    background: var(--bg-card2);
    border: 1px solid var(--border2);
    border-left: 3px solid;
    color: var(--text);
    padding: 12px 18px;
    border-radius: 8px;
    font-size: 13px;
    opacity: 0;
    transform: translateY(8px);
    transition: all 0.25s;
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;
  
  // Set border color based on type
  switch (type) {
    case ToastType.SUCCESS:
      toast.style.borderLeftColor = 'var(--green)';
      break;
    case ToastType.ERROR:
      toast.style.borderLeftColor = 'var(--red)';
      break;
    case ToastType.WARNING:
      toast.style.borderLeftColor = 'var(--orange)';
      break;
    case ToastType.INFO:
      toast.style.borderLeftColor = 'var(--blue)';
      break;
    default:
      toast.style.borderLeftColor = 'var(--gold)';
  }
  
  // Add icon based on type
  const icon = document.createElement('span');
  icon.style.cssText = 'font-size: 16px; flex-shrink: 0;';
  
  switch (type) {
    case ToastType.SUCCESS:
      icon.textContent = '✓';
      break;
    case ToastType.ERROR:
      icon.textContent = '✕';
      break;
    case ToastType.WARNING:
      icon.textContent = '!';
      break;
    case ToastType.INFO:
      icon.textContent = 'ℹ';
      break;
    default:
      icon.textContent = '•';
  }
  
  // Add message content
  const content = document.createElement('div');
  content.textContent = message;
  content.style.flex = '1';
  
  // Add close button if closable
  let closeButton;
  if (options.closable !== false) {
    closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.cssText = `
      background: none;
      border: none;
      color: var(--text-dim);
      font-size: 14px;
      cursor: pointer;
      padding: 0 0 0 10px;
      margin: -4px 0 -4px 10px;
      border-left: 1px solid var(--border);
    `;
    
    closeButton.addEventListener('click', () => {
      dismissToast(toast, options.onDismiss);
    });
  }
  
  // Assemble the toast
  toast.appendChild(icon);
  toast.appendChild(content);
  if (closeButton) toast.appendChild(closeButton);
  
  return toast;
}

/**
 * Shows a toast notification
 * @param {string} message - The notification message
 * @param {ToastType} [type=ToastType.DEFAULT] - The notification type
 * @param {ToastOptions} [options={}] - Configuration options
 * @returns {HTMLElement} The toast element that was shown
 */
export function showToast(message, type = ToastType.DEFAULT, options = {}) {
  // Ensure container exists
  const container = ensureToastContainer();
  
  // Create and add the toast
  const toast = createToastElement(message, type, options);
  container.appendChild(toast);
  
  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  
  // Auto-dismiss after duration if not persistent
  if (!options.persistent) {
    const duration = options.duration !== undefined ? options.duration : 3000;
    setTimeout(() => {
      dismissToast(toast, options.onDismiss);
    }, duration);
  }
  
  return toast;
}

/**
 * Dismisses a toast notification
 * @param {HTMLElement} toast - The toast element to dismiss
 * @param {function} [onDismiss] - Optional callback to run after dismissal
 */
export function dismissToast(toast, onDismiss) {
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(8px)';
  
  // Remove after transition
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
      if (typeof onDismiss === 'function') {
        onDismiss();
      }
    }
  }, 250);
}

/**
 * Shows a success notification
 * @param {string} message - The success message
 * @param {ToastOptions} [options={}] - Configuration options
 */
export function showSuccess(message, options = {}) {
  showToast(message, ToastType.SUCCESS, {
    ...options,
    duration: options.duration || 3000
  });
}

/**
 * Shows an error notification
 * @param {string} message - The error message
 * @param {ToastOptions} [options={}] - Configuration options
 */
export function showError(message, options = {}) {
  showToast(message, ToastType.ERROR, {
    ...options,
    duration: options.duration || 4000
  });
}

/**
 * Shows a warning notification
 * @param {string} message - The warning message
 * @param {ToastOptions} [options={}] - Configuration options
 */
export function showWarning(message, options = {}) {
  showToast(message, ToastType.WARNING, {
    ...options,
    duration: options.duration || 3500
  });
}

/**
 * Shows an info notification
 * @param {string} message - The info message
 * @param {ToastOptions} [options={}] - Configuration options
 */
export function showInfo(message, options = {}) {
  showToast(message, ToastType.INFO, {
    ...options,
    duration: options.duration || 3000
  });
}

/**
 * Initializes the toast system with the legacy toast function
 * For backward compatibility with existing code
 */
export function initLegacyToast() {
  // Create a legacy toast function that matches the existing implementation
  window.toast = (msg, type = 'default') => {
    let toastType = ToastType.DEFAULT;
    
    switch (type) {
      case 'success':
        toastType = ToastType.SUCCESS;
        break;
      case 'error':
        toastType = ToastType.ERROR;
        break;
      case 'warning':
        toastType = ToastType.WARNING;
        break;
      case 'info':
        toastType = ToastType.INFO;
        break;
    }
    
    showToast(msg, toastType, { duration: 3000 });
  };
}

/**
 * Sets the position of the toast container
 * @param {string} position - Position ('bottom-right', 'bottom-left', 'top-right', 'top-left')
 */
export function setToastPosition(position) {
  const container = ensureToastContainer();
  
  // Reset all position styles
  container.style.top = '';
  container.style.bottom = '';
  container.style.left = '';
  container.style.right = '';
  
  // Set new position
  switch (position) {
    case 'bottom-right':
      container.style.bottom = '24px';
      container.style.right = '24px';
      break;
    case 'bottom-left':
      container.style.bottom = '24px';
      container.style.left = '24px';
      break;
    case 'top-right':
      container.style.top = '24px';
      container.style.right = '24px';
      break;
    case 'top-left':
      container.style.top = '24px';
      container.style.left = '24px';
      break;
    default:
      console.warn(`Invalid toast position: ${position}. Using default (bottom-right).`);
      container.style.bottom = '24px';
      container.style.right = '24px';
  }
}

/**
 * Clears all active toasts
 */
export function clearAllToasts() {
  const container = document.getElementById('toast-container');
  if (container) {
    container.innerHTML = '';
  }
}