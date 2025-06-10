"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md p-6 mb-8">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Last Updated: June 9, 2025</p>
        
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p className="mb-4">
          Welcome to Ziq ("we", "our", or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and while using our services.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
        <p className="mb-2">We collect the following types of information:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Account information: When you create an account, we collect your email address.</li>
          <li>Search queries: We store your search queries to improve your experience and our services.</li>
          <li>Memory groups: We store memory groups you create to help organize your searches.</li>
          <li>Usage data: We collect information about how you interact with our service.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
        <p className="mb-2">We use your information for the following purposes:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>To provide and maintain our services</li>
          <li>To improve and personalize your experience</li>
          <li>To process transactions and manage your account</li>
          <li>To communicate with you about our services</li>
        </ul>
        
        <h2 className="text-xl font-semibold mb-3">4. Data Retention</h2>
        <p className="mb-4">
          We retain your data for as long as your account is active or as needed to provide you services. 
          You can delete your memory groups at any time through the application interface.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">5. Data Sharing and Processors</h2>
        <p className="mb-4">
          We do not sell your personal information. We may share your information with third-party service providers 
          who help us operate our services, but they are only permitted to use your information to provide services to us.
        </p>
        <p className="mb-2">We use the following data processors to deliver our services:</p>
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
          We have data processing agreements in place with these processors as required by the GDPR. All processors that may receive EU personal data provide adequate safeguards in accordance with applicable data protection laws.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">6. Security</h2>
        <p className="mb-4">
          We implement appropriate security measures to protect your personal information. However, no method of 
          transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">7. Your Rights Under GDPR and Other Privacy Laws</h2>
        <p className="mb-2">Depending on your location, you may have the following rights regarding your personal data:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-1">Right to access - You can request copies of your personal data.</li>
          <li className="mb-1">Right to rectification - You can request that we correct inaccurate information or complete incomplete information.</li>
          <li className="mb-1">Right to erasure - You can request that we delete your personal data in certain circumstances.</li>
          <li className="mb-1">Right to restrict processing - You can request that we restrict the processing of your data in certain circumstances.</li>
          <li className="mb-1">Right to data portability - You can request that we transfer your data to another organization or directly to you.</li>
          <li className="mb-1">Right to object - You can object to our processing of your personal data in certain circumstances.</li>
          <li className="mb-1">Rights related to automated decision making and profiling - You have rights related to how we use automated decision-making processes.</li>
        </ul>
        <p className="mb-4">
          To exercise any of these rights, please contact us at privacy@ziqsearch.com. We will respond to your request within 30 days. There is no charge for making a request, but we may charge a reasonable fee if your request is clearly unfounded, repetitive, or excessive.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">8. Children's Privacy</h2>
        <p className="mb-4">
          Our services are not intended for children under 13. We do not knowingly collect personal information 
          from children under 13. If you believe we have collected information from a child under 13, 
          please contact us so we can remove the information.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">9. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
          the new Privacy Policy on this page and updating the "Last Updated" date.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">10. Legal Basis for Processing (GDPR)</h2>
        <p className="mb-4">
          For users in the European Economic Area (EEA), we process your personal data on the following legal bases:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-1"><strong>Contractual necessity:</strong> Processing necessary to fulfill our contract with you (Terms of Service)</li>
          <li className="mb-1"><strong>Legitimate interests:</strong> Processing necessary for our legitimate interests, such as improving our services and providing a personalized experience</li>
          <li className="mb-1"><strong>Consent:</strong> Processing based on your specific consent, such as for marketing communications</li>
          <li className="mb-1"><strong>Legal obligation:</strong> Processing necessary to comply with legal obligations</li>
        </ul>
        
        <h2 className="text-xl font-semibold mb-3">11. International Data Transfers</h2>
        <p className="mb-4">
          Your information may be transferred to and processed in countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country. We ensure appropriate safeguards are in place to protect your data when it is transferred internationally, including the use of standard contractual clauses approved by the European Commission.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">12. Data Protection Officer</h2>
        <p className="mb-4">
          We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions regarding this privacy policy. If you have questions about how we handle your data or would like to exercise your rights, please contact our DPO at privacy@ziqsearch.com.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">13. Supervisory Authority</h2>
        <p className="mb-4">
          If you are located in the European Economic Area and believe we are processing your personal data unlawfully, you have the right to lodge a complaint with your local data protection supervisory authority.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">14. United States Privacy Rights</h2>
        <p className="mb-4">
          Depending on your state of residence, you may have additional privacy rights under state laws such as the California Consumer Privacy Act (CCPA), California Privacy Rights Act (CPRA), Virginia Consumer Data Protection Act (VCDPA), Colorado Privacy Act (CPA), Connecticut Data Privacy Act (CTDPA), and Utah Consumer Privacy Act (UCPA).
        </p>
        
        <h3 className="text-lg font-semibold mb-2">California Residents</h3>
        <p className="mb-2">If you are a California resident, you have the following rights:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-1">Right to know what personal information we collect about you</li>
          <li className="mb-1">Right to delete personal information we have collected about you</li>
          <li className="mb-1">Right to correct inaccurate personal information</li>
          <li className="mb-1">Right to opt-out of the sale or sharing of personal information</li>
          <li className="mb-1">Right to limit the use of sensitive personal information</li>
          <li className="mb-1">Right to non-discrimination for exercising your rights</li>
        </ul>
        <p className="mb-4">
          We do not sell or share your personal information as defined by the CCPA/CPRA. In the preceding 12 months, we have collected the categories of personal information described in the "Information We Collect" section of this policy.
        </p>
        
        <h3 className="text-lg font-semibold mb-2">Other U.S. State Laws</h3>
        <p className="mb-4">
          Residents of Virginia, Colorado, Connecticut, and Utah may have similar rights to access, delete, correct, and opt-out of the processing of their personal data. To exercise any of these rights, please contact us using the information in the "Contact Us" section.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">15. Canadian Privacy Rights</h2>
        <p className="mb-4">
          We comply with Canadian privacy laws, including the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial laws. Canadian residents have the right to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-1">Access their personal information</li>
          <li className="mb-1">Challenge the accuracy and completeness of their information</li>
          <li className="mb-1">Withdraw consent for the collection, use, or disclosure of their information</li>
          <li className="mb-1">File a complaint with the Office of the Privacy Commissioner of Canada regarding the handling of their personal information</li>
        </ul>
        <p className="mb-4">
          We only collect, use, and disclose your personal information with your consent or as permitted or required by law. You can withdraw your consent at any time, subject to legal or contractual restrictions and reasonable notice.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">16. Global Privacy Compliance</h2>
        <p className="mb-4">
          Ziq is committed to respecting privacy laws worldwide. In addition to the specific regional provisions outlined above, we strive to comply with applicable privacy and data protection laws in all jurisdictions where our users are located, including but not limited to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-1">United Kingdom (UK GDPR)</li>
          <li className="mb-1">Brazil (Lei Geral de Proteção de Dados - LGPD)</li>
          <li className="mb-1">Australia (Privacy Act and Australian Privacy Principles)</li>
          <li className="mb-1">China (Personal Information Protection Law - PIPL)</li>
          <li className="mb-1">Japan (Act on Protection of Personal Information - APPI)</li>
          <li className="mb-1">South Korea (Personal Information Protection Act - PIPA)</li>
          <li className="mb-1">Singapore (Personal Data Protection Act - PDPA)</li>
          <li className="mb-1">India (Digital Personal Data Protection Act - DPDPA)</li>
        </ul>
        <p className="mb-4">
          Our core privacy principles apply globally: transparency in our data practices, minimizing data collection to what's necessary, implementing appropriate security measures, respecting user rights, and providing meaningful control over personal information. As privacy laws evolve worldwide, we are committed to adapting our practices to maintain compliance.
        </p>
        <p className="mb-4">
          If you have specific questions about how we comply with the privacy laws in your jurisdiction, please contact us using the information provided below.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">17. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at support@ziqsearch.com.
        </p>
      </div>
    </div>
  );
}
