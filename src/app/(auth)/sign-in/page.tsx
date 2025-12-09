import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { GlassCard } from "@/components/ui/glass-card";
import { Lock, Mail } from "lucide-react";
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
      {/* Centered Glass Card */}
      <GlassCard className="w-full max-w-md p-10">
        {/* Logo Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <Lock className="w-7 h-7 text-slate-950" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sign in to WAGER</h1>
          <p className="text-sm text-zinc-400">
            New to the workspace?{" "}
            <Link
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              href="/sign-up"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="label-text text-xs">
              WORK EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@studio.dev"
                required
                className="w-full bg-transparent border-0 border-b border-white/20 text-white pl-12 pr-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="label-text text-xs">
                PASSWORD
              </label>
              <Link
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                href="/forgot-password"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                className="w-full bg-transparent border-0 border-b border-white/20 text-white pl-12 pr-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <SubmitButton
              className="w-full py-4 text-base"
              pendingText="Signing in..."
              formAction={signInAction}
            >
              Continue to dashboard
            </SubmitButton>
          </div>

          <FormMessage message={message} />
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-950 px-3 text-zinc-600">OR</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            className="h-12 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
          >
            <span className="text-emerald-400 text-xl font-bold">G</span>
          </button>
          <button
            type="button"
            className="h-12 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
          >
            <span className="text-white text-xl font-bold">🍎</span>
          </button>
          <button
            type="button"
            className="h-12 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
          >
            <span className="text-white text-xl font-bold">🐙</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-500">
            By continuing, you agree to the WAGER{" "}
            <Link href="/terms" className="text-zinc-400 hover:text-zinc-300 underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-zinc-400 hover:text-zinc-300 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
