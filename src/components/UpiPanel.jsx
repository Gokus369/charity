import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Icon from './Icon.jsx';
import { SITE } from '../data/site.js';
import { money, upiAppLink, upiPlatform, UPI_APPS } from '../payments.js';

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
  // Doesn't change during a session, so resolve it once.
  const [platform] = useState(upiPlatform);
  const isMobile = platform !== 'desktop';

  const link = (app) =>
    upiAppLink({
      platform,
      app,
      upiId: SITE.upi.id,
      payeeName: SITE.upi.payeeName,
      amount,
      note: 'Donation',
    });

  // The QR always carries the plain upi:// intent — that is what scanners read,
  // regardless of which platform rendered the page.
  const qrPayload = upiAppLink({
    platform: 'desktop',
    app: null,
    upiId: SITE.upi.id,
    payeeName: SITE.upi.payeeName,
    amount,
    note: 'Donation',
  });

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(qrPayload, {
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
  }, [qrPayload]);

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
          {isMobile ? (
            <>
              Pay <strong>{money(amount)}</strong> — the amount is filled in for you, so there is
              nothing to type.
            </>
          ) : (
            <>
              Scan this code with any UPI app on your phone — GPay, PhonePe, Paytm, BHIM. The amount{' '}
              <strong>{money(amount)}</strong> is already filled in.
            </>
          )}
        </p>

        <CopyField label="UPI ID" value={SITE.upi.id} />

        {/* upi:// only resolves on a phone, so a desktop visitor gets the QR
            and the UPI ID rather than a button that would do nothing. */}
        {isMobile ? (
          <>
            {/* Label in a span and arrow last — matches the submit button, and
                the .btn:hover .arrow nudge is written for a trailing icon. */}
            <a className="btn btn-primary btn-block upi-open" href={link(null)}>
              <span>Open my UPI app</span>
              <Icon name="arrow" className="ic arrow" />
            </a>

            <p className="upi-apps-label">or go straight to</p>
            <div className="upi-apps">
              {UPI_APPS.map((app) => (
                <a key={app.key} className="upi-app" href={link(app)}>
                  {app.label}
                </a>
              ))}
            </div>
          </>
        ) : (
          <p className="upi-hint upi-hint-desktop">
            On a computer, UPI apps can't be opened from the browser — scan the code above with your
            phone, or send to the UPI ID from your phone's app.
          </p>
        )}

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
