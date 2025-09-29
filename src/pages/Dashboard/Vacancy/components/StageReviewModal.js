import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Rate, 
  Input, 
  Button, 
  Avatar, 
  List, 
  Typography, 
  Divider, 
  Space,
  message,
  Tag,
  Tooltip
} from 'antd';
import { 
  UserOutlined, 
  StarOutlined, 
  MessageOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/auth/selectors';
import CrudService from '../../../../services/CrudService';

// Global button styles are now handled in NewATS.js

const { TextArea } = Input;
const { Text, Title } = Typography;

const StageReviewModal = ({ 
  visible, 
  onCancel, 
  candidate, 
  currentStage,
  onReviewUpdate 
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const user = useSelector(selectUser);

  // Calculate average rating for current stage
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  useEffect(() => {
    if (visible && candidate && currentStage) {
      loadStageReviews();
    }
  }, [visible, candidate, currentStage]);

  const loadStageReviews = async () => {
    setLoading(true);
    try {
      // Load reviews for this candidate and stage
      const response = await CrudService.search('StageReview', 100, 1, {
        filters: {
          candidateId: candidate.id,
          stageName: currentStage
        },
        populate: 'reviewedBy',
        sort: { createdAt: -1 }
      });
      
      setReviews(response.data?.items || []);
    } catch (error) {
      console.error('Error loading stage reviews:', error);
      message.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!newRating) {
      message.error('Please provide a rating');
      return;
    }

    if (!newComment.trim()) {
      message.error('Please provide a comment');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        candidateId: candidate.id,
        stageName: currentStage,
        rating: newRating,
        comment: newComment.trim(),
        reviewedBy: user._id,
        reviewedAt: new Date().toISOString()
      };

      if (editingReview) {
        // Update existing review
        await CrudService.update('StageReview', editingReview._id, reviewData);
        message.success('Review updated successfully');
      } else {
        // Create new review
        await CrudService.create('StageReview', reviewData);
        message.success('Review submitted successfully');
      }

      // Reset form
      setNewRating(0);
      setNewComment('');
      setEditingReview(null);
      
      // Reload reviews
      await loadStageReviews();
      
      // Notify parent component
      if (onReviewUpdate) {
        onReviewUpdate(candidate.id, currentStage);
      }
      
    } catch (error) {
      console.error('Error submitting review:', error);
      message.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewRating(review.rating);
    setNewComment(review.comment);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await CrudService.delete('StageReview', reviewId);
      message.success('Review deleted successfully');
      await loadStageReviews();
      
      if (onReviewUpdate) {
        onReviewUpdate(candidate.id, currentStage);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      message.error('Failed to delete review');
    }
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setNewRating(0);
    setNewComment('');
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const userHasReviewed = reviews?.some(review => 
    review.reviewedBy._id === user._id || review.reviewedBy === user._id
  );

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <MessageOutlined className="text-blue-500" />
          <div>
            <div className="font-semibold">Stage Review: {currentStage}</div>
            <div className="text-sm text-gray-500 font-normal">
              {candidate?.fullname || candidate?.email}
            </div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      className="stage-review-modal"
    >
      <div className="space-y-6">
        {/* Stage Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar 
                src={candidate?.avatar} 
                icon={<UserOutlined />}
                size={40}
              />
              <div>
                <div className="font-medium">{candidate?.fullname || 'Unnamed Candidate'}</div>
                <div className="text-sm text-gray-500">{candidate?.email}</div>
              </div>
            </div>
            <div className="text-right">
              <Tag color="blue" className="mb-1">{currentStage}</Tag>
              {reviews.length > 0 && (
                <div className="flex items-center gap-1">
                  <StarOutlined className="text-yellow-500" />
                  <span className="font-medium">{getAverageRating()}</span>
                  <span className="text-gray-500 text-sm">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Review Form */}
        {(!userHasReviewed || editingReview) && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <StarOutlined className="text-blue-500" />
              <span className="font-medium">
                {editingReview ? 'Edit Your Review' : 'Add Your Review'}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <Rate 
                  value={newRating}
                  onChange={setNewRating}
                  className="text-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment *
                </label>
                <TextArea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this candidate for this stage..."
                  rows={4}
                  maxLength={500}
                  showCount
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  type="primary"
                  onClick={handleSubmitReview}
                  loading={submitting}
                  disabled={!newRating || !newComment.trim()}
                >
                  {editingReview ? 'Update Review' : 'Submit Review'}
                </Button>
                {editingReview && (
                  <Button 
                    onClick={cancelEdit}
                    className="border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Existing Reviews */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageOutlined className="text-gray-500" />
              <span className="font-medium">Reviews for "{currentStage}" ({reviews.length})</span>
            </div>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <StarOutlined className="text-yellow-500" />
                <span className="font-medium">{averageRating}</span>
                <span className="text-gray-500 text-sm">avg</span>
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews yet. Be the first to review this candidate!
            </div>
          ) : (
            <List
              dataSource={reviews}
              renderItem={(review) => (
                <List.Item className="border-b border-gray-100 last:border-b-0 py-4">
                  <div className="w-full">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          src={review.reviewedBy?.avatar} 
                          icon={<UserOutlined />}
                          size={32}
                        />
                        <div>
                          <div className="font-medium text-sm">
                            {review.reviewedBy?.firstName} {review.reviewedBy?.lastName}
                          </div>
                          <div className="flex items-center gap-2">
                            <Rate 
                              value={review.rating} 
                              disabled 
                              size="small"
                            />
                            <span className="text-xs text-gray-500">
                              <ClockCircleOutlined className="mr-1" />
                              {moment(review.createdAt).fromNow()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {(review.reviewedBy._id === user._id || review.reviewedBy === user._id) && (
                        <div className="flex gap-1">
                          <Tooltip title="Edit review">
                            <Button 
                              type="text" 
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => handleEditReview(review)}
                              className="text-gray-400 hover:text-blue-500"
                            />
                          </Tooltip>
                          <Tooltip title="Delete review">
                            <Button 
                              type="text" 
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-gray-400 hover:text-red-500"
                              danger
                            />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-11">
                      <Text className="text-gray-700">{review.comment}</Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default StageReviewModal;
