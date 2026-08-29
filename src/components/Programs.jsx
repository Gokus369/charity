import Photo from './Photo.jsx';
import { SectionHead, Reveal } from './Section.jsx';
import { programs } from '../data/content.js';
import { photos } from '../data/photos.js';

// One card per breakpoint column, so the browser never downloads the 760w
// file for a card rendered 300px wide.
const CARD_SIZES = '(max-width: 720px) calc(100vw - 40px), (max-width: 1000px) 46vw, 24vw';

export default function Programs() {
  return (
    <section className="section" id="programs" aria-labelledby="programsHeading">
      <div className="wrap">
        <SectionHead
          id="programsHeading"
          eyebrow="What we do"
          title="Four programmes, one goal: a balanced plate"
        >
          Your donation isn't pooled into a vague fund. It flows into one of four programmes, each
          with a published cost per meal and the same nutrition floor.
        </SectionHead>

        <div className="card-grid">
          {programs.map((p, i) => (
            <Reveal as="article" className="card card-media" key={p.title} delay={(i % 4) * 70}>
              <Photo photo={photos[p.photo]} className="card-photo" sizes={CARD_SIZES} />
              <div className="card-body">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <p className="card-meta">
                  <strong>{p.cost}</strong> per meal · {p.share}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
