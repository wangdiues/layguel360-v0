"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserRound } from "lucide-react";

type Props = {
  defaultName: string;
  defaultEmail: string;
  defaultBio: string;
};

export function ProfileForm({ defaultName, defaultEmail, defaultBio }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 600);
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UserRound className="h-4 w-4" />
          Profile Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" name="full_name" defaultValue={defaultName} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={defaultEmail}
                disabled
                className="opacity-60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={defaultBio}
              className="min-h-32 resize-none"
              placeholder="A short description about yourself"
            />
          </div>

          {success && (
            <p className="rounded-lg bg-indigo-50 px-4 py-2 text-sm text-indigo-700">
              Profile updated successfully.
            </p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
