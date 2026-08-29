/* Single source for every inline SVG on the page. */

const PATHS = {
  check: <path d="m5 13 4 4L19 7" />,
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  close: <path d="M18 6 6 18M6 6l12 12" />,
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2 3 6v6c0 5 3.8 9.3 9 10 5.2-.7 9-5 9-10V6l-9-4Z" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </>
  ),
  shieldPlain: <path d="M12 2 3 6v6c0 5 3.8 9.3 9 10 5.2-.7 9-5 9-10V6l-9-4Z" />,
  box: (
    <>
      <path d="M3 7h18v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z" />
      <path d="M3 7 5 3h14l2 4" />
      <path d="M10 12h4" />
    </>
  ),
  school: (
    <>
      <path d="M22 9 12 4 2 9l10 5 10-5Z" />
      <path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
    </>
  ),
  truck: (
    <>
      <path d="M1 8h13v9H1z" />
      <path d="M14 11h4l3 3v3h-7z" />
      <circle cx="6" cy="18.5" r="2" />
      <circle cx="17.5" cy="18.5" r="2" />
    </>
  ),
  doc: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
      <path d="M14 2v6h6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="m7 14 4-4 3 3 5-6" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c0-4 3-6.5 7.5-6.5C19.5 10.5 16.5 13 12 13Z" />
      <path d="M12 15.5c0-3.2-2.6-5.5-6.5-5.5 0 3.2 2.6 5.5 6.5 5.5Z" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5" />
      <path d="M12 16.2h.01" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
      <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  bowl: (
    <>
      <path d="M3 12h18a9 9 0 0 1-9 9 9 9 0 0 1-9-9Z" />
      <path d="M12 3c-1.6 1.4-1.6 3.6 0 5" />
      <path d="M8.5 5.5c-1 .9-1 2.3 0 3.2" />
      <path d="M15.5 5.5c1 .9 1 2.3 0 3.2" />
    </>
  ),
};

export default function Icon({ name, className = 'ic', ...rest }) {
  const paths = PATHS[name];
  if (!paths) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...rest}>
      {paths}
    </svg>
  );
}
