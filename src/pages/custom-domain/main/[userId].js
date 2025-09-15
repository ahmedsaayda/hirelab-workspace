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
      if (!userId) return;
      setLoading(true);
      try {
        const res = await PublicService.queryJobsOfRecruiter({ page: 1, limit: 100, recruiterId: userId });
        const arr = res?.data?.jobs || res?.data || [];
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
            renderItem={(job) => (
              <List.Item className="cursor-pointer" onClick={() => router.push(`/lp/${job._id}`)}>
                <div>
                  <Typography.Text strong>{job.vacancyTitle || job.name}</Typography.Text>
                  <div className="text-gray-500 text-sm">{job.department}</div>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
}







