import { SectionHead, Reveal } from './Section.jsx';
import { involvement } from '../data/content.js';

export default function GetInvolved() {
  return (
    <section className="section" id="involved" aria-labelledby="involvedHeading">
      <div className="wrap">
        <SectionHead id="involvedHeading" eyebrow="Beyond giving" title="Other ways to help" />

        <div className="card-grid card-grid-3">
          {involvement.map((item, i) => (
            <Reveal as="article" className="card card-soft" key={item.title} delay={i * 70}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <a className="link-arrow" href="#contact">
                {item.cta} <span aria-hidden="true">→</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
