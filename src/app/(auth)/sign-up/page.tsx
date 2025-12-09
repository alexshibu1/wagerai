import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { signUpAction } from "@/app/actions";
import { UrlProvider } from "@/components/url-provider";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 relative bg-[#030014]">
      {/* Grainy texture overlay - match landing page */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-soft-light pointer-events-none" />
      
      {/* Ambient glow effects - emerald/teal theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl" />
      </div>

      {/* Glass Card Container */}
      <div className="relative w-full max-w-md p-10 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white uppercase tracking-tighter mb-3">
            Sign Up
          </h1>
          <p className="text-sm text-zinc-400">
            Start tracking what matters.
          </p>
        </div>

        {/* Form */}
        <UrlProvider>
          <form className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label htmlFor="full_name" className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white pl-12 pr-4 py-4 
                           focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 
                           transition-all duration-300 placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white pl-12 pr-4 py-4 
                           focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 
                           transition-all duration-300 placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••••••"
                  minLength={6}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white pl-12 pr-4 py-4 
                           focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 
                           transition-all duration-300 placeholder:text-zinc-600"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1 pl-1">Minimum 6 characters</p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <SubmitButton
                formAction={signUpAction}
                pendingText="Creating account..."
                className="w-full py-4 text-sm font-bold uppercase tracking-wider
                         bg-white text-black
                         hover:bg-zinc-100
                         border-0 rounded-xl transition-all duration-300"
              >
                Sign Up
              </SubmitButton>
            </div>

            <FormMessage message={searchParams} />
          </form>
        </UrlProvider>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
