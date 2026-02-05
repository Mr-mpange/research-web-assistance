 import { Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { FadeInSection } from "@/components/public/FadeInSection";
 import { 
   Target, 
   Users, 
   Shield,
   Globe,
   ArrowRight
 } from "lucide-react";
 
 const values = [
   {
     icon: Target,
     title: "Research Integrity",
     description: "We build tools that uphold the highest standards of research ethics and data quality.",
   },
   {
     icon: Users,
     title: "Accessibility",
     description: "Technology should not be a barrier to participation. We design for low-resource environments.",
   },
   {
     icon: Shield,
     title: "Data Protection",
     description: "Participant data is sacred. We implement rigorous security and privacy measures.",
   },
   {
     icon: Globe,
     title: "Local Context",
     description: "Our platform is built with deep understanding of African research contexts and languages.",
   },
 ];
 
 const partners = [
   "University of Nairobi",
   "Makerere University",
   "UNICEF East Africa",
   "Kenya Red Cross Society",
   "Population Council",
   "African Population and Health Research Center",
   "World Health Organization",
   "Kenya Medical Research Institute",
 ];
 
 export default function About() {
   return (
     <div>
       {/* Header */}
       <section className="bg-muted/30 border-b">
         <div className="container py-16">
           <FadeInSection>
             <div className="max-w-2xl">
               <p className="text-sm font-medium text-secondary uppercase tracking-wide mb-3">
                 About Us
               </p>
               <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                 Empowering Ethical Field Research
               </h1>
               <p className="text-muted-foreground leading-relaxed">
                 We build technology that enables researchers to gather authentic voices from 
                 communities that traditional survey methods cannot reach.
               </p>
             </div>
           </FadeInSection>
         </div>
       </section>
 
       {/* Mission Section */}
       <section className="py-16 md:py-24">
         <div className="container">
           <div className="grid md:grid-cols-2 gap-12 items-center">
             <FadeInSection>
               <img
                 src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80"
                 alt="Researchers in the field"
                 className="rounded-md w-full object-cover aspect-[4/3]"
               />
             </FadeInSection>
             <FadeInSection delay={0.2}>
               <h2 className="text-2xl font-bold text-foreground mb-4">
                 Our Mission
               </h2>
               <p className="text-muted-foreground leading-relaxed mb-4">
                 Across Africa, millions of people live in areas with limited internet connectivity. 
                 Their voices are often missing from health surveys, policy research, and program evaluations.
               </p>
               <p className="text-muted-foreground leading-relaxed mb-4">
                 The Voice Research System was developed to bridge this gap. By leveraging voice calls 
                 and USSD technology — which work on any mobile phone — we enable researchers to collect 
                 high-quality data from hard-to-reach populations.
               </p>
               <p className="text-muted-foreground leading-relaxed">
                 Our AI-powered transcription and analysis tools then transform this data into actionable 
                 insights, while maintaining the highest standards of research ethics and data protection.
               </p>
             </FadeInSection>
           </div>
         </div>
       </section>
 
       {/* Values Section */}
       <section className="py-16 bg-muted/30">
         <div className="container">
           <FadeInSection>
             <h2 className="text-2xl font-bold text-foreground text-center mb-12">
               Our Values
             </h2>
           </FadeInSection>
           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {values.map((value, index) => (
               <FadeInSection key={value.title} delay={index * 0.1}>
                 <div className="bg-card border rounded-md p-6 text-center h-full">
                   <value.icon className="h-8 w-8 text-secondary mx-auto mb-4" />
                   <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                   <p className="text-sm text-muted-foreground">{value.description}</p>
                 </div>
               </FadeInSection>
             ))}
           </div>
         </div>
       </section>
 
       {/* Ethics Section */}
       <section className="py-16 md:py-24">
         <div className="container">
           <div className="grid md:grid-cols-2 gap-12 items-center">
             <FadeInSection delay={0.2} className="md:order-2">
               <img
                 src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
                 alt="Data security and ethics"
                 className="rounded-md w-full object-cover aspect-[4/3]"
               />
             </FadeInSection>
             <FadeInSection className="md:order-1">
               <h2 className="text-2xl font-bold text-foreground mb-4">
                 Commitment to Data Ethics
               </h2>
               <p className="text-muted-foreground leading-relaxed mb-4">
                 We understand that research data carries responsibility. Every feature in our platform 
                 is designed with ethical considerations at the forefront.
               </p>
               <ul className="space-y-3 text-sm text-muted-foreground">
                 <li className="flex items-start gap-3">
                   <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                   <span><strong className="text-foreground">Informed Consent:</strong> Built-in consent workflows ensure participants understand how their data will be used.</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                   <span><strong className="text-foreground">Data Minimization:</strong> Collect only what you need. Our tools support anonymization and data retention policies.</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                   <span><strong className="text-foreground">Secure Storage:</strong> End-to-end encryption and compliance with institutional data protection requirements.</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                   <span><strong className="text-foreground">Audit Trails:</strong> Complete transparency on data access and modifications for IRB compliance.</span>
                 </li>
               </ul>
             </FadeInSection>
           </div>
         </div>
       </section>
 
       {/* Partners Section */}
       <section className="py-16 bg-muted/30">
         <div className="container">
           <FadeInSection>
             <h2 className="text-2xl font-bold text-foreground text-center mb-4">
               Trusted by Research Institutions
             </h2>
             <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
               Universities, NGOs, and international organizations across Africa rely on our platform 
               for their field research needs.
             </p>
           </FadeInSection>
           <FadeInSection delay={0.2}>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {partners.map((partner) => (
                 <div key={partner} className="bg-card border rounded-md p-4 text-center">
                   <span className="text-sm font-medium text-muted-foreground">{partner}</span>
                 </div>
               ))}
             </div>
           </FadeInSection>
         </div>
       </section>
 
       {/* CTA */}
       <section className="py-16">
         <div className="container text-center">
           <FadeInSection>
             <h2 className="text-2xl font-bold text-foreground mb-4">
               Partner With Us
             </h2>
             <p className="text-muted-foreground max-w-xl mx-auto mb-8">
               Whether you're a university researcher, an NGO, or a government agency, 
               we'd love to discuss how our platform can support your work.
             </p>
             <Button size="lg" asChild>
               <Link to="/contact">
                 Get in Touch
                 <ArrowRight className="ml-2 h-4 w-4" />
               </Link>
             </Button>
           </FadeInSection>
         </div>
       </section>
     </div>
   );
 }