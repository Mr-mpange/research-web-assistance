 import { Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { FadeInSection } from "@/components/public/FadeInSection";
 import { 
   ClipboardList, 
   Phone, 
   Mic, 
   FileText, 
   BarChart3, 
   Download,
   ArrowRight,
   CheckCircle
 } from "lucide-react";
 
 const processSteps = [
   {
     icon: ClipboardList,
     number: "01",
     title: "Design Your Research Questions",
     description: "Log in to the researcher dashboard and create your study. Define research questions, set response formats, and configure skip logic for branching surveys.",
     details: [
       "Create multiple-choice or open-ended questions",
       "Set up branching logic based on responses",
       "Configure consent scripts and ethical safeguards",
       "Preview questions before launching",
     ],
   },
   {
     icon: Phone,
     number: "02",
     title: "Upload Participant Lists",
     description: "Import your participant phone numbers and demographic data. The system validates numbers and ensures compliance with consent requirements.",
     details: [
       "CSV upload for bulk participant import",
       "Phone number validation and deduplication",
       "Demographic tagging for analysis",
       "Consent status tracking",
     ],
   },
   {
     icon: Mic,
     number: "03",
     title: "Launch Data Collection",
     description: "Schedule automated voice calls or USSD sessions. Participants receive calls at optimal times and respond using voice or keypad inputs.",
     details: [
       "Schedule campaigns for specific times",
       "Retry logic for missed calls",
       "Real-time response monitoring",
       "Pause and resume campaigns",
     ],
   },
   {
     icon: FileText,
     number: "04",
     title: "AI Transcription & Review",
     description: "Voice recordings are automatically transcribed using AI trained on African languages. Review and correct transcriptions in the dashboard.",
     details: [
       "Automatic speech-to-text transcription",
       "Support for 20+ African languages",
       "Manual review and correction tools",
       "Speaker identification",
     ],
   },
   {
     icon: BarChart3,
     number: "05",
     title: "Analyze Responses",
     description: "View response distributions, completion rates, and key themes. Filter by demographics and cross-tabulate responses.",
     details: [
       "Real-time analytics dashboard",
       "Response coding and tagging",
       "Theme detection with AI",
       "Custom filters and segments",
     ],
   },
   {
     icon: Download,
     number: "06",
     title: "Export Clean Data",
     description: "Export your data in formats ready for statistical software. All transcriptions, responses, and metadata are included.",
     details: [
       "Export to CSV, Excel, SPSS",
       "Audio files with transcripts",
       "Anonymization options",
       "Audit trail for compliance",
     ],
   },
 ];
 
 export default function HowItWorks() {
   return (
     <div>
       {/* Header */}
       <section className="bg-muted/30 border-b">
         <div className="container py-16">
           <FadeInSection>
             <div className="max-w-2xl">
               <p className="text-sm font-medium text-secondary uppercase tracking-wide mb-3">
                 Research Workflow
               </p>
               <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                 How It Works
               </h1>
               <p className="text-muted-foreground leading-relaxed">
                 From study design to data export — a step-by-step guide to conducting 
                 voice and USSD research with our platform.
               </p>
             </div>
           </FadeInSection>
         </div>
       </section>
 
       {/* Process Steps */}
       <section className="py-16 md:py-24">
         <div className="container">
           <div className="max-w-3xl mx-auto">
             <div className="relative">
               {/* Timeline line */}
               <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />
 
               <div className="space-y-12">
                 {processSteps.map((step, index) => (
                   <FadeInSection key={step.number} delay={index * 0.1}>
                     <div className="relative pl-0 md:pl-16">
                       {/* Step number circle */}
                       <div className="hidden md:flex absolute left-0 top-0 w-12 h-12 rounded-full bg-primary text-primary-foreground items-center justify-center font-bold text-sm">
                         {step.number}
                       </div>
 
                       <div className="bg-card border rounded-md p-6">
                         <div className="flex items-start gap-4">
                           <div className="md:hidden flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                             {step.number}
                           </div>
                           <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                               <step.icon className="h-5 w-5 text-secondary" />
                               <h3 className="font-semibold text-foreground">{step.title}</h3>
                             </div>
                             <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                               {step.description}
                             </p>
                             <ul className="grid sm:grid-cols-2 gap-2">
                               {step.details.map((detail) => (
                                 <li key={detail} className="flex items-center gap-2 text-xs text-muted-foreground">
                                   <CheckCircle className="h-3 w-3 text-secondary flex-shrink-0" />
                                   {detail}
                                 </li>
                               ))}
                             </ul>
                           </div>
                         </div>
                       </div>
                     </div>
                   </FadeInSection>
                 ))}
               </div>
             </div>
           </div>
         </div>
       </section>
 
       {/* Image Section */}
       <section className="py-16 bg-muted/30">
         <div className="container">
           <div className="grid md:grid-cols-2 gap-12 items-center">
             <FadeInSection>
               <img
                 src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                 alt="Research team analyzing data"
                 className="rounded-md w-full object-cover aspect-[4/3]"
               />
             </FadeInSection>
             <FadeInSection delay={0.2}>
               <h2 className="text-2xl font-bold text-foreground mb-4">
                 Designed for Collaborative Research
               </h2>
               <p className="text-muted-foreground leading-relaxed mb-6">
                 Our platform supports multi-user teams with role-based access. Principal investigators, 
                 research assistants, and data analysts can work together with appropriate permissions.
               </p>
               <Button asChild>
                 <Link to="/features">
                   Explore Features
                   <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
               </Button>
             </FadeInSection>
           </div>
         </div>
       </section>
 
       {/* CTA */}
       <section className="py-16">
         <div className="container text-center">
           <FadeInSection>
             <h2 className="text-2xl font-bold text-foreground mb-4">
               Ready to Get Started?
             </h2>
             <p className="text-muted-foreground max-w-xl mx-auto mb-8">
               Contact our team to discuss your research needs and see the platform in action.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button size="lg" asChild>
                 <Link to="/contact">Request Demo</Link>
               </Button>
               <Button size="lg" variant="outline" asChild>
                 <Link to="/auth">Researcher Login</Link>
               </Button>
             </div>
           </FadeInSection>
         </div>
       </section>
     </div>
   );
 }