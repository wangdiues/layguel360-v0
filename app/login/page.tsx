"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FolderKanban, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-12">
          <Card className="w-full max-w-md rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <FolderKanban className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">
                  ལས་འགུལ་360
                </CardTitle>
                <p className="mt-2 text-sm text-slate-500">
                  Sign in to manage projects, tasks, milestones, and team
                  coordination.
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="karma@example.bt"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>

                <p className="text-center text-sm text-slate-500">
                  Do not have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Create account
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
              <ShieldCheck className="h-4 w-4" />
              Project coordination workspace
            </div>

            <div className="mt-10 max-w-xl">
              <h1 className="text-4xl font-semibold tracking-tight">
                Manage public-sector projects with clarity and accountability.
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-300">
                Track projects, tasks, deadlines, comments, attachments, and
                progress notes from one clean dashboard.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-medium">ལས་འགུལ་360</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                A project management platform for planning, tracking, and
                coordinating work across teams and departments.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
