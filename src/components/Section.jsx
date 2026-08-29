import { useReveal } from '../hooks/useReveal.js';

/** Section heading block that fades in on scroll. */
export function SectionHead({ eyebrow, title, id, children }) {
  const ref = useReveal();
  return (
    <header className="section-head reveal" ref={ref}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {children && <p className="section-sub">{children}</p>}
    </header>
  );
}

/** Any block that should fade in on scroll, keeping its own tag + classes. */
export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`${className} reveal`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
