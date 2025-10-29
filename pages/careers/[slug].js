import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Card, Button, Typography, Spin, Empty, Avatar } from 'antd';
import { ArrowLeftOutlined, EnvironmentOutlined, ClockOutlined, DollarOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const CategoryPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchCategoryPage();
    }
  }, [slug]);

  const fetchCategoryPage = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/public/careers/${slug}`);
      setCategory(response.data);
    } catch (err) {
      console.error('Error fetching category page:', err);
      if (err.response?.status === 404) {
        setError('Category not found');
      } else {
        setError('Failed to load category page');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFunnelClick = (funnelSlug) => {
    // Navigate to the funnel page
    // This could be a partner domain or the main app
    if (category?.partner?.domain) {
      window.open(`https://${category.partner.domain}/lp/${funnelSlug}`, '_blank');
    } else {
      router.push(`/lp/${funnelSlug}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center">
          <Empty
            description={error}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            className="mt-4"
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  const primaryColor = category.primaryColor || '#1890ff';
  const secondaryColor = category.secondaryColor || '#666';

  return (
    <>
      <Head>
        <title>{category.name} | {category.companyName}</title>
        <meta name="description" content={category.description || category.heroDescription} />
        <meta property="og:title" content={`${category.name} | ${category.companyName}`} />
        <meta property="og:description" content={category.description || category.heroDescription} />
        {category.heroImage && <meta property="og:image" content={category.heroImage} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {category.companyLogo && (
                  <img
                    src={category.companyLogo}
                    alt={category.companyName}
                    className="h-10 w-auto"
                  />
                )}
                <div>
                  <Title level={3} style={{ color: primaryColor, margin: 0 }}>
                    {category.companyName}
                  </Title>
                  <Text type="secondary">Career Opportunities</Text>
                </div>
              </div>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
              >
                Back
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div
          className="relative py-16 px-4"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}10 100%)`
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <Title level={1} className="mb-4">
              {category.vacancyTitle || category.name}
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              {category.heroDescription || category.description}
            </Paragraph>
            {category.heroImage && (
              <div className="mt-8">
                <img
                  src={category.heroImage}
                  alt={category.name}
                  className="max-w-md mx-auto rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Funnels Section */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <Title level={2} style={{ color: primaryColor }}>
              Open Positions
            </Title>
            <Text type="secondary" className="text-lg">
              Join our team and help shape the future
            </Text>
          </div>

          {category.associatedFunnels && category.associatedFunnels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.associatedFunnels.map((funnel) => (
                <Card
                  key={funnel._id}
                  hoverable
                  className="shadow-md hover:shadow-lg transition-shadow duration-300"
                  onClick={() => handleFunnelClick(funnel.slug)}
                >
                  {funnel.heroImage && (
                    <div className="mb-4">
                      <img
                        src={funnel.heroImage}
                        alt={funnel.vacancyTitle}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <Title level={4} className="mb-2">
                      {funnel.vacancyTitle}
                    </Title>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {funnel.location && (
                        <div className="flex items-center gap-1">
                          <EnvironmentOutlined />
                          <span>{funnel.location}</span>
                        </div>
                      )}

                      {funnel.employmentType && (
                        <div className="flex items-center gap-1">
                          <ClockOutlined />
                          <span>{funnel.employmentType}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      type="primary"
                      block
                      style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                      className="mt-4"
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Empty
                description={
                  <div>
                    <Text className="block mb-2">No open positions in this category yet</Text>
                    <Text type="secondary">Check back soon for new opportunities</Text>
                  </div>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <Text type="secondary">
                © 2024 {category.companyName}. Powered by HireLab
              </Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;





