"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FolderKanban, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 600);
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* ── Left panel: form ── */}
      <section className="flex flex-col items-center justify-center bg-white px-8 py-16 sm:px-16">
        <div className="w-full max-w-sm">
          {/* Brand mark */}
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <FolderKanban className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              ལས་འགུལ་360
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to continue to your workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email address
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="karma@example.bt"
                  className="pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500"
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </section>

      {/* ── Right panel: brand ── */}
      <section
        className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between"
        style={{ backgroundColor: "#0B0F1A" }}
      >
        {/* Decorative rings */}
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-96 w-96 rounded-full border border-white/5 bg-white/[0.02]"
        />
        <div
          aria-hidden="true"
          className="absolute -left-10 bottom-10 h-64 w-64 rounded-full border border-indigo-600/10 bg-indigo-600/[0.03]"
        />

        {/* Inner content — sits above the rings */}
        <div className="relative z-10 flex h-full flex-col justify-between px-14 py-16">
          {/* Top: tagline block */}
          <div>
            {/* Overline label */}
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Project Intelligence Platform
            </p>

            {/* Large headline — intentionally mixed sizing */}
            <h2 className="max-w-xs text-5xl font-bold leading-[1.1] tracking-tight text-white">
              One platform.
              <br />
              <span className="text-indigo-400">Every</span> project.
              <br />
              Full clarity.
            </h2>

            {/* Separator */}
            <div className="my-10 h-px w-12 bg-white/10" />

            {/* Feature list */}
            <ul className="space-y-4">
              {[
                "Track projects end to end",
                "Manage tasks and deadlines",
                "Coordinate teams with ease",
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  <span className="text-base leading-snug text-slate-300">
                    {feat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom: version descriptor */}
          <p className="text-xs tracking-wide text-slate-600">
            ལས་འགུལ་360 &mdash; Version 0 &bull; Static Preview
          </p>
        </div>
      </section>
    </main>
  );
}
