"use client";

import { useState, useTransition } from "react";
import { UserRound } from "lucide-react";

import { updateProfile } from "@/app/profile/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  defaultName: string;
  defaultEmail: string;
  defaultRole: string;
  defaultDepartment: string;
  defaultBio: string;
};

export function ProfileForm({
  defaultName,
  defaultEmail,
  defaultRole,
  defaultDepartment,
  defaultBio,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.ok === false) {
        setError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }
      setSuccess(true);
    });
  }

  return (
    <Card>
      <CardHeader className="border-b border-white/[0.08] pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <UserRound className="h-4 w-4 text-primary" />
          Profile Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" name="full_name" defaultValue={defaultName} required />
              {fieldErrors.full_name?.[0] && (
                <p className="text-xs text-destructive">{fieldErrors.full_name[0]}</p>
              )}
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
              <p className="text-xs text-muted-foreground">
                Email is managed through your sign-in provider.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                defaultValue={defaultRole}
                placeholder="e.g. Project Manager"
              />
              {fieldErrors.role?.[0] && (
                <p className="text-xs text-destructive">{fieldErrors.role[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                defaultValue={defaultDepartment}
                placeholder="e.g. Department of Forests"
              />
              {fieldErrors.department?.[0] && (
                <p className="text-xs text-destructive">{fieldErrors.department[0]}</p>
              )}
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
            {fieldErrors.bio?.[0] && (
              <p className="text-xs text-destructive">{fieldErrors.bio[0]}</p>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary"
            >
              Profile updated successfully.
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
