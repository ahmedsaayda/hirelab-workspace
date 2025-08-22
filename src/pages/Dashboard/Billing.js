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
  ExclamationCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import AuthService from "../../services/AuthService";
import { useSelector } from "react-redux";
import { selectUser, selectLoading } from "../../redux/auth/selectors";
import { useRouter } from "next/router";
import { refreshUserData } from "../../utils/userRefresh";

const Billing = () => {
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState(0); // 0: monthly, 1: annual
  const [initialFrequency, setInitialFrequency] = useState(0); // Track initial state
  const [userChangedFrequency, setUserChangedFrequency] = useState(false);
  const [plans, setPlans] = useState([]);
  const [currentTier, setCurrentTier] = useState(null);
  const [usage, setUsage] = useState(null);
  const [plansLoading, setPlansLoading] = useState(true);
  const user = useSelector(selectUser);
  const globalLoading = useSelector(selectLoading);
  const router = useRouter();

  // Fetch plans with pricing from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        const response = await AuthService.getPlansWithPricing();
        if (response.data) {
          setPlans(response.data.plans || []);
          setCurrentTier(response.data.currentTier);
          setUsage(response.data.usage);
          
          // Set billing frequency based on current subscription
          if (response.data.user?.subscription?.paid) {
            const currentBilling = response.data.user.subscription?.billing_cycle || 'month';
            const currentFreq = currentBilling === 'year' ? 1 : 0;
            setFrequency(currentFreq);
            setInitialFrequency(currentFreq);
            console.log('Detected current billing cycle:', currentBilling);
          }
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        message.error('Failed to load plans');
      } finally {
        setPlansLoading(false);
      }
    };

    // Check if user returned from payment (refresh user data if so)
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment') === 'success' || urlParams.get('success') === 'true';
    
    if (paymentSuccess) {
      console.log('🎉 Payment success detected, refreshing user data...');
      refreshUserData().then(() => {
        console.log('✅ User data refreshed after payment success');
        // Clean up URL parameters
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      });
    }

    fetchPlans();
  }, []);

  // Detect current billing cycle and set as default (fallback)
  useEffect(() => {
    if (user?.subscription?.paid && !plansLoading) {
      // For existing paid subscribers, try to detect their current billing cycle
      // This would ideally come from the subscription details
      const currentBilling = user.subscription?.billing_cycle || 'month';
      const currentFreq = currentBilling === 'year' ? 1 : 0;
      setFrequency(currentFreq);
      setInitialFrequency(currentFreq);
      console.log('Detected current billing cycle:', currentBilling);
    }
  }, [user?.subscription, plansLoading]);

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

  // Find current plan from fetched data
  const currentPlan = plans.find(p => p.id === (currentTier?.id || 'start')) || plans[0];
  
  // Helper function to get plan relationship
  const getPlanRelationship = (planId) => {
    const currentPlanObj = plans.find(p => p.id === currentTier.id);
    const targetPlan = plans.find(p => p.id === planId);
    
    if (!currentPlanObj || !targetPlan) return 'unknown';
    
    // Define tier hierarchy if not present
    const tierHierarchy = {
      'start': 1,
      'create': 2, 
      'scale': 3
    };
    
    const currentTierNum = currentPlanObj.tier || tierHierarchy[currentPlanObj.id] || 1;
    const targetTierNum = targetPlan.tier || tierHierarchy[targetPlan.id] || 1;
    
    if (currentTierNum === targetTierNum) return 'current';
    if (currentTierNum < targetTierNum) return 'upgrade';
    if (currentTierNum > targetTierNum) return 'downgrade';
    
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
        await refreshUserData();
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
        await refreshUserData();
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      message.error(error.response?.data?.message || "Failed to update plan");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBillingPortal = async () => {
    try {
      setLoading(true);
      const response = await AuthService.getSubscription();
      
      if (response.data?.link) {
        window.open(response.data.link, '_blank');
      } else {
        message.error("Unable to access billing portal. Please try again.");
      }
    } catch (error) {
      console.error("Error opening billing portal:", error);
      message.error("Failed to open billing portal");
    } finally {
      setLoading(false);
    }
  };

  // Use the usage data from API if available, otherwise fallback to user data
  const usageData = usage || {
    funnels: {
      current: user?.landingPages?.length || user?.landingPageNum || 0,
      limit: currentPlan?.maxFunnels || currentTier?.maxFunnels || 1,
      unlimited: (currentPlan?.maxFunnels || currentTier?.maxFunnels) === null
    },
    candidates: {
      current: user?.totalCandidates || 0,
      limit: currentPlan?.maxCandidates || currentTier?.maxCandidates || 50,
      unlimited: (currentPlan?.maxCandidates || currentTier?.maxCandidates) === null
    }
  };

  if (globalLoading || plansLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  // Return early if no data
  if (!plans.length || !currentTier) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p>Unable to load billing information.</p>
          <Button 
            type="primary" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
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
                        {usageData.funnels.current}
                        <span className="text-gray-500 font-normal text-sm">
                          {usageData.funnels.unlimited ? ' / ∞' : ` / ${usageData.funnels.limit}`}
                        </span>
                      </div>
                      {!usageData.funnels.unlimited && (
                        <div className="text-xs text-gray-500">
                          {Math.max(0, usageData.funnels.limit - usageData.funnels.current)} remaining
                        </div>
                      )}
                    </div>
                  </div>
                  {!usageData.funnels.unlimited && (
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            usageData.funnels.current >= usageData.funnels.limit 
                              ? 'bg-red-500' 
                              : usageData.funnels.current >= usageData.funnels.limit * 0.8 
                                ? 'bg-yellow-500' 
                                : 'bg-blue-500'
                          }`}
                          style={{ 
                            width: `${Math.min((usageData.funnels.current / usageData.funnels.limit) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      {usageData.funnels.current >= usageData.funnels.limit && (
                        <div className="text-xs text-red-600 mt-1 font-medium">
                          ⚠️ Over limit by {usageData.funnels.current - usageData.funnels.limit}
                        </div>
                      )}
                    </div>
                  )}
                  {usageData.funnels.unlimited && (
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
                        {usageData.candidates.current}
                        <span className="text-gray-500 font-normal text-sm">
                          {usageData.candidates.unlimited ? ' / ∞' : ` / ${usageData.candidates.limit}`}
                        </span>
                      </div>
                      {!usageData.candidates.unlimited && (
                        <div className="text-xs text-gray-500">
                          {Math.max(0, usageData.candidates.limit - usageData.candidates.current)} remaining
                        </div>
                      )}
                    </div>
                  </div>
                  {!usageData.candidates.unlimited && (
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            usageData.candidates.current >= usageData.candidates.limit 
                              ? 'bg-red-500' 
                              : usageData.candidates.current >= usageData.candidates.limit * 0.8 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min((usageData.candidates.current / usageData.candidates.limit) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      {usageData.candidates.current >= usageData.candidates.limit && (
                        <div className="text-xs text-red-600 mt-1 font-medium">
                          ⚠️ Over limit by {usageData.candidates.current - usageData.candidates.limit}
                        </div>
                      )}
                    </div>
                  )}
                  {usageData.candidates.unlimited && (
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
            const isOverLimit = (usageData.funnels.current > (usageData.funnels.limit || 0) && !usageData.funnels.unlimited) ||
                               (usageData.candidates.current > (usageData.candidates.limit || 0) && !usageData.candidates.unlimited);
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

      {/* Manage Subscription */}
      {user?.subscription?.id && (
        <Card 
          title={
            <div className="flex items-center">
              <FileTextOutlined className="mr-2 text-blue-500" />
              Manage Subscription
            </div>
          } 
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 mb-2">
                Access billing history, download invoices, and manage payment methods.
              </p>
            </div>
            <Button 
              type="primary"
              onClick={handleOpenBillingPortal}
              loading={loading}
              className="w-full md:w-auto"
            >
              Manage Subscription
            </Button>
          </div>
        </Card>
      )}

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
                      Save €{((plan.monthlyPrice  * 12) - plan.annualPrice)}/year
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
