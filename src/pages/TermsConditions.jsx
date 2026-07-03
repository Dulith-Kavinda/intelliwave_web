import Layout from '../components/Layout.jsx';

export default function TermsConditions() {
  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <span className="section-chip">Legal Documents</span>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Terms & Conditions</h1>
        <p className="mt-2 text-sm text-slate-500 font-mono">Last updated: July 2026</p>

        <article className="mt-12 space-y-8 text-slate-600 leading-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">1. Subscription & Rentals</h2>
            <p>
              By renting or acquiring the Intelliwave ECG node, clinics agree to the standard subscription terms. Hardware orders require a base fee (e.g. 25,000 LKR) covering device setup, initial diagnostic patches, BLE wireless synchronizer node calibration, and full client software access.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">2. Device Warranty & Operational Limitations</h2>
            <p>
              The Intelliwave ECG monitor is a precision telemetry tool. The device must be sanitized and configured in accordance with the user documentation. Modifying node firmware or attempting reverse-engineering of BLE streams will invalidate the clinic warranty.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">3. Software Deployment & Dashboard Logs</h2>
            <p>
              Administrative dashboard users are responsible for keeping credentials confidential. Direct API access, clinic logs query, and waveform export logs are restricted strictly to registered physicians under custom organization rules.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">4. Billing & Support Queries</h2>
            <p>
              Invoices are compiled monthly. Subscription updates, custom distributor orders, and billing revisions can be coordinated through your regional administrator or directly by emailing support.
            </p>
          </div>
        </article>
      </section>
    </Layout>
  );
}
