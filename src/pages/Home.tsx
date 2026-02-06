import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FadeInSection } from "@/components/public/FadeInSection";
import { HeroVideo } from "@/components/public/HeroVideo";
import { Testimonials } from "@/components/public/Testimonials";
import { 
  Mic, 
  Phone, 
  FileText, 
  BarChart3, 
  Users, 
  Shield,
  CheckCircle,
  ArrowRight
} from "lucide-react";
 const features = [
   {
     icon: Mic,
     title: "Voice Interviews",
     description: "Conduct structured voice interviews via automated phone calls. Participants respond in their native language.",
   },
   {
     icon: Phone,
     title: "USSD Surveys",
     description: "Reach respondents on basic phones without internet. Simple menu-based questionnaires work on any device.",
   },
   {
     icon: FileText,
     title: "AI Transcription",
     description: "Automatic transcription of voice recordings with support for multiple African languages and dialects.",
   },
   {
     icon: BarChart3,
     title: "Analytics Dashboard",
     description: "Real-time insights and response analytics. Export data for further statistical analysis.",
   },
   {
     icon: Users,
     title: "Participant Management",
     description: "Track consent, manage participant lists, and ensure ethical research practices throughout.",
   },
   {
     icon: Shield,
     title: "Data Security",
     description: "End-to-end encryption and compliance with institutional data protection requirements.",
   },
 ];
 
 const steps = [
   {
     number: "01",
     title: "Design Your Study",
     description: "Create research questions and define your participant criteria using our intuitive dashboard.",
   },
   {
     number: "02",
     title: "Collect Responses",
     description: "Participants receive automated calls or USSD prompts. Responses are recorded securely.",
   },
   {
     number: "03",
     title: "Analyze & Export",
     description: "AI transcribes and summarizes responses. Export clean data for your research.",
   },
 ];
 
 const institutions = [
   "University of Nairobi",
   "Makerere University",
   "UNICEF Kenya",
   "Kenya Red Cross",
   "Population Council",
   "APHRC",
 ];
 
 export default function Home() {
   return (
     <div>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <HeroVideo />
         <div className="relative container py-20 md:py-28">
           <div className="max-w-3xl">
             <FadeInSection>
               <p className="text-sm font-medium text-primary-foreground/80 uppercase tracking-wide mb-4">
                 AI-Powered Research Platform
               </p>
               <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                 Voice & USSD Research for Communities Without Internet Access
               </h1>
               <p className="text-lg text-primary-foreground/90 mb-8 leading-relaxed max-w-2xl">
                 Conduct ethical, scalable field research using voice calls and USSD. 
                 Reach participants on basic phones. Get AI-transcribed, analysis-ready data.
               </p>
               <div className="flex flex-col sm:flex-row gap-4">
                 <Button size="lg" variant="secondary" asChild>
                   <Link to="/auth">
                     Researcher Login
                     <ArrowRight className="ml-2 h-4 w-4" />
                   </Link>
                 </Button>
                 <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                   <Link to="/contact">Request Demo</Link>
                 </Button>
               </div>
             </FadeInSection>
           </div>
         </div>
       </section>
 
       {/* Trusted By Section */}
       <section className="border-b bg-muted/30">
         <div className="container py-8">
           <p className="text-xs text-muted-foreground text-center mb-6 uppercase tracking-wide">
             Trusted by leading research institutions
           </p>
           <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
             {institutions.map((name) => (
               <span key={name} className="text-sm font-medium text-muted-foreground/70">
                 {name}
               </span>
             ))}
           </div>
         </div>
       </section>
 
       {/* Features Section */}
       <section className="py-16 md:py-24">
         <div className="container">
           <FadeInSection>
             <div className="text-center max-w-2xl mx-auto mb-12">
               <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                 Built for Field Research in Africa
               </h2>
               <p className="text-muted-foreground">
                 Our platform addresses the unique challenges of conducting research in low-connectivity environments.
               </p>
             </div>
           </FadeInSection>
 
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {features.map((feature, index) => (
               <FadeInSection key={feature.title} delay={index * 0.1}>
                 <div className="bg-card border rounded-md p-6 h-full hover:shadow-sm transition-shadow">
                   <feature.icon className="h-8 w-8 text-secondary mb-4" />
                   <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     {feature.description}
                   </p>
                 </div>
               </FadeInSection>
             ))}
           </div>
         </div>
       </section>
 
       {/* Image + Text Section */}
       <section className="py-16 bg-muted/30">
         <div className="container">
           <div className="grid md:grid-cols-2 gap-12 items-center">
             <FadeInSection>
               <img
                 src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80"
                 alt="Researchers conducting field interview"
                 className="rounded-md w-full object-cover aspect-[4/3]"
               />
             </FadeInSection>
             <FadeInSection delay={0.2}>
               <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                 Accessibility-First Research
               </h2>
               <p className="text-muted-foreground mb-6 leading-relaxed">
                 In many communities, smartphones and internet are luxuries. Our USSD and voice-based approach ensures 
                 that anyone with a basic mobile phone can participate in your research study.
               </p>
               <ul className="space-y-3">
                 {[
                   "Works on any mobile phone",
                   "No internet required",
                   "Supports local languages",
                   "Ethical consent workflows",
                 ].map((item) => (
                   <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                     <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                     {item}
                   </li>
                 ))}
               </ul>
             </FadeInSection>
           </div>
         </div>
       </section>
 
       {/* How It Works Section */}
       <section className="py-16 md:py-24">
         <div className="container">
           <FadeInSection>
             <div className="text-center max-w-2xl mx-auto mb-12">
               <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                 How It Works
               </h2>
               <p className="text-muted-foreground">
                 A streamlined process from study design to data export.
               </p>
             </div>
           </FadeInSection>
 
           <div className="grid md:grid-cols-3 gap-8">
             {steps.map((step, index) => (
               <FadeInSection key={step.number} delay={index * 0.15}>
                 <div className="text-center">
                   <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-lg font-bold mb-4">
                     {step.number}
                   </div>
                   <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     {step.description}
                   </p>
                 </div>
               </FadeInSection>
             ))}
           </div>
 
           <FadeInSection delay={0.4}>
             <div className="text-center mt-12">
               <Button asChild>
                 <Link to="/how-it-works">
                   Learn More
                   <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
               </Button>
             </div>
            </FadeInSection>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container text-center">
           <FadeInSection>
             <h2 className="text-2xl md:text-3xl font-bold mb-4">
               Ready to Start Your Research?
             </h2>
             <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
               Join universities and NGOs across Africa using our platform for ethical, accessible field research.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button size="lg" variant="secondary" asChild>
                 <Link to="/contact">Request Demo</Link>
               </Button>
               <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                 <Link to="/auth">Sign In</Link>
               </Button>
             </div>
           </FadeInSection>
         </div>
       </section>
     </div>
   );
 }