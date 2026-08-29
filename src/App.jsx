import StatusBanner from './components/StatusBanner.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Programs from './components/Programs.jsx';
import DonateSection from './components/DonateSection.jsx';
import WhyBalanced from './components/WhyBalanced.jsx';
import Commitments from './components/Commitments.jsx';
import GetInvolved from './components/GetInvolved.jsx';
import Faq from './components/Faq.jsx';
import CtaBand from './components/CtaBand.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <StatusBanner />
      <Header />

      <main id="main">
        <Hero />
        <WhyBalanced />
        <Programs />
        <DonateSection />
        <Commitments />
        <GetInvolved />
        <Faq />
        <CtaBand />
      </main>

      <Footer />
    </>
  );
}
