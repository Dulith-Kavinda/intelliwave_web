import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { hasSupabaseConfig, supabase } from './supabase.js';

export const defaultSiteContent = {
  header: { brandName: '', navItems: [], orderCta: '', contactCta: '' },
  footer: { leftText: '', rightText: '' },
  home: { heroBadge: '', heroTitle: '', heroCopy: '', primaryCta: '', secondaryCta: '', specs: [], architecture: [], impact: [], business: [], technologies: [], progress: [], showDiscount: false, discountText: '', priceText: '' },
  installApp: { heroBadge: '', title: '', copy: '', steps: [], notes: [], backLabel: '', orderLabel: '', androidLink: '', iosLink: '', desktopLink: '' },
  orderDevice: { heroBadge: '', title: '', copy: '', nextLabel: '', orderItems: [], requestLabel: '', formNote: '', submitLabel: '', installLabel: '' },
  feedbackContact: { heroBadge: '', title: '', copy: '', topicLabel: '', contactTopics: [], formLabel: '', formNote: '', submitLabel: '' },
  leadForm: { idleMessage: '', configuredMessage: '', noConfigMessage: '', successMessage: '', signInMessage: '', signInButton: '', feedbackRatingLabel: '' }
};

const CONTENT_TABLE = 'site_content';
const SiteContentContext = createContext(null);

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeDeep(base, override) {
  if (Array.isArray(base) || Array.isArray(override)) {
    return override ?? base;
  }

  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override ?? base;
  }

  const merged = { ...base };

  for (const [key, value] of Object.entries(override)) {
    merged[key] = key in base ? mergeDeep(base[key], value) : value;
  }

  return merged;
}

export function SiteContentProvider({ children }) {
  const [overrides, setOverrides] = useState({});
  const [isLoading, setIsLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadContent() {
      setIsLoading(true);

      const { data, error } = await supabase.from(CONTENT_TABLE).select('content_key, content');

      if (!isMounted) {
        return;
      }

      if (error) {
        setIsLoading(false);
        return;
      }

      const nextOverrides = {};
      for (const row of data || []) {
        if (row?.content_key && isPlainObject(row.content)) {
          nextOverrides[row.content_key] = row.content;
        }
      }

      setOverrides(nextOverrides);
      setIsLoading(false);
    }

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const content = useMemo(() => mergeDeep(defaultSiteContent, overrides), [overrides]);

  const value = useMemo(
    () => ({
      content,
      isLoading,
      hasLiveData: hasSupabaseConfig,
    }),
    [content, isLoading],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);

  if (context) {
    return context;
  }

  return {
    content: defaultSiteContent,
    isLoading: false,
    hasLiveData: hasSupabaseConfig,
  };
}