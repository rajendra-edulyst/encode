import React from 'react';

export const EulaContent: React.FC = () => {
  return (
    <div className="eula-content text-sm  mx-auto p-3">
      <div className="mb-8 text-start border-b pb-6">
        {/* Centered column layout for header text */}
        <div className="flex flex-col items-start justify-start space-y-3">
          <h1 className="text-2xl font-bold text-primary leading-tight">
            CODEEDU - End User License Agreement (EULA)
          </h1>
          <div className="effective-date text-white flex flex-row">
            <p className="font-medium">Effective Date:</p>
            <p>September 30, 2025</p>
          </div>
          <p className="text-white max-w-2xl leading-relaxed">
            By accessing or using the CODEEDU platform Software, you agree to the terms below.
            If you do not agree, please do not use the platform.
          </p>
        </div>
      </div>

      <div className="section mb-6">
        <h2 className="text-lg font-semibold mb-3 text-primary">1. License Grant</h2>
        <p className="text-white">
          CODEEDU grants you a limited, non-transferable, non-exclusive license to use the platform
          for educational or internal business purposes only.
        </p>
      </div>

      <div className="section mb-6">
        <h2 className="text-lg font-semibold mb-3 text-primary">2. Restrictions</h2>
        <p className="text-white mb-2">You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2 text-white">
          <li>Copy, modify, distribute, or resell the Software.</li>
          <li>Reverse engineer or attempt to extract source code.</li>
          <li>Use the platform to create a competing product.</li>
          <li>Misuse or overload the system.</li>
          <li>Violate intellectual property rights of CODEEDU or third parties.</li>
        </ul>
      </div>

      <div className="section mb-6">
        <h2 className="text-lg font-semibold mb-3 text-primary">3. Content Usage</h2>
        <ul className="list-disc pl-6 space-y-2 text-white">
          <li>Content on the platform is derived from public educational sources and transformed for educational purposes.</li>
          <li>You may only use it within the platform and for non-commercial, educational use.</li>
          <li>Do not share, download, or reproduce content outside the platform unless permitted.</li>
        </ul>
      </div>

      <div className="section mb-6">
        <h2 className="text-lg font-semibold mb-3 text-primary">4. User Responsibilities</h2>
        <ul className="list-disc pl-6 space-y-2 text-white">
          <li>Keep your account credentials secure.</li>
          <li>Provide accurate information.</li>
          <li>Use the platform legally and ethically.</li>
          <li>Back up your own data — CODEEDU is not responsible for loss of user data.</li>
        </ul>
      </div>

      <div className="section mb-6">
        <h2 className="text-lg font-semibold mb-3 text-primary">5. Intellectual Property</h2>
        <p className="text-white">
          All software, features, and content (unless otherwise stated) are owned by CODEEDU or its licensors.
        </p>
      </div>

      <div className="section mb-6">
        <h2 className="text-lg font-semibold mb-3 text-primary">6. Privacy</h2>
        <p className="text-white">
          Your data is handled as per our Privacy Policy and in compliance with applicable Indian data protection laws.
        </p>
      </div>

      <div className="section mb-6">
        <h2 className="text-lg font-semibold mb-3 text-primary">7. Termination</h2>
        <p className="text-white">
          We may suspend or terminate access if you breach this agreement. Upon termination, you must stop using
          the platform and delete any related materials.
        </p>
      </div>

      <div className="section mb-6">
        <h2 className="text-lg font-semibold mb-3 text-primary">8. Disclaimers</h2>
        <p className="text-white">
          The software is provided `as-is` without warranties. CODEEDU does not guarantee error-free or uninterrupted service.
        </p>
      </div>

      <div className="section mb-6">
        <h2 className="text-lg font-semibold mb-3 text-primary">9. Limitation of Liability</h2>
        <p className="text-white">
          We are not liable for indirect or consequential damages. Our total liability is limited to INR 10,000
          or the amount paid by you in the last 12 months, whichever is less.
        </p>
      </div>

      <div className="section mb-6">
        <h2 className="text-lg font-semibold mb-3 text-primary">10. Governing Law</h2>
        <p className="text-white">
          This agreement is governed by the laws of India. Legal disputes will be handled in Jaipur, Rajasthan.
        </p>
      </div>

      <div className="section mb-6">
        <h2 className="text-lg font-semibold mb-3 text-primary">11. Contact Us</h2>
        Email:{' '}
        <a href="mailto:support@codeedu.co" className="text-primary hover:underline">
          support@codeedu.co
        </a>
      </div>

      <div className="footer text-xs text-gray-500 mt-8 pt-6 border-t text-center">
        <p>&copy; {new Date().getFullYear()} CODEEDU. All rights reserved.</p>
      </div>
    </div>
  );
};

export default EulaContent;