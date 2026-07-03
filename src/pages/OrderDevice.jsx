import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import LeadForm from '../components/LeadForm.jsx';
import { useSiteContent } from '../lib/useSiteContent.jsx';

function HeroBadge({ children }) {
  return <span className="section-chip">{children}</span>;
}

export default function OrderDevice() {
  const { content } = useSiteContent();

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="space-y-5">
          <HeroBadge>{content.orderDevice.heroBadge}</HeroBadge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-900">{content.orderDevice.title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">{content.orderDevice.copy}</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <article className="glass-panel rounded-[2rem] p-8">
            <h2 className="text-2xl font-bold text-slate-900">{content.orderDevice.nextLabel}</h2>
            <ul className="mt-6 space-y-4">
              {content.orderDevice.orderItems.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="glass-panel rounded-[2rem] p-8">
            <h2 className="text-2xl font-bold text-slate-900">{content.orderDevice.requestLabel}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{content.orderDevice.formNote}</p>
            <div className="mt-6">
              <LeadForm mode="order" buttonLabel={content.orderDevice.submitLabel} />
            </div>
          </article>
        </div>

        <div className="mt-8">
          <Link className="cta-secondary" to="/install-app">{content.orderDevice.installLabel}</Link>
        </div>
      </section>
    </Layout>
  );
}