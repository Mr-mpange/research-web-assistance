import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FadeInSection } from "@/components/public/FadeInSection";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const planMessages: Record<string, string> = {
  academic: "I'm interested in the Academic plan for my university research project.",
  institution: "I'm interested in the Research Institution plan for our organization.",
  enterprise: "I'm interested in the Enterprise plan for our large-scale program.",
};

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan && planMessages[plan]) {
      setFormData((prev) => ({
        ...prev,
        message: planMessages[plan],
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: formData,
      });

      if (error) throw error;

      toast.success("Thank you for your message. We'll be in touch soon.");
      setFormData({ name: "", email: "", organization: "", message: "" });
    } catch (error: any) {
      console.error("Error sending contact form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
   return (
     <div>
       {/* Header */}
       <section className="bg-muted/30 border-b">
         <div className="container py-16">
           <FadeInSection>
             <div className="max-w-2xl">
               <p className="text-sm font-medium text-secondary uppercase tracking-wide mb-3">
                 Contact Us
               </p>
               <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                 Get in Touch
               </h1>
               <p className="text-muted-foreground leading-relaxed">
                 Interested in using the Voice Research System for your next study? 
                 Reach out to discuss your research needs.
               </p>
             </div>
           </FadeInSection>
         </div>
       </section>
 
       {/* Contact Form + Info */}
       <section className="py-16 md:py-24">
         <div className="container">
           <div className="grid md:grid-cols-2 gap-12">
             {/* Contact Form */}
             <FadeInSection>
               <div className="bg-card border rounded-md p-6 md:p-8">
                 <h2 className="text-xl font-semibold text-foreground mb-6">
                   Request a Demo
                 </h2>
                 <form onSubmit={handleSubmit} className="space-y-4">
                   <div className="space-y-2">
                     <Label htmlFor="name">Full Name</Label>
                     <Input
                       id="name"
                       placeholder="Dr. Amina Osei"
                       value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       required
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="email">Email Address</Label>
                     <Input
                       id="email"
                       type="email"
                       placeholder="you@university.ac.ke"
                       value={formData.email}
                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                       required
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="organization">Organization</Label>
                     <Input
                       id="organization"
                       placeholder="University of Nairobi"
                       value={formData.organization}
                       onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="message">Tell us about your research needs</Label>
                     <Textarea
                       id="message"
                       placeholder="Describe your study, target population, and timeline..."
                       rows={5}
                       value={formData.message}
                       onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                       required
                     />
                   </div>
                   <Button type="submit" className="w-full" disabled={loading}>
                     {loading ? (
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     ) : (
                       <Send className="mr-2 h-4 w-4" />
                     )}
                     Send Message
                   </Button>
                 </form>
               </div>
             </FadeInSection>
 
             {/* Contact Info */}
             <FadeInSection delay={0.2}>
               <div className="space-y-8">
                 <div>
                   <h2 className="text-xl font-semibold text-foreground mb-4">
                     Contact Information
                   </h2>
                   <p className="text-muted-foreground leading-relaxed">
                     Our team is based in Nairobi with partners across East Africa. 
                     We're happy to schedule a call or video meeting at your convenience.
                   </p>
                 </div>
 
                 <div className="space-y-4">
                   <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                       <Mail className="h-4 w-4 text-muted-foreground" />
                     </div>
                     <div>
                       <p className="font-medium text-foreground">Email</p>
                       <p className="text-sm text-muted-foreground">research@voiceresearch.org</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                       <Phone className="h-4 w-4 text-muted-foreground" />
                     </div>
                     <div>
                       <p className="font-medium text-foreground">Phone</p>
                       <p className="text-sm text-muted-foreground">+254 700 123 456</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                       <MapPin className="h-4 w-4 text-muted-foreground" />
                     </div>
                     <div>
                       <p className="font-medium text-foreground">Office</p>
                       <p className="text-sm text-muted-foreground">
                         Research Hub, Chiromo Campus<br />
                         University of Nairobi<br />
                         Nairobi, Kenya
                       </p>
                     </div>
                   </div>
                 </div>
 
                 <div className="bg-muted/50 rounded-md p-6">
                   <h3 className="font-medium text-foreground mb-2">Office Hours</h3>
                   <p className="text-sm text-muted-foreground">
                     Monday – Friday: 8:00 AM – 5:00 PM (EAT)<br />
                     Weekend demos by appointment
                   </p>
                 </div>
               </div>
             </FadeInSection>
           </div>
         </div>
       </section>
     </div>
   );
 }