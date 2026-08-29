import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Icon from './Icon.jsx';
import { SITE } from '../data/site.js';
import { money, upiLink } from '../payments.js';

/** Small copy-to-clipboard control. Falls back silently on old browsers. */
function CopyField({ label, value, mono = true }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the value is on screen to copy by hand */
    }
  }

  return (
    <div className="copy-field">
      <span className="copy-label">{label}</span>
      <span className={'copy-value' + (mono ? ' mono' : '')}>{value}</span>
      <button type="button" className="copy-btn" onClick={copy} aria-label={`Copy ${label}`}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export default function UpiPanel({ amount }) {
  const [qr, setQr] = useState('');
  const [showBank, setShowBank] = useState(false);

  const link = upiLink({
    upiId: SITE.upi.id,
    payeeName: SITE.upi.payeeName,
    amount,
    note: 'Donation',
  });

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(link, {
      margin: 1,
      width: 480,
      errorCorrectionLevel: 'M',
      color: { dark: '#1b1917', light: '#ffffff' },
    })
      .then((url) => alive && setQr(url))
      .catch(() => alive && setQr(''));
    return () => {
      alive = false;
    };
  }, [link]);

  return (
    <div className="upi">
      <div className="upi-qr">
        {qr ? (
          <img
            src={qr}
            width={200}
            height={200}
            alt={`UPI QR code to pay ${money(amount)} to ${SITE.upi.payeeName}`}
          />
        ) : (
          <div className="upi-qr-empty" aria-hidden="true" />
        )}
      </div>

      <div className="upi-body">
        <p className="upi-lead">
          Scan with any UPI app — GPay, PhonePe, Paytm, BHIM. The amount{' '}
          <strong>{money(amount)}</strong> is already filled in.
        </p>

        <CopyField label="UPI ID" value={SITE.upi.id} />

        {/* upi:// only resolves on a phone with a UPI app installed. */}
        <a className="btn btn-primary btn-block upi-open" href={link}>
          <Icon name="arrow" className="ic arrow" />
          Open a UPI app on this phone
        </a>
        <p className="upi-hint">On a computer? Scan the code with your phone instead.</p>

        <button
          type="button"
          className="upi-toggle"
          onClick={() => setShowBank((v) => !v)}
          aria-expanded={showBank}
        >
          {showBank ? 'Hide' : 'Prefer a bank transfer?'}
        </button>

        {showBank && (
          <div className="upi-bank">
            <CopyField label="Account name" value={SITE.bank.accountName} mono={false} />
            <CopyField label="Account number" value={SITE.bank.accountNumber} />
            <CopyField label="IFSC" value={SITE.bank.ifsc} />
            <p className="upi-hint">{SITE.bank.bankName} · NEFT, IMPS or RTGS</p>
          </div>
        )}
      </div>
    </div>
  );
}
