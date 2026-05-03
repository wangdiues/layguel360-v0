"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LockKeyhole, Mail, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 600);
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel: form */}
      <section className="flex flex-col items-center justify-center bg-card px-8 py-16 sm:px-16">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="mb-10 flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-border">
              <Image
                src="/logo.png"
                alt="ལས་འགུལ་360"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              ལས་འགུལ་360
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Create an account
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Join ལས་འགུལ་360 and start managing your work.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Full name
              </Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Karma Wangchuk"
                  className="pl-9 text-sm bg-background"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="karma@example.bt"
                  className="pl-9 text-sm bg-background"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="pl-9 text-sm bg-background"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
                  Confirm
                </Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm"
                    className="pl-9 text-sm bg-background"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* Right panel: brand showcase */}
      <section
        className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between"
        style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #0f1014 50%, #13131a 100%)" }}
      >
        {/* Decorative rings */}
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-96 w-96 rounded-full border border-primary/5 bg-primary/[0.02]"
        />
        <div
          aria-hidden="true"
          className="absolute -left-10 bottom-10 h-64 w-64 rounded-full border border-primary/10 bg-primary/[0.03]"
        />

        <div className="relative z-10 flex h-full flex-col justify-between px-14 py-16">
          <div>
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Built for real work
            </p>

            <h2 className="max-w-xs text-5xl font-bold leading-[1.1] tracking-tight text-foreground">
              Built for teams
              <br />
              that get{" "}
              <span className="text-primary">things</span>
              <br />
              done.
            </h2>

            <div className="my-10 h-px w-12 bg-border" />

            <ul className="space-y-4">
              {[
                "Set up projects in minutes",
                "Assign tasks to your team",
                "See progress at a glance",
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-base leading-snug text-muted-foreground">
                    {feat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs tracking-wide text-muted-foreground">
            ལས་འགུལ་360 &mdash; Version 0 &bull; Static Preview
          </p>
        </div>
      </section>
    </main>
  );
}
