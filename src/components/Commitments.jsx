import Icon from './Icon.jsx';
import { Reveal } from './Section.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { funding, commitments } from '../data/content.js';

export default function Commitments() {
  // `.bars.is-visible` is what animates each bar out to its width.
  const barsRef = useReveal();

  return (
    <section className="section" id="commitments" aria-labelledby="commitHeading">
      <div className="wrap trans-grid">
        <div>
          <p className="eyebrow">What we commit to</p>
          <h2 id="commitHeading">92 paise of every rupee, committed to food</h2>
          <p className="section-sub">
            We are new, so we have no annual report to point at yet — and we would rather say that
            plainly than dress up numbers we haven't earned. What we can do is publish the split we
            are committing to, and then be measured against it.
          </p>

          <div className="bars" ref={barsRef}>
            {funding.map((row) => (
              <div className="bar-row" key={row.label}>
                <div className="bar-top">
                  <span>{row.label}</span>
                  <strong>{row.percent}%</strong>
                </div>
                <div className="bar">
                  <span className={row.tone} style={{ '--w': `${row.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <p className="bars-note">Planned allocation for our first year of operation.</p>
        </div>

        <ul className="accountability">
          {commitments.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 70}>
              <Icon name={item.icon} />
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
