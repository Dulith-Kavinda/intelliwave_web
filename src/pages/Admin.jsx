import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { defaultSiteContent } from '../lib/useSiteContent.jsx';
import { signInWithEmail, signOut, supabase } from '../lib/supabase.js';
import { useSupabaseSession } from '../lib/useSupabaseSession.jsx';



export default function Admin() {
  const { session, loading } = useSupabaseSession();
  const [message, setMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [contentDrafts, setContentDrafts] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('visual'); // 'visual', 'data'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const defaultDrafts = useMemo(() => {
    const nextDrafts = {};
    for (const [sectionKey, value] of Object.entries(defaultSiteContent)) {
      nextDrafts[sectionKey] = JSON.stringify(value, null, 2);
    }
    return nextDrafts;
  }, []);

  useEffect(() => {
    if (!supabase || !session) {
      setIsAdmin(false);
      return undefined;
    }

    let isMounted = true;

    async function loadAdminData() {
      setIsAdminLoading(true);

      const [
        { data: adminRows, error: adminError }, 
        { data: feedbackData, error: feedbackError }, 
        { data: requestData, error: requestError }, 
        { data: contentData, error: contentError }
      ] = await Promise.all([
        supabase.from('site_admins').select('email'),
        supabase.from('feedback_messages').select('id, display_name, email, organization, rating, message, is_featured, created_at').order('created_at', { ascending: false }),
        supabase.from('lead_requests').select('id, full_name, email, organization, details, request_type, created_at').order('created_at', { ascending: false }),
        supabase.from('site_content').select('content_key, content').order('content_key', { ascending: true }),
      ]);

      if (!isMounted) {
        return;
      }

      if (adminError) {
        setMessage(adminError.message);
        setIsAdmin(false);
        setIsAdminLoading(false);
        return;
      }

      const adminEmails = (adminRows || []).map((row) => String(row.email || '').toLowerCase()).filter(Boolean);
      const currentEmail = String(session.user?.email || '').toLowerCase();
      const nextIsAdmin = adminEmails.length === 0 || adminEmails.includes(currentEmail);

      setIsAdmin(nextIsAdmin);

      if (!nextIsAdmin) {
        setIsAdminLoading(false);
        return;
      }

      setFeedbacks(feedbackError ? [] : feedbackData || []);
      setRequests(requestError ? [] : requestData || []);

      if (contentError) {
        setMessage(contentError.message);
      } else {
        const nextDrafts = { ...defaultDrafts };

        for (const row of contentData || []) {
          if (row?.content_key && row.content) {
            nextDrafts[row.content_key] = JSON.stringify(row.content, null, 2);
          }
        }

        setContentDrafts(nextDrafts);
      }

      setIsAdminLoading(false);
    }

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, [defaultDrafts, session]);

  async function handleLogin(e) {
    if (e) e.preventDefault();
    if (!email || !password) {
      setMessage('Please enter both email and password.');
      return;
    }
    setIsSaving(true);
    setMessage('');
    const { error } = await signInWithEmail(email, password);
    if (error) {
      setMessage(error.message);
    }
    setIsSaving(false);
  }

  async function handleToggleFeatured(feedbackId, nextValue) {
    if (!supabase) {
      return;
    }

    setIsSaving(true);
    setMessage('');

    const { error } = await supabase.from('feedback_messages').update({ is_featured: nextValue }).eq('id', feedbackId);

    if (error) {
      setMessage(error.message);
    } else {
      setFeedbacks((current) => current.map((item) => (item.id === feedbackId ? { ...item, is_featured: nextValue } : item)));
    }

    setIsSaving(false);
  }
  async function handleDeleteFeedback(feedbackId) {
    if (!supabase || !confirm('Are you sure you want to delete this feedback message?')) {
      return;
    }

    setIsSaving(true);
    setMessage('');

    const { data, error } = await supabase.from('feedback_messages').delete().eq('id', feedbackId).select();

    if (error) {
      setMessage(error.message);
    } else if (!data || data.length === 0) {
      setMessage('Delete failed. Verify that your email is registered in the site_admins table and the RLS delete policy is set up.');
    } else {
      setFeedbacks((current) => current.filter((item) => item.id !== feedbackId));
      setMessage('Feedback message deleted successfully.');
      setTimeout(() => setMessage(''), 3000);
    }

    setIsSaving(false);
  }

  async function handleDeleteRequest(requestId) {
    if (!supabase || !confirm('Are you sure you want to delete this order request?')) {
      return;
    }

    setIsSaving(true);
    setMessage('');

    const { data, error } = await supabase.from('lead_requests').delete().eq('id', requestId).select();

    if (error) {
      setMessage(error.message);
    } else if (!data || data.length === 0) {
      setMessage('Delete failed. Verify that your email is registered in the site_admins table and the RLS delete policy is set up.');
    } else {
      setRequests((current) => current.filter((item) => item.id !== requestId));
      setMessage('Order request deleted successfully.');
      setTimeout(() => setMessage(''), 3000);
    }

    setIsSaving(false);
  }

  async function handleSaveContent(sectionKey) {
    if (!supabase) {
      return;
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(contentDrafts[sectionKey]);
    } catch {
      setMessage(`Section ${sectionKey} contains invalid JSON.`);
      return;
    }

    setIsSaving(true);
    setMessage('');

    const { error } = await supabase.from('site_content').upsert({ content_key: sectionKey, content: parsedContent });

    if (error) {
      setMessage(error.message);
    } else {
      setContentDrafts((current) => ({ ...current, [sectionKey]: JSON.stringify(parsedContent, null, 2) }));
      setMessage(`${sectionKey} copy saved successfully.`);
      setTimeout(() => setMessage(''), 3000);
    }

    setIsSaving(false);
  }

  // Parse structured data for Visual Form Inputs
  const headerData = useMemo(() => {
    try { return JSON.parse(contentDrafts['header'] || '{}'); } 
    catch { return defaultSiteContent.header; }
  }, [contentDrafts]);

  const homeData = useMemo(() => {
    try { return JSON.parse(contentDrafts['home'] || '{}'); }
    catch { return defaultSiteContent.home; }
  }, [contentDrafts]);

  const installAppData = useMemo(() => {
    try { return JSON.parse(contentDrafts['installApp'] || '{}'); }
    catch { return defaultSiteContent.installApp; }
  }, [contentDrafts]);

  // Unified visual editor field updater
  function updateField(sectionKey, fieldKey, value) {
    setContentDrafts((current) => {
      let parsed = {};
      try {
        parsed = JSON.parse(current[sectionKey] || '{}');
      } catch {
        parsed = { ...defaultSiteContent[sectionKey] };
      }
      parsed[fieldKey] = value;
      return {
        ...current,
        [sectionKey]: JSON.stringify(parsed, null, 2)
      };
    });
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || isAdminLoading) {
    return (
      <Layout>
        <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
          <div className="glass-panel rounded-[2rem] p-8 text-sm text-slate-600 flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
            Loading admin session...
          </div>
        </section>
      </Layout>
    );
  }

  if (!supabase) {
    return (
      <Layout>
        <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
          <div className="glass-panel rounded-[2rem] p-8 text-sm text-rose-600">
            Supabase is not configured. Add the project URL and anon key first.
          </div>
        </section>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="glass-panel rounded-[2rem] p-8">
              <span className="section-chip">Admin login</span>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900">Sign in to manage the site</h1>
              <p className="mt-3 text-sm leading-7 text-slate-600">Enter your administrator email and password credentials.</p>
            </article>

            <article className="glass-panel rounded-[2rem] p-8">
              <form onSubmit={handleLogin} className="space-y-4">
                <label className="block space-y-2 text-sm text-slate-600">
                  <span className="font-semibold">Email address</span>
                  <input
                    type="email"
                    required
                    className="field-input"
                    placeholder="admin@intelliwave.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSaving}
                  />
                </label>
                <label className="block space-y-2 text-sm text-slate-600">
                  <span className="font-semibold">Password</span>
                  <input
                    type="password"
                    required
                    className="field-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSaving}
                  />
                </label>
                <button
                  type="submit"
                  className="cta-primary justify-center w-full py-3 mt-2 text-sm font-semibold"
                  disabled={isSaving}
                >
                  {isSaving ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </article>
          </div>
        </section>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
          <div className="glass-panel rounded-[2rem] p-8 text-sm text-rose-600">
            Your account ({session.user?.email}) is signed in, but it is not listed in the site_admins table.
          </div>
          <div className="mt-6 flex justify-start">
            <button className="cta-secondary" type="button" onClick={signOut}>
              Sign out
            </button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
            <span className="section-chip">Admin Panel</span>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900">Intelliwave Command Center</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">Update content, review clinic requests, feature feedback, and manage promotions.</p>
          </div>
          <button className="cta-secondary text-sm" type="button" onClick={signOut}>
            Sign out
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 border-b border-slate-200">
          <nav className="-mb-px flex gap-6">
            <button
              onClick={() => setActiveTab('visual')}
              className={`pb-4 text-sm font-semibold border-b-2 transition ${activeTab === 'visual' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
            >
              Visual Site Editor
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`pb-4 text-sm font-semibold border-b-2 transition ${activeTab === 'data' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
            >
              Orders & Feedback ({requests.length + feedbacks.length})
            </button>

          </nav>
        </div>

        {message ? (
          <div className="mt-6 p-4 rounded-2xl bg-sky-50 border border-sky-100 text-sm text-sky-700 font-medium">
            {message}
          </div>
        ) : null}

        {/* Tab 1: Visual Content Editor */}
        {activeTab === 'visual' && (
          <div className="mt-8 space-y-8">
            {/* Header Settings Card */}
            <article className="glass-panel rounded-[2rem] p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Header Settings</h2>
                <p className="text-sm text-slate-500 mt-1">Modify header text and call-to-actions.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-3">
                <label className="space-y-2 text-sm text-slate-600">
                  <span className="block font-medium">Brand Name</span>
                  <input 
                    type="text" 
                    className="field-input" 
                    value={headerData.brandName || ''} 
                    onChange={(e) => updateField('header', 'brandName', e.target.value)} 
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600">
                  <span className="block font-medium">Order CTA Label</span>
                  <input 
                    type="text" 
                    className="field-input" 
                    value={headerData.orderCta || ''} 
                    onChange={(e) => updateField('header', 'orderCta', e.target.value)} 
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600">
                  <span className="block font-medium">Feedback CTA Label</span>
                  <input 
                    type="text" 
                    className="field-input" 
                    value={headerData.contactCta || ''} 
                    onChange={(e) => updateField('header', 'contactCta', e.target.value)} 
                  />
                </label>
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button 
                  className="cta-primary text-sm" 
                  onClick={() => handleSaveContent('header')}
                  disabled={isSaving}
                >
                  Save Header Changes
                </button>
              </div>
            </article>

            {/* Hero & Promotion Settings Card */}
            <article className="glass-panel rounded-[2rem] p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Homepage Hero & Promotion Settings</h2>
                <p className="text-sm text-slate-500 mt-1">Configure landing page descriptions and promo badges.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-600">
                  <span className="block font-medium">Hero Badge Tag</span>
                  <input 
                    type="text" 
                    className="field-input" 
                    value={homeData.heroBadge || ''} 
                    onChange={(e) => updateField('home', 'heroBadge', e.target.value)} 
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600">
                  <span className="block font-medium">Hero Title</span>
                  <input 
                    type="text" 
                    className="field-input" 
                    value={homeData.heroTitle || ''} 
                    onChange={(e) => updateField('home', 'heroTitle', e.target.value)} 
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600 sm:col-span-2">
                  <span className="block font-medium">Hero Copy Paragraph</span>
                  <textarea 
                    className="field-input min-h-[80px]" 
                    value={homeData.heroCopy || ''} 
                    onChange={(e) => updateField('home', 'heroCopy', e.target.value)} 
                  />
                </label>
              </div>

              {/* Promo Discount Settings */}
              <div className="pt-6 border-t border-slate-100 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">ECG Device Discount settings</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Toggle and configure the floating price/discount badge on the 3D model.</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="flex items-center h-full">
                    <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-700">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        checked={Boolean(homeData.showDiscount)} 
                        onChange={(e) => updateField('home', 'showDiscount', e.target.checked)} 
                      />
                      <span>Show Discount Badge</span>
                    </label>
                  </div>
                  <label className="space-y-2 text-sm text-slate-600">
                    <span className="block font-medium">Discount Badge Label</span>
                    <input 
                      type="text" 
                      className="field-input" 
                      placeholder="e.g. 10% Discount"
                      value={homeData.discountText || ''} 
                      onChange={(e) => updateField('home', 'discountText', e.target.value)} 
                      disabled={!homeData.showDiscount}
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-600">
                    <span className="block font-medium">Display Price</span>
                    <input 
                      type="text" 
                      className="field-input" 
                      placeholder="e.g. 25,000 LKR"
                      value={homeData.priceText || ''} 
                      onChange={(e) => updateField('home', 'priceText', e.target.value)} 
                      disabled={!homeData.showDiscount}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button 
                  className="cta-primary text-sm" 
                  onClick={() => handleSaveContent('home')}
                  disabled={isSaving}
                >
                  Save Homepage Content
                </button>
              </div>
            </article>

            {/* App Installer Links Settings Card */}
            <article className="glass-panel rounded-[2rem] p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">App Download Links</h2>
                <p className="text-sm text-slate-500 mt-1">Configure app installer package URLs for the Install App page downloads.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-3">
                <label className="space-y-2 text-sm text-slate-600">
                  <span className="block font-medium">iOS Download URL</span>
                  <input 
                    type="text" 
                    className="field-input" 
                    placeholder="App Store URL or Direct download link"
                    value={installAppData.iosLink || ''} 
                    onChange={(e) => updateField('installApp', 'iosLink', e.target.value)} 
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600">
                  <span className="block font-medium">Android Download URL</span>
                  <input 
                    type="text" 
                    className="field-input" 
                    placeholder="Play Store URL or Direct APK link"
                    value={installAppData.androidLink || ''} 
                    onChange={(e) => updateField('installApp', 'androidLink', e.target.value)} 
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600">
                  <span className="block font-medium">Desktop Download URL</span>
                  <input 
                    type="text" 
                    className="field-input" 
                    placeholder="Desktop Setup .exe/.dmg download link"
                    value={installAppData.desktopLink || ''} 
                    onChange={(e) => updateField('installApp', 'desktopLink', e.target.value)} 
                  />
                </label>
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button 
                  className="cta-primary text-sm" 
                  onClick={() => handleSaveContent('installApp')}
                  disabled={isSaving}
                >
                  Save App Links
                </button>
              </div>
            </article>
          </div>
        )}

        {/* Tab 2: Orders & Feedback Logs */}
        {activeTab === 'data' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* Feedback Review Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Featured & Customer Feedback</h2>
                <p className="text-sm text-slate-500 mt-1">Review feedback submissions and select up to 3 reviews to feature on the Homepage.</p>
              </div>

              <div className="space-y-4">
                {feedbacks.length ? (
                  feedbacks.map((feedback) => (
                    <article key={feedback.id} className="glass-panel rounded-[1.75rem] p-6 hover:shadow-md transition">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{feedback.display_name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{feedback.organization || 'No organization'} • {feedback.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-600 select-none bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full cursor-pointer hover:bg-sky-50 transition">
                            <input 
                              type="checkbox" 
                              className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                              checked={Boolean(feedback.is_featured)} 
                              onChange={(event) => handleToggleFeatured(feedback.id, event.target.checked)} 
                              disabled={isSaving} 
                            />
                            <span>Featured</span>
                          </label>
                          <button
                            onClick={() => handleDeleteFeedback(feedback.id)}
                            className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Feedback"
                            disabled={isSaving}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-1">
                        <span className="text-xs font-semibold text-slate-700 bg-sky-50 text-sky-800 px-2 py-0.5 rounded-full">
                          Rating: {feedback.rating}/5
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono ml-2">
                          {formatDate(feedback.created_at)}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600 italic">
                        "{feedback.message}"
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="glass-panel rounded-[1.75rem] p-8 text-center text-slate-500 text-sm">
                    No feedback messages found in database.
                  </div>
                )}
              </div>
            </div>

            {/* Clinic Orders Log Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Clinic Order Requests</h2>
                <p className="text-sm text-slate-500 mt-1">Review incoming device order requests and clinic deployments.</p>
              </div>

              <div className="space-y-4">
                {requests.length ? (
                  requests.map((request) => (
                    <article key={request.id} className="glass-panel rounded-[1.75rem] p-6 hover:shadow-md transition">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{request.full_name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{request.organization || 'No organization'} • {request.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-slate-900 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                            {request.request_type}
                          </span>
                          <button
                            onClick={() => handleDeleteRequest(request.id)}
                            className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Order Request"
                            disabled={isSaving}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-400 font-mono">
                        Submitted: {formatDate(request.created_at)}
                      </div>

                      <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Request Details</span>
                        <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{request.details}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="glass-panel rounded-[1.75rem] p-8 text-center text-slate-500 text-sm">
                    No order requests found in database.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


      </section>
    </Layout>
  );
}