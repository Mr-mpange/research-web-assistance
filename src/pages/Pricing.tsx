import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeInSection } from "@/components/public/FadeInSection";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Academic",
    description: "For university researchers and small research teams",
    price: "Contact Us",
    priceNote: "Custom pricing for academic institutions",
    features: [
      "Up to 500 voice interviews per project",
      "USSD survey support",
      "AI transcription in 10+ African languages",
      "Basic analytics dashboard",
      "Email support",
      "Data export (CSV, JSON)",
      "Standard encryption",
      "Ethics compliance templates",
    ],
    cta: "Request Academic Quote",
    highlighted: false,
  },
  {
    name: "Research Institution",
    description: "For NGOs, think tanks, and research organizations",
    price: "Contact Us",
    priceNote: "Volume-based pricing",
    features: [
      "Up to 5,000 voice interviews per project",
      "Unlimited USSD surveys",
      "AI transcription in 25+ languages",
      "Advanced analytics & insights",
      "Priority support with dedicated CSM",
      "API access for data integration",
      "Advanced encryption & audit logs",
      "Custom consent workflows",
      "Multi-project management",
    ],
    cta: "Request Quote",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For government agencies and large-scale development programs",
    price: "Custom",
    priceNote: "Tailored to your requirements",
    features: [
      "Unlimited voice interviews",
      "Unlimited USSD surveys",
      "All supported languages",
      "Real-time analytics & monitoring",
      "24/7 dedicated support",
      "Full API access & webhooks",
      "On-premise deployment option",
      "Custom integrations",
      "SLA guarantees",
      "Training & onboarding",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "How is pricing calculated?",
    answer:
      "Pricing is based on the number of participants, call duration, and transcription volume. We offer flexible monthly or project-based billing.",
  },
  {
    question: "Do you offer discounts for academic institutions?",
    answer:
      "Yes, we provide significant discounts for universities and academic researchers. Contact us with your institutional email for a customized quote.",
  },
  {
    question: "Can I run a pilot study first?",
    answer:
      "Absolutely. We encourage pilot studies with 20-50 participants to validate your research design before scaling up.",
  },
  {
    question: "What's included in the free trial?",
    answer:
      "Our pilot program includes up to 50 voice interviews, basic transcription, and access to the analytics dashboard at no cost.",
  },
];

export default function Pricing() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container">
          <FadeInSection>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-medium text-primary-foreground/80 uppercase tracking-wide mb-4">
                Pricing
              </p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                Flexible Plans for Every Research Need
              </h1>
              <p className="text-lg text-primary-foreground/90 leading-relaxed">
                Whether you're an academic researcher, NGO, or government agency, 
                we have a plan that fits your scope and budget.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <FadeInSection key={plan.name} delay={index * 0.1}>
                <Card
                  className={`relative h-full flex flex-col ${
                    plan.highlighted
                      ? "border-primary shadow-lg ring-1 ring-primary"
                      : "border-border"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {plan.priceNote}
                      </p>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                      asChild
                    >
                      <Link to="/contact">
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <FadeInSection>
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">
              Pricing FAQs
            </h2>
          </FadeInSection>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <FadeInSection key={index} delay={index * 0.05}>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <FadeInSection>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Research?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Get in touch with our team to discuss your research needs and 
              find the right plan for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/contact">
                  Schedule a Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/case-studies">View Case Studies</Link>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
