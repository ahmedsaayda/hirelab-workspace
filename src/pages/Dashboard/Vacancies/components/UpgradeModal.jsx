import React, { useState } from 'react';
import { Modal, Button, Radio, Tag, Progress, Alert, message } from 'antd';
import { useRouter } from "next/router";
import { 
  CrownOutlined, 
  CheckCircleOutlined, 
  StarOutlined,
  RocketOutlined,
  GiftOutlined 
} from "@ant-design/icons";
import AuthService from "../../../../services/AuthService";

const UpgradeModal = ({
  open,
  onClose,
  currentTier,
  requiredTier,
  feature,
  usage,
  plans = [],
  upgradeReason = "limit"
}) => {
  const router = useRouter();
  const [frequency, setFrequency] = useState(0); // 0: monthly, 1: annual
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (planId) => {
    try {
      setLoading(true);
      const response = await AuthService.createSubscription({
        tier: planId,
        return_url: window.location.href,
        interval: frequency === 0 ? "month" : "year",
        trial: false, // No trial period
      });

      if (response.data.paymentLink) {
        window.location.href = response.data.paymentLink;
      } else {
        message.success("Plan upgraded successfully");
        onClose();
        // Force a page refresh to get updated user data
        window.location.reload();
      }
    } catch (error) {
      console.error("Error upgrading plan:", error);
      message.error(error.response?.data?.message || "Failed to upgrade plan");
    } finally {
      setLoading(false);
    }
  };

  const getUpgradeTitle = () => {
    switch (upgradeReason) {
      case "feature":
        return "Feature Upgrade Required";
      case "limit":
        return "Plan Limit Reached";
      default:
        return "Upgrade Your Plan";
    }
  };

  const getUpgradeDescription = () => {
    if (upgradeReason === "feature") {
      return `Access to ${feature} requires a higher plan. Upgrade now to unlock this feature and more!`;
    } else if (upgradeReason === "limit") {
      return `You've reached the ${feature} limit for your ${currentTier?.name || 'current'} plan. Upgrade to continue and unlock additional features!`;
    }
    return "Upgrade your plan to access more features and higher limits.";
  };

  const getRecommendedPlan = () => {
    if (requiredTier) return requiredTier;
    
    // Auto-suggest based on current tier
    const currentIndex = plans.findIndex(p => p.id === currentTier?.id);
    return plans[currentIndex + 1] || plans[plans.length - 1];
  };

  const recommendedPlan = getRecommendedPlan();
  
  // Check if we should show simplified billing redirect modal
  const shouldShowSimplified = !plans || plans.length === 0 || upgradeReason === "limit";

  return (
    <Modal 
      title={
        <div className="flex items-center">
          <CrownOutlined className="mr-2 text-yellow-500" />
          {getUpgradeTitle()}
        </div>
      }
      open={open} 
      onCancel={onClose} 
      footer={null}
      width={800}
      centered
    >
      <div className="p-4">
        {/* Current Usage Alert */}
        {usage && upgradeReason === "limit" && (
          <Alert
            message="Usage Limit Reached"
            description={
              <div>
                <div className="mb-2">Current usage on {currentTier?.name || 'your'} plan:</div>
                {usage.funnels && (
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span>Funnels</span>
                      <span>{usage.funnels.current} / {usage.funnels.unlimited ? '∞' : usage.funnels.limit}</span>
                    </div>
                    <Progress 
                      percent={usage.funnels.unlimited ? 0 : Math.min((usage.funnels.current / (usage.funnels.limit || 1)) * 100, 100)}
                      status={usage.funnels.current >= (usage.funnels.limit || Infinity) ? "exception" : "normal"}
                    />
                  </div>
                )}
                {usage.candidates && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Candidates</span>
                      <span>{usage.candidates.current} / {usage.candidates.unlimited ? '∞' : usage.candidates.limit}</span>
                    </div>
                    <Progress 
                      percent={usage.candidates.unlimited ? 0 : Math.min((usage.candidates.current / (usage.candidates.limit || 1)) * 100, 100)}
                      status={usage.candidates.current >= (usage.candidates.limit || Infinity) ? "exception" : "normal"}
                    />
                  </div>
                )}
              </div>
            }
            type="warning"
            showIcon
            className="mb-6"
          />
        )}

        {/* Feature Access Alert */}
        {upgradeReason === "feature" && (
          <Alert
            message={`${feature} Feature Required`}
            description={getUpgradeDescription()}
            type="info"
            showIcon
            className="mb-6"
          />
        )}

        {/* Show simplified version for limit exceeded or empty plans */}
        {shouldShowSimplified ? (
          <div className="text-center py-6">
            <div className="mb-6">
              <RocketOutlined className="text-4xl text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to Upgrade?</h3>
              <p className="text-gray-600 mb-4">
                {upgradeReason === "limit" 
                  ? "You've reached your plan limit. Upgrade to continue creating and unlock more features."
                  : "Explore our plans to get access to more features and higher limits."
                }
              </p>
            </div>
            
            <div className="flex gap-3 justify-center items-center">
              <Button 
                size="large"
                onClick={onClose}
              >
                Maybe Later
              </Button>
              <Button 
                type="primary" 
                size="large"
                icon={<RocketOutlined />}
                href='/dashboard/billing'
              
              >
                View Plans & Upgrade
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Pricing Toggle */}
            <div className="text-center mb-6">
              <Radio.Group value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <Radio.Button value={0}>Monthly</Radio.Button>
                <Radio.Button value={1}>
                  Annual 
                  <Tag color="green" className="ml-1">Save ~50%</Tag>
                </Radio.Button>
              </Radio.Group>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {plans.map((plan) => {
                const isCurrentPlan = plan.id === currentTier?.id;
                const isRecommended = plan.id === recommendedPlan?.id;
                
                return (
                  <div
                    key={plan.id}
                    className={`
                      relative border rounded-lg p-4 
                      ${isRecommended ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200'}
                      ${isCurrentPlan ? 'bg-gray-50' : ''}
                    `}
                  >
                    {/* Recommended Badge */}
                    {isRecommended && !isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Tag color="blue" icon={<StarOutlined />}>
                          Recommended
                        </Tag>
                      </div>
                    )}

                    {/* Current Plan Badge */}
                    {isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Tag color="green">Current Plan</Tag>
                      </div>
                    )}

                    <div className="text-center">
                      <h4 className="text-lg font-semibold mb-2">{plan.name}</h4>
                      
                      {/* Pricing */}
                      <div className="mb-3">
                        <div className="text-2xl font-bold">
                          €{frequency === 0 ? plan.monthlyPrice : plan.annualPrice}
                        </div>
                        <div className="text-sm text-gray-500">per month</div>
                        {frequency === 1 && plan.monthlyPrice > 0 && (
                          <div className="text-sm text-green-600">
                            Save €{(plan.monthlyPrice - plan.annualPrice) * 12}/year
                          </div>
                        )}
                      </div>

                      {/* Key Features */}
                      <div className="text-left mb-4">
                        <div className="text-xs text-gray-600 mb-2">Key Features:</div>
                        {plan.features && plan.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center mb-1">
                            <CheckCircleOutlined className="text-green-500 mr-2 text-xs" />
                            <span className="text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <Button 
                        type={isRecommended && !isCurrentPlan ? "primary" : "default"}
                        size="small"
                        className="w-full"
                        onClick={() => handleUpgrade(plan.id)}
                        loading={loading}
                        disabled={isCurrentPlan}
                        icon={!isCurrentPlan ? <RocketOutlined /> : null}
                      >
                        {isCurrentPlan ? "Current Plan" : 
                         isRecommended ? "Upgrade Now" : "Select Plan"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-2 justify-center">
              <Button onClick={onClose}>
                Maybe Later
              </Button>
              
              {recommendedPlan && recommendedPlan.id !== currentTier?.id && (
                <Button 
                  type="primary" 
                  icon={<GiftOutlined />}
                  onClick={() => handleUpgrade(recommendedPlan.id)}
                  loading={loading}
                >
                  Upgrade to {recommendedPlan.name}
                </Button>
              )}
              
              <Button 
                type="link"
                onClick={() => {
                  router.push('/dashboard/billing');
                  onClose();
                }}
              >
                View All Plans
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default UpgradeModal; 
