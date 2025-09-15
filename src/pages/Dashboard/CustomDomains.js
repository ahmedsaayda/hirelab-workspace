import React, { useEffect, useState } from 'react';
import { Badge, Button, Input, Table, Tag, Space, Card, Alert, message } from 'antd';
import { 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  RocketLaunchIcon,
  CogIcon,
  ChartBarIcon,
  LockClosedIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import DomainsService from '../../services/DomainsService';

const CustomDomains = () => {
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState('');
  const [dnsInstr, setDnsInstr] = useState(null);
  const [dnsList, setDnsList] = useState([]);

  const copy = async (text, label = 'Copied') => {
    try {
      await navigator.clipboard.writeText(text || '');
      message.success(label);
    } catch (_) {
      message.warning('Copy failed');
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await DomainsService.list();
      setDomains(res.data || []);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onAdd = async () => {
    if (!newDomain?.trim()) return;
    setLoading(true);
    try {
      const domain = newDomain.trim();
      const res = await DomainsService.add(domain);
      if (res?.data?.dns_instructions) setDnsInstr(res.data.dns_instructions);
      // Immediately fetch full DNS set so user sees all records without extra click
      try {
        const cfg = await DomainsService.dnsConfig(domain);
        const list = cfg?.data?.records || [];
        setDnsList(list);
        if (list?.length) setDnsInstr({ type: list[0].recordType, name: list[0].name, value: list[0].value });
      } catch (_) {}
      setNewDomain('');
      await load();
    } catch (_) {}
    setLoading(false);
  };

  const onDisconnect = async (row) => {
    setLoading(true);
    try { await DomainsService.remove(row._id); } catch (_) {}
    await load();
    setLoading(false);
  };

  const onRefreshDNS = async (row) => {
    setLoading(true);
    try {
      // 1) Ask backend to re-check verification and update DB status
      try { await DomainsService.check(row.domain); } catch (_) {}
      // 2) Fetch the latest DNS instructions to display
      const res = await DomainsService.dnsConfig(row.domain);
      const list = res?.data?.records || [];
      setDnsList(list);
      if (list?.length) setDnsInstr({ type: list[0].recordType, name: list[0].name, value: list[0].value });
      // 3) Reload list to reflect potential status change
      await load();
    } catch (_) {}
    setLoading(false);
  };

  const columns = [
    { 
      title: 'Domain', 
      dataIndex: 'domain', 
      key: 'domain', 
      render: (text, r) => (
        <Space size={6}>
          <span>{text}</span>
          {r.status === 'active' && (
            <a href={`https://${r.domain}`} target="_blank" rel="noreferrer" title="Open">
              <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-500 hover:text-gray-800" />
            </a>
          )}
        </Space>
      )
    },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v) => <Tag color={v==='active'?'green':'gold'}>{v}</Tag> },
    { title: 'Actions', key: 'dns', render: (_, r) => (
      <Space>
        <Button size="small" onClick={() => onRefreshDNS(r)}>Check DNS</Button>
        <Button danger size="small" onClick={() => onDisconnect(r)}>Disconnect</Button>
      </Space>
    ) },
  ];

  const features = [
    {
      icon: <GlobeAltIcon className="w-6 h-6" />,
      title: "Custom Domain Setup",
      description: "Connect your own domain (e.g., careers.yourcompany.com) to create a professional branded experience for all your job postings."
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: "SSL Security & Performance",
      description: "Automatic SSL certificates and global CDN integration for fast, secure job page loading worldwide."
    },
    {
      icon: <CogIcon className="w-6 h-6" />,
      title: "DNS Management",
      description: "Simple DNS configuration with automated health checks and failover protection for maximum uptime."
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: "Domain Analytics",
      description: "Track domain performance, visitor analytics, and SEO metrics to optimize your recruitment reach."
    },
    {
      icon: <LockClosedIcon className="w-6 h-6" />,
      title: "Advanced Security",
      description: "HTTPS enforcement, DDoS protection, and security headers to protect your brand and candidates' data."
    },
    {
      icon: <RocketLaunchIcon className="w-6 h-6" />,
      title: "SEO Optimization",
      description: "Custom meta tags, structured data, and search engine optimization to improve job posting visibility."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <GlobeAltIcon className="w-4 h-4" />
            Domain Manager
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Custom Domains
          </h1>
          
          <p className="text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Transform your recruitment presence with professional custom domains. 
            Create a seamless branded experience that builds trust and improves your company's 
            professional image in the job market.
          </p>
        </div>

        {/* Connect form */}
        <Card className="mb-8">
          <div className="flex gap-3 items-center flex-wrap">
            <Input
              value={newDomain}
              onChange={(e)=>setNewDomain(e.target.value)}
              placeholder="yourdomain.com"
              allowClear
              size="large"
              style={{maxWidth:420, borderRadius:8}}
            />
            <Button type="primary" size="large" loading={loading} onClick={onAdd}>Connect Domain</Button>
          </div>
          {dnsInstr && (
            <Alert className="mt-4" type="info" showIcon
              message="Add this DNS record at your registrar"
              description={<div>
                <div className="mb-1"><b>Type:</b> {dnsInstr.type}</div>
                <div className="mb-1 flex items-center gap-2">
                  <span><b>Name:</b> {dnsInstr.name}</span>
                  <Button size="small" onClick={()=>copy(dnsInstr.name,'Name copied')}>Copy</Button>
                </div>
                <div className="mb-1 flex items-center gap-2">
                  <span><b>Value:</b> {dnsInstr.value}</span>
                  <Button size="small" onClick={()=>copy(dnsInstr.value,'Value copied')}>Copy</Button>
                </div>
                <div className="text-xs mt-2">Also ensure www subdomain redirects to the main domain.</div>
              </div>}
            />
          )}
          {dnsList?.length > 1 && (
            <Card size="small" className="mt-4" title="All required DNS records">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dnsList.map((r, idx) => (
                  <Card key={idx} size="small">
                    <div className="text-sm"><b>For</b>: {r.forDomain || '—'}</div>
                    <div className="text-sm"><b>Type</b>: {r.recordType}</div>
                    <div className="text-sm flex items-center gap-2"><span><b>Name</b>: {r.name}</span><Button size="small" onClick={()=>copy(r.name,'Name copied')}>Copy</Button></div>
                    <div className="text-sm flex items-center gap-2"><span><b>Value</b>: {r.value}</span><Button size="small" onClick={()=>copy(r.value,'Value copied')}>Copy</Button></div>
                  </Card>
                ))}
              </div>
            </Card>
          )}
        </Card>

        <Table rowKey="_id" loading={loading} dataSource={domains} columns={columns} pagination={false} className="mb-12" />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CustomDomains; 