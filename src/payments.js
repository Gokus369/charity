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

/* -------------------------------------------------------
   NO PAYMENT GATEWAY.

   Money arrives directly in the bank account by UPI or bank
   transfer. Nothing here moves money — this only RECORDS what
   the donor says they sent, so you can:
     1. match it against the bank statement using the UTR, and
     2. file Form 10BD, which needs name, PAN, address, amount.

   Wire it to wherever you want the record to land. Three options
   that need no server of your own:
   ------------------------------------------------------- */
export function recordDonation(payload) {
  // ---- OPTION A · your own endpoint (best: you control the data) ----
  // return fetch('/api/donations', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // }).then((r) => {
  //   if (!r.ok) throw new Error('Could not record donation');
  //   return r.json();
  // });

  // ---- OPTION B · Google Sheet via an Apps Script Web App ----
  // Deploy a Script with doPost(e) appending to a sheet, then:
  // return fetch(import.meta.env.VITE_SHEET_ENDPOINT, {
  //   method: 'POST',
  //   body: JSON.stringify(payload),
  // });

  // ---- OPTION C · a form service (Formspree, Basin, Web3Forms) ----
  // return fetch('https://formspree.io/f/XXXXXXX', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  //   body: JSON.stringify(payload),
  // });

  // ---- Placeholder: nothing is recorded anywhere yet ----
  return new Promise((resolve) => {
    setTimeout(() => resolve({ status: 'not_connected' }), 500);
  });
}
