# Complete Meal Foundation — charity donation website

A donation site for a **pre-launch Indian nutrition charity**: providing good food to people who are
suffering — a properly balanced plate, not bare calories. Built with **React 19 + Vite**, in **INR (₹)**,
taking donations **by UPI with no payment gateway**.

## Renaming the organisation

Everything except the static `index.html` reads from [src/data/site.js](src/data/site.js) — name,
wordmark, email, phone, address, registration numbers. Change it there and the header, footer,
copyright line, contact block and payment-gateway label all follow.

Two traps a find-and-replace would hit, both real:

- the header wordmark is **split markup** (`{lead}<span>{accent}</span>` so the second word takes the
  brand colour) — a search for the full name never matches it;
- the body copy contains **"nourished"** and **"malnourished"**, which are ordinary English words, not
  the brand.

`index.html` (`<title>`, `og:title`) and `package.json` / `package-lock.json` still need editing by
hand.

## Positioning

The site argues one thing: *filling a stomach isn't the same as feeding a person.* The cheapest
calories in India are cereal calories, so people with no money eat almost only rice and roti — the
hunger stops while the malnutrition doesn't.

Every plate is specced to carry at least **20 g of protein** and **8 g of fibre**. Both numbers live
in `CONFIG` and flow into the copy from there.

Meat is deliberate, not decorative: it is the first thing a household in poverty gives up, so it is
the gap nobody else is filling. But it is also the most expensive thing on the menu — **₹68 for a
chicken plate against ₹20 for dal, rice and a vegetable** — so it is served weekly, with mutton kept
for festival days. That mix is what holds the blended cost at **₹160 a plate**. A vegetarian plate
hits the same nutrition targets for anyone who wants it; both are covered in the FAQ.

Because the organisation is pre-launch, **no copy claims a track record**. Percentages and costs are
framed as commitments and planned figures, and there are no beneficiary testimonials.

## Run it

```powershell
npm install
npm run dev      # http://localhost:5173
```

```powershell
npm run build    # -> dist/
npm run preview  # serve the production build
```

## Structure

```
index.html                 Vite entry (meta tags, favicon, #root)
vite.config.js
.env.example               template for VITE_SHEET_ENDPOINT
apps-script/Code.gs        paste into the Google Sheet's Apps Script editor
src/
  main.jsx                 mounts <App>
  App.jsx                  composes the page sections
  payments.js              CONFIG + submitDonation()  ← payment hook
  styles.css               design tokens, layout, light + dark theme
  data/content.js          all page copy (programmes, FAQ, commitments)
  data/site.js             organisation identity — the ONLY place the name lives
  data/photos.js           photo manifest: srcset, alt text, licence + credit
  hooks/
    useReveal.js           fade-in on scroll (IntersectionObserver)
    useStickyHeader.js     header shadow on scroll
  components/
    Header.jsx             + exports <Brand>, reused in the footer
    Hero.jsx               copy + inline SVG illustration
    Programs.jsx
    WhyBalanced.jsx        the argument for a balanced plate over bare calories
    DonateSection.jsx      pitch column + <DonationForm>
    DonationForm.jsx       all donation state lives here
    ConfirmModal.jsx       focus-trapped dialog (checkout stand-in)
    Commitments.jsx        planned funding split + what we promise
    GetInvolved.jsx  Faq.jsx  CtaBand.jsx  Footer.jsx
    Section.jsx            <SectionHead> + <Reveal> helpers
    Icon.jsx               every inline SVG, by name
    Photo.jsx              <Photo> + <PhotoCredits>
public/photos/             the image files (5 photos x 2-3 widths)
```

**Editing copy?** Almost everything is in [src/data/content.js](src/data/content.js) — programmes,
the why-balanced cards, FAQ, commitments, funding split. You rarely need to touch the JSX.

## Photography

Five real photographs, all **CC0 / public domain**, in `public/photos/` with the manifest at
[src/data/photos.js](src/data/photos.js).

| Slot | Subject |
| --- | --- |
| `hero` | A Malabar chicken biryani on a serving tray |
| `rations` | Dried beans, peas and lentils |
| `school` | Egg and potato curry |
| `meat` | Kerala chicken curry |
| `kitchen` | Khichdi |

**Why CC0 specifically.** An earlier set used CC BY / CC BY-SA images, which legally require a
visible credit naming each photographer — that is what the footer's photo-credits block was for.
CC0 waives attribution entirely, so the block could be deleted outright. The `source` field in the
manifest is kept purely as a provenance record for you; it is not a licence condition.

If you ever swap in a CC BY or CC BY-SA image, **attribution becomes legally required again** and
the credits block has to come back. Prefer your own photography, or CC0.

**Every photo is of food, never of people.** A pre-launch fundraiser has no beneficiaries to
photograph, and using stock pictures of strangers as though they were the people you serve is both
misleading and a well-known way to lose donor trust.

### Filenames must match real pixel widths

Commons snaps thumbnail requests to its own standard sizes, so asking for 380px returns a 500px file.
An earlier version named files by the *requested* width while the srcset `w` descriptors described the
*actual* one — which quietly mis-tunes the browser's image selection. The manifest is now generated by
reading dimensions out of the JPEG headers on disk, and the filenames encode the real width. Regenerate
it rather than hand-editing.

### How `<Photo>` works

```jsx
<Photo photo={photos.hero} sizes="(max-width: 1000px) calc(100vw - 40px), 46vw" priority />
```

It emits `srcset`/`sizes` so the browser picks the smallest adequate file, and always sets
`width`/`height` so nothing shifts as images load. Only the hero is eager; the four programme cards
lazy-load. Verified: a 278px-wide card downloads the 380w file, not the 760w.

### Before launch

- Replace these with **your own photographs**, with written consent from anyone identifiable
- Convert to **WebP or AVIF** — the JPEGs total ~1.3 MB across all sizes; WebP would cut roughly 60%.
  Initial load is only the hero (75 KB) since the rest lazy-load
- Add an `og:image` — the social preview is still text-only

## Theme

**White**, with vermilion and gold kept as the brand accents. Tokens are at the top of
[src/styles.css](src/styles.css):

| Token | Value | Role |
| --- | --- | --- |
| `--bg` / `--surface` | `#ffffff` | the page |
| `--surface-2` | `#f7f5f2` | alternating section bands |
| `--text` | `#1b1917` | near-black |
| `--muted` / `--border` | `#6a635d` / `#e5e1db` | neutral greys carry the structure |
| `--brand` | `#9e2b19` | deep vermilion — buttons, links, headings |
| `--brand-strong` | `#6f1a0d` | maroon — button hover, illustration depth |
| `--accent` | `#96631a` | burnished gold, dark enough for small text |
| `--accent-2` | `#d9a441` | leaf gold — decoration + the CTA-band button |
| `--wash` | `#c4472e0f` | ambient gradient tint behind the hero and donate block |

Change `--brand` and `--accent` and the whole site re-themes. `--wash` is deliberately separate from
`--brand-2` so you can flatten the section gradients without weakening the focus rings.

### Dark palette

The site is **white by default and does not follow the OS setting**. A warm chocolate dark palette is
still defined, opt-in:

```html
<html lang="en" data-theme="dark">
```

To go back to following the reader's OS preference, change the `:root[data-theme="dark"]` selector
in `styles.css` to `@media (prefers-color-scheme: dark) { :root { … } }` (and the six matching
`:root[data-theme="dark"] .foo` one-liners further down).

## Currency & meal maths

One meal is the unit everything is built from. All of it lives in `CONFIG` at the top of
[src/payments.js](src/payments.js):

```js
const COST_PER_MEAL = 160;             // ₹ per balanced plate
const PRESET_MEALS  = [1, 3, 5, 10, 25];

export const CONFIG = {
  locale: 'en-IN',        // Indian digit grouping: ₹1,00,000 not ₹100,000
  currency: 'INR',
  currencySymbol: '₹',
  costPerMeal: COST_PER_MEAL,
  proteinPerMeal: 20,     // g — a floor
  fibrePerMeal: 8,        // g
  presets: PRESET_MEALS.map((m) => m * COST_PER_MEAL),   // ₹160 … ₹4,000
  defaultAmount: 5 * COST_PER_MEAL,
  minAmount: COST_PER_MEAL,   // one meal is the smallest meaningful gift
  maxAmount: 1000000,
};
```

Presets derive from `PRESET_MEALS`, so a donor always sees a round meal count — ₹160 = 1 meal,
₹800 = 5, ₹4,000 = 25 — rather than "₹500 = 3 meals and a bit". The form's live readout, the
campaign card, the commitments card and three FAQ answers all compute from these constants; change
one and the whole page follows.

### The one invariant to preserve

Programme costs in `content.js` must blend back to `costPerMeal`:

| Programme | Cost/meal | Share |
| --- | --- | --- |
| Balanced ration kits | ₹115 | 50% |
| School lunch with protein | ₹145 | 25% |
| The weekly meat meal | ₹310 | 15% |
| Emergency & mobile kitchen | ₹195 | 10% |

`0.50×115 + 0.25×145 + 0.15×310 + 0.10×195 = ₹159.75 ≈ ₹160`

If you edit a cost or a share, re-check that blend — otherwise the programmes table and the donation
form describe two different meals. This has already gone wrong once, when hand-written donation-tier
prose drifted out of step with the computed readout.

### ₹160 is 34× the benchmark — the site has to earn that

[Akshaya Patra feeds a child for a year on ₹1,100](https://www.akshayapatra.org/active-fundraising-campaigns/food-for-all-42)
— roughly **₹4.70 a meal** to the donor. At ₹160 this is **thirty-four times** that, and a year of one
meal a day comes to ₹58,400 per person against their ₹1,100.

That gap is the hardest question the site will be asked, so the FAQ answers it head-on rather than
hoping nobody runs the arithmetic: they receive free government foodgrain, cook for millions in
industrial kitchens, and serve a vegetarian school lunch, while this is a cooked, packed and
delivered plate carrying meat most weeks, for people who are not in a school queue. The answer ends
by telling cost-per-meal donors to give to Akshaya Patra instead — the only response that survives
contact with a sceptic.

**Two things to settle before publishing at this price:**

1. **Can ₹160 actually be spent well?** If the real delivered cost is nearer ₹60, the surplus has to
   show up in the published ledger or the number is indefensible.
2. **20 g of protein is low for a ₹160 plate.** At ₹30 it was a stretch; at ₹160 it reads miserly and
   a sceptic will notice. Raise `proteinPerMeal` to what the budget genuinely supports.

### Why there are no "your ₹500 feeds a child for a month" claims

There were, and they were removed. **Donations are pooled**, so no charity can truthfully tell an
individual donor which person their specific rupees fed, or for how long. The donate column now
states the cost per plate and what goes on it, and makes no attribution claim about any individual.

## The donation form

All state lives in [DonationForm.jsx](src/components/DonationForm.jsx): frequency, preset vs. custom
amount, gateway-fee cover, dedication, donor fields, validation and submit status. `amount`, `fee`,
`total` and `meals` are derived on each render rather than stored, so they can never drift out of
sync.

The form collects name and email only. Note that issuing a valid **80G receipt normally requires the
donor's PAN** — collect it after payment (Razorpay can capture it, or ask by email with the receipt)
rather than on this form.

Accessibility: skip link, semantic landmarks, `aria-live` on the impact readout, `role="radiogroup"`
on the frequency toggle, focus-visible rings, a focus-trapped modal that restores focus on close, and
`prefers-reduced-motion` support.

## The current appeal

`campaign` in [src/data/content.js](src/data/content.js):

```js
export const campaign = {
  name: 'Christmas 2026',
  goalMeals: 2000,
  deadline: '2026-12-25',
  mealsFunded: 0,      // UPDATE BY HAND from the bank statement
};
```

At `costPerMeal` ₹160 that is **₹3,20,000**, and the progress card computes everything else — percentage,
meals remaining, days left, and the daily run-rate needed. Change `goalMeals` or `costPerMeal` and
every figure follows, including the hero eyebrow.

`mealsFunded` is the one number nothing can compute for you: without a payment gateway there is no
feed of totals, so it is only as honest as your reconciliation. Update it from the statement, never
from memory, and never round up — an inflated progress bar is the fastest way to lose a donor.

### This goal crosses the personal-account tax line

**₹3,20,000 is more than six times the ₹50,000 threshold in
[s.56(2)(x)](https://taxgarden.in/blog/gift-tax-rules-india-section-56-2-x-ay-2026-27).** Money
received from non-relatives into a personal account becomes taxable personal income once the year's
total passes ₹50,000 — and **the whole amount is taxed, not just the excess**.

At ₹160 a meal that line is crossed at **312 meals — 16% of the way to the goal**, plausibly within
the first few weeks. Run the full campaign through a personal UPI account and roughly ₹3,20,000 of
donated money becomes the organiser's personal income for the year, taxed at slab rate. At 30% that
is close to ₹96,000 of tax on money meant for food.

The registered trust and its current account need to exist **before about the 312th meal**, not the
2,000th. That is now the binding constraint on the campaign, ahead of fundraising.

## Registered charity, or public fundraiser?

`SITE.isRegistered` in [src/data/site.js](src/data/site.js) is currently **false**, so the site
presents itself honestly as a **public fundraiser** rather than a registered charity. That is the
legitimate way to raise money before registration exists — the requirement is disclosure, not
silence.

While it is `false`:

| | |
| --- | --- |
| Banner | A quiet one-line note: not a registered charity, personal UPI account, not tax-deductible, linking to the FAQ for the rest |
| Donate form | The same two facts restated in small print directly under the submit button, at the point of decision |
| Name | `SITE.shortName` ("Complete Meal"), never "Foundation" — that word implies a registered entity |
| Footer | "A public fundraiser — not a registered charity" instead of the 12A/80G line |
| Hero | "Run openly as a public fundraiser" instead of "80G tax exemption" |
| Tax FAQ | Answers **"No"**, and tells deduction-seeking donors to give to an established charity instead |
| "Who is collecting?" FAQ | States plainly that there is no board, no auditor and no statutory filing behind it yet |
| Commitments | "Every rupee published" (a public ledger) instead of "Audited from year one" |
| PAN field | **Hidden.** PAN is only usable for an 80G certificate; collecting a government ID you cannot act on is gratuitous |

Fill in `SITE.organiser.name` — a public appeal should say who is collecting. Left blank, the copy
degrades to "the organiser", which works but is weaker.

Set `isRegistered: true` only when all three hold:

1. the trust / society / Sec-8 company is actually registered,
2. `SITE.upi` and `SITE.bank` point at the **organisation's own current account**, and
3. `SITE.registration` holds the real 12A / 80G / CSR numbers.

### Why the disclosure is quiet but not hidden

The banner is deliberately understated — 12px, muted grey on the section tint, one line, 33px tall.
It is styled as a note, not a warning strip.

What it is **not** is removable or collapsed behind a click. Two facts have to reach a donor before
they pay: this is not a registered charity, and the gift is not tax-deductible. Burying either one is
the difference between an honest fundraiser and a misleading one, and it is the first thing a donor
would feel cheated by afterwards. Everything else — who is collecting, what changes on registration —
sits in the FAQ the banner links to.

The same two facts also appear in small print under the donate button, because that is the moment the
decision actually gets made.

### The account is the part that must change

The UPI ID is a **personal VPA**. That is disclosed on the page, which makes it honest — but it does
not make it durable:

- under [s.56(2)(x)](https://taxgarden.in/blog/gift-tax-rules-india-section-56-2-x-ay-2026-27),
  money received from non-relatives becomes taxable personal income once the year's total passes
  **₹50,000 — and the whole amount is taxed, not just the excess**. At ₹160 a plate that is about
  312 meals before the organiser starts paying income tax on donations;
- most banks prohibit collection through a personal account, and the inflow pattern invites a freeze;
- UPI apps show the **bank-verified account holder name**, so payers see an individual's name.

Keep a separate ledger of every rupee in and out from day one. When the trust account opens, that
ledger is what lets you transfer the balance across cleanly and show where it came from.

## Taking money without a payment gateway

There is no gateway. Donors pay **UPI straight into the foundation's bank account**, or by NEFT/IMPS.
That is deliberate: UPI carries no MDR, so 100% of a gift arrives, where Razorpay or Stripe would
take ~2%.

Bank and UPI details live in `SITE.upi` / `SITE.bank` in [src/data/site.js](src/data/site.js) — all
placeholders today. **They must be the registered organisation's own current account**, never a
personal one: donations into a personal account are not the trust's income, break the 80G trail, and
are a serious audit problem.

### How the flow works

1. **Choose an amount** — presets or custom.
2. **Pay by UPI** — [UpiPanel.jsx](src/components/UpiPanel.jsx) renders a QR plus, on a phone,
   tappable deep links. Bank transfer details sit behind a toggle.

   **The link format depends on the platform**, because `upi://` is not universal:

   | Platform | What is offered | Link form |
   | --- | --- | --- |
   | Desktop | QR + UPI ID only — **no button** | — |
   | Android | "Open my UPI app" + per-app links | `intent://pay?…#Intent;scheme=upi;package=…;end` |
   | iOS | "Open my UPI app" + per-app links | `gpay://`, `phonepe://`, `paytmmp://` |

   A desktop browser has no handler for `upi://`, so a button there does nothing at all — which is
   why it is not rendered. On Android the `intent://` form is more reliable than bare `upi://` and can
   name a package, so "Google Pay" genuinely opens Google Pay. iOS does not support `upi://`, so each
   app is reached through its own scheme.

   The QR always encodes the plain `upi://` intent, since that is what scanners expect regardless of
   which device drew the page.
3. **Tell us it's yours** — name, email, PAN and the **UTR**, because money arrives in the account
   with no donor name attached.

`recordDonation()` in [src/payments.js](src/payments.js) does **not** move money — it records what
the donor says they sent, so you can reconcile against the bank statement and, once registered, file
Form 10BD.

### Sending donations to a Google Sheet

Records go to a Google Sheet via an Apps Script Web App. Nothing is stored until you set this up —
the form still works, but logs a console warning and saves nothing.

**1. Make the sheet.** In the Google account that should own it (`completemeal570@gmail.com`), create
a spreadsheet. The script writes to a tab named **`complete_meal`** and creates it if missing.

**2. Add the script.** In that sheet: **Extensions ▸ Apps Script**, delete the placeholder, and paste
all of [apps-script/Code.gs](apps-script/Code.gs). Save.

**3. Deploy it.** **Deploy ▸ New deployment ▸ Web app**, then:

| Setting | Value |
| --- | --- |
| Execute as | **Me** |
| Who has access | **Anyone** |

"Anyone" is required — donors are not signed in to your Google account. Authorise when prompted;
the "unverified app" warning is expected for your own script (**Advanced ▸ Go to … (unsafe)**).

**4. Point the site at it.** Copy the `/exec` URL and put it in `.env` at the project root:

```
VITE_SHEET_ENDPOINT=https://script.google.com/macros/s/AKfy.../exec
```

`.env` is gitignored; [.env.example](.env.example) is the committed template. **Vite only reads env
files at startup — restart `npm run dev` after editing.**

**5. Test.** Submit a donation on the site and confirm a row appears. Opening the `/exec` URL in a
browser directly should return `{"ok":true,...}`.

Columns: Timestamp · Name · Email · Amount · Meals · UTR · Method · Currency · Matched to bank? ·
Receipt sent? — the last two are blank for you to fill during reconciliation.

**Two things worth knowing.** The request is sent as `text/plain` on purpose: that keeps it a CORS
"simple request" so the browser skips the preflight `OPTIONS` that Apps Script cannot answer. The
script still parses the body as JSON.

And the Web App URL ships inside the site's JavaScript, so anyone viewing source can find it and post
rows. That is normally harmless — the sheet is a to-check list, not a source of truth; the bank
statement is. If you get spammed, set `TOKEN` in `Code.gs`, send the same value in the payload, and
rows without it are rejected.

### What this costs you

| | |
| --- | --- |
| **Reconciliation** | Manual. You match UTRs against the bank statement by hand |
| **Receipts** | Manual. Nothing is issued automatically |
| **Where records land** | A Google Sheet via Apps Script — see above |
| **Recurring gifts** | Not possible — UPI AutoPay needs a PSP. The FAQ points donors at a bank standing instruction instead |
| **Cards / netbanking** | Not supported. Add a hosted link (Danamojo, Instamojo, Razorpay Payment Pages) if donors ask |

If that bookkeeping becomes the bottleneck, **Danamojo** is built for Indian NGOs and gives you a
hosted page with no integration work.

### Compliance that skipping the gateway does not skip

- **[Cash over ₹2,000 kills the 80G deduction](https://itrngst.com/guides/income-tax/section-80g-donation-cash-limit-alert/)**
  — s.80G requires anything above ₹2,000 to be paid by a non-cash mode. Cap any cash collection at
  ₹2,000 per donor.
- **[Form 10BD / 10BE](https://www.patronaccounting.com/blog/donation-certificate-80g-rules-2026-form-10bd-10be-donor-compliance)**
  — you file an annual statement of donations with donor **name, PAN, address and amount**; the portal
  then generates each donor's 10BE certificate, and the IT department matches it against their ITR
  claim. This is why the PAN field is back on the form: with no gateway, nothing else collects it.
- **FCRA** — foreign donations must go to the designated SBI New Delhi account, kept entirely
  separate. The FAQ tells overseas donors not to use this form.

None of the above is legal advice — confirm it with your CA before you launch.

## Figures to verify before launch

Nothing on the site claims past results, but every number is *planned* and needs real backing:

| Figure | Where | How to verify |
| --- | --- | --- |
| **20 g protein / 8 g fibre per plate** | `CONFIG` in `payments.js` | A qualified nutritionist signing off real menus against ICMR-NIN requirements |
| **₹160 blended cost per plate** | `costPerMeal` in `payments.js` | Bulk supplier quotes — the number the whole page rests on, and the one a sceptic will attack |
| **₹115 / ₹145 / ₹310 / ₹195 per programme** | `programs` in `content.js` | Same, and they must blend back to ₹160 |
| **₹310 for a chicken or mutton plate** | `programs` in `content.js` | Meat is the volatile input; price it against a bad month, not a good one |
| **50 / 25 / 15 / 10% programme shares** | `programs` in `content.js` | Your actual first-year budget |
| **92 / 5 / 3 funding split** | `funding` in `content.js` | Your first-year budget — presented as a commitment, so you will be held to it |
| **12A / 80G / CSR numbers** | `Footer.jsx` | Your real certificates — the placeholders are obviously fake |
| **50% deduction under 80G** | FAQ in `content.js` | Depends on your certificate; some orgs qualify at 100% |
| **FCRA position** | FAQ in `content.js` | Keep overseas gifts off this form unless you hold FCRA registration |

Food-safety and sourcing rules also bite harder now that meat is on the menu — FSSAI registration for
partner kitchens, and a cold chain for chicken and mutton. Neither is a website problem, but both are
launch blockers.

### A note on SEO

This is a client-rendered single-page app, so the initial HTML is an empty `<div id="root">`. Google
executes JS and will index it, but other crawlers and social-preview scrapers often won't. If organic
search matters for donations, either add `vite-plugin-prerender`/`react-snap` to emit static HTML at
build time, or move the site to Next.js for server rendering. The components port over as-is.
