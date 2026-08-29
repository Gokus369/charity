import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import { CONFIG, money } from '../payments.js';

/**
 * Stand-in for a real checkout. Traps focus, closes on Esc/backdrop,
 * and restores both page scroll and the previously focused element.
 */
export default function ConfirmModal({ payload, onClose }) {
  const cardRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !cardRef.current) return;

      const focusables = [
        ...cardRef.current.querySelectorAll('button, [href], input, select, textarea'),
      ].filter((el) => !el.disabled && el.offsetParent !== null);
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="modal">
      <div className="modal-backdrop" onClick={onClose} />

      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle" ref={cardRef}>
        <button className="modal-x" onClick={onClose} aria-label="Close">
          <Icon name="close" className="" />
        </button>

        <div className="modal-icon" aria-hidden="true">
          <Icon name="check" className="" />
        </div>

        <h2 id="modalTitle">Thank you, {payload.donor.name.split(' ')[0] || 'friend'}.</h2>

        <p>
          We'll match your gift against our bank statement and email your receipt. If anything
          doesn't line up, we'll write to you rather than guess.
        </p>

        <div className="modal-summary">
          <div className="row">
            <span>Donation</span>
            <span>{money(payload.amount)}</span>
          </div>

          <div className="row">
            <span>Balanced meals</span>
            <span>{payload.meals.toLocaleString(CONFIG.locale)}</span>
          </div>

          <div className="row">
            <span>UPI reference</span>
            <span>{payload.reference || 'not given'}</span>
          </div>

          {payload.donor.pan && (
            <div className="row">
              <span>PAN (for 80G)</span>
              <span>{payload.donor.pan}</span>
            </div>
          )}

          <div className="row total">
            <span>Total</span>
            <span>{money(payload.amount)}</span>
          </div>
        </div>

        <p className="modal-note">
          <strong>Developer note:</strong> nothing was recorded anywhere — this is a placeholder.
          Point <code>src/payments.js → recordDonation()</code> at a sheet, a form service or your
          own endpoint so donations reach you.
        </p>

        <button className="btn btn-primary btn-block" onClick={onClose} ref={closeBtnRef}>
          Close
        </button>
      </div>
    </div>
  );
}
