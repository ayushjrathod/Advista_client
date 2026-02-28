import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

export function ResearchReportSidebar({
  navItems,
  activeSection,
  onSectionChange,
  onClose,
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center gap-2 px-2 mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-zinc-400 hover:text-white"
            onClick={onClose}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-bold text-xl bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
            Advista
          </span>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                  ${isActive ? "text-violet-400" : "text-zinc-400 hover:text-zinc-200"}
                `}
              >
                {isActive && (
                  <Motion.div
                    layoutId="active-sidebar-item"
                    className="absolute inset-0 bg-violet-500/10 border border-violet-500/20 rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-violet-400" : "text-zinc-500"}`} />
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-zinc-800 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            onClick={() => navigate("/chat")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chat
          </Button>
        </div>
      </div>
    </>
  );
}
