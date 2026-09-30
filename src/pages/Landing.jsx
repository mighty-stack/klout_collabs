import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wordmark } from '../components/ui.jsx';
import { warmUp } from '../api/client.js';
import {
  ABOUT, HOW_IT_WORKS, BENEFITS_INTRO, BENEFITS, FAQ_INTRO, FAQS, FOOTER_COLUMNS, FOOTER_SOCIALS,
} from '../lib/content.js';

function useInViewFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function SocialIcon({ name }) {
  if (name === 'instagram') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle className="solid" cx="18" cy="6" r="1" /></svg>;
  }
  if (name === 'linkedin') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path className="solid" d="M5.2 8.8H2.4V21h2.8V8.8ZM3.8 3a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM21.6 13.9c0-3.7-2-5.4-4.7-5.4-2.2 0-3.2 1.2-3.8 2V8.8h-2.8V21h2.8v-6.1c0-1.6.3-3.2 2.4-3.2s2.1 1.9 2.1 3.3V21h2.8l1.2-7.1Z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path className="solid" d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.8 5.7 22H2.5l7.3-8.4L1.9 2h6.5l4.4 6.6L18.9 2Zm-1.1 17.9h1.7L7.4 4H5.6l12.2 15.9Z" /></svg>;
}

const revealClass = (name, reveal) => `${name} reveal${reveal.visible ? ' is-visible' : ''}`;

export default function Landing() {
  const intro = useInViewFadeIn();
  const pair = useInViewFadeIn();
  const about = useInViewFadeIn();
  const steps = useInViewFadeIn();
  const benefits = useInViewFadeIn();
  const faq = useInViewFadeIn();
  const footer = useInViewFadeIn();
  const [benefitIndex, setBenefitIndex] = useState(0);
  const [benefitHovered, setBenefitHovered] = useState(false);
  const [benefitFocused, setBenefitFocused] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const activeBenefit = BENEFITS[benefitIndex];

  useEffect(() => {
    if (!benefits.visible || benefitHovered || benefitFocused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const interval = window.setInterval(() => {
      setBenefitIndex((index) => (index + 1) % BENEFITS.length);
    }, 5500);
    return () => window.clearInterval(interval);
  }, [benefits.visible, benefitHovered, benefitFocused]);

  useEffect(() => {
    warmUp(); // give a sleeping free-tier API a head start before anyone submits a form
  }, []);

  return (
    <>
      <header className="nav">
        <Wordmark />
        <nav>
          <a href="#about" className="hide-m">About</a>
          <Link to="/login">Log in</Link>
        </nav>
      </header>

      <section ref={intro.ref} className={revealClass('intro', intro)}>
        <h1 className="hero-title">Brands and creators, reviewed and in one place.</h1>
        <p className="hero-copy">Register your brand or your channel. The Klout Collabs team checks every profile before it goes live, then shares collaboration opportunities with verified members.</p>
      </section>

      <section ref={pair.ref} className={revealClass('pair', pair)} aria-label="Choose how you want to join">
        <article className="side brand">
          <div>
            <h2>I run a brand or business</h2>
            <p>Tell us what you sell, where you operate and the kind of creators you want to work with.</p>
            <div className="cta"><Link className="btn white" to="/register/brand">Register your brand</Link></div>
          </div>
          <div className="sample" aria-hidden="true">
            <div className="row">
              <div className="avatar b">A</div>
              <div><strong>Adaeze Skin Lab</strong><small>Beauty and personal care</small></div>
            </div>
            <div className="facts">
              <span><b>Location</b>&nbsp;Lagos, Nigeria</span>
              <span><b>Looking for</b>&nbsp;Product reviews, giveaways</span>
            </div>
          </div>
        </article>

        <article className="side creator">
          <div>
            <h2>I create content</h2>
            <p>Share your niche, your platforms and your audience so brands can see who you are.</p>
            <div className="cta"><Link className="btn ink" to="/register/creator">Register as a creator</Link></div>
          </div>
          <div className="sample" aria-hidden="true">
            <div className="row">
              <div className="avatar c">T</div>
              <div><strong>Tomi Cooks</strong><small>Food and home cooking</small></div>
            </div>
            <div className="facts">
              <span><b>Location</b>&nbsp;Accra, Ghana</span>
              <span><b>TikTok</b>&nbsp;48,200 followers</span>
            </div>
          </div>
        </article>
      </section>

      <section ref={about.ref} className={revealClass('about', about)} id="about">
        <h2>What Klout Collabs does</h2>
        <div className="copy">
          {ABOUT.map((p) => <p key={p}>{p}</p>)}
        </div>
      </section>

      <section ref={steps.ref} className={revealClass('steps', steps)}>
        <h3>How joining works</h3>
        <ol>
          {HOW_IT_WORKS.map((s, i) => (
            <li key={s.title}>
              <div className="n">{i + 1}</div>
              <strong>{s.title}</strong>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section ref={benefits.ref} className={revealClass('benefits', benefits)} aria-labelledby="benefits-title">
        <div className="benefits-intro">
          <h2 id="benefits-title">{BENEFITS_INTRO[0]}</h2>
          <p>{BENEFITS_INTRO[1]}</p>
        </div>
        <div
          className="benefit-carousel" role="region" aria-roledescription="carousel" aria-label="Why members choose Klout Collabs"
          onMouseEnter={() => setBenefitHovered(true)} onMouseLeave={() => setBenefitHovered(false)}
          onFocusCapture={() => setBenefitFocused(true)}
          onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setBenefitFocused(false); }}
        >
          <article className="benefit-slide" key={activeBenefit.number} role="group" aria-roledescription="slide" aria-label={`${benefitIndex + 1} of ${BENEFITS.length}`} aria-live={benefitHovered || benefitFocused ? 'polite' : 'off'}>
            <span className="n" aria-hidden="true">{activeBenefit.number}</span>
            <h3>{activeBenefit.title}</h3>
            <p>{activeBenefit.text}</p>
          </article>
          <div className="benefit-controls">
            <button className="benefit-arrow" type="button" aria-label="Previous benefit" onClick={() => setBenefitIndex((index) => (index - 1 + BENEFITS.length) % BENEFITS.length)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <div className="benefit-indicators" role="group" aria-label="Choose a benefit">
              {BENEFITS.map((benefit, index) => (
                <button className={index === benefitIndex ? 'on' : ''} type="button" key={benefit.number} aria-label={`Show benefit ${index + 1}: ${benefit.title}`} aria-pressed={index === benefitIndex} onClick={() => setBenefitIndex(index)} />
              ))}
            </div>
            <button className="benefit-arrow" type="button" aria-label="Next benefit" onClick={() => setBenefitIndex((index) => (index + 1) % BENEFITS.length)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </button>
            <span className="benefit-position" aria-live="polite">{benefitIndex + 1} / {BENEFITS.length}</span>
          </div>
        </div>
      </section>

      <section ref={faq.ref} className={revealClass('faq-section', faq)} id="faq" aria-labelledby="faq-title">
        <h2 id="faq-title">{FAQ_INTRO[0]}</h2>
        <div className="faq-list">
          {FAQS.map((item, index) => {
            const isOpen = openFaq === index;
            const buttonId = `faq-question-${index}`;
            const answerId = `faq-answer-${index}`;
            return (
              <article className={`faq-item${isOpen ? ' open' : ''}`} key={item.question}>
                <h3>
                  <button id={buttonId} className="faq-question" type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenFaq(isOpen ? null : index)}>
                    <span>{item.question}</span><span className="faq-icon" aria-hidden="true" />
                  </button>
                </h3>
                <div className={`faq-answer${isOpen ? ' open' : ''}`} id={answerId} role="region" aria-labelledby={buttonId} aria-hidden={!isOpen} inert={!isOpen}>
                  <div><p>{item.answer}</p></div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer ref={footer.ref} className={revealClass('site', footer)} id="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Wordmark />
            <p>{FOOTER_COLUMNS[0].description}</p>
          </div>
          {FOOTER_COLUMNS.slice(1).map((column) => (
            <nav className="footer-links" aria-label={column.title} key={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.to.startsWith('/') ? <Link to={link.to}>{link.label}</Link> : <a href={link.to}>{link.label}</a>}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Klout Collabs</span>
          <ul className="footer-socials" aria-label="Social media">
            {FOOTER_SOCIALS.map((social) => (
              <li key={social.icon}>
                <button type="button" aria-label={`${social.label} coming soon`} title={`${social.label} coming soon`} disabled>
                  <SocialIcon name={social.icon} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
