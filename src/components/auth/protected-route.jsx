import { useAuth } from "@/contexts/use-auth";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center text-zinc-300">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return children;
  }

  if (user && !user.is_verified) {
    return children;
  }

  return children;
}
