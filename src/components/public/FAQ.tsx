import { FadeInSection } from "./FadeInSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does voice data collection work without internet?",
    answer:
      "Our system uses automated phone calls via standard GSM networks. Participants receive a call, listen to questions, and respond verbally. The audio is recorded and stored securely for later transcription. No smartphone or internet connection is required—any mobile phone works.",
  },
  {
    question: "What languages do you support for transcription?",
    answer:
      "We support major African languages including Swahili, Amharic, Hausa, Yoruba, Zulu, and many regional dialects. Our AI transcription models are trained on African language datasets to ensure accuracy. Contact us if you need support for a specific language.",
  },
  {
    question: "How do you ensure informed consent from participants?",
    answer:
      "Before any data collection, participants hear a consent statement in their preferred language explaining the research purpose, how their data will be used, and their right to withdraw. They must verbally confirm consent before proceeding. All consent recordings are stored separately for audit purposes.",
  },
  {
    question: "Is my research data secure?",
    answer:
      "Yes. All data is encrypted in transit and at rest using AES-256 encryption. We comply with GDPR, the Kenya Data Protection Act, and institutional ethics requirements. Access controls ensure only authorized team members can view participant data.",
  },
  {
    question: "Can I export data for analysis in other tools?",
    answer:
      "Absolutely. You can export transcriptions, response summaries, and raw metadata in CSV, JSON, or Excel formats. This allows seamless integration with tools like SPSS, Stata, NVivo, or your preferred analysis software.",
  },
  {
    question: "What is USSD and how does it work for surveys?",
    answer:
      "USSD (Unstructured Supplementary Service Data) is a protocol that works on any mobile phone without internet. Participants dial a short code and navigate menu-based questionnaires using their phone keypad. It's ideal for quick structured surveys and reaching the widest possible audience.",
  },
  {
    question: "How much does the platform cost?",
    answer:
      "Pricing depends on your research scope—number of participants, call duration, and transcription volume. We offer flexible plans for academic institutions and NGOs. Contact us for a customized quote based on your project needs.",
  },
  {
    question: "Can I run a pilot study before committing?",
    answer:
      "Yes, we encourage pilot studies. We can set up a small-scale test with 20-50 participants to validate your research design and ensure the technology works for your context before scaling up.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <FadeInSection>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Common questions from researchers about our platform and methodology.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
