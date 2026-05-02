import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Track projects, tasks, and progress</p>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search..."
          className="hidden w-64 md:block"
        />
        <Avatar>
          <AvatarFallback>W</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
