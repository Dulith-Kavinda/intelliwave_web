import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../images/logo_black.png';
import { useSiteContent } from '../lib/useSiteContent.jsx';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useSiteContent();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Set initial state in case the page loads already scrolled
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Transparent/blurred only on the home page while at the top;
  // solid white once scrolled or on any other page.
  const showTransparent = isHome && !isScrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          showTransparent
            ? 'border-transparent bg-transparent shadow-none'
            : 'border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link className="flex items-center gap-3 text-slate-900" to="/">
            <img src={logo} alt="Intelliwave logo" className="h-8 w-12" />
            <span className="font-display text-lg font-bold tracking-[0.18em]">{content.header.brandName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 md:flex">
            {content.header.navItems.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) => `rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link className="cta-secondary text-sm" to={location.pathname === '/order-device' ? '/feedback-contact' : '/order-device'}>
              {location.pathname === '/order-device' ? content.header.contactCta : content.header.orderCta}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-700 hover:bg-slate-100 transition"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden animate-fade-in">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setMobileMenuOpen(false)} />
          
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white p-6 shadow-2xl transition duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <Link className="flex items-center gap-3 text-slate-900" to="/" onClick={() => setMobileMenuOpen(false)}>
                <img src={logo} alt="Intelliwave logo" className="h-8 w-12" />
                <span className="font-display text-lg font-bold tracking-[0.18em]">{content.header.brandName}</span>
              </Link>
              <button
                type="button"
                className="rounded-xl p-2.5 text-slate-700 hover:bg-slate-100 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-8 space-y-6">
              <nav className="flex flex-col gap-2">
                {content.header.navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    className={({ isActive }) => `block rounded-2xl px-4 py-3 text-base font-semibold transition ${isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              
              <div className="pt-6 border-t border-slate-100">
                <Link
                  className="cta-primary w-full justify-center text-center text-base"
                  to={location.pathname === '/order-device' ? '/feedback-contact' : '/order-device'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {location.pathname === '/order-device' ? content.header.contactCta : content.header.orderCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}