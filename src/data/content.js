/* =========================================================
   All page copy lives here — edit this file, not the JSX.

   NOTE: this is a pre-launch organisation, so nothing here
   claims a track record. Costs and nutrition figures are
   PLANNED targets — verify them against real supplier quotes
   and a qualified nutritionist before publishing.
   ========================================================= */

import { CONFIG } from '../payments.js';
import { SITE } from './site.js';

/* Every derived number on the page comes from CONFIG — never hand-write a
   meal count, a cost or a nutrition figure into copy. */
const PROTEIN = CONFIG.proteinPerMeal;
const FIBRE = CONFIG.fibrePerMeal;

/* Programme costs blend to CONFIG.costPerMeal:
     0.50×115 + 0.25×145 + 0.15×310 + 0.10×195 = ₹159.75 ≈ ₹160
   If you change a cost or a share here, re-check that blend. */
/* The current appeal.

   `mealsFunded` has to be updated BY HAND — there is no payment gateway
   reporting totals, so this number is only as honest as your reconciliation.
   Update it from the bank statement, not from memory, and never round up:
   an inflated progress bar is the fastest way to lose a donor's trust. */
export const campaign = {
  name: 'Christmas 2026',
  goalMeals: 2000,
  deadline: '2026-12-25',
  mealsFunded: 0,
};

export const programs = [
  {
    icon: 'box',
    photo: 'rations',
    title: 'Balanced ration kits',
    body: 'A month of grain, dal, oil, eggs and seasonal vegetables — enough for a household to cook a complete plate rather than just fill one.',
    cost: '₹115',
    share: '50% of funds',
  },
  {
    icon: 'school',
    photo: 'school',
    title: 'School lunch with protein',
    body: 'Egg or chicken with rice and a vegetable, every school day. Not a supplement handed out at the gate — an actual meal, eaten sitting down.',
    cost: '₹145',
    share: '25% of funds',
  },
  {
    icon: 'bowl',
    photo: 'meat',
    title: 'The weekly meat meal',
    body: 'Chicken once a week, mutton on festival days. It is the single meal a household in poverty almost never gets, and by far the most expensive thing we serve.',
    cost: '₹310',
    share: '15% of funds',
  },
  {
    icon: 'shield',
    photo: 'kitchen',
    title: 'Emergency & mobile kitchen',
    body: 'Hot balanced meals driven to people on the street, and ready-to-eat rations after floods and displacement when no kitchen is left standing.',
    cost: '₹195',
    share: '10% of funds',
  },
];

/* The argument for a balanced plate — not testimonials. A new organisation
   has no beneficiaries to quote, and the reasoning matters more anyway. */
export const whyBalanced = [
  {
    icon: 'sprout',
    title: 'Cereals fill. They don’t build.',
    body: 'Rice and roti stop the hunger pang, and they are what the poorest eat almost exclusively because they are the cheapest calories money can buy. The body gets fuel and almost none of the material it needs to grow, repair itself or fight infection.',
  },
  {
    icon: 'alert',
    title: 'Meat is the first thing cut',
    body: 'When money runs short, chicken and mutton go first, then eggs, then dal — which is precisely where the protein was. A family can eat every single day and still be starved of what builds bone, muscle and a growing brain.',
  },
  {
    icon: 'coins',
    title: 'Fibre is the forgotten half',
    body: 'Vegetables get dropped as "not filling enough", and the fibre and micronutrients that come with them go too. Protein alone is not a diet. A plate has to carry both halves before it counts as a meal.',
  },
];

export const funding = [
  { label: 'Food & programme delivery', percent: 92, tone: '' },
  { label: 'Fundraising', percent: 5, tone: 'alt' },
  { label: 'Administration', percent: 3, tone: 'alt2' },
];

export const commitments = [
  {
    icon: 'chart',
    title: `Every plate: ${PROTEIN}g protein, ${FIBRE}g fibre`,
    body: 'We publish the menu and the nutrition breakdown of every meal we serve, and we will not count a plate that misses either target.',
  },
  {
    icon: 'doc',
    title: SITE.isRegistered ? 'Audited from year one' : 'Every rupee published',
    body: SITE.isRegistered
      ? 'Our accounts will be audited by a registered chartered accountant and published in full — including the first year, when nobody would think to ask.'
      : 'A public fundraiser has no statutory audit behind it, so we publish the ledger instead: everything collected, everything spent, itemised, updated as it happens. Once we are registered it becomes a proper audited account.',
  },
  {
    icon: 'clock',
    title: '72-hour emergency deployment',
    body: 'Once the emergency programme is running, funds will reach partner kitchens within three days of a verified request.',
  },
];

export const involvement = [
  {
    title: 'Volunteer a shift',
    body: 'Pack ration kits, drive the van or cook and serve. Shifts start at three hours, no experience needed.',
    cta: 'Register your interest',
  },
  {
    title: 'Host a food drive',
    body: 'Schools, offices and places of worship can collect the dal, grain and oil our kits are built from.',
    cta: 'Get a drive kit',
  },
  {
    title: 'CSR partnerships',
    body: "Nutrition programmes sit squarely inside Schedule VII, and we're looking for founding corporate partners.",
    cta: 'Talk to us',
  },
];

export const faqs = [
  {
    q: 'Why a balanced meal, and not simply more food?',
    a: `Because filling a stomach and feeding a body are not the same thing. The cheapest calories in India are cereal calories, so a household with no money ends up eating almost only rice or wheat — they stop feeling hungry while staying malnourished. A plate only counts once it carries protein that builds tissue and immunity, and the fibre and micronutrients that come with vegetables. Every meal we design targets at least ${PROTEIN}g of protein and ${FIBRE}g of fibre.`,
  },
  {
    q: 'Chicken and mutton? Isn’t that expensive for a charity?',
    a: 'Meat is by far the most expensive thing we serve — a chicken or mutton plate costs about ₹310 against ₹115 for a dal, rice and vegetable plate. That is exactly why we serve it weekly rather than daily, and why mutton is reserved for festival days. Meat is the first thing a household in poverty gives up, so it is the gap nobody else is filling; serving it occasionally is what keeps the blended cost at ₹160 a plate rather than far more.',
  },
  {
    q: 'What if someone doesn’t eat meat?',
    a: 'Then they get an equally balanced vegetarian plate — paneer, soya, extra dal, curd and groundnuts reach the same protein target. Nobody is served food that conflicts with their beliefs or their family’s practice, and nobody is asked to justify the choice. The nutrition target is fixed; the ingredients are not.',
  },
  {
    q: 'How is "₹160 a plate" calculated?',
    a: 'It is the planned blended cost across all four programmes, including cooking, packing and delivery: ₹115 for a dal, rice and vegetable plate, ₹145 for a school lunch with an egg, ₹310 for the weekly chicken or mutton meal, and ₹195 for emergency and mobile-kitchen meals, weighted 50/25/15/10. These are budgeted figures, not audited actuals — and they are the figures we most want to be held to.',
  },
  {
    q: 'Akshaya Patra feeds a child for ₹1,100 a year. You charge ₹160 a meal. Why?',
    a: 'Because these are not the same thing, and the gap is large enough that you deserve the full answer rather than a deflection. Akshaya Patra costs roughly ₹4.70 a meal to a donor. We cost about thirty-four times that. Three things account for it: they receive free foodgrain under the government mid-day meal scheme and we buy everything at market rates; they cook for millions at a time in industrial kitchens and we cook in small batches; and they serve a vegetarian school lunch while we serve a cooked, packed and delivered plate that carries meat most weeks. If the number you care about is meals per rupee, they will beat us every time and you should give to them — they are one of the best-run food charities in the country and we would rather you fed a child cheaply than fed nobody expensively. What ₹160 buys instead is a full meal delivered to someone who is not in a school queue: the homeless, the elderly living alone, families with no kitchen. That is a smaller number of people, fed properly.',
  },
  {
    q: 'Who is collecting this money, and where does it go?',
    a: SITE.isRegistered
      ? `Donations go to ${SITE.name}'s own current account, and the audited accounts are published every year.`
      : `Money goes to a personal UPI account held by ${SITE.organiser.name || 'the organiser'}${SITE.organiser.city ? ' in ' + SITE.organiser.city : ''}, because there is no registered organisation yet to hold a bank account of its own. That is a real limitation and you should weigh it: there is no board, no auditor and no statutory filing standing behind this fundraiser today. What there is instead is a published record of everything collected and everything spent, and a commitment to move to a registered account the moment registration is granted.`,
  },
  {
    q: 'You are new. Why should I trust you with money?',
    a: 'You should be sceptical — we have no track record yet, and we would rather say so than invent one. What we can offer is the commitments on this page: published nutrition targets per plate, a public record of every rupee collected and spent, and a clear breakdown of where the money goes. Start with a small amount, see whether the accounting appears as promised, and give more only if it does.',
  },
  {
    q: 'Is my donation tax-deductible?',
    a: !SITE.isRegistered
      ? 'No, and we would rather say that loudly than let you find out at tax time. This is a public fundraiser, not a registered charity: 12A and 80G registration is not in place, so nothing given here is deductible and no 80G certificate can be issued. If a tax deduction is what you need, give to an established registered charity instead — several excellent ones are named elsewhere in this FAQ.'
      : 'Yes. We are registered under Section 12A and hold 80G certification, so your gift is eligible for a 50% deduction under Section 80G of the Income Tax Act. Because there is no payment gateway telling us who paid, we match your UPI reference against our bank statement by hand and email your receipt once it clears — usually the next working day. Give us your PAN when you donate: the tax department requires it on the annual statement of donations we file, and without it your certificate cannot be generated.',
  },
  {
    q: 'Can I give every month?',
    a: 'Yes, but you set it up rather than us. UPI AutoPay and card e-mandates both require a payment gateway, and we have deliberately not connected one — a gateway would take 2% of every rupee. Instead, set a standing instruction to our account from your net banking, or a monthly reminder to send the same UPI payment. Email us and we will record you as a monthly donor so your receipts and reports come as one annual set. You cancel it yourself, from your own bank, with no conversation required.',
  },
  {
    q: 'Can I donate from outside India?',
    a: 'Foreign contributions are handled separately under FCRA rules and must go through a designated FCRA account. Email us and we will tell you exactly where we stand on that — please do not use the form above for an overseas gift.',
  },
];

export const navLinks = [
  { href: '#why', label: 'Why balanced' },
  { href: '#programs', label: 'Programmes' },
  { href: '#commitments', label: 'Commitments' },
  { href: '#faq', label: 'FAQ' },
];
