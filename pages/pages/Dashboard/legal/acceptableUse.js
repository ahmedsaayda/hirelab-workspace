import React from "react";

const AcceptableUse = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Acceptable Use Policy</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-4">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Permitted Use</h2>
          <p className="text-gray-700 mb-4">
            You may use HireLab's services only for lawful purposes and in accordance with these terms. 
            You agree not to use the services in any way that violates any applicable laws or regulations.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Prohibited Activities</h2>
          <p className="text-gray-700 mb-4">You may not use our services:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>To transmit any unlawful, harmful, or objectionable content</li>
            <li>To impersonate any person or entity</li>
            <li>To violate the security of any computer network</li>
            <li>To interfere with or disrupt the services</li>
            <li>To collect personal information about other users</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Content Standards</h2>
          <p className="text-gray-700 mb-4">
            Any content you submit must be accurate, lawful, and not infringe on the rights of others. 
            We reserve the right to remove any content that violates these standards.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Consequences of Violation</h2>
          <p className="text-gray-700 mb-4">
            Violation of this policy may result in suspension or termination of your account and 
            access to our services, and may subject you to civil and criminal liability.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Reporting Violations</h2>
          <p className="text-gray-700 mb-4">
            If you become aware of any violation of this policy, please report it to us immediately 
            through our support channels.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcceptableUse; 
