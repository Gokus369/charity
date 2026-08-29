/* =========================================================
   Organisation identity — the single place the name lives.

   Renaming used to mean touching ten files, including a split
   <span> in the header that no plain search would match. Change
   it here instead. index.html is the one exception: it is static,
   so its <title> and og:title must be edited by hand.
   ========================================================= */

export const SITE = {
  /* ---------------------------------------------------------------
     Is this a registered charity yet?

     false  -> the site presents itself as a PUBLIC FUNDRAISER: it says so
               in a banner, names the organiser, discloses that money goes
               to a personal account, drops the registration line, and
               states plainly that donations are NOT tax-deductible.
     true   -> the registered-charity presentation, with 80G claims.

     Only set true when ALL of these hold:
       1. the trust / society / Sec-8 company is actually registered,
       2. `upi` and `bank` point at the ORGANISATION's own current
          account, not anyone's personal account, and
       3. `registration` holds real 12A / 80G / CSR numbers.
     --------------------------------------------------------------- */
  isRegistered: false,

  /* Who is running the fundraiser. Shown publicly while isRegistered is
     false — a public appeal has to say who is collecting the money.
     LEAVE name BLANK rather than putting something inaccurate; the copy
     degrades to "the organiser" on its own. */
  organiser: {
    name: 'Gokul Raj S',
    city: 'Kollam',
  },

  /** Legal name — receipts, copyright line, payment gateway. */
  name: 'Complete Meal Foundation',

  /** Everyday short form, used in body copy. */
  shortName: 'Complete Meal',

  /** Header/footer wordmark. `accent` renders in the brand colour. */
  wordmark: { lead: 'Complete', accent: 'Meal' },

  tagline: 'A complete meal — not just a full stomach.',

  email: 'completemeal570@gmail.com',
  phone: { display: '+91 62386 65296', href: '+916238665296' },
  /* City and state only, deliberately. While this is a fundraiser run by an
     individual, publishing a home street address is neither required nor wise.
     Once the trust is registered, replace this with the full registered office
     address — that one has to appear on 80G receipts and statutory filings. */
  address: ['Kollam, Kerala', 'India'],

  /** Placeholders — replace with the real certificate numbers. */
  registration: 'Registered under Sec. 12A · 80G No. AAAAA0000A · CSR Reg. CSR00000000',

  /* ---- Where donations land. ALL PLACEHOLDERS — replace before launch. ----
     These must be the registered organisation's own current account, never a
     personal one: donations into a personal account are not the trust's
     income, break the 80G trail, and are a serious audit problem. */
  upi: {
    // PERSONAL VPA. Disclosed as such on the page while isRegistered is
    // false. UPI apps show the bank-verified account holder name, not
    // `payeeName`, so a payer sees the individual's name regardless.
    id: 's.gokul.18@superyes',
    payeeName: 'Complete Meal',
  },
  /* A PERSONAL savings account, and the page says so. The account NAME must
     match the bank's records exactly — a transfer addressed to a name the
     bank does not hold gets rejected or reversed, and a mismatch between the
     name on the page and the name on the account looks like fraud to a
     careful donor. So this reads "Gokul Raj S", not "Complete Meal".

     Only what is needed to receive a transfer lives here. The passbook also
     carries a home address, mobile number, customer ID and Aadhaar — none of
     which a donor needs, all of which are useful to someone impersonating the
     account holder to the bank. Do not add them. */
  bank: {
    accountName: 'GOKUL RAJ S',
    accountNumber: '40563101076949',
    ifsc: 'KLGB0040563',
    bankName: 'Kerala Gramin Bank, Kollam branch',
  },

  /** Name to show publicly: the campaign name until registration exists. */
  get publicName() {
    return this.isRegistered ? this.name : this.shortName;
  },

  blurb:
    'A public fundraiser providing good food to people who are suffering — a complete, balanced plate rather than something that merely fills a stomach.',
};
