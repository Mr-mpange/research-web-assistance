 import { Link } from "react-router-dom";
 
 export function PublicFooter() {
   return (
     <footer className="border-t bg-muted/30">
       <div className="container py-12">
         <div className="grid gap-8 md:grid-cols-4">
           <div className="space-y-4">
             <div className="flex items-center gap-2">
               <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
                 VR
               </div>
               <span className="font-semibold text-foreground">
                 Voice Research System
               </span>
             </div>
             <p className="text-sm text-muted-foreground leading-relaxed">
               AI-powered voice and USSD research platform for academic institutions and NGOs conducting field research across Africa.
             </p>
           </div>
 
           <div>
             <h4 className="font-semibold text-foreground mb-4">Platform</h4>
             <ul className="space-y-2 text-sm">
               <li>
                 <Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">
                   Features
                 </Link>
               </li>
               <li>
                 <Link to="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                   How It Works
                 </Link>
               </li>
               <li>
                 <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                   About Us
                 </Link>
               </li>
             </ul>
           </div>
 
           <div>
             <h4 className="font-semibold text-foreground mb-4">Resources</h4>
             <ul className="space-y-2 text-sm">
               <li>
                 <Link to="/documentation" className="text-muted-foreground hover:text-primary transition-colors">
                   Documentation
                 </Link>
               </li>
               <li>
                 <Link to="/case-studies" className="text-muted-foreground hover:text-primary transition-colors">
                   Case Studies
                 </Link>
               </li>
               <li>
                 <Link to="/support" className="text-muted-foreground hover:text-primary transition-colors">
                   Support
                 </Link>
               </li>
             </ul>
           </div>
 
           <div>
             <h4 className="font-semibold text-foreground mb-4">Legal</h4>
             <ul className="space-y-2 text-sm">
               <li>
                 <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                   Privacy Policy
                 </Link>
               </li>
               <li>
                 <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                   Terms of Service
                 </Link>
               </li>
               <li>
                 <Link to="/data-ethics" className="text-muted-foreground hover:text-primary transition-colors">
                   Data Ethics
                 </Link>
               </li>
             </ul>
           </div>
         </div>
 
         <div className="mt-10 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-xs text-muted-foreground">
             © {new Date().getFullYear()} Voice Research System. Built for ethical research.
           </p>
           <p className="text-xs text-muted-foreground">
             Powered by Africa's Talking API
           </p>
         </div>
       </div>
     </footer>
   );
 }