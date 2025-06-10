"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md p-6 mb-8">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Last Updated: June 9, 2025</p>
        
        <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
        <p className="mb-4">
          By accessing or using Ziq ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">2. User Accounts</h2>
        <p className="mb-4">
          When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding the password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">3. Credit System</h2>
        <p className="mb-4">
          Our Service operates on a credit system. Free accounts receive 5 credits upon registration. Additional credits can be purchased through our subscription plans. Credits are consumed when using certain features of the Service. Unused credits do not expire as long as your account remains active.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">4. Payments and Subscriptions</h2>
        <p className="mb-4">
          We use third-party payment processors to handle all payments. By purchasing credits or subscribing to a plan, you agree to the terms and privacy policies of these payment processors. Subscription plans automatically renew unless canceled before the renewal date.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">5. Cancellation and Refunds</h2>
        <p className="mb-4">
          You can cancel your subscription at any time through your account settings. Cancellation will take effect at the end of the current billing cycle. We do not provide refunds for unused portions of subscription periods or unused credits, except where required by law.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">6. Acceptable Use</h2>
        <p className="mb-4">
          You agree not to use the Service for any illegal purposes or to violate any laws. You may not use the Service to distribute malware, conduct phishing attacks, or engage in any activity that could harm our systems or other users.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">7. Intellectual Property</h2>
        <p className="mb-4">
          The Service and its original content, features, and functionality are owned by Ziq and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">8. Disclaimer of Warranties</h2>
        <p className="mb-4">
          The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, timely, secure, or error-free.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
        <p className="mb-4">
          In no event shall Ziq, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
        <p className="mb-4">
          These Terms shall be governed by the laws of the jurisdiction in which Ziq is established, without regard to its conflict of law provisions.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">11. Third-Party Services</h2>
        <p className="mb-4">
          Our Service relies on various third-party services and APIs to provide functionality. We act as a data controller for information we collect directly, and we engage the following data processors:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Clerk (Clerk.dev) - For user authentication and account management</li>
          <li className="mb-2">Stripe, Inc. - For payment processing and subscription management</li>
          <li className="mb-2">Tavily AI - For image search functionality and web content retrieval</li>
          <li className="mb-2">Exa AI - For academic search capabilities and scholarly content access</li>
          <li className="mb-2">Vercel, Inc. - For website hosting and infrastructure</li>
          <li className="mb-2">Supabase - For database services and data storage</li>
        </ul>
        <p className="mb-4">
          A complete and current list of all third-party data processors we use is maintained at <Link href="/data-processors" className="text-blue-600 hover:underline">ziqsearch.com/data-processors</Link>. This list is updated whenever we add or remove a data processor.
        </p>
        <p className="mb-4">
          By using our Service, you acknowledge and agree that your data may be processed by these third parties according to their respective terms of service and privacy policies. You agree to be bound by the applicable terms of these third-party services when using our Service. We have data processing agreements in place with our processors as required by the GDPR.
        </p>
        <p className="mb-4">
          We have selected these service providers carefully and take reasonable steps to ensure that they provide adequate protection for your personal data and comply with applicable data protection laws. However, we are not responsible for the content or privacy practices of these third-party services once data is transferred to them in accordance with our Privacy Policy.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">12. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">13. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at support@ziqsearch.com.
        </p>
      </div>
    </div>
  );
}
