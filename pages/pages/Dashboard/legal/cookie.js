import React from "react";

const Cookie = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-4">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. What Are Cookies</h2>
          <p className="text-gray-700 mb-4">
            Cookies are small text files that are stored on your computer or mobile device when you 
            visit our website. They help us provide you with a better experience by remembering your 
            preferences and improving our services.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. How We Use Cookies</h2>
          <p className="text-gray-700 mb-4">We use cookies for the following purposes:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
            <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
            <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
            <li><strong>Targeting Cookies:</strong> Used to deliver relevant advertisements</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Types of Cookies We Use</h2>
          <p className="text-gray-700 mb-4">
            <strong>Session Cookies:</strong> These are temporary cookies that are deleted when you close your browser.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Persistent Cookies:</strong> These cookies remain on your device for a set period or until you delete them.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Managing Cookies</h2>
          <p className="text-gray-700 mb-4">
            You can control and manage cookies through your browser settings. Please note that disabling 
            certain cookies may affect the functionality of our website.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Third-Party Cookies</h2>
          <p className="text-gray-700 mb-4">
            We may also use third-party services that place cookies on your device. These cookies are 
            governed by the respective third parties' privacy policies.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about our use of cookies, please contact us through our support channels.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cookie; 