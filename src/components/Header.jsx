import { useState } from 'react';
import Icon from './Icon.jsx';
import { navLinks } from '../data/content.js';
import { SITE } from '../data/site.js';
import { useStickyHeader } from '../hooks/useStickyHeader.js';

export function Brand() {
  return (
    <a className="brand" href="#home" aria-label={`${SITE.publicName}, home`}>
      <span className="brand-mark" aria-hidden="true">
        <Icon
          name="bowl"
          className=""
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </span>
      <span className="brand-text">
        {SITE.wordmark.lead}
        <span> {SITE.wordmark.accent}</span>
      </span>
    </a>
  );
}

export default function Header() {
  const stuck = useStickyHeader();
  const [open, setOpen] = useState(false);

  return (
    <header className={'site-header' + (stuck ? ' is-stuck' : '')}>
      <div className="wrap header-inner">
        <Brand />

        <nav
          className={'nav' + (open ? ' is-open' : '')}
          id="primaryNav"
          aria-label="Primary"
          onClick={() => setOpen(false)}
        >
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a className="btn btn-primary btn-sm nav-donate" href="#donate">
            Donate
          </a>
        </nav>

        <button
          className="nav-toggle"
          id="navToggle"
          aria-expanded={open}
          aria-controls="primaryNav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
