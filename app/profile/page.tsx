import { ProfileForm } from "@/components/profile/ProfileForm";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail } from "lucide-react";
import { mockUser, mockProjects, mockTasks } from "@/lib/mock-data";

export default function ProfilePage() {
  const activeProjects = mockProjects.filter((p) => p.status === "Active").length;
  const openTasks = mockTasks.filter((t) => t.status !== "Completed").length;
  const completedTasks = mockTasks.filter((t) => t.status === "Completed").length;

  const stats = [
    { label: "Active Projects", value: activeProjects },
    { label: "Open Tasks", value: openTasks },
    { label: "Completed Tasks", value: completedTasks },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="min-h-screen lg:pl-72">
        <Topbar />

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border">
                  <AvatarFallback className="bg-primary/20 text-xl font-semibold text-primary">
                    {mockUser.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    {mockUser.name}
                  </h1>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{mockUser.email}</span>
                  </div>
                  <div className="mt-3">
                    <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary hover:bg-primary/10">
                      {mockUser.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <ProfileForm
              defaultName={mockUser.name}
              defaultEmail={mockUser.email}
              defaultBio={mockUser.bio}
            />

            <div className="space-y-6">
              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.map((item, index) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-lg font-semibold">{item.value}</p>
                      </div>
                      {index !== stats.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {mockUser.role} — can create and manage projects, tasks,
                    comments, and documents.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
