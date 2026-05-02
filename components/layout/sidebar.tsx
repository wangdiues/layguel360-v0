import Link from "next/link"
import { LayoutDashboard, FolderKanban, CheckSquare, FileText, User } from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
]

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r bg-white px-4 py-6 md:block">
      <div className="mb-8">
        <h1 className="text-xl font-bold tracking-tight">ལས་འགུལ་360</h1>
        <p className="text-sm text-muted-foreground">Project Management</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
