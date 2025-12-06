import { login } from "@/actions/admin/auth";
import { errorToast, successToast } from "@/lib/toast";
import { AdminPanelComponentProps } from "@/lib/types/admin";
import { ArrowRight, Lock, Mail, Shield, User } from "lucide-react";
import { useState, useTransition } from "react";

function Login({}: AdminPanelComponentProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onLogin();
  }

  async function onLogin() {
    startTransition(async () => {
      try {
        const result = await login({ username, password });

        if (result && !result.success) {
          const errorMessage =
            // @ts-ignore
            (result.errors?.general as string) ||
            "Login failed. Please check your credentials.";
          errorToast(errorMessage);
        } else {
          successToast("Login successful!");
        }
      } catch (error) {
        const errorMessage = "An unexpected error occurred. Please try again.";
        // errorToast(errorMessage);
        console.error("Login error:", error);
      }
    });
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden text-foreground font-sans transition-colors duration-300">
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-primary/10 blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[150px]"></div>
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10 animate-scale-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow border border-primary/20 backdrop-blur-md">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1 sm:mb-2 text-foreground">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Sign in to the Super Admin Control Tower
          </p>
        </div>

        <div className="bg-card/60 backdrop-blur-2xl border border-border/50 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Username
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-muted/30 border border-border/50 rounded-lg pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                  placeholder="craigktb"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-muted/30 border border-border/50 rounded-lg pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div />
              <a
                href="#"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full font-semibold py-3 rounded-lg flex items-center justify-center gap-2 group relative overflow-hidden bg-lapis hover:bg-lapis-hover dark:bg-sky-600 dark:hover:bg-sky-500 shadow-lg shadow-lapis/20 dark:shadow-sky-500/20 transition-all mt-2 text-white cursor-pointer"
            >
              {isPending ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          &copy; {new Date().getFullYear()} Tangapano Inc. Restricted Access.
        </p>
      </div>
    </div>
  );
}

export default Login;
