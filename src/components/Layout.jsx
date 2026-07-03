import Footer from './Footer.jsx';
import Header from './Header.jsx';
import { useSiteContent } from '../lib/useSiteContent.jsx';

export default function Layout({ children }) {
  const { isLoading } = useSiteContent();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-emerald-600">
        <div className="glass-panel relative flex flex-col items-center gap-6 p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-glow backdrop-blur-xl max-w-xs w-full mx-6">
          <div className="absolute inset-0 z-0 opacity-5 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:16px_16px] rounded-[2rem]" />
          
          <div className="relative z-10 flex h-24 w-52 items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500/5 blur-2xl animate-pulse rounded-full" />
            
            <svg className="w-full h-full text-emerald-500 filter drop-shadow-[0_0_6px_rgba(16,185,129,0.35)]" viewBox="0 0 100 30" fill="none">
              <path
                d="M 0 15 H 25 L 30 15 L 34 5 L 38 25 L 42 15 H 48 L 50 10 L 52 20 L 54 15 H 100"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ecg-line"
              />
            </svg>
          </div>
          
          <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600/80 animate-pulse">Monitoring telemetry stream</span>
            <span className="text-sm font-semibold tracking-wider text-slate-600">Loading Intelliwave ECG...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Header />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  );
}