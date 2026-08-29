import Icon from './Icon.jsx';
import DonationForm from './DonationForm.jsx';
import CampaignProgress from './CampaignProgress.jsx';
import { Reveal } from './Section.jsx';
import { CONFIG, money } from '../payments.js';
import { SITE } from '../data/site.js';

export default function DonateSection() {
  return (
    <section className="donate" id="donate" aria-labelledby="donateHeading">
      <div className="wrap donate-grid">
        <div className="donate-pitch">
          <p className="eyebrow">Give food, today</p>
          <h2 id="donateHeading">Choose an amount. We'll do the rest.</h2>
          <p className="section-sub">
            Every <strong>{money(CONFIG.costPerMeal)}</strong> puts one balanced plate in front of
            someone — protein, vegetables and grain, not just something to fill a stomach. You pay
            by UPI direct, so no gateway takes a cut on the way: every rupee you send is a rupee
            that can be spent on food.
          </p>

          <CampaignProgress />

          <Reveal className="assure" delay={120}>
            <Icon name="shieldPlain" />
            <div>
              <p>
                <strong>No card details, no middleman.</strong> You pay from your own UPI app, so we
              never see your bank or card details and no gateway takes a cut. Because the money
              arrives without your name on it, we match it against the reference you give us and
              email your receipt once it clears — usually the next working day.
              {SITE.isRegistered && ' That receipt is your 80G certificate.'}
            </p>

              <p className="assure-note">
                <strong>Giving every month?</strong> UPI AutoPay needs a payment gateway we have
                deliberately not connected. Set up a standing instruction to the account details
                above from your bank, and tell us — we will treat it as a monthly gift.
              </p>
            </div>
          </Reveal>
        </div>

        <DonationForm />
      </div>
    </section>
  );
}
