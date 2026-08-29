import { useRef, useState } from 'react';
import Icon from './Icon.jsx';
import UpiPanel from './UpiPanel.jsx';
import ConfirmModal from './ConfirmModal.jsx';
import { CONFIG, mealsFor, money, recordDonation, round2 } from '../payments.js';
import { SITE } from '../data/site.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const UTR_RE = /^[A-Za-z0-9]{6,24}$/;

const formatPreset = (n) => CONFIG.currencySymbol + n.toLocaleString(CONFIG.locale);

export default function DonationForm() {
  const [selected, setSelected] = useState(CONFIG.defaultAmount); // number | 'custom'
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pan, setPan] = useState('');
  const [utr, setUtr] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | error
  const [receipt, setReceipt] = useState(null);

  const customRef = useRef(null);

  const parsedCustom = parseFloat(custom);
  const amount = selected === 'custom' ? (parsedCustom > 0 ? round2(parsedCustom) : 0) : selected;
  const meals = mealsFor(amount);

  function pickAmount(value) {
    setSelected(value);
    if (value === 'custom') requestAnimationFrame(() => customRef.current?.focus());
    else setCustom('');
    setErrors((e) => ({ ...e, amount: '' }));
  }

  function onCustomChange(e) {
    const raw = e.target.value;
    setCustom(parseFloat(raw) > CONFIG.maxAmount ? String(CONFIG.maxAmount) : raw);
    setErrors((e2) => ({ ...e2, amount: '' }));
  }

  function validate() {
    const next = {};
    if (!name.trim()) next.name = 'Please tell us your name.';
    if (!EMAIL_RE.test(email.trim())) next.email = 'We need a valid email to send your receipt.';
    if (pan.trim() && !PAN_RE.test(pan.trim().toUpperCase())) {
      next.pan = 'That doesn’t look like a PAN (e.g. ABCDE1234F).';
    }
    if (utr.trim() && !UTR_RE.test(utr.trim())) {
      next.utr = 'A UPI reference is usually 12 digits.';
    }
    if (amount < CONFIG.minAmount) {
      next.amount = `Please choose an amount of at least ${money(CONFIG.minAmount)}.`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function revalidate(field) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      if (field === 'name' && name.trim()) delete next.name;
      if (field === 'email' && EMAIL_RE.test(email.trim())) delete next.email;
      if (field === 'pan' && (!pan.trim() || PAN_RE.test(pan.trim().toUpperCase()))) delete next.pan;
      if (field === 'utr' && (!utr.trim() || UTR_RE.test(utr.trim()))) delete next.utr;
      return next;
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      amount,
      currency: CONFIG.currency,
      meals,
      method: 'upi',
      reference: utr.trim() || null,
      donor: {
        name: name.trim(),
        email: email.trim(),
        pan: pan.trim() ? pan.trim().toUpperCase() : null,
      },
    };

    setStatus('submitting');
    try {
      await recordDonation(payload);
      setReceipt(payload);
      setStatus('idle');
    } catch (err) {
      console.error('Could not record donation:', err);
      setStatus('error');
    }
  }

  const submitLabel =
    status === 'submitting'
      ? 'Sending…'
      : status === 'error'
        ? 'Something went wrong — try again'
        : "I've sent it";

  return (
    <div className="donate-card">
      {/* ---------- 1. amount ---------- */}
      <section className="step">
        <h3 className="step-head">
          <span className="step-num">1</span> Choose an amount
        </h3>

        <div className="amount-grid">
          {CONFIG.presets.map((value) => (
            <button
              type="button"
              key={value}
              data-amount={value}
              className={'amt-opt' + (selected === value ? ' is-active' : '')}
              onClick={() => pickAmount(value)}
            >
              {formatPreset(value)}
            </button>
          ))}
          <button
            type="button"
            data-amount="custom"
            className={'amt-opt amt-custom' + (selected === 'custom' ? ' is-active' : '')}
            onClick={() => pickAmount('custom')}
          >
            Other
          </button>
        </div>

        {selected === 'custom' && (
          <div className="custom-wrap">
            <label className="sr-only" htmlFor="customAmount">
              Custom amount in rupees
            </label>
            <span className="currency" aria-hidden="true">
              {CONFIG.currencySymbol}
            </span>
            <input
              type="number"
              id="customAmount"
              ref={customRef}
              min={CONFIG.minAmount}
              max={CONFIG.maxAmount}
              step="1"
              inputMode="numeric"
              placeholder="Enter amount"
              value={custom}
              onChange={onCustomChange}
            />
          </div>
        )}

        <p className="meals-readout" id="mealsReadout" aria-live="polite">
          {errors.amount ? (
            <strong>{errors.amount}</strong>
          ) : amount ? (
            <>
              That's{' '}
              <strong>
                {meals.toLocaleString(CONFIG.locale)} balanced meal{meals === 1 ? '' : 's'}
              </strong>{' '}
              for people who are suffering.
            </>
          ) : (
            'Enter an amount to see your impact.'
          )}
        </p>
      </section>

      {/* ---------- 2. pay ---------- */}
      <section className="step">
        <h3 className="step-head">
          <span className="step-num">2</span> Pay by UPI
        </h3>
        {amount > 0 ? (
          <UpiPanel amount={amount} />
        ) : (
          <p className="step-empty">Choose an amount above to get your QR code.</p>
        )}
      </section>

      {/* ---------- 3. tell us ---------- */}
      <section className="step">
        <h3 className="step-head">
          <span className="step-num">3</span> Tell us it's yours
        </h3>
        <p className="step-sub">
          Money arrives in our account without your name attached, so this is the only way we can
          match it to you{!SITE.isRegistered ? ' and thank you.' : ' and send your 80G receipt.'}
        </p>

        <form onSubmit={onSubmit} noValidate>
          <div className="field-row">
            <div className="field">
              <label htmlFor="donorName">Full name</label>
              <input
                type="text"
                id="donorName"
                autoComplete="name"
                placeholder="Priya Menon"
                className={errors.name ? 'has-error' : ''}
                aria-invalid={Boolean(errors.name)}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onInput={() => revalidate('name')}
                onBlur={() => revalidate('name')}
              />
              <p className="err" data-err-for="donorName">
                {errors.name || ''}
              </p>
            </div>

            <div className="field">
              <label htmlFor="donorEmail">Email</label>
              <input
                type="email"
                id="donorEmail"
                autoComplete="email"
                placeholder="priya@example.com"
                className={errors.email ? 'has-error' : ''}
                aria-invalid={Boolean(errors.email)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onInput={() => revalidate('email')}
                onBlur={() => revalidate('email')}
              />
              <p className="err" data-err-for="donorEmail">
                {errors.email || ''}
              </p>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="donorUtr">
                UPI reference <span className="muted-label">(UTR)</span>
              </label>
              <input
                type="text"
                id="donorUtr"
                autoComplete="off"
                placeholder="123456789012"
                inputMode="numeric"
                className={errors.utr ? 'has-error' : ''}
                aria-invalid={Boolean(errors.utr)}
                aria-describedby="utrHint"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                onInput={() => revalidate('utr')}
                onBlur={() => revalidate('utr')}
              />
              {errors.utr ? (
                <p className="err" data-err-for="donorUtr">
                  {errors.utr}
                </p>
              ) : (
                <p className="hint" id="utrHint">
                  In your UPI app's receipt. It's how we find your payment.
                </p>
              )}
            </div>

            {SITE.isRegistered && (
              <div className="field">
                <label htmlFor="donorPan">
                  PAN <span className="muted-label">(optional)</span>
                </label>
                <input
                  type="text"
                  id="donorPan"
                  maxLength={10}
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="ABCDE1234F"
                  style={{ textTransform: 'uppercase' }}
                  className={errors.pan ? 'has-error' : ''}
                  aria-invalid={Boolean(errors.pan)}
                  aria-describedby="panHint"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  onInput={() => revalidate('pan')}
                  onBlur={() => revalidate('pan')}
                />
                {errors.pan ? (
                  <p className="err" data-err-for="donorPan">
                    {errors.pan}
                  </p>
                ) : (
                  <p className="hint" id="panHint">
                    Required by the tax department for an 80G certificate.
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            id="submitBtn"
            className="btn btn-primary btn-block btn-lg"
            disabled={amount <= 0 || status === 'submitting'}
            style={amount <= 0 ? { opacity: 0.6 } : undefined}
          >
            <span id="submitLabel">{submitLabel}</span>
            <Icon name="arrow" className="ic arrow" />
          </button>

          <p className="form-foot">
            <Icon name="lock" />
            We never see your bank or card details — you pay from your own app
          </p>

          {!SITE.isRegistered && (
            <p className="form-disclosure">
              Not a registered charity — this gift is not tax-deductible.
            </p>
          )}
        </form>
      </section>

      {receipt && <ConfirmModal payload={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}
