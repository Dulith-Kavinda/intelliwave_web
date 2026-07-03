import Layout from '../components/Layout.jsx';
import LeadForm from '../components/LeadForm.jsx';
import { useSiteContent } from '../lib/useSiteContent.jsx';

function HeroBadge({ children }) {
  return <span className="section-chip">{children}</span>;
}

export default function FeedbackContact() {
  const { content } = useSiteContent();

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="space-y-5">
          <HeroBadge>{content.feedbackContact.heroBadge}</HeroBadge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-900">{content.feedbackContact.title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">{content.feedbackContact.copy}</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="glass-panel rounded-[2rem] p-8">
            <h2 className="text-2xl font-bold text-slate-900">{content.feedbackContact.topicLabel}</h2>
            <div className="mt-6 grid gap-3">
              {content.feedbackContact.contactTopics.map((topic) => (
                <div key={topic} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {topic}
                </div>
              ))}
            </div>
          </article>

          <article className="glass-panel rounded-[2rem] p-8">
            <h2 className="text-2xl font-bold text-slate-900">{content.feedbackContact.formLabel}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{content.feedbackContact.formNote}</p>
            <div className="mt-6">
              <LeadForm mode="contact" buttonLabel={content.feedbackContact.submitLabel} note="We’ll reply after your message is captured in Supabase." />
            </div>
          </article>
        </div>
      </section>
    </Layout>
  );
}