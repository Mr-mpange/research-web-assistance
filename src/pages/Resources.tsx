import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FadeInSection } from "@/components/public/FadeInSection";
import { ArticleCard } from "@/components/resources/ArticleCard";
import { WhitepaperCard } from "@/components/resources/WhitepaperCard";
import { NewsletterSignup } from "@/components/resources/NewsletterSignup";
import { ArticleFilters } from "@/components/resources/ArticleFilters";

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
    filename: "future-of-field-research-africa.pdf",
  },
  {
    title: "Data Ethics in Mobile Research",
    description: "A framework for ethical data collection, storage, and usage in voice and USSD research.",
    pages: "18 pages",
    filename: "data-ethics-mobile-research.pdf",
  },
  {
    title: "Comparing Voice vs. USSD for Survey Research",
    description: "A comparative analysis of response rates, data quality, and participant preferences.",
    pages: "15 pages",
    filename: "voice-vs-ussd-comparison.pdf",
  },
];

const articleTypes = [
  { value: "guide", label: "Guides" },
  { value: "case-study", label: "Case Studies" },
  { value: "technical", label: "Technical" },
  { value: "update", label: "Updates" },
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === null || article.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

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
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Latest Articles
            </h2>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <ArticleFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              types={articleTypes}
            />
          </FadeInSection>

          {filteredArticles.length === 0 ? (
            <FadeInSection>
              <div className="text-center py-12 text-muted-foreground">
                <p>No articles found matching your criteria.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType(null);
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              </div>
            </FadeInSection>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <FadeInSection key={index} delay={index * 0.05}>
                  <ArticleCard article={article} />
                </FadeInSection>
              ))}
            </div>
          )}
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
                <WhitepaperCard paper={paper} />
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16">
        <div className="container">
          <FadeInSection>
            <NewsletterSignup />
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
