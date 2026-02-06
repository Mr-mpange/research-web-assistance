import { FadeInSection } from "./FadeInSection";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "The Voice Research System allowed us to reach pastoralist communities we couldn't access before. The USSD feature was a game-changer for our maternal health study.",
    author: "Dr. Amina Osei",
    role: "Senior Researcher",
    organization: "University of Nairobi",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
  },
  {
    quote: "We collected over 3,000 voice responses in three weeks. The AI transcription handled Swahili and Luo dialects with impressive accuracy.",
    author: "James Okello",
    role: "Program Manager",
    organization: "UNICEF Kenya",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    quote: "The ethical consent workflows gave our IRB the confidence to approve the study. Data security and participant privacy were handled professionally.",
    author: "Dr. Grace Mwangi",
    role: "Research Director",
    organization: "Population Council",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <FadeInSection>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Trusted by Researchers Across Africa
            </h2>
            <p className="text-muted-foreground">
              Hear from the institutions using our platform for ethical, accessible field research.
            </p>
          </div>
        </FadeInSection>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <FadeInSection key={testimonial.author} delay={index * 0.1}>
              <div className="bg-card border rounded-md p-6 h-full flex flex-col">
                <Quote className="h-8 w-8 text-secondary/30 mb-4" />
                <blockquote className="text-muted-foreground leading-relaxed flex-1 mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.organization}
                    </p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
