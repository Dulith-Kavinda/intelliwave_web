import Layout from '../components/Layout.jsx';

export default function UserAgreement() {
  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <span className="section-chip">Legal Documents</span>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">End User License Agreement</h1>
        <p className="mt-2 text-sm text-slate-500 font-mono">Last updated: July 2026</p>

        <article className="mt-12 space-y-8 text-slate-600 leading-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">1. Software License Grant</h2>
            <p>
              Intelliwave grants you a non-exclusive, non-transferable, limited license to install and run the Intelliwave Desktop Client, iOS Application, and Android Application strictly to sync with registered BLE ECG hardware nodes.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">2. Device Usage Requirements</h2>
            <p>
              The user agrees that raw diagnostic telemetry readings must be validated by licensed clinical personnel. The classification suggestions provided by the Intelliwave neural network algorithm are designed for auxiliary assistance and do not constitute a standalone medical diagnostic claim.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">3. Diagnostic Tool Exports</h2>
            <p>
              Users are permitted to export diagnostic PDF waveform charts and patient cardiac classification histories strictly for clinical files. Automated batch parsing, bulk data scraping, or feeding exports into external neural models is restricted unless authorized in writing.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">4. Update Compliance</h2>
            <p>
              To maintain telemetry stability and device bluetooth handshake standards, user clients will query for firmware updates. Clinics are advised to install updates promptly to maintain compatibility with our database sync handlers.
            </p>
          </div>
        </article>
      </section>
    </Layout>
  );
}
