import React from 'react';
import { Modal } from 'antd';
import { useRouter } from "next/router";
import { Button, Heading } from '../../pages/pages/Dashboard/Vacancies/components';



const UpgradeModal = ({
  open,
  onClose,
  currentTier,
  requiredTier,
  feature
}) => {
  const router = useRouter();;

  return (
    <Modal 
      title="" 
      open={open} 
      onCancel={onClose} 
      footer={null}
      width={400}
      centered
    >
      <div className="flex flex-col items-center text-center p-4">
        <div className="text-2xl font-semibold mb-6">
          Upgrade Required
        </div>
        
        <p className="text-gray-600 text-sm mb-2">
          You've reached the {feature} limit for your current {currentTier} plan.
        </p>
        <p className="text-gray-600 text-sm mb-6">
          Upgrade to {requiredTier} to create more {feature}s and unlock additional features!
        </p>

        <Button
          className="w-full !bg-[#0066FF] !text-white hover:!bg-[#0052CC] font-medium"
          size="lg"
          variant="fill"
          shape="round"
          leftIcon={null}
          rightIcon={null}
          onClick={() => {
            router.push('/dashboard/billing');
            onClose();
          }}
        >
          Upgrade Now
        </Button>
      </div>
    </Modal>
  );
};

export default UpgradeModal; 
