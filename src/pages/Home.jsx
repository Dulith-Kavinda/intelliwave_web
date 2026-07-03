import { lazy, Suspense, useEffect, useMemo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useSiteContent } from '../lib/useSiteContent.jsx';
import { supabase } from '../lib/supabase.js';
import deviceImg from '../images/device_display.png';
import electrodePlacementImg from '../images/electrode_placement.png';

const LazyDeviceScene = lazy(() => import('../components/DeviceScene.jsx'));

function HeroBadge({ children }) {
  return <span className="section-chip">{children}</span>;
}

function ParallaxDeviceImage() {
  return (
    <div className="relative my-12 flex justify-center items-center px-4">
      <div 
        className="w-full max-w-2xl h-[420px] rounded-[2.5rem] border border-slate-200/80 bg-gradient-to-b from-slate-50/50 to-white shadow-xl shadow-slate-100/50 relative overflow-hidden flex justify-center items-center"
      >
        {/* Subtle glow effect on light background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-sky-200/30 blur-3xl" />
        
        {/* Parallax background window */}
        <div 
          className="absolute inset-0 bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${deviceImg})`,
            backgroundAttachment: 'fixed',
            backgroundSize: '390px', // Increased image size further for enhanced visibility
          }}
        />
        
        {/* Faint slate grid pattern overlay for modern design */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a04_1px,transparent_1px),linear-gradient(to_bottom,#0f172a04_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
      </div>
    </div>
  );
}

export default function Home() {
  const { content } = useSiteContent();
  const [scrollY, setScrollY] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const updateScroll = () => setScrollY(window.scrollY);

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadFeedbacks() {
      if (!supabase) {
        setFeedbacks([]);
        return;
      }

      const { data } = await supabase
        .from('feedback_messages')
        .select('display_name, organization, rating, message, created_at')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (isMounted) {
        setFeedbacks(data && data.length ? data : []);
      }
    }

    loadFeedbacks();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroShift = useMemo(() => Math.min(scrollY * 0.07, 52), [scrollY]);
  const deviceShift = useMemo(() => Math.min(scrollY * 0.03, 18), [scrollY]);
  const glowShift = useMemo(() => Math.min(scrollY * 0.1, 70), [scrollY]);

  return (
    <Layout>
      <section id="top" className="relative mx-auto max-w-7xl px-6 pb-20 pt-14 lg:px-8 lg:pb-24 lg:pt-18">

        <div className="relative grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="space-y-8">
            <HeroBadge>{content.home.heroBadge}</HeroBadge>
            <div className="space-y-5">
              <h1 className="max-w-3xl font-display text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                {content.home.heroTitle}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                {content.home.heroCopy}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/order-device" className="cta-primary">
                {content.home.primaryCta}
              </Link>
              <Link to="/feedback-contact" className="cta-secondary">
                {content.home.secondaryCta}
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {content.home.specs.map((metric) => (
                <div key={metric.label} className="glass-panel rounded-3xl p-4">
                  <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
                  <div className="mt-2 text-sm text-slate-500">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-sky-200/80 blur-2xl" style={{ transform: `translateY(${glowShift}px)` }} />
            <div className="glass-panel relative rounded-[2rem] p-4" style={{ transform: `translateY(${deviceShift}px)` }}>
              {content.home.showDiscount && (
                <Link
                  to="/order-device"
                  className="absolute -top-5 -right-5 z-10 group flex items-center gap-3.5 rounded-[1.5rem] bg-gradient-to-br from-rose-500 to-amber-500 px-6 py-3 text-white shadow-xl shadow-rose-500/30 transition-all duration-300 hover:scale-105 hover:shadow-rose-500/50 active:scale-95"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[11px] font-black uppercase tracking-[0.18em] text-rose-100">{content.home.discountText}</span>
                    <span className="text-base font-extrabold mt-1">{content.home.priceText}</span>
                  </div>

                  <svg className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              )}
              <Suspense
                fallback={
                  <div className="flex h-[520px] items-center justify-center rounded-[2rem] border border-slate-200 bg-white text-sm uppercase tracking-[0.2em] text-slate-500">
                    Loading 3D demo...
                  </div>
                }
              >
                <LazyDeviceScene />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <section id="specs" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <div className="space-y-4">
            <HeroBadge>Device architecture</HeroBadge>
            <h2 className="section-title">Built from an analog front end, microcontroller, and BLE module.</h2>
            <p className="section-copy">
              Intelliwave combines electrodes, AD8233 acquisition, STM32 control, and HM-10 transmission to keep the device compact and practical.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.home.architecture.map((item) => (
              <article key={item.title} className="glass-panel rounded-[1.75rem] p-6">
                <div className="text-sm uppercase tracking-[0.2em] text-sky-700">{item.title}</div>
                <div className="mt-3 text-base leading-7 text-slate-700">{item.detail}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="space-y-4">
            <HeroBadge>AI detection</HeroBadge>
            <h2 className="section-title">1D CNN classification helps detect normal and abnormal rhythms automatically.</h2>
            <p className="section-copy">
              The MIT-BIH-trained model reduces cognitive load for doctors and improves diagnostic accuracy for intermittent events.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {content.home.impact.map((feature) => (
              <article key={feature.title} className="glass-panel rounded-[1.75rem] p-6">
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Electrode Placement Section */}
      <section id="placement" className="mx-auto max-w-7xl px-6 py-16 lg:px-8 border-t border-slate-100">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="glass-panel rounded-[2rem] p-6 flex justify-center items-center bg-slate-50/50">
            <img 
              src={electrodePlacementImg} 
              alt="Intelliwave 3-lead Electrode Placement Diagram" 
              className="rounded-3xl max-h-[480px] w-full object-contain mix-blend-multiply"
            />
          </div>
          <div className="space-y-6">
            <HeroBadge>Electrode placement</HeroBadge>
            <h2 className="section-title">Simplified three-lead placement for stable signal capture.</h2>
            <p className="section-copy">
              Intelliwave operates on an optimized three-lead electrode configuration (RA, LA, LL) to ensure clinical-grade signal acquisition with minimum setup. The color-coded leads correspond directly to the standard Einthoven triangle positions for clear cardiac screening.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border border-slate-200 bg-white rounded-2xl p-4 text-center">
                <span className="inline-block w-4 h-4 rounded-full bg-rose-500 mb-2"></span>
                <div className="font-semibold text-slate-800 text-sm">Right Arm (RA)</div>
                <div className="text-xs text-slate-500 mt-1">Yellow-Red leads</div>
              </div>
              <div className="border border-slate-200 bg-white rounded-2xl p-4 text-center">
                <span className="inline-block w-4 h-4 rounded-full bg-yellow-400 mb-2"></span>
                <div className="font-semibold text-slate-800 text-sm">Left Arm (LA)</div>
                <div className="text-xs text-slate-500 mt-1">Ground Reference</div>
              </div>
              <div className="border border-slate-200 bg-white rounded-2xl p-4 text-center">
                <span className="inline-block w-4 h-4 rounded-full bg-emerald-500 mb-2"></span>
                <div className="font-semibold text-slate-800 text-sm">Left Leg (LL)</div>
                <div className="text-xs text-slate-500 mt-1">Signal Reference</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Device Overview & Parallax Section */}
      <section id="device-parallax" className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 border-t border-slate-100">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
          <HeroBadge>Connected Hardware</HeroBadge>
          <h2 className="section-title">Seamless BLE transmission with local AI rhythm analysis.</h2>
          <p className="section-copy mx-auto">
            Review live waveform patterns and neural network predictions directly on your mobile device. The HM-10 Bluetooth module continuously transmits data at low latency.
          </p>
        </div>
        
        <ParallaxDeviceImage />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          <div className="glass-panel rounded-3xl p-6">
            <h4 className="font-semibold text-slate-900">Low-Latency BLE</h4>
            <p className="mt-2 text-sm text-slate-600">Continuous 250Hz ECG data transmission with zero data loss or packet dropouts.</p>
          </div>
          <div className="glass-panel rounded-3xl p-6">
            <h4 className="font-semibold text-slate-900">AI Waveform Analytics</h4>
            <p className="mt-2 text-sm text-slate-600">MIT-BIH database trained CNN classification model identifies rhythm changes immediately.</p>
          </div>
          <div className="glass-panel rounded-3xl p-6">
            <h4 className="font-semibold text-slate-900">Clinician Dashboard</h4>
            <p className="mt-2 text-sm text-slate-600">Monitor Heart Rate, SpO2, Blood Pressure and signal quality indicators on the fly.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {content.home.business.map((plan) => (
            <article key={plan.title} className="glass-panel rounded-[2rem] p-7">
              <h3 className="text-2xl font-bold text-slate-900">{plan.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{plan.detail}</p>
              <Link className="cta-secondary mt-6 inline-flex" to="/order-device">
                Explore pricing
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <article className="glass-panel rounded-[2rem] p-8 lg:p-10">
            <HeroBadge>Core stack</HeroBadge>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">The hardware and model stack behind Intelliwave.</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {content.home.technologies.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="glass-panel rounded-[2rem] p-8 lg:p-10">
            <HeroBadge>Project progress</HeroBadge>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              {content.home.progress.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <HeroBadge>Featured feedback</HeroBadge>
            <h2 className="section-title">What early reviewers say about Intelliwave.</h2>
            <p className="section-copy">
              These sample comments come from the Supabase feedback table and can be edited or replaced later from the database.
            </p>
          </div>
          <div className="grid gap-4">
            {feedbacks.length ? (
              feedbacks.slice(0, 3).map((feedback) => (
                <article key={`${feedback.display_name}-${feedback.message}`} className="glass-panel rounded-[1.75rem] p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{feedback.display_name}</h3>
                      <p className="text-sm text-slate-500">{feedback.organization}</p>
                    </div>
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                      {feedback.rating}/5
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{feedback.message}</p>
                </article>
              ))
            ) : (
              <div className="glass-panel rounded-[1.75rem] p-6 text-sm text-slate-600">No featured feedback has been published yet.</div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}