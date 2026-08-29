import Icon from './Icon.jsx';
import { SectionHead, Reveal } from './Section.jsx';
import { whyBalanced } from '../data/content.js';
import { CONFIG } from '../payments.js';

export default function WhyBalanced() {
  return (
    <section className="section section-alt" id="why" aria-labelledby="whyHeading">
      <div className="wrap">
        <SectionHead
          id="whyHeading"
          eyebrow="Why a balanced plate"
          title="A full stomach can still be a starving body"
        >
          Hunger relief usually stops at calories. That is the cheap half of the problem — and the
          half that leaves people fed but not nourished. Every plate we serve is built to carry at
          least <strong>{CONFIG.proteinPerMeal}g of protein</strong> and{' '}
          <strong>{CONFIG.fibrePerMeal}g of fibre</strong>: meat, egg or dal alongside vegetables
          and grain.
        </SectionHead>

        <div className="card-grid card-grid-3">
          {whyBalanced.map((item, i) => (
            <Reveal as="article" className="card" key={item.title} delay={i * 70}>
              <span className="card-icon" aria-hidden="true">
                <Icon name={item.icon} className="" />
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
