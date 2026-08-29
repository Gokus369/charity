import { SectionHead } from './Section.jsx';
import { faqs } from '../data/content.js';

export default function Faq() {
  return (
    <section className="section section-alt" id="faq" aria-labelledby="faqHeading">
      <div className="wrap wrap-narrow">
        <SectionHead id="faqHeading" eyebrow="Questions" title="Before you give" />

        <div className="faq">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
