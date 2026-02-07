import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FadeInSection } from "@/components/public/FadeInSection";
import { ArrowRight, Users, MapPin, Calendar, FileText } from "lucide-react";

const caseStudies = [
  {
    id: "maternal-health-kenya",
    title: "Maternal Health Access Study",
    organization: "University of Nairobi & UNICEF Kenya",
    location: "Turkana County, Kenya",
    year: "2024",
    participants: 2847,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    summary:
      "Researchers used voice interviews to understand barriers to maternal healthcare in remote pastoralist communities where internet connectivity is virtually nonexistent.",
    challenge:
      "Traditional survey methods failed to reach nomadic populations who move seasonally and lack smartphone access. Previous attempts using in-person interviews were costly and reached only 12% of the target population.",
    solution:
      "Automated voice calls in Turkana and Swahili allowed women to share experiences from any location with mobile network coverage. USSD follow-ups collected structured data on healthcare facility access.",
    results: [
      "Reached 78% of target population vs. 12% with traditional methods",
      "Identified 3 previously unknown barriers to prenatal care",
      "Data collection cost reduced by 64%",
      "Informed county health department policy changes",
    ],
    quote: {
      text: "For the first time, we heard directly from women in the most remote areas. Their voices shaped real policy change.",
      author: "Dr. Grace Wanjiku",
      role: "Lead Researcher, University of Nairobi",
    },
  },
  {
    id: "agricultural-practices-ethiopia",
    title: "Climate-Resilient Farming Practices",
    organization: "Ethiopian Agricultural Research Institute",
    location: "Amhara & Oromia Regions, Ethiopia",
    year: "2023",
    participants: 4125,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
    summary:
      "A nationwide study on smallholder farmers' adoption of drought-resistant crop varieties and water conservation techniques.",
    challenge:
      "Ethiopia has over 10 million smallholder farmers, most without internet access. Understanding regional variations in farming practices required a scalable, low-cost methodology.",
    solution:
      "Voice interviews in Amharic and Afaan Oromo captured detailed narratives about farming decisions. USSD surveys collected quantitative data on crop yields and water usage across two growing seasons.",
    results: [
      "Surveyed farmers across 47 woredas in 3 months",
      "Identified knowledge gaps in drought preparation",
      "92% completion rate for USSD follow-up surveys",
      "Findings influenced national extension program curriculum",
    ],
    quote: {
      text: "The voice recordings gave us rich qualitative data we never could have collected through written surveys with our farmer population.",
      author: "Alemayehu Tadesse",
      role: "Senior Researcher, EARI",
    },
  },
  {
    id: "youth-employment-nigeria",
    title: "Youth Employment & Skills Training Impact",
    organization: "World Bank & Nigeria Federal Ministry of Youth",
    location: "Lagos, Kano, and Rivers States, Nigeria",
    year: "2024",
    participants: 6230,
    image: "https://images.unsplash.com/photo-1529390079861-591f31a86139?w=800&q=80",
    summary:
      "Evaluation of government-sponsored vocational training programs and their impact on youth employment outcomes.",
    challenge:
      "Tracking employment outcomes 12-24 months after training completion was difficult. Many program graduates moved locations or changed phone numbers, and low literacy rates made SMS surveys ineffective.",
    solution:
      "Voice calls in Hausa, Yoruba, Igbo, and Pidgin English reached graduates wherever they had relocated. Conversational AI probes gathered detailed information about employment status, income, and skill application.",
    results: [
      "85% response rate among program graduates",
      "Tracked outcomes across 156 local government areas",
      "Revealed 40% higher employment rates for specific training tracks",
      "Data used to redesign program curriculum and targeting",
    ],
    quote: {
      text: "We finally have reliable outcome data that shows which programs actually work. This will transform how we allocate training resources.",
      author: "Fatima Bello",
      role: "M&E Director, Federal Ministry of Youth",
    },
  },
  {
    id: "refugee-wellbeing-uganda",
    title: "Refugee Mental Health & Wellbeing",
    organization: "UNHCR & Makerere University",
    location: "Bidi Bidi Settlement, Uganda",
    year: "2023",
    participants: 1890,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    summary:
      "Longitudinal study of mental health indicators among South Sudanese refugees in the world's second-largest refugee settlement.",
    challenge:
      "In-person mental health assessments were stigmatized and logistically difficult in a settlement spanning 250 square kilometers. Written surveys were inappropriate given literacy levels and trauma sensitivity.",
    solution:
      "Voice interviews in Juba Arabic and Dinka provided a private, non-judgmental channel for discussing mental health. Trained counselors reviewed flagged recordings to provide referrals for urgent cases.",
    results: [
      "3x higher disclosure rates compared to in-person interviews",
      "Identified 340 individuals needing immediate mental health support",
      "Monthly follow-up calls tracked wellbeing over 18 months",
      "Informed UNHCR mental health program expansion",
    ],
    quote: {
      text: "People spoke openly because they were alone and felt safe. The phone became a trusted confidant.",
      author: "Dr. Samuel Okello",
      role: "Principal Investigator, Makerere University",
    },
  },
];

export default function CaseStudies() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container">
          <FadeInSection>
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-primary-foreground/80 uppercase tracking-wide mb-4">
                Case Studies
              </p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                Real Research, Real Impact
              </h1>
              <p className="text-lg text-primary-foreground/90 leading-relaxed">
                See how universities, NGOs, and government agencies across Africa 
                are using voice and USSD research to reach communities and drive 
                evidence-based decisions.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Case Studies List */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="space-y-24">
            {caseStudies.map((study, index) => (
              <FadeInSection key={study.id} delay={index * 0.1}>
                <article className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
                  {/* Image */}
                  <div className={index % 2 === 1 ? "md:order-2" : ""}>
                    <img
                      src={study.image}
                      alt={study.title}
                      className="rounded-md w-full object-cover aspect-[4/3]"
                    />
                  </div>

                  {/* Content */}
                  <div className={index % 2 === 1 ? "md:order-1" : ""}>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {study.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {study.year}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {study.participants.toLocaleString()} participants
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {study.title}
                    </h2>
                    <p className="text-sm text-secondary font-medium mb-4">
                      {study.organization}
                    </p>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {study.summary}
                    </p>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm mb-1">
                          The Challenge
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {study.challenge}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm mb-1">
                          Our Solution
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {study.solution}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold text-foreground text-sm mb-2">
                        Results
                      </h3>
                      <ul className="space-y-1">
                        {study.results.map((result, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <FileText className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <blockquote className="border-l-2 border-secondary pl-4 italic text-muted-foreground">
                      <p className="mb-2">"{study.quote.text}"</p>
                      <footer className="text-sm not-italic">
                        <span className="font-medium text-foreground">
                          {study.quote.author}
                        </span>
                        <br />
                        <span className="text-muted-foreground">
                          {study.quote.role}
                        </span>
                      </footer>
                    </blockquote>
                  </div>
                </article>
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
              Ready to Conduct Your Own Research?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Join leading institutions using our platform to reach underserved 
              communities and collect high-quality research data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/contact">
                  Request a Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/how-it-works">See How It Works</Link>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
