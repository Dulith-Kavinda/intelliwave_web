import Layout from '../components/Layout.jsx';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../lib/useSiteContent.jsx';

function HeroBadge({ children }) {
  return <span className="section-chip">{children}</span>;
}

export default function InstallApp() {
  const { content } = useSiteContent();

  const handleDownload = (e, fileUrl, defaultFilename) => {
    // If the database has a valid URL, navigate to it instead of starting a dummy local download
    if (fileUrl && fileUrl.startsWith('http')) {
      return; // Let standard anchor link behavior handle it
    }

    // Programmatically start a download of a dummy package file for demonstration/preview
    e.preventDefault();
    const element = document.createElement("a");
    const file = new Blob(["Mock Intelliwave Application Binary Data"], { type: 'application/octet-stream' });
    element.href = URL.createObjectURL(file);
    element.download = defaultFilename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <div className="space-y-5">
          <HeroBadge>{content.installApp.heroBadge}</HeroBadge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-slate-900">{content.installApp.title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">{content.installApp.copy}</p>
        </div>

        {/* Premium App Download Links Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">Choose your platform</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* iOS Download Card */}
            <article className="glass-panel rounded-[2rem] p-8 flex flex-col justify-between hover:shadow-lg transition duration-300">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  {/* Apple Icon */}
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.17c.65-.79 1.09-1.9 1-3.01-1 .04-2.22.67-2.94 1.51-.62.72-1.16 1.84-1 2.94 1.11.09 2.26-.64 2.94-1.44z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">iOS App</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Real-time waveform stream, BLE device configuration, and rhythm classifications on your iPhone or iPad.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <a
                  href={content.installApp.iosLink || '#'}
                  onClick={(e) => handleDownload(e, content.installApp.iosLink, 'intelliwave-app.ipa')}
                  className="cta-primary w-full justify-center text-sm"
                >
                  Download
                </a>
              </div>
            </article>

            {/* Android Download Card */}
            <article className="glass-panel rounded-[2rem] p-8 flex flex-col justify-between hover:shadow-lg transition duration-300">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  {/* Android Icon */}
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.523 15.3l1.815 3.144a.456.456 0 0 1-.165.622.458.458 0 0 1-.623-.165l-1.83-3.17a10.457 10.457 0 0 1-4.72 1.11 10.455 10.455 0 0 1-4.72-1.11l-1.83 3.17a.457.457 0 0 1-.623.165.456.456 0 0 1-.165-.622L6.477 15.3C3.682 13.565 1.77 10.519 1.517 7H22.48c-.25 3.519-2.165 6.565-4.96 8.3zM7 11.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm10 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM12 2a1 1 0 0 1 1 1v1h-2V3a1 1 0 0 1 1-1z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Android App</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Live cardiac screening alerts, telemetry stream, and patient file history on your phone or tablet.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <a
                  href={content.installApp.androidLink || '#'}
                  onClick={(e) => handleDownload(e, content.installApp.androidLink, 'intelliwave-app.apk')}
                  className="cta-primary w-full justify-center text-sm"
                >
                  Download
                </a>
              </div>
            </article>

            {/* Desktop Download Card */}
            <article className="glass-panel rounded-[2rem] p-8 flex flex-col justify-between hover:shadow-lg transition duration-300">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  {/* Laptop Icon */}
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect width="18" height="12" x="3" y="4" rx="2" />
                    <line x1="2" x2="22" y1="20" y2="20" />
                    <line x1="12" x2="12" y1="16" y2="20" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Desktop Client</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Full-featured desktop client with neural network analytics tools, batch screening exporter, and clinic logs dashboard.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <a
                  href={content.installApp.desktopLink || '#'}
                  onClick={(e) => handleDownload(e, content.installApp.desktopLink, 'intelliwave-setup.exe')}
                  className="cta-secondary w-full justify-center text-sm"
                >
                  Download
                </a>
              </div>
            </article>
          </div>
        </div>

        {/* Guides */}
        <div className="mt-12">
          {/* Installation Steps Guide Card */}
          <article className="glass-panel rounded-[2rem] p-8 space-y-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4">Installation Guide</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">01</div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">Install iOS Application</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    Click Download to download the package file. Since this is in developer preview, go to Settings &gt; General &gt; VPN &amp; Device Management on your device and trust the certificate after installing.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">02</div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">Install Android Application</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    Click Download to fetch the `.apk` package file. Make sure to allow installations from unknown sources in your settings, then tap the downloaded file to install it.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">03</div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">Install Desktop Client</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    Click Download to fetch the installer package. Double-click the installer (Windows `.exe` or macOS `.dmg`), follow the setup wizard prompts, and configure your BLE device module.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <Link className="cta-primary text-sm" to="/">{content.installApp.backLabel || 'Back'}</Link>
              <Link className="cta-secondary text-sm" to="/order-device">{content.installApp.orderLabel || 'Order Device'}</Link>
            </div>
          </article>
        </div>
      </section>
    </Layout>
  );
}