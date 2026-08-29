import Icon from './Icon.jsx';
import Photo from './Photo.jsx';
import { photos } from '../data/photos.js';
import { SITE } from '../data/site.js';
import { campaign } from '../data/content.js';

// The 80G promise is only true once registration is granted — see !SITE.isRegistered.
const TRUST = [
  'A balanced plate, not just calories',
  SITE.isRegistered ? '80G tax exemption' : 'Run openly as a public fundraiser',
  'Pay by UPI — no fees deducted',
];

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="pulse-dot" aria-hidden="true" />{' '}
            {campaign.goalMeals.toLocaleString('en-IN')} meals by {campaign.name}
          </p>

          <h1>
            Filling a stomach isn't
            <br />
            <em>the same as feeding a person.</em>
          </h1>

          <p className="lede">
            The cheapest food is cereal, so people with nothing eat almost only rice and roti. The
            hunger stops; the malnutrition doesn't. We serve people who are suffering a properly
            balanced plate — chicken, mutton, egg or dal for protein, vegetables for fibre, grain
            alongside.
          </p>

          <div className="hero-actions">
            <a className="btn btn-primary btn-lg" href="#donate">
              Donate now
            </a>
            <a className="btn btn-ghost btn-lg" href="#programs">
              See where it goes
            </a>
          </div>

          <ul className="trust-row" aria-label="Why donors trust us">
            {TRUST.map((item) => (
              <li key={item}>
                <Icon name="check" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-art">
            <Photo
              photo={photos.hero}
              className="hero-photo"
              sizes="(max-width: 1000px) calc(100vw - 40px), 46vw"
              priority
            />
          </div>

          <div className="float-card float-b">
            <span className="dot" aria-hidden="true" />
            <div>
              <strong>20g protein · 8g fibre</strong>
              <span>the floor for every plate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
