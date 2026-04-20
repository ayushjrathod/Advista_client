import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, History, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccountMenu({ user, logout }) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex items-center rounded-full border border-white/10 bg-white/7 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/12">
          <User size={16} className="mr-2" />
          <span className="hidden max-w-[140px] truncate sm:inline">{user?.email?.split("@")[0] || "Account"}</span>
          <ChevronDown size={14} className="ml-1.5" />
          <span className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-400/80 to-transparent" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-4 w-56 border border-white/10 bg-[#0B0B0F]/95 text-white backdrop-blur-xl" align="end">
        <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/history")} className="cursor-pointer text-white hover:bg-white/8 focus:bg-white/8">
            <History className="mr-2 h-4 w-4" />
            <span>Research History</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-red-400 hover:bg-white/8 focus:bg-white/8 hover:text-red-300 focus:text-red-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
