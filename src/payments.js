/* =========================================================
   Donation config + the single payment integration point.
   ========================================================= */

/* One meal is the unit everything else is built from. Presets are whole
   multiples of it, so a donor always sees a round number of meals rather
   than "₹500 = 3 meals and a bit". */
const COST_PER_MEAL = 160;
const PRESET_MEALS = [1, 3, 5, 10, 25];

export const CONFIG = {
  locale: 'en-IN', // gives Indian digit grouping: 1,00,000 not 100,000
  currency: 'INR',
  currencySymbol: '₹',

  // Blended across the four programmes (₹115–₹310 each) — see content.js.
  // These are cooked, packed and delivered meals, not dry rations.
  costPerMeal: COST_PER_MEAL,
  proteinPerMeal: 20, // g per plate — floor, not ceiling
  fibrePerMeal: 8,    // g per plate (vegetables + whole grain)
  presets: PRESET_MEALS.map((m) => m * COST_PER_MEAL),
  defaultAmount: 5 * COST_PER_MEAL,
  minAmount: COST_PER_MEAL, // one meal is the smallest meaningful gift
  maxAmount: 1000000,
};

export const round2 = (n) => Math.round(n * 100) / 100;

export function money(n) {
  return (
    CONFIG.currencySymbol +
    n.toLocaleString(CONFIG.locale, {
      minimumFractionDigits: n % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}

/** Whole balanced meals a donation buys. */
export const mealsFor = (amount) => Math.floor(amount / CONFIG.costPerMeal);


/**
 * Builds a UPI intent link. Scanned as a QR (desktop) or tapped to open a UPI
 * app with the amount already filled in (mobile).
 *
 * Format: upi://pay?pa=<vpa>&pn=<payee>&am=<amount>&cu=INR&tn=<note>
 * `am` locks the amount in most apps, so the donor cannot mistype it.
 */
export function upiLink({ upiId, payeeName, amount, note }) {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    cu: 'INR',
  });
  if (amount > 0) params.set('am', amount.toFixed(2));
  if (note) params.set('tn', note);
  // UPI apps want %20 rather than + for spaces.
  return `upi://pay?${params.toString().replace(/\+/g, '%20')}`;
}

/**
 * Which UPI deep links will actually resolve here.
 *
 *   desktop -> none. `upi://` has no handler in a desktop browser, so a
 *              button would simply do nothing. Show the QR instead.
 *   android -> `intent://` is the reliable form, and can target one app by
 *              package name so "Google Pay" really opens Google Pay.
 *   ios     -> `upi://` is not supported at all; each app has its own scheme.
 */
export function upiPlatform() {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  // iPadOS 13+ reports as a Mac; a touch-capable "Mac" is really an iPad.
  if (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return 'ios';
  return 'desktop';
}

/** Android package names / iOS URL schemes for the common Indian UPI apps. */
export const UPI_APPS = [
  { key: 'gpay', label: 'Google Pay', pkg: 'com.google.android.apps.nbu.paisa.user', ios: 'gpay://upi/pay' },
  { key: 'phonepe', label: 'PhonePe', pkg: 'com.phonepe.app', ios: 'phonepe://pay' },
  { key: 'paytm', label: 'Paytm', pkg: 'net.one97.paytm', ios: 'paytmmp://pay' },
];

/** A link that opens one specific app, or the system chooser when `app` is null. */
export function upiAppLink({ platform, app, upiId, payeeName, amount, note }) {
  const qs = new URLSearchParams({ pa: upiId, pn: payeeName, cu: 'INR' });
  if (amount > 0) qs.set('am', amount.toFixed(2));
  if (note) qs.set('tn', note);
  const query = qs.toString().replace(/\+/g, '%20');

  if (platform === 'android') {
    const pkg = app ? `package=${app.pkg};` : '';
    return `intent://pay?${query}#Intent;scheme=upi;${pkg}end`;
  }
  if (platform === 'ios') {
    return app ? `${app.ios}?${query}` : `upi://pay?${query}`;
  }
  return `upi://pay?${query}`;
}

/* -------------------------------------------------------
   NO PAYMENT GATEWAY.

   Money arrives directly in the bank account by UPI or bank
   transfer. Nothing here moves money — this only RECORDS what
   the donor says they sent, so you can match it against the
   bank statement using the UTR.

   Set VITE_SHEET_ENDPOINT in .env to your Apps Script Web App
   URL (see apps-script/Code.gs and the README). With it unset,
   submissions resolve without being stored anywhere, so the
   form still works in development.
   ------------------------------------------------------- */
const SHEET_ENDPOINT = import.meta.env?.VITE_SHEET_ENDPOINT || '';

export function recordDonation(payload) {
  if (!SHEET_ENDPOINT) {
    // Nothing configured — don't pretend the donation was recorded.
    console.warn('[recordDonation] VITE_SHEET_ENDPOINT is not set; nothing was saved.');
    return Promise.resolve({ status: 'not_connected' });
  }

  /* text/plain keeps this a CORS "simple request", so the browser skips the
     preflight OPTIONS that Apps Script cannot answer. The script reads the
     raw body with JSON.parse(e.postData.contents) regardless of this header. */
  return fetch(SHEET_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow',
  })
    .then(async (r) => {
      if (!r.ok) throw new Error(`Sheet responded ${r.status}`);
      const body = await r.json().catch(() => ({ ok: true }));
      if (body.ok === false) throw new Error(body.error || 'Sheet rejected the row');
      return body;
    });
}
