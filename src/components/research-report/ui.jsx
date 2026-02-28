import { Package } from "lucide-react";

export function Tag({ children, variant = "default" }) {
  const variants = {
    default: "bg-zinc-800/60 text-zinc-300 border-zinc-700",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    primary: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export function ListItem({ children, icon: Icon, className = "" }) {
  return (
    <li className={`flex items-start gap-3 text-zinc-300 ${className}`}>
      {Icon ? (
        <div className="mt-1 p-1 rounded bg-zinc-800/50">
          <Icon className="w-3.5 h-3.5 text-zinc-400" />
        </div>
      ) : (
        <span className="w-1.5 h-1.5 mt-2.5 rounded-full bg-zinc-500 flex-shrink-0" />
      )}
      <span className="text-sm leading-relaxed">{children}</span>
    </li>
  );
}

export function NoData({ message = "No data available for this section." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
      <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
        <Package className="w-6 h-6 text-zinc-600" />
      </div>
      <p className="text-zinc-400 text-sm">{message}</p>
    </div>
  );
}
