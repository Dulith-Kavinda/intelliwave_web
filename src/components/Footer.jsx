import logo from '../images/logo_black.png';
import { useSiteContent } from '../lib/useSiteContent.jsx';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { content } = useSiteContent();

  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo & Contact details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Intelliwave logo" className="h-8 w-12 object-contain brightness-0 invert" />
              <span className="font-display text-lg font-bold tracking-[0.18em] text-white">
                {content.header.brandName || 'INTELLIWAVE'}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Advanced BLE ECG telemetry monitoring and intelligent classifications dashboard.
            </p>
            <div className="text-xs text-slate-500 space-y-1.5 pt-2">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">Email:</span>
                <a href="mailto:support@intelliwave.com" className="hover:text-white transition text-slate-400">
                  support@intelliwave.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">Tel:</span>
                <span className="text-slate-400">+94 (11) 234-5678</span>
              </p>
            </div>
          </div>

          {/* Nav & Info links */}
          <div className="mt-8 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link to="/" className="text-sm text-slate-400 hover:text-white transition">Home</Link>
                  </li>
                  <li>
                    <Link to="/install-app" className="text-sm text-slate-400 hover:text-white transition">Install App</Link>
                  </li>
                  <li>
                    <Link to="/order-device" className="text-sm text-slate-400 hover:text-white transition">Order Device</Link>
                  </li>
                </ul>
              </div>
              <div className="mt-8 md:mt-0">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Legal & Terms</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link to="/terms-conditions" className="text-sm text-slate-400 hover:text-white transition">Terms & Conditions</Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy" className="text-sm text-slate-400 hover:text-white transition">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/user-agreement" className="text-sm text-slate-400 hover:text-white transition">End User License Agreement</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>{content.footer.leftText}</span>
          <span>{content.footer.rightText}</span>
        </div>
      </div>
    </footer>
  );
}