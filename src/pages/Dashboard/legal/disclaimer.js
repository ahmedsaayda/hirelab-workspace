import React from "react";

const Disclaimer = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Disclaimer</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-4">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Website Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            The information on this website is provided on an "as is" basis. To the fullest extent 
            permitted by law, HireLab excludes all representations, warranties, obligations, and 
            liabilities arising out of or in connection with this website.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. No Professional Advice</h2>
          <p className="text-gray-700 mb-4">
            The content on this website does not constitute professional advice. We recommend that 
            you seek appropriate professional advice before acting upon any of the information contained herein.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            HireLab will not be liable for any consequential, incidental, indirect, or special damages 
            arising out of or in connection with the use of this website or the information contained herein.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. External Links</h2>
          <p className="text-gray-700 mb-4">
            This website may contain links to external websites. HireLab has no control over the content 
            of these sites and accepts no responsibility for them or for any loss or damage that may arise 
            from your use of them.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Accuracy of Information</h2>
          <p className="text-gray-700 mb-4">
            While we strive to ensure that the information on this website is accurate and up-to-date, 
            we make no warranties or representations of any kind as to its accuracy, currency, or completeness.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Changes to Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify this disclaimer at any time. Changes will be effective 
            immediately upon posting to this website.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this disclaimer, please contact us through our support channels.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer; 
