import React, { useEffect, useState } from 'react';
import { Badge, Button, Input, Table, Tag, Space, Card, Alert, message, Modal, Form, Select, Tabs } from 'antd';
import { 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  RocketLaunchIcon,
  CogIcon,
  ChartBarIcon,
  LockClosedIcon,
  ArrowTopRightOnSquareIcon,
  LinkIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/auth/selectors';
import DomainsService from '../../services/DomainsService';

const CustomDomains = () => {
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState('');
  const [dnsInstr, setDnsInstr] = useState(null);
  const [dnsList, setDnsList] = useState([]);
  const [activeTab, setActiveTab] = useState('domains');
  const [settings, setSettings] = useState(null);
  const [prettyList, setPrettyList] = useState([]);
  const [lpOptions, setLpOptions] = useState([]);
  const [loadingLandingPages, setLoadingLandingPages] = useState(false);
  
  // Get user from Redux store (same as vacancies dashboard)
  const user = useSelector(selectUser);

  const hasActiveDomain = domains?.some?.((d) => d?.status === 'active');

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
      // Check if user is in workspace session
      const isWorkspaceSession = user?.isWorkspaceSession && user?.workspaceId;
      const res = await DomainsService.list(isWorkspaceSession ? { workspace: user.workspaceId } : {});
      setDomains(res.data || []);
    } catch (_) {}
    try {
      const s = await DomainsService.getSettings();
      const set = s?.data || {};
      setSettings(set);
      setPrettyList(Array.isArray(set.prettyUrls) ? set.prettyUrls : []);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { 
    load();
    // Load landing pages immediately on component mount
    loadLandingPages();
  }, []);

  // Hide DNS instructions once any domain is active
  useEffect(() => {
    if (hasActiveDomain) {
      setDnsList([]);
      setDnsInstr(null);
    }
  }, [hasActiveDomain]);

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

  const loadLandingPages = async (force = false) => {
    if (lpOptions.length > 0 && !force) return; // Already loaded
    
    setLoadingLandingPages(true);
    try {
      // Use the EXACT same approach as the vacancies dashboard
      const CrudService = (await import('../../services/CrudService')).default;
      console.log('Loading landing pages for user:', user?._id);
      console.log('Full user object:', user);
      
      if (!user?._id) {
        console.error('No user ID found in Redux store');
        message.error('User not found. Please refresh the page.');
        return;
      }
      
      const result = await CrudService.search("LandingPageData", 999999, 1, {
        text: "",
        filters: {
          user_id: user._id,
          published: true,  // Only show published jobs, same as public careers page
        },
        sort: {},
        ...({}),
      });
      
      console.log('Landing pages response:', result?.data);
      const items = Array.isArray(result?.data?.items) ? result.data.items : [];
      console.log('Landing pages items found:', items.length);
      console.log('First few items:', items.slice(0, 3).map(i => ({ _id: i._id, user_id: i.user_id, vacancyTitle: i.vacancyTitle })));
      
      // Double-check that we're only getting this user's jobs
      const userJobs = items.filter(item => item.user_id === user._id);
      console.log('Jobs actually belonging to current user:', userJobs.length);
      
      if (userJobs.length !== items.length) {
        console.error('FILTERING ERROR: Got jobs from other users!', {
          totalItems: items.length,
          userItems: userJobs.length,
          currentUserId: user._id
        });
        // Use only the user's jobs
        const filteredItems = userJobs;
        setLpOptions(filteredItems.map(i => ({ 
          label: `${i.vacancyTitle || i.name || 'Untitled Job'}`, 
          value: i._id 
        })));
        return;
      }
      
      if (items.length === 0) {
        console.log('No landing pages found for user:', user?._id);
      } else {
        console.log('Successfully loaded', items.length, 'jobs for user:', user?._id);
      }
      
      setLpOptions(items.map(i => ({ 
        label: `${i.vacancyTitle || i.name || 'Untitled Job'}`, 
        value: i._id 
      })));
    } catch (error) {
      console.error('Error loading landing pages:', error);
      message.error('Failed to load landing pages');
    }
    setLoadingLandingPages(false);
  };

  const savePretty = async () => {
    setLoading(true);
    try {
      const payload = { 
        ...(settings||{}), 
        prettyUrls: prettyList.map(x => ({ 
          slug: x.slug, 
          landingPageId: x.landingPageId, 
          active: x.active !== false 
        })) 
      };
      await DomainsService.saveSettings(payload);
      const s = await DomainsService.getSettings();
      const set = s?.data || {};
      setSettings(set);
      setPrettyList(Array.isArray(set.prettyUrls) ? set.prettyUrls : []);
      message.success('Pretty URLs saved');
    } catch (e) {
      message.error('Failed to save');
    }
    setLoading(false);
  };

  const addPrettyUrl = () => {
    setPrettyList([...(prettyList||[]), { slug: '', landingPageId: null, active: true }]);
  };

  const removePrettyUrl = (index) => {
    const next = [...prettyList];
    next.splice(index, 1);
    setPrettyList(next);
  };

  const updatePrettyUrl = (index, field, value) => {
    const next = [...prettyList];
    next[index] = { ...next[index], [field]: value };
    setPrettyList(next);
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

        {/* Tabs Navigation */}
        <Card className="mb-8">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            items={[
              {
                key: 'domains',
                label: (
                  <div className="flex items-center gap-2">
                    <GlobeAltIcon className="w-5 h-5" />
                    <span>Domains</span>
                  </div>
                ),
                children: (
                  <div className="space-y-6">
                    <div className="flex gap-3 items-center flex-wrap">
                      <div className="relative flex-1 max-w-md">
                        <Input
                          value={newDomain}
                          onChange={(e)=>setNewDomain(e.target.value)}
                          placeholder="Enter your domain (e.g., careers.yourcompany.com)"
                          allowClear
                          size="large"
                          className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 shadow-sm"
                          prefix={<GlobeAltIcon className="w-4 h-4 text-gray-400" />}
                        />
                      </div>
                      <Button 
                        type="primary" 
                        size="large" 
                        loading={loading} 
                        onClick={onAdd}
                        className="bg-purple-600 hover:bg-purple-700 border-purple-600 rounded-lg px-6 shadow-sm"
                      >
                        Connect Domain
                      </Button>
                    </div>

                    
                    {!hasActiveDomain && domains?.length > 0 && dnsList?.length > 0 && (
                      <Card 
                        size="small" 
                        className="bg-blue-50 border-blue-200" 
                        title={<span className="text-blue-800 font-medium">DNS Configuration Required</span>}
                      >
                        <p className="text-blue-700 mb-4">Add these DNS records at your domain registrar and click 'Check DNS' below:</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {dnsList.map((r, idx) => (
                            <Card key={idx} size="small" className="bg-white border-blue-100">
                              <div className="space-y-2">
                                <div className="text-sm"><span className="font-medium text-gray-700">Domain:</span> {r.forDomain || '—'}</div>
                                <div className="text-sm"><span className="font-medium text-gray-700">Type:</span> <Tag color="blue">{r.recordType}</Tag></div>
                                <div className="text-sm">
                                  <div className="flex items-center justify-between">
                                    <span><span className="font-medium text-gray-700">Name:</span> <code className="bg-gray-100 px-1 rounded text-xs">{r.name}</code></span>
                                    <Button size="small" type="link" onClick={()=>copy(r.name,'Name copied')}>Copy</Button>
                                  </div>
                                </div>
                                <div className="text-sm">
                                  <div className="flex items-center justify-between">
                                    <span><span className="font-medium text-gray-700">Value:</span> <code className="bg-gray-100 px-1 rounded text-xs break-all">{r.value}</code></span>
                                    <Button size="small" type="link" onClick={()=>copy(r.value,'Value copied')}>Copy</Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </Card>
                    )}
                    
                    <Table 
                      rowKey="_id" 
                      loading={loading} 
                      dataSource={domains} 
                      columns={columns} 
                      pagination={false} 
                      className="rounded-lg overflow-hidden shadow-sm"
                    />
                  </div>
                )
              },
              {
                key: 'pretty-urls',
                label: (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    <span>Pretty URLs</span>
                  </div>
                ),
                disabled: !hasActiveDomain,
                children: (
                  <div className="space-y-6">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-purple-800 mb-2">Create Beautiful URLs</h3>
                      <p className="text-purple-700 text-sm">
                        Transform your job posting URLs from complex IDs to memorable, SEO-friendly paths.
                        Example: <code className="bg-white px-2 py-1 rounded">yourdomain.com/software-engineer</code>
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">URL Mappings</h3>
                      <div className="flex gap-2">
                        <Button 
                          type="primary" 
                          icon={<PlusIcon className="w-4 h-4" />} 
                          onClick={addPrettyUrl}
                          className="bg-purple-600 hover:bg-purple-700 border-purple-600 rounded-lg"
                        >
                          Add Mapping
                        </Button>
                        <Button 
                          type="primary" 
                          loading={loading} 
                          onClick={savePretty}
                          className="bg-green-600 hover:bg-green-700 border-green-600 rounded-lg"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                    
                    {prettyList?.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No Pretty URLs Yet</h3>
                        <p className="text-gray-500 mb-4">Create your first pretty URL mapping to get started</p>
                        <Button 
                          type="primary" 
                          icon={<PlusIcon className="w-4 h-4" />} 
                          onClick={addPrettyUrl}
                          className="bg-purple-600 hover:bg-purple-700 border-purple-600 rounded-lg"
                        >
                          Add First Mapping
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {prettyList.map((item, idx) => (
                          <Card key={idx} className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex gap-4 items-center">
                              <div className="flex-1 flex items-center gap-2">
                                <span className="text-gray-600 font-medium whitespace-nowrap">
                                  {domains?.[0]?.domain || 'yourdomain.com'}/
                                </span>
                                <Input 
                                  value={item.slug} 
                                  onChange={(e) => {
                                    const v = e.target.value.replace(/^\//,'').toLowerCase();
                                    updatePrettyUrl(idx, 'slug', v);
                                  }} 
                                  placeholder="enter-slug-here" 
                                  className="max-w-xs rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                />
                              </div>
                              <div className="flex-1">
                                <Select
                                  className="w-full"
                                  placeholder="Select landing page"
                                  value={item.landingPageId}
                                  onChange={(val) => updatePrettyUrl(idx, 'landingPageId', val)}
                                  options={lpOptions}
                                  showSearch
                                  optionFilterProp="label"
                                  loading={loadingLandingPages}
                                  onFocus={loadLandingPages}
                                  notFoundContent={loadingLandingPages ? 'Loading...' : 'No landing pages found'}
                                />
                              </div>
                              <Button 
                                danger 
                                icon={<TrashIcon className="w-4 h-4" />}
                                onClick={() => removePrettyUrl(idx)}
                                className="rounded-lg"
                              >
                                Remove
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
            ]}
          />
        </Card>


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