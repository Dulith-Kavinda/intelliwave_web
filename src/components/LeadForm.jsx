import { useState } from 'react';
import { hasSupabaseConfig, signInWithGoogle, supabase } from '../lib/supabase.js';
import { useSiteContent } from '../lib/useSiteContent.jsx';
import { useSupabaseSession } from '../lib/useSupabaseSession.jsx';

export default function LeadForm({ mode = 'demo', buttonLabel = 'Submit request', note }) {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const { session, loading: sessionLoading } = useSupabaseSession();
  const { content } = useSiteContent();

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get('fullName') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const organization = String(formData.get('organization') || '').trim();
    const details = String(formData.get('details') || '').trim();
    const rating = Number(formData.get('rating') || 5);

    if (!fullName || !email || !details) {
      setStatus('error');
      setMessage(mode === 'contact' ? 'Please add your name, email, and feedback message.' : 'Please add your name, email, and request details.');
      return;
    }

    setStatus('sending');
    setMessage('');

    if (!supabase) {
      setStatus('success');
      setMessage(content.leadForm.noConfigMessage);
      event.currentTarget.reset();
      return;
    }

    const tableName = mode === 'contact' ? 'feedback_messages' : 'lead_requests';
    const payload =
      mode === 'contact'
        ? {
            display_name: fullName,
            email,
            organization,
            rating,
            message: details,
            is_featured: false,
          }
        : {
            full_name: fullName,
            email,
            organization,
            details,
            request_type: mode,
            source: 'intelliwave-landing',
          };

    const { error } = await supabase.from(tableName).insert(payload);

    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }

    setStatus('success');
    setMessage(content.leadForm.successMessage);
    event.currentTarget.reset();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-600">
          <span className="block">Full name</span>
          <input className="field-input" name="fullName" placeholder="Dr. A. Perera" />
        </label>
        <label className="space-y-2 text-sm text-slate-600">
          <span className="block">Email</span>
          <input className="field-input" name="email" type="email" placeholder="name@hospital.com" />
        </label>
      </div>
      <label className="space-y-2 text-sm text-slate-600">
        <span className="block">Organization</span>
        <input className="field-input" name="organization" placeholder="Hospital, clinic, distributor, or home user" />
      </label>
      {mode === 'contact' ? (
        <label className="space-y-2 text-sm text-slate-600">
          <span className="block">{content.leadForm.feedbackRatingLabel}</span>
          <select className="field-input" name="rating" defaultValue="5">
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Strong</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Needs work</option>
            <option value="1">1 - Poor</option>
          </select>
        </label>
      ) : null}
      <label className="space-y-2 text-sm text-slate-600">
        <span className="block">Details</span>
        <textarea
          className="field-input min-h-[120px] resize-y"
          name="details"
          placeholder={mode === 'order' ? 'Device quantity, delivery timeline, and setup needs' : 'Share your feedback, comments, or contact message'}
        />
      </label>
      <button className="cta-primary w-full justify-center" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : buttonLabel}
      </button>
      {message ? (
        <p className={`text-sm ${status === 'error' ? 'text-rose-500' : status === 'success' ? 'text-sky-600' : 'text-slate-500'}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}