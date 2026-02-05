 import { motion } from "framer-motion";
 import { ReactNode } from "react";
 
 interface FadeInSectionProps {
   children: ReactNode;
   className?: string;
   delay?: number;
 }
 
 export function FadeInSection({ children, className, delay = 0 }: FadeInSectionProps) {
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true, margin: "-50px" }}
       transition={{ duration: 0.6, delay, ease: "easeOut" }}
       className={className}
     >
       {children}
     </motion.div>
   );
 }