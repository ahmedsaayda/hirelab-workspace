import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, List, Typography, Input, Tag, Button, Skeleton } from 'antd';
import PublicService from '../../../../src/services/PublicService';

export default function CustomDomainMain() {
  const router = useRouter();
  const { userId } = router.query;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState({});
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      // Fallback for dev: if userId not present in route, resolve from backend using Host
      let resolvedUserId = userId;
      let resolvedWorkspaceId = null;

      // Always resolve by hostname to determine scope (workspace vs main)
      if (typeof window !== 'undefined') {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5155/api';
          const currentHostname = window.location.hostname.replace('www.', ''); // no port
          const params = new URLSearchParams(window.location.search);
          const queryOverride = params.get('cdh');
          const storedOverride = (() => {
            try { return localStorage.getItem('devCustomDomainHost') || null; } catch (_) { return null; }
          })();
          const envOverride = process.env.NEXT_PUBLIC_DEV_CUSTOM_HOST;
          const isLocal = currentHostname === 'localhost' || currentHostname === '127.0.0.1';
          const chosenHost = (isLocal ? (queryOverride || envOverride || storedOverride) : currentHostname) || currentHostname;
          console.log('[CDM] resolve owner from host', { currentHostname, isLocal, queryOverride, envOverridePresent: !!envOverride, chosenHost });
          const res = await fetch(`${backendUrl}/domains/by-hostname?hostname=${chosenHost}`);
          if (res.ok) {
            const data = await res.json();
            // Prefer host-resolved user/workspace when available
            resolvedUserId = data?.user_id || resolvedUserId;
            resolvedWorkspaceId = data?.workspaceId || null;
            console.log('[CDM] resolved', { resolvedUserId, resolvedWorkspaceId });
          } else {
            console.log('[CDM] by-hostname not ok', await res.text());
          }
        } catch (_) {}
      }

      if (!resolvedUserId) { setLoading(false); return; }
      setLoading(true);
      try {
        const res = await PublicService.queryLandingPagesOfRecruiter({
          page: 1,
          limit: 100,
          recruiterId: resolvedUserId,
          includeUnpublished: false,
          // If this domain belongs to a workspace, restrict to that workspace only
          workspace: resolvedWorkspaceId || undefined
        });
        const data = res?.data;
        const arr = Array.isArray(data?.result)
          ? data.result
          : Array.isArray(data)
            ? data
            : [];
        console.log('[CDM] jobs loaded', Array.isArray(arr) ? arr.length : 'n/a');
        setJobs(arr);
        // Load recruiter branding
        try {
          const r = await PublicService.getRecruiterData(resolvedUserId);
          const recruiter = r?.data?.recruiter || {};
          setBrand(recruiter || {});
          // Dynamically load brand fonts (object with {family, src} or string)
          const ensureFontLink = (id, href) => {
            if (!href) return;
            if (document.getElementById(id)) return;
            const link = document.createElement('link');
            link.id = id; link.rel = 'stylesheet'; link.href = href; document.head.appendChild(link);
          };
          const normalizeFamily = (f) => typeof f === 'string' ? f : (f?.family || undefined);
          const titleFontObj = recruiter?.titleFont;
          const bodyFontObj = recruiter?.bodyFont;
          if (titleFontObj?.src) ensureFontLink('cdm-title-font', titleFontObj.src);
          if (bodyFontObj?.src) ensureFontLink('cdm-body-font', bodyFontObj.src);
          // If only family names provided, load from Google Fonts as fallback
          const fams = [normalizeFamily(titleFontObj), normalizeFamily(bodyFontObj)].filter(Boolean);
          if (fams.length) {
            const q = fams.map((x)=>x.replace(/\s+/g,'+')).join('&family=');
            ensureFontLink('cdm-google-fonts', `https://fonts.googleapis.com/css2?family=${q}:wght@400;600;700&display=swap`);
          }
        } catch (_) {}
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, [userId]);

  const primaryColor = brand?.primaryColor || brand?.themeColor || '#6D28D9';
  const titleFontFamily = brand?.titleFont ? `'${brand.titleFont}', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, sans-serif` : undefined;
  const bodyFontFamily = brand?.bodyFont ? `'${brand.bodyFont}', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, sans-serif` : undefined;

  const filteredJobs = (jobs || []).filter(j => {
    if (!query) return true;
    const hay = `${j?.vacancyTitle || ''} ${j?.department || ''} ${j?.companyName || ''}`.toLowerCase();
    return hay.includes(query.toLowerCase());
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', fontFamily: bodyFontFamily }}>
      <style jsx>{`
        .cdm-hero{background: radial-gradient(1200px 400px at 10% -10%, ${primaryColor}22 0%, transparent 70%), radial-gradient(800px 300px at 90% -20%, ${primaryColor}1f 0%, transparent 70%)}
        .cdm-btn{background:${primaryColor};border-color:${primaryColor};color:#fff}
        .cdm-btn:hover{filter:brightness(0.95)}
        .cdm-card:hover{box-shadow:0 10px 24px rgba(0,0,0,0.06); transform: translateY(-2px)}
      `}</style>

      <div className="cdm-hero w-full border-b" style={{ borderColor: '#eef2ff' }}>
        <div className="max-w-5xl mx-auto px-4 py-10 flex items-center gap-5">
          {brand?.companyLogo ? (
            <img src={brand.companyLogo} alt={brand?.brandName || 'Logo'} className="!w-16  object-contain" />
          ) : (
            <div style={{ width:64, height:64, borderRadius:12, background: primaryColor }} />
          )}
          <div>
            <div style={{ fontFamily: titleFontFamily, color:'#111827' }} className="text-2xl font-bold">{brand?.brandName || 'Careers'}</div>
            <div className="text-gray-600 text-sm">{brand?.jobPortalHeroTitle || 'Join Our Team: Where Your Career Takes Off'}</div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 style={{ fontFamily: titleFontFamily }} className="text-2xl font-semibold">Open Positions</h2>
          <Input.Search placeholder="Search roles, teams..." allowClear onSearch={setQuery} onChange={(e)=>setQuery(e.target.value)} style={{ maxWidth: 360 }} />
        </div>

        {loading ? (
          <Card>
            <Skeleton active title paragraph={{ rows: 3 }} />
          </Card>
        ) : (
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={filteredJobs}
            renderItem={(job) => {
              const title = job?.vacancyTitle || job?.name || job?.alternativeName || 'Open position';
              const subtitle = job?.department || job?.companyName || '';
              const location = Array.isArray(job?.location) ? job.location.join(', ') : job?.location;
              return (
                <List.Item key={job?._id}>
                  <Card className="cdm-card" hoverable onClick={() => router.push(`/lp/${job._id}`)}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div style={{ fontFamily: titleFontFamily }} className="text-lg font-semibold">{title}</div>
                        {subtitle ? <div className="text-gray-500 text-sm mb-2">{subtitle}</div> : null}
                        <div className="flex flex-wrap gap-2">
                          {location ? <Tag>{location}</Tag> : null}
                          {job?.engagementType ? <Tag>{job.engagementType}</Tag> : null}
                          {job?.contractType ? <Tag>{job.contractType}</Tag> : null}
                        </div>
                      </div>
                      <Button className="cdm-btn" type="primary" onClick={() => router.push(`/lp/${job._id}`)}>View & Apply</Button>
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}







