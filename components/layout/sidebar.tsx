"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FolderKanban, CheckSquare, FileText, User, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
]

function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onLinkClick}
            className={
              isActive
                ? "flex items-center gap-3 rounded-lg border-l-2 border-indigo-600 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700"
                : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarBranding() {
  return (
    <div className="mb-8">
      <h1 className="text-xl font-bold tracking-tight">ལས་འགུལ་360</h1>
      <p className="text-sm text-muted-foreground">Project Management</p>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar — fixed on the left, hidden below lg */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-white px-4 py-6 lg:block">
        <SidebarBranding />
        <NavLinks />
      </aside>

      {/* Mobile hamburger button — visible only below lg */}
      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64 px-4 py-6">
            <SidebarBranding />
            <NavLinks onLinkClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
