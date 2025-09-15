import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, List, Typography } from 'antd';
import PublicService from '../../../../src/services/PublicService';

export default function CustomDomainMain() {
  const router = useRouter();
  const { userId } = router.query;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Fallback for dev: if userId not present in route, resolve from backend using Host
      let resolvedUserId = userId;
      if (!resolvedUserId && typeof window !== 'undefined') {
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
            resolvedUserId = data?.user_id;
            console.log('[CDM] resolved userId', resolvedUserId);
          } else {
            console.log('[CDM] by-hostname not ok', await res.text());
          }
        } catch (_) {}
      }
      if (!resolvedUserId) { setLoading(false); return; }
      setLoading(true);
      try {
        const res = await PublicService.queryLandingPagesOfRecruiter({ page: 1, limit: 100, recruiterId: resolvedUserId, includeUnpublished: false });
        const data = res?.data;
        const arr = Array.isArray(data?.result)
          ? data.result
          : Array.isArray(data)
            ? data
            : [];
        console.log('[CDM] jobs loaded', Array.isArray(arr) ? arr.length : 'n/a');
        setJobs(arr);
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <Card title="Open Positions" loading={loading}>
          <List
            dataSource={jobs}
            renderItem={(job) => {
              const title = job?.vacancyTitle || job?.name || job?.alternativeName || 'Open position';
              const subtitle = job?.department || job?.companyName || '';
              return (
                <List.Item key={job?._id} className="cursor-pointer" onClick={() => router.push(`/lp/${job._id}`)}>
                  <div>
                    <Typography.Text strong>{title}</Typography.Text>
                    {subtitle ? <div className="text-gray-500 text-sm">{subtitle}</div> : null}
                  </div>
                </List.Item>
              );
            }}
          />
        </Card>
      </div>
    </div>
  );
}







