import { FadeInSection } from "@/components/public/FadeInSection";
import { Shield, Users, Lock, Eye, FileCheck, Heart } from "lucide-react";

const principles = [
  {
    icon: Users,
    title: "Informed Consent",
    description:
      "All research participants must provide voluntary, informed consent before any data collection. Researchers are required to clearly explain the purpose, methods, and potential uses of collected data in language participants can understand.",
  },
  {
    icon: Shield,
    title: "Data Protection",
    description:
      "We employ industry-leading security measures including encryption, access controls, and secure storage. All data is processed in compliance with international data protection standards and institutional ethics requirements.",
  },
  {
    icon: Lock,
    title: "Confidentiality",
    description:
      "Participant identities are protected through anonymization and pseudonymization techniques. Access to identifying information is strictly limited to authorized researchers who have agreed to confidentiality protocols.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Researchers maintain clear documentation of data collection methods, processing activities, and storage practices. Participants have the right to know how their data is being used and can request access to their information.",
  },
  {
    icon: FileCheck,
    title: "Purpose Limitation",
    description:
      "Data collected through our platform is used only for the specific research purposes approved by ethics committees. Secondary use of data requires additional ethical approval and, where applicable, renewed consent.",
  },
  {
    icon: Heart,
    title: "Beneficence",
    description:
      "Research conducted using our platform should aim to benefit communities and advance knowledge. We encourage researchers to share findings with participants and contribute to evidence-based policy development.",
  },
];

export default function DataEthics() {
  return (
    <div>
      {/* Header */}
      <section className="bg-muted/30 border-b">
        <div className="container py-16">
          <FadeInSection>
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-secondary uppercase tracking-wide mb-3">
                Our Commitment
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Data Ethics Framework
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Ethical data collection and management are foundational to our mission. 
                We are committed to protecting the rights and dignity of research participants 
                while enabling valuable research.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Principles Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <FadeInSection>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Core Ethical Principles
              </h2>
              <p className="text-muted-foreground">
                Our platform is built on these foundational principles that guide 
                how we handle research data and protect participant rights.
              </p>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {principles.map((principle, index) => (
              <FadeInSection key={principle.title} delay={index * 0.1}>
                <div className="bg-card border rounded-md p-6 h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <principle.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeInSection>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Regulatory Compliance
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We maintain compliance with major data protection regulations and 
                research ethics frameworks, including:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground">
                    Kenya Data Protection Act (2019)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground">
                    African Union Convention on Cyber Security
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground">
                    Declaration of Helsinki for Medical Research
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground">
                    GDPR principles for international collaborations
                  </span>
                </li>
              </ul>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="bg-card border rounded-md p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Ethics Review Support
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  We provide documentation and technical specifications to help researchers 
                  navigate institutional ethics review processes. Our team can assist with:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Data security documentation for IRB submissions</li>
                  <li>• Consent form templates and guidance</li>
                  <li>• Data management plan support</li>
                  <li>• Anonymization strategy consultation</li>
                </ul>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <FadeInSection>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Questions About Data Ethics?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our Data Ethics Officer is available to discuss specific concerns 
                or assist with ethics committee requirements.
              </p>
              <p className="text-muted-foreground">
                Contact:{" "}
                <a
                  href="mailto:ethics@voiceresearch.org"
                  className="text-primary hover:underline"
                >
                  ethics@voiceresearch.org
                </a>
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
