import React from "react";

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-4">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using HireLab's services, you accept and agree to be bound by the terms 
            and provision of this agreement.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Use License</h2>
          <p className="text-gray-700 mb-4">
            Permission is granted to temporarily use HireLab's services for personal, non-commercial 
            transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            The materials on HireLab's services are provided on an 'as is' basis. HireLab makes no 
            warranties, expressed or implied, and hereby disclaims and negates all other warranties.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Limitations</h2>
          <p className="text-gray-700 mb-4">
            In no event shall HireLab or its suppliers be liable for any damages (including, without 
            limitation, damages for loss of data or profit, or due to business interruption).
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Accuracy of Materials</h2>
          <p className="text-gray-700 mb-4">
            The materials appearing on HireLab's services could include technical, typographical, or 
            photographic errors. HireLab does not warrant that any of the materials are accurate.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, please contact us through our support channels.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms; 
