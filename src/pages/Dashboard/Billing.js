import React, { useState, useEffect } from "react";
import { 
  Card, 
  Button, 
  Tag,
  Radio,
  message,
  Spin,
  Modal
} from "antd";
import { 
  CrownOutlined, 
  CheckCircleOutlined,
  RocketOutlined,
  StarOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import AuthService from "../../services/AuthService";
import { useSelector } from "react-redux";
import { selectUser, selectLoading } from "../../redux/auth/selectors";
import { useRouter } from "next/router";

const Billing = () => {
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState(0); // 0: monthly, 1: annual
  const [initialFrequency, setInitialFrequency] = useState(0); // Track initial state
  const [userChangedFrequency, setUserChangedFrequency] = useState(false);
  const user = useSelector(selectUser);
  const globalLoading = useSelector(selectLoading);
  const router = useRouter();

  // Detect current billing cycle and set as default
  useEffect(() => {
    if (user?.subscription?.paid) {
      // For existing paid subscribers, try to detect their current billing cycle
      // This would ideally come from the subscription details
      const currentBilling = user.subscription?.billing_cycle || 'month';
      const currentFreq = currentBilling === 'year' ? 1 : 0;
      setFrequency(currentFreq);
      setInitialFrequency(currentFreq);
      console.log('Detected current billing cycle:', currentBilling);
    }
  }, [user?.subscription]);

  const handleFrequencyChange = (e) => {
    const newFreq = e.target.value;
    setFrequency(newFreq);
    
    // Track if user explicitly changed from their current billing cycle
    if (user?.subscription?.paid && newFreq !== initialFrequency) {
      setUserChangedFrequency(true);
    } else {
      setUserChangedFrequency(false);
    }
  };

     // Mock plans data - this should ideally come from API
   const plans = [
     {
       id: 'free',
       name: 'Start',
       monthlyPrice: 0,
       annualPrice: 0,
       description: 'The applicant journey you\'ve always wanted. Created in minutes.',
       features: [
         '1 recruitment funnel',
         'Auto page and form builder',
         'Full AI Capabilities',
         'Free ATS up to 50 Applicants',
         '3 Premium page templates',
         'Engagement Analytics',
         'Mobile responsiveness'
       ],
       cta: 'Current Plan',
       featured: false,
       maxFunnels: 1,
       maxCandidates: 50,
       tier: 1
     },
     {
       id: 'create',
       name: 'Create',
       monthlyPrice: 99,
       annualPrice: 49,
       description: 'For forward thinking teams serious about recruitment marketing.',
       features: [
         'All Free features plus:',
         'Create up to 5 funnels',
         'Free ATS - Unlimited Applicants',
         'Complete Page Templates Library',
         'Job bundle Widget',
         'Custom Domains',
         'Remove HireLab branding',
         'Advanced Analytics',
         'A/B Testing',
         'Tag Automation',
         'Priority Support'
       ],
       cta: 'START DIRECTLY',
       featured: true,
       maxFunnels: 5,
       maxCandidates: null,
       tier: 2
     },
     {
       id: 'scale',
       name: 'Scale',
       monthlyPrice: 199,
       annualPrice: 99,
       description: 'For growing teams that need advanced recruitment capabilities.',
       features: [
         'All Create features plus:',
         'Create up to 15 funnels',
         'External ATS Integrations',
         'Advanced Team Management',
         'White-label Options',
         'API Access',
         'Custom Reporting',
         'Live Chat Support'
       ],
       cta: 'SCALE UP',
       featured: false,
       maxFunnels: 15,
       maxCandidates: null,
       tier: 3
     }
   ];

  const currentTier = user?.tier || { id: 'free', name: 'Start', maxFunnels: 1 };
  const currentPlan = plans.find(p => p.id === currentTier.id) || plans[0];
  
  // Helper function to get plan relationship
  const getPlanRelationship = (planId) => {
    const currentPlanObj = plans.find(p => p.id === currentTier.id);
    const targetPlan = plans.find(p => p.id === planId);
    
    if (!currentPlanObj || !targetPlan) return 'unknown';
    
    if (currentPlanObj.tier === targetPlan.tier) return 'current';
    if (currentPlanObj.tier < targetPlan.tier) return 'upgrade';
    if (currentPlanObj.tier > targetPlan.tier) return 'downgrade';
    
    return 'unknown';
  };

  const handlePlanChange = (planId) => {
    const relationship = getPlanRelationship(planId);
    const targetPlan = plans.find(p => p.id === planId);
    
    if (!targetPlan) return;

    // For non-paid users, proceed directly
    if (!user?.subscription?.paid) {
      handleUpgrade(planId);
      return;
    }

    // Show confirmation modal for existing subscribers
    const isUpgrade = relationship === 'upgrade';
    const isDowngrade = relationship === 'downgrade';
    
    const modalTitle = isUpgrade ? 'Confirm Upgrade' : isDowngrade ? 'Confirm Downgrade' : 'Confirm Plan Change';
    
    let modalContent = '';
    const hasScheduledDowngrade = user?.subscription?.cancel_at_period_end;
    
    if (isUpgrade) {
      let billingMessage = userChangedFrequency ? 
        `Your billing cycle will change to ${frequency === 0 ? 'monthly' : 'annual'} and you'll be charged the pro-rated difference immediately.` :
        'Your current billing cycle will be preserved and you\'ll be charged the pro-rated difference immediately.';
      
      if (hasScheduledDowngrade) {
        modalContent = `${billingMessage}\n\nThis will also cancel your scheduled downgrade.`;
      } else {
        modalContent = billingMessage;
      }
    } else if (isDowngrade) {
      modalContent = 'The downgrade will take effect at the end of your current billing period. You won\'t be charged until then.';
    }

    Modal.confirm({
      title: modalTitle,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>You're about to {isUpgrade ? 'upgrade' : isDowngrade ? 'downgrade' : 'change'} to the <strong>{targetPlan.name}</strong> plan.</p>
          {modalContent && (
            <div className="mt-2 text-blue-600">
              {modalContent.split('\n\n').map((text, index) => (
                <p key={index} className={index > 0 ? 'mt-2 font-semibold' : ''}>{text}</p>
              ))}
            </div>
          )}
        </div>
      ),
      okText: isUpgrade ? 'Upgrade Now' : isDowngrade ? 'Confirm Downgrade' : 'Continue',
      cancelText: 'Cancel',
      onOk() {
        handleUpgrade(planId);
      },
    });
  };

  const handleCancelDowngrade = async () => {
    Modal.confirm({
      title: 'Cancel Downgrade',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Are you sure you want to cancel your scheduled downgrade?</p>
          <p className="mt-2 text-blue-600">Your current plan will continue without any changes.</p>
        </div>
      ),
      okText: 'Cancel Downgrade',
      cancelText: 'Keep Downgrade',
      onOk() {
        cancelDowngradeRequest();
      },
    });
  };

  const cancelDowngradeRequest = async () => {
    try {
      setLoading(true);
      
      // Call the reactivate subscription endpoint to cancel the downgrade
      const response = await AuthService.reactivateSubscription();
      
      if (response.data) {
        message.success("Downgrade cancelled successfully! Your current plan will continue.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error cancelling downgrade:", error);
      message.error(error.response?.data?.message || "Failed to cancel downgrade");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId) => {
    try {
      setLoading(true);
      
      const subscriptionData = {
        tier: planId,
        return_url: window.location.href,
        interval: frequency === 0 ? "month" : "year",
        trial: false, // No trial period
        explicitBillingChange: userChangedFrequency, // Flag for billing cycle change
      };

      const response = await AuthService.createSubscription(subscriptionData);

      if (response.data.paymentLink) {
        window.location.href = response.data.paymentLink;
      } else {
        message.success("Plan updated successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      message.error(error.response?.data?.message || "Failed to update plan");
    } finally {
      setLoading(false);
    }
  };

  const getUsageData = () => {
    const funnelsUsed = user?.landingPages?.length || user?.landingPageNum || 0;
    const maxFunnels = currentPlan?.maxFunnels || currentTier?.maxFunnels || 1;
    
    // Get candidates count - this would typically come from user data or API
    const candidatesUsed = user?.totalCandidates || 0;
    const maxCandidates = currentPlan?.maxCandidates || currentTier?.maxCandidates || 50;
    
    return {
      funnels: {
        current: funnelsUsed,
        limit: maxFunnels,
        unlimited: maxFunnels === null
      },
      candidates: {
        current: candidatesUsed,
        limit: maxCandidates,
        unlimited: maxCandidates === null
      }
    };
  };

  const usage = getUsageData();

  if (globalLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Current Plan Overview */}
      <Card className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <CrownOutlined className="mr-2 text-yellow-500" />
              Current Plan: {currentTier?.name || 'Start'}
            </h2>
            <p className="text-gray-600 mb-4">{currentPlan.description}</p>
            
            {/* Plan Status */}
            <div className="flex gap-4 mb-4">
              <Tag color="green" icon={<CheckCircleOutlined />}>
                Active
              </Tag>
              {user?.subscription?.cancel_at_period_end && (
                <Tag color="orange" icon={<ExclamationCircleOutlined />}>
                  Downgrade Scheduled
                </Tag>
              )}
            </div>

            {/* Downgrade Information */}
            {user?.subscription?.paid && user?.subscription?.cancel_at_period_end && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Upcoming Plan Change</h4>
                <div className="text-orange-700 text-sm">
                  {user.subscription.current_period_end && (
                    <div>
                      <div className="mb-1">
                        <strong>Downgrade Date:</strong> {new Date(user.subscription.current_period_end * 1000).toLocaleDateString()}
                      </div>
                      <div className="mb-1">
                        <strong>Days Remaining:</strong> {Math.ceil((user.subscription.current_period_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24))} days
                      </div>
                                             <div className="text-orange-600 text-xs mt-2">
                         💡 You can upgrade to any plan to cancel this downgrade and continue with full access.
                       </div>
                       <div className="mt-3">
                         <Button 
                           type="primary" 
                           size="small"
                           onClick={() => handleCancelDowngrade()}
                           loading={loading}
                         >
                           Cancel Downgrade
                         </Button>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Usage Information */}
            <div className="mb-4">
              <h4 className="font-semibold mb-3">Current Usage</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Funnels Usage */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="font-medium text-gray-700">Funnels</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        {usage.funnels.current}
                        <span className="text-gray-500 font-normal text-sm">
                          {usage.funnels.unlimited ? ' / ∞' : ` / ${usage.funnels.limit}`}
                        </span>
                      </div>
                      {!usage.funnels.unlimited && (
                        <div className="text-xs text-gray-500">
                          {Math.max(0, usage.funnels.limit - usage.funnels.current)} remaining
                        </div>
                      )}
                    </div>
                  </div>
                  {!usage.funnels.unlimited && (
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            usage.funnels.current >= usage.funnels.limit 
                              ? 'bg-red-500' 
                              : usage.funnels.current >= usage.funnels.limit * 0.8 
                                ? 'bg-yellow-500' 
                                : 'bg-blue-500'
                          }`}
                          style={{ 
                            width: `${Math.min((usage.funnels.current / usage.funnels.limit) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      {usage.funnels.current >= usage.funnels.limit && (
                        <div className="text-xs text-red-600 mt-1 font-medium">
                          ⚠️ Over limit by {usage.funnels.current - usage.funnels.limit}
                        </div>
                      )}
                    </div>
                  )}
                  {usage.funnels.unlimited && (
                    <div className="text-sm text-green-600 font-medium">
                      ✨ Unlimited funnels
                    </div>
                  )}
                </div>

                {/* Candidates Usage */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-medium text-gray-700">Candidates</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        {usage.candidates.current}
                        <span className="text-gray-500 font-normal text-sm">
                          {usage.candidates.unlimited ? ' / ∞' : ` / ${usage.candidates.limit}`}
                        </span>
                      </div>
                      {!usage.candidates.unlimited && (
                        <div className="text-xs text-gray-500">
                          {Math.max(0, usage.candidates.limit - usage.candidates.current)} remaining
                        </div>
                      )}
                    </div>
                  </div>
                  {!usage.candidates.unlimited && (
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            usage.candidates.current >= usage.candidates.limit 
                              ? 'bg-red-500' 
                              : usage.candidates.current >= usage.candidates.limit * 0.8 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min((usage.candidates.current / usage.candidates.limit) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      {usage.candidates.current >= usage.candidates.limit && (
                        <div className="text-xs text-red-600 mt-1 font-medium">
                          ⚠️ Over limit by {usage.candidates.current - usage.candidates.limit}
                        </div>
                      )}
                    </div>
                  )}
                  {usage.candidates.unlimited && (
                    <div className="text-sm text-green-600 font-medium">
                      ✨ Unlimited candidates
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="mb-4">
              <div className="text-2xl font-bold text-blue-600">
                €{currentPlan.monthlyPrice}
              </div>
              <div className="text-sm text-gray-500">
                per month
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {(() => {
            const isOverLimit = (usage.funnels.current > (usage.funnels.limit || 0) && !usage.funnels.unlimited) ||
                               (usage.candidates.current > (usage.candidates.limit || 0) && !usage.candidates.unlimited);
            const isOnHighestPlan = currentTier?.id === 'scale';
            
            if (isOverLimit && isOnHighestPlan) {
              return (
                <Button 
                  type="default"
                  icon={<ExclamationCircleOutlined />}
                  onClick={() => {
                    Modal.info({
                      title: 'Usage Over Limit',
                      content: (
                        <div>
                          <p>You're currently over your plan limits. Please consider:</p>
                          <ul className="mt-2 list-disc list-inside">
                            <li>Removing unused funnels or candidates</li>
                            <li>Contacting support for enterprise options</li>
                          </ul>
                        </div>
                      ),
                    });
                  }}
                >
                  Manage Usage
                </Button>
              );
            } else if (isOnHighestPlan) {
              return (
                <Button 
                  type="default"
                  onClick={() => {
                    document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View All Plans
                </Button>
              );
            } else {
              return (
                <Button 
                  type="primary"
                  icon={<RocketOutlined />}
                  onClick={() => {
                    document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Upgrade Plan
                </Button>
              );
            }
          })()}
        </div>
      </Card>

      {/* Available Plans */}
      <Card title="Available Plans" className="mb-6" id="plans-section">
        <div className="mb-4 flex flex-col items-center">
          {/* Show downgrade status for users who have already downgraded */}
          {user?.subscription?.paid && user?.subscription?.cancel_at_period_end && (
            <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg text-sm text-center max-w-lg">
              <div className="font-semibold text-orange-800 mb-2">📅 Downgrade Scheduled</div>
              <div className="text-orange-700 mb-2">
                Your subscription will downgrade at the end of your current billing period.
              </div>
              <div className="text-orange-600 text-xs">
                {user.subscription.current_period_end && (
                  <div>
                    <strong>Current plan:</strong> {currentTier?.name || 'Current'}<br/>
                    <strong>Downgrade date:</strong> {new Date(user.subscription.current_period_end * 1000).toLocaleDateString()}<br/>
                    <strong>New plan:</strong> You can upgrade anytime before this date to cancel the downgrade.
                  </div>
                )}
              </div>
            </div>
          )}

          <Radio.Group value={frequency} onChange={handleFrequencyChange} className="mb-4">
            <Radio.Button value={0}>Monthly</Radio.Button>
            <Radio.Button value={1}>Annual (Save ~50%)</Radio.Button>
          </Radio.Group>
          
          {/* Show billing change indicator */}
          {user?.subscription?.paid && userChangedFrequency && (
            <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-center text-yellow-700">
              🔄 You've changed your billing cycle. Your subscription will be updated to {frequency === 0 ? 'monthly' : 'annual'} billing.
            </div>
          )}
          
          {/* Info about coupon codes */}
          {frequency === 1 && (
            <div className="text-sm text-blue-600 text-center">
              💡 Coupon codes can be applied on the checkout page
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const relationship = getPlanRelationship(plan.id);
            const isCurrentPlan = relationship === 'current';
            const isUpgrade = relationship === 'upgrade';
            const isDowngrade = relationship === 'downgrade';
            
            return (
              <Card
                key={plan.id}
                className={`relative ${plan.featured ? 'border-blue-500 shadow-lg' : ''} ${
                  isCurrentPlan ? 'border-2 border-blue-500' : ''
                }`}
                actions={[
                  isCurrentPlan ? (
                    <div className="text-blue-600 font-semibold">✓ Current Plan</div>
                  ) : (
                    <Button 
                      type={plan.featured && !isDowngrade ? "primary" : "default"}
                      onClick={() => handlePlanChange(plan.id)}
                      loading={loading}
                    >
                      {user?.subscription?.paid ? 
                        (isUpgrade ? "Upgrade Now" : 
                         isDowngrade ? "Downgrade" : 
                         "Select Plan") : 
                        plan.cta
                      }
                    </Button>
                  )
                              ]}
            >
              {isDowngrade && (
                <div className="absolute top-2 right-2">
                  <Tag color="orange" className="text-xs">Downgrade</Tag>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute top-2 right-2">
                  <Tag color="green" className="text-xs">✓ Active</Tag>
                </div>
              )}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Tag color="blue" icon={<StarOutlined />}>Most Popular</Tag>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <div className="text-3xl font-bold">
                    €{frequency === 0 ? plan.monthlyPrice : plan.annualPrice}
                  </div>
                  <div className="text-gray-500">per month</div>
                  {frequency === 1 && plan.monthlyPrice > 0 && (
                    <div className="text-sm text-green-600">
                      Save €{(plan.monthlyPrice - plan.annualPrice) * 12}/year
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="text-left">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center mb-1">
                      <CheckCircleOutlined className="text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Billing;
