import { SITE } from '../data/site.js';

/**
 * Public-fundraiser disclosure, kept deliberately quiet.
 *
 * Two facts have to stay visible without a click, because a donor needs both
 * BEFORE they pay: this is not a registered charity, and the money is not
 * tax-deductible. Everything else — who is collecting, what happens on
 * registration — lives in the FAQ this links to.
 */
export default function StatusBanner() {
  if (SITE.isRegistered) return null;

  return (
    <div className="status-banner" role="note">
      Public fundraiser — not a registered charity. Donations go to a personal UPI account and are
      not tax-deductible. <a href="#faq">Details</a>
    </div>
  );
}
