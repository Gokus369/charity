import { Brand } from './Header.jsx';
import { SITE } from '../data/site.js';

const EXPLORE = [
  { href: '#why', label: 'Why balanced' },
  { href: '#programs', label: 'Programmes' },
  { href: '#commitments', label: 'Commitments' },
];

const SUPPORT = [
  { href: '#donate', label: 'Donate' },
  { href: '#involved', label: 'Volunteer' },
  { href: '#involved', label: 'Host a drive' },
  { href: '#faq', label: 'FAQ' },
];

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Brand />
          <p>{SITE.blurb}</p>
        </div>

        <nav aria-label="Site">
          <h3>Explore</h3>
          {EXPLORE.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <nav aria-label="Support">
          <h3>Support</h3>
          {SUPPORT.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="footer-contact">
          <h3>Contact</h3>
          <p>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
          <p>
            <a href={`tel:${SITE.phone.href}`}>{SITE.phone.display}</a>
          </p>
          <p>
            {SITE.address[0]}
            <br />
            {SITE.address[1]}
          </p>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <p>
          © {new Date().getFullYear()} {SITE.publicName}.{' '}
          {SITE.isRegistered ? SITE.registration : 'A public fundraiser — not a registered charity.'}
        </p>
        <p>
          <a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Annual report</a>
        </p>
      </div>
    </footer>
  );
}
