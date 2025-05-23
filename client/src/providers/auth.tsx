import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";
import { authMeOptions } from "@/api/queries/authOptions";
import { postLogin } from "@/api/services/postLogin";
import { getToken, setToken, clearToken } from "@/lib/token";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthCtx {
  user?: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ token: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();

  const session = useQuery({
    ...authMeOptions(),
    enabled: !!getToken(),
    retry: false,
    staleTime: 5 * 60_000,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      postLogin({ email, password }),
    onSuccess: ({ token }) => {
      setToken(token);
      qc.invalidateQueries({ queryKey: authMeOptions().queryKey });
    },
    onError: () => {
      toast.error("Zaloguj się ponownie, coś poszło nie tak");
    },
  });

  const logout = () => {
    clearToken();
    qc.resetQueries();
    toast.success("Pomyślnie wylogowano");
  };

  const value: AuthCtx = {
    user: session.data,
    isAuthenticated: !!session.data,
    login: (e, p) => loginMutation.mutateAsync({ email: e, password: p }),
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
