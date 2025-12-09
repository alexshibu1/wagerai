import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Lock, Mail, Focus } from "lucide-react";
import Link from "next/link";

interface LoginProps {
  searchParams: Promise<Message>;
}

export default async function SignInPage({ searchParams }: LoginProps) {
  const message = await searchParams;

  if ("message" in message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 relative">
      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      {/* Glass Card Container */}
      <div className="relative w-full max-w-md p-10 bg-slate-950/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-indigo-900/20">
        {/* Focus Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Focus className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-white uppercase tracking-widest mb-3">
            Enter Focus Mode
          </h1>
          <p className="text-sm text-white/50 tracking-wide">
            Sign in to start your deep work session.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-medium text-white/40 uppercase tracking-widest">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white pl-12 pr-4 py-4 
                         focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 
                         transition-all duration-300 placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-medium text-white/40 uppercase tracking-widest">
                Password
              </label>
              <Link
                className="text-xs text-teal-400/70 hover:text-teal-300 transition-colors uppercase tracking-wider"
                href="/forgot-password"
              >
                Reset
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white pl-12 pr-4 py-4 
                         focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 
                         transition-all duration-300 placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <SubmitButton
              className="w-full py-4 text-sm font-bold uppercase tracking-widest
                       bg-gradient-to-r from-indigo-600 to-teal-500 
                       hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] 
                       border-0 rounded-xl transition-all duration-300"
              pendingText="Signing in..."
              formAction={signInAction}
            >
              Start Focusing
            </SubmitButton>
          </div>

          <FormMessage message={message} />
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-slate-950/50 backdrop-blur-sm px-4 text-white/20">Or continue with</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            className="h-12 rounded-xl bg-white/5 border border-white/10 
                     hover:bg-white/10 hover:border-indigo-500/30
                     transition-all duration-300 flex items-center justify-center group"
          >
            <svg className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
          <button
            type="button"
            className="h-12 rounded-xl bg-white/5 border border-white/10 
                     hover:bg-white/10 hover:border-indigo-500/30
                     transition-all duration-300 flex items-center justify-center group"
          >
            <svg className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </button>
          <button
            type="button"
            className="h-12 rounded-xl bg-white/5 border border-white/10 
                     hover:bg-white/10 hover:border-indigo-500/30
                     transition-all duration-300 flex items-center justify-center group"
          >
            <svg className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center space-y-4">
          <p className="text-xs text-white/30 tracking-wide">
            By continuing, you agree to the{" "}
            <Link href="/terms" className="text-indigo-400/60 hover:text-indigo-300 underline underline-offset-2 transition-colors">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-indigo-400/60 hover:text-indigo-300 underline underline-offset-2 transition-colors">
              Privacy Policy
            </Link>
          </p>
          
          <p className="text-sm text-white/40">
            New here?{" "}
            <Link
              className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
              href="/sign-up"
            >
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
