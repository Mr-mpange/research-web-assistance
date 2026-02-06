import { FadeInSection } from "@/components/public/FadeInSection";

export default function PrivacyPolicy() {
  return (
    <div>
      {/* Header */}
      <section className="bg-muted/30 border-b">
        <div className="container py-16">
          <FadeInSection>
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-secondary uppercase tracking-wide mb-3">
                Legal
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Last updated: February 2026
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
            <FadeInSection>
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The Voice Research System ("we," "our," or "us") is committed to protecting the privacy 
                of researchers and research participants who use our platform. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you use our services.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <h2 className="text-xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-medium text-foreground mb-2">2.1 Researcher Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Account information (name, email, organization)</li>
                <li>Research project details and configurations</li>
                <li>Usage data and platform interactions</li>
                <li>Communication preferences</li>
              </ul>
              <h3 className="text-lg font-medium text-foreground mb-2">2.2 Participant Data</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Voice recordings collected during research studies</li>
                <li>USSD session data and responses</li>
                <li>Demographic information as defined by researchers</li>
                <li>Consent records and participation timestamps</li>
              </ul>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <h2 className="text-xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use collected information to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Provide and maintain our research platform services</li>
                <li>Process and transcribe voice recordings using AI technology</li>
                <li>Generate research insights and analytics</li>
                <li>Communicate with researchers about their projects</li>
                <li>Improve our services and develop new features</li>
                <li>Comply with legal obligations and research ethics requirements</li>
              </ul>
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We implement industry-standard security measures to protect your data, including:
                encryption at rest and in transit, access controls, regular security audits,
                and secure data centers. All research data is stored in compliance with 
                institutional research ethics requirements.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.4}>
              <h2 className="text-xl font-semibold text-foreground mb-4">5. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Research data is retained according to the policies established by the 
                responsible researcher and their institution. Researchers may request 
                deletion of their data at any time, subject to legal and ethical requirements 
                for research data preservation.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.5}>
              <h2 className="text-xl font-semibold text-foreground mb-4">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Export your data in a portable format</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </FadeInSection>

            <FadeInSection delay={0.6}>
              <h2 className="text-xl font-semibold text-foreground mb-4">7. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For privacy-related inquiries, please contact our Data Protection Officer at{" "}
                <a href="mailto:privacy@voiceresearch.org" className="text-primary hover:underline">
                  privacy@voiceresearch.org
                </a>
              </p>
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  );
}
