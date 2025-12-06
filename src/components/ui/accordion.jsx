import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

export function Accordion({ children, className }) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}

export function AccordionItem({ children, className }) {
  return (
    <div className={cn("border border-zinc-800/50 rounded-xl overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function AccordionTrigger({ children, isOpen, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-4 text-left transition-colors",
        "hover:bg-zinc-800/30 cursor-pointer",
        isOpen && "bg-zinc-800/20",
        className
      )}
    >
      <span className="font-medium">{children}</span>
      {isOpen ? (
        <ChevronDown className="w-5 h-5 text-zinc-400 transition-transform" />
      ) : (
        <ChevronRight className="w-5 h-5 text-zinc-400 transition-transform" />
      )}
    </button>
  );
}

export function AccordionContent({ children, isOpen, className }) {
  if (!isOpen) return null;
  
  return (
    <div className={cn("px-4 pb-4 pt-2 border-t border-zinc-800/30", className)}>
      {children}
    </div>
  );
}
