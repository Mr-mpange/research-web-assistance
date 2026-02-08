 import { useState } from "react";
 import { Link, useLocation } from "react-router-dom";
 import { Menu, X } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { cn } from "@/lib/utils";
 
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];
 
 export function PublicHeader() {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const location = useLocation();
 
   return (
     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
       <div className="container flex h-16 items-center justify-between">
         <Link to="/" className="flex items-center gap-2">
           <div className="flex h-9 w-9 items-center justify-center rounded bg-primary text-primary-foreground text-sm font-bold">
             VR
           </div>
           <span className="hidden font-semibold text-foreground sm:inline-block">
             Voice Research System
           </span>
         </Link>
 
         {/* Desktop Navigation */}
         <nav className="hidden md:flex items-center gap-6">
           {navLinks.map((link) => (
             <Link
               key={link.href}
               to={link.href}
               className={cn(
                 "text-sm font-medium transition-colors hover:text-primary",
                 location.pathname === link.href
                   ? "text-primary"
                   : "text-muted-foreground"
               )}
             >
               {link.label}
             </Link>
           ))}
         </nav>
 
         <div className="hidden md:flex items-center gap-3">
           <Button variant="ghost" asChild>
             <Link to="/auth">Researcher Login</Link>
           </Button>
           <Button asChild>
             <Link to="/contact">Request Demo</Link>
           </Button>
         </div>
 
         {/* Mobile Menu Toggle */}
         <button
           className="md:hidden p-2"
           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
           aria-label="Toggle menu"
         >
           {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
         </button>
       </div>
 
       {/* Mobile Navigation */}
       {mobileMenuOpen && (
         <div className="md:hidden border-t bg-background">
           <nav className="container py-4 flex flex-col gap-3">
             {navLinks.map((link) => (
               <Link
                 key={link.href}
                 to={link.href}
                 onClick={() => setMobileMenuOpen(false)}
                 className={cn(
                   "text-sm font-medium py-2 transition-colors hover:text-primary",
                   location.pathname === link.href
                     ? "text-primary"
                     : "text-muted-foreground"
                 )}
               >
                 {link.label}
               </Link>
             ))}
             <div className="flex flex-col gap-2 pt-3 border-t">
               <Button variant="ghost" asChild className="justify-start">
                 <Link to="/auth">Researcher Login</Link>
               </Button>
               <Button asChild>
                 <Link to="/contact">Request Demo</Link>
               </Button>
             </div>
           </nav>
         </div>
       )}
     </header>
   );
 }