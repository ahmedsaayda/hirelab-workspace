import React, { useState, useEffect } from 'react';
import { Modal, Rate, Typography, List, Tag, Divider, Spin, Empty, Avatar } from 'antd';
import { StarOutlined, UserOutlined } from '@ant-design/icons';
import CrudService from '../../../../services/CrudService';
import moment from 'moment';

const { Text, Title } = Typography;

const ReviewBreakdownModal = ({ visible, onCancel, candidate }) => {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (visible && candidate) {
      loadReviews();
    }
  }, [visible, candidate]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await CrudService.search('StageReview', 100, 1, {
        filters: { candidateId: candidate.id },
        populate: 'reviewedBy',
        sort: { createdAt: -1 }
      });
      setReviews(response.data?.items || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group reviews by stage
  const reviewsByStage = reviews.reduce((acc, review) => {
    const stage = review.stageName || 'Unknown Stage';
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push(review);
    return acc;
  }, {});

  // Calculate overall average
  const overallAverage = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  // Calculate stage averages
  const stageAverages = Object.entries(reviewsByStage).map(([stage, stageReviews]) => ({
    stage,
    average: (stageReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / stageReviews.length).toFixed(1),
    count: stageReviews.length
  }));

  if (loading) {
    return (
      <Modal
        title="Review Breakdown"
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={600}
      >
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <StarOutlined className="text-yellow-500" />
          <div>
            <div className="font-semibold">Review Breakdown</div>
            <div className="text-sm text-gray-500 font-normal">
              {candidate?.fullname || candidate?.email}
            </div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <div className="space-y-6">
        {/* Overall Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <Title level={4} className="mb-1">Overall Rating</Title>
              <Text type="secondary">{reviews.length} total reviews across all stages</Text>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Rate disabled value={parseFloat(overallAverage)} allowHalf />
                <Text strong className="text-lg">{overallAverage}</Text>
              </div>
              <Text type="secondary">Average across all stages</Text>
            </div>
          </div>
        </div>

        {/* Stage Breakdown */}
        {stageAverages.length > 0 && (
          <div>
            <Title level={5}>Stage Breakdown</Title>
            <div className="space-y-3">
              {stageAverages.map(({ stage, average, count }) => (
                <div key={stage} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Tag color="blue">{stage}</Tag>
                    <Text>{count} review{count !== 1 ? 's' : ''}</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Rate disabled value={parseFloat(average)} allowHalf size="small" />
                    <Text strong>{average}</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Divider />

        {/* Detailed Reviews */}
        <div>
          <Title level={5}>All Reviews</Title>
          {reviews.length === 0 ? (
            <Empty 
              description="No reviews yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <List
              dataSource={reviews}
              renderItem={(review) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      (() => {
                        // Generate initials from name or email
                        const name = review.reviewedBy?.name || 
                                   (review.reviewedBy?.firstName && review.reviewedBy?.lastName 
                                     ? `${review.reviewedBy.firstName} ${review.reviewedBy.lastName}`
                                     : null) ||
                                   review.reviewedBy?.email;
                        
                        // Check if avatar URL exists and is valid
                        const hasValidAvatar = review.reviewedBy?.avatar && 
                                             review.reviewedBy.avatar.trim() !== '' &&
                                             !review.reviewedBy.avatar.includes('undefined') &&
                                             !review.reviewedBy.avatar.includes('null');
                        
                        if (hasValidAvatar) {
                          return (
                            <Avatar 
                              src={review.reviewedBy.avatar} 
                              size="small"
                            />
                          );
                        }
                        
                        // Generate initials if no valid avatar
                        if (!name) {
                          return <Avatar size="small" icon={<UserOutlined />} />;
                        }
                        
                        // For email, use the part before @
                        const displayName = name.includes('@') ? name.split('@')[0] : name;
                        
                        // Get initials (first 2 letters of first and last word)
                        const words = displayName.split(/[\s._-]+/).filter(Boolean);
                        let initials;
                        if (words.length >= 2) {
                          initials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
                        } else if (words.length === 1) {
                          initials = words[0].slice(0, 2).toUpperCase();
                        } else {
                          return <Avatar size="small" icon={<UserOutlined />} />;
                        }
                        
                        return (
                          <Avatar size="small" style={{ backgroundColor: '#5207cd' }}>
                            {initials}
                          </Avatar>
                        );
                      })()
                    }
                    title={
                      <div className="flex items-center gap-2">
                        <Text strong>
                          {review.reviewedBy?.name || 
                            (review.reviewedBy?.firstName && review.reviewedBy?.lastName 
                              ? `${review.reviewedBy.firstName} ${review.reviewedBy.lastName}`.trim()
                              : review.reviewedBy?.email?.split('@')[0] || 'Unknown Reviewer')
                          }
                        </Text>
                        <Tag color="blue" size="small">{review.stageName}</Tag>
                        <Rate disabled value={review.rating || 0} size="small" />
                        <Text type="secondary" className="text-xs">
                          {moment(review.createdAt).fromNow()}
                        </Text>
                      </div>
                    }
                    description={
                      review.comment && (
                        <Text type="secondary" className="text-sm">
                          {review.comment}
                        </Text>
                      )
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReviewBreakdownModal;
