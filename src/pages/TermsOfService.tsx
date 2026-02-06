import { FadeInSection } from "@/components/public/FadeInSection";

export default function TermsOfService() {
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
                Terms of Service
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
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                By accessing or using the Voice Research System ("Service"), you agree to be bound 
                by these Terms of Service. If you do not agree to these terms, you may not use 
                the Service. These terms apply to all users, including researchers and their 
                institutional affiliates.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <h2 className="text-xl font-semibold text-foreground mb-4">2. Eligibility</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The Service is intended for use by researchers affiliated with academic institutions, 
                non-governmental organizations, and research organizations. Users must be at least 
                18 years of age and have the authority to bind their organization to these terms.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <h2 className="text-xl font-semibold text-foreground mb-4">3. Research Ethics Compliance</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Users are responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Obtaining appropriate ethical approval for research studies</li>
                <li>Ensuring informed consent from all research participants</li>
                <li>Complying with local and international research ethics standards</li>
                <li>Protecting the privacy and confidentiality of participant data</li>
                <li>Using data only for approved research purposes</li>
              </ul>
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <h2 className="text-xl font-semibold text-foreground mb-4">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Use the Service for any unlawful purpose</li>
                <li>Collect data without proper consent</li>
                <li>Share access credentials with unauthorized parties</li>
                <li>Attempt to circumvent security measures</li>
                <li>Use the Service to harm or exploit vulnerable populations</li>
                <li>Misrepresent your identity or institutional affiliation</li>
              </ul>
            </FadeInSection>

            <FadeInSection delay={0.4}>
              <h2 className="text-xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Research data collected through the Service remains the property of the 
                responsible researcher and their institution. The Service's software, 
                design, and documentation are protected by intellectual property laws 
                and remain the property of the Voice Research System.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.5}>
              <h2 className="text-xl font-semibold text-foreground mb-4">6. Service Availability</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We strive to maintain high availability of the Service but do not guarantee 
                uninterrupted access. We may perform maintenance or updates that temporarily 
                affect availability. We will provide reasonable notice of planned maintenance 
                when possible.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.6}>
              <h2 className="text-xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The Service is provided "as is" without warranties of any kind. We shall not 
                be liable for any indirect, incidental, special, or consequential damages 
                arising from your use of the Service. Our total liability shall not exceed 
                the fees paid by you in the twelve months preceding the claim.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.7}>
              <h2 className="text-xl font-semibold text-foreground mb-4">8. Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We may suspend or terminate your access to the Service if you violate these 
                terms or engage in conduct that we determine is harmful to the Service or 
                other users. You may terminate your account at any time by contacting us.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.8}>
              <h2 className="text-xl font-semibold text-foreground mb-4">9. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These terms shall be governed by and construed in accordance with the laws 
                of Kenya, without regard to its conflict of law provisions.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.9}>
              <h2 className="text-xl font-semibold text-foreground mb-4">10. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:legal@voiceresearch.org" className="text-primary hover:underline">
                  legal@voiceresearch.org
                </a>
              </p>
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  );
}
