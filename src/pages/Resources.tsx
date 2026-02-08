import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeInSection } from "@/components/public/FadeInSection";
import { 
  FileText, 
  BookOpen, 
  Newspaper, 
  ArrowRight, 
  Calendar,
  Download,
  ExternalLink
} from "lucide-react";

const articles = [
  {
    category: "Research Guide",
    title: "Best Practices for Voice-Based Research in Low-Connectivity Areas",
    description: "A comprehensive guide to designing and conducting voice-based research studies in communities with limited internet access.",
    date: "January 2026",
    readTime: "12 min read",
    type: "guide",
  },
  {
    category: "Case Study",
    title: "How UNICEF Reached 10,000 Households Using USSD Surveys",
    description: "Learn how UNICEF Kenya conducted a nationwide nutrition assessment using our USSD survey platform.",
    date: "December 2025",
    readTime: "8 min read",
    type: "case-study",
  },
  {
    category: "Technical",
    title: "AI Transcription Accuracy for African Languages",
    description: "An analysis of transcription accuracy across 25+ African languages and dialects supported by our platform.",
    date: "November 2025",
    readTime: "10 min read",
    type: "technical",
  },
  {
    category: "Ethics",
    title: "Informed Consent in Voice Research: A Practical Framework",
    description: "Guidelines for obtaining meaningful informed consent when conducting research via phone calls.",
    date: "October 2025",
    readTime: "15 min read",
    type: "guide",
  },
  {
    category: "Platform Update",
    title: "New Features: Multi-Language Support and Real-Time Analytics",
    description: "Announcing expanded language support and a new real-time analytics dashboard for research teams.",
    date: "September 2025",
    readTime: "5 min read",
    type: "update",
  },
  {
    category: "Research Guide",
    title: "Designing Effective USSD Questionnaires",
    description: "Tips and best practices for creating USSD surveys that maximize response rates and data quality.",
    date: "August 2025",
    readTime: "9 min read",
    type: "guide",
  },
];

const whitepapers = [
  {
    title: "The Future of Field Research in Africa",
    description: "Exploring how technology is transforming data collection in hard-to-reach communities.",
    pages: "24 pages",
  },
  {
    title: "Data Ethics in Mobile Research",
    description: "A framework for ethical data collection, storage, and usage in voice and USSD research.",
    pages: "18 pages",
  },
  {
    title: "Comparing Voice vs. USSD for Survey Research",
    description: "A comparative analysis of response rates, data quality, and participant preferences.",
    pages: "15 pages",
  },
];

const getCategoryIcon = (type: string) => {
  switch (type) {
    case "guide":
      return BookOpen;
    case "case-study":
      return FileText;
    case "update":
      return Newspaper;
    default:
      return FileText;
  }
};

const getCategoryColor = (type: string) => {
  switch (type) {
    case "guide":
      return "bg-primary/10 text-primary";
    case "case-study":
      return "bg-secondary/10 text-secondary";
    case "update":
      return "bg-muted text-muted-foreground";
    case "technical":
      return "bg-accent text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Resources() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-muted/30 border-b">
        <div className="container py-16">
          <FadeInSection>
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-secondary uppercase tracking-wide mb-3">
                Resources
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Research Articles & Platform Updates
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Guides, case studies, and insights to help you conduct more effective 
                field research using voice and USSD methodologies.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 md:py-24">
        <div className="container">
          <FadeInSection>
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Latest Articles
            </h2>
          </FadeInSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => {
              const Icon = getCategoryIcon(article.type);
              return (
                <FadeInSection key={index} delay={index * 0.05}>
                  <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="secondary" 
                          className={getCategoryColor(article.type)}
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {article.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-snug">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <CardDescription className="flex-1 leading-relaxed">
                        {article.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {article.date}
                        </span>
                        <span>{article.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Whitepapers & Downloads */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <FadeInSection>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Whitepapers & Reports
              </h2>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-6">
            {whitepapers.map((paper, index) => (
              <FadeInSection key={index} delay={index * 0.1}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{paper.title}</CardTitle>
                    <CardDescription>{paper.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {paper.pages}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16">
        <div className="container">
          <FadeInSection>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Stay Updated
              </h2>
              <p className="text-muted-foreground mb-6">
                Get the latest research guides, platform updates, and field research 
                insights delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/contact">
                    Subscribe to Newsletter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Follow on Twitter
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <FadeInSection>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Apply These Insights?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Put research best practices into action with our voice and USSD 
              research platform.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                Request a Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
