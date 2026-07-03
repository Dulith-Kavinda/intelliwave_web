import Layout from '../components/Layout.jsx';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <span className="section-chip">Legal Documents</span>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500 font-mono">Last updated: July 2026</p>

        <article className="mt-12 space-y-8 text-slate-600 leading-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">1. Health Data Protection (HIPAA & GDPR)</h2>
            <p>
              Intelliwave operates advanced BLE hardware nodes that stream real-time cardiac waveforms directly to your patient client. All electrocardiogram (ECG) data, heart rate calculations, and classification annotations are encrypted locally using industrial-grade AES-256 protocols before being uploaded to databases.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">2. Telemetry Storage Criteria</h2>
            <p>
              Any recorded waveform streams are processed exclusively for telemetry diagnostics and logging. We do not sell or share patient records with third-party networks, advertising networks, or unauthorized cloud repositories. Database rows are stored strictly under secure custom authentication mechanisms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">3. Local Credentials & Cookies</h2>
            <p>
              We use local browser session storage strictly for maintaining credentials during administrative sessions. No marketing cookies or diagnostic profile trackers are installed without explicit user consent.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">4. Contact Data Privacy</h2>
            <p>
              Clinic information submitted via our Order Form (distributor name, clinic details, and requests) is retained securely to compile distribution requests. Clinic coordinators can request total removal of their order details by emailing <a href="mailto:support@intelliwave.com" className="font-semibold text-slate-900 underline">support@intelliwave.com</a>.
            </p>
          </div>
        </article>
      </section>
    </Layout>
  );
}
