 import { Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { FadeInSection } from "@/components/public/FadeInSection";
 import { 
   Mic, 
   Phone, 
   FileText, 
   BarChart3, 
   Users, 
   Shield,
   Globe,
   Clock,
   ArrowRight
 } from "lucide-react";
 
 const mainFeatures = [
   {
     icon: Mic,
     title: "Automated Voice Interviews",
     description: "Schedule and conduct automated phone interviews at scale. Participants receive calls and respond to structured questions using their voice. Recordings are stored securely for transcription and analysis.",
     image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=600&q=80",
   },
   {
     icon: Phone,
     title: "USSD Survey Collection",
     description: "Reach respondents on basic feature phones without requiring internet access. Simple menu-driven questionnaires work on any GSM-enabled device, ensuring maximum participation rates.",
     image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
   },
   {
     icon: FileText,
     title: "AI-Powered Transcription",
     description: "Automatic speech-to-text transcription with support for multiple African languages including Swahili, Kikuyu, Luo, and more. Transcripts are reviewed and exportable.",
     image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
   },
   {
     icon: BarChart3,
     title: "Research Analytics Dashboard",
     description: "Real-time response tracking, completion rates, and demographic breakdowns. Visualize your data collection progress and export results for statistical software.",
     image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
   },
 ];
 
 const additionalFeatures = [
   {
     icon: Users,
     title: "Participant Management",
     description: "Upload and manage participant lists. Track consent status and response history.",
   },
   {
     icon: Shield,
     title: "Data Security",
     description: "End-to-end encryption. Compliant with institutional data protection requirements.",
   },
   {
     icon: Globe,
     title: "Multi-Language Support",
     description: "Transcription and analysis support for 20+ African languages and dialects.",
   },
   {
     icon: Clock,
     title: "Scheduled Campaigns",
     description: "Schedule calls and surveys at optimal times for your target population.",
   },
 ];
 
 export default function Features() {
   return (
     <div>
       {/* Header */}
       <section className="bg-muted/30 border-b">
         <div className="container py-16">
           <FadeInSection>
             <div className="max-w-2xl">
               <p className="text-sm font-medium text-secondary uppercase tracking-wide mb-3">
                 Platform Capabilities
               </p>
               <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                 Features Built for Field Research
               </h1>
               <p className="text-muted-foreground leading-relaxed">
                 Every feature is designed to address the real challenges of conducting research 
                 in low-connectivity environments across Africa.
               </p>
             </div>
           </FadeInSection>
         </div>
       </section>
 
       {/* Main Features */}
       <section className="py-16 md:py-24">
         <div className="container">
           <div className="space-y-20">
             {mainFeatures.map((feature, index) => (
               <FadeInSection key={feature.title}>
                 <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                   <div className={index % 2 === 1 ? "md:order-2" : ""}>
                     <feature.icon className="h-10 w-10 text-secondary mb-4" />
                     <h2 className="text-2xl font-bold text-foreground mb-4">
                       {feature.title}
                     </h2>
                     <p className="text-muted-foreground leading-relaxed">
                       {feature.description}
                     </p>
                   </div>
                   <div className={index % 2 === 1 ? "md:order-1" : ""}>
                     <img
                       src={feature.image}
                       alt={feature.title}
                       className="rounded-md w-full object-cover aspect-[4/3]"
                     />
                   </div>
                 </div>
               </FadeInSection>
             ))}
           </div>
         </div>
       </section>
 
       {/* Additional Features Grid */}
       <section className="py-16 bg-muted/30">
         <div className="container">
           <FadeInSection>
             <h2 className="text-2xl font-bold text-foreground text-center mb-12">
               Additional Capabilities
             </h2>
           </FadeInSection>
           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {additionalFeatures.map((feature, index) => (
               <FadeInSection key={feature.title} delay={index * 0.1}>
                 <div className="bg-card border rounded-md p-6 text-center h-full">
                   <feature.icon className="h-8 w-8 text-secondary mx-auto mb-4" />
                   <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                   <p className="text-sm text-muted-foreground">{feature.description}</p>
                 </div>
               </FadeInSection>
             ))}
           </div>
         </div>
       </section>
 
       {/* CTA */}
       <section className="py-16">
         <div className="container text-center">
           <FadeInSection>
             <h2 className="text-2xl font-bold text-foreground mb-4">
               See the Platform in Action
             </h2>
             <p className="text-muted-foreground max-w-xl mx-auto mb-8">
               Schedule a demo with our team to see how the Voice Research System can support your next study.
             </p>
             <Button size="lg" asChild>
               <Link to="/contact">
                 Request Demo
                 <ArrowRight className="ml-2 h-4 w-4" />
               </Link>
             </Button>
           </FadeInSection>
         </div>
       </section>
     </div>
   );
 }