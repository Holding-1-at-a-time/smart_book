"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/clerk-react"

const routes = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Book Appointment",
        href: "/book",
    },
    {
        label: "My Appointments",
        href: "/appointments",
    },
    {
        label: "Services",
        href: "/services",
    },
    {
        label: "Chat with AI",
        href: "/chat",
    },
]

export function MainNav() {
    const pathname = usePathname()

    return (
        <div className="flex items-center space-x-4 lg:space-x-6">
            {routes.map((route) => (
                <Button
                    key={route.href}
                    variant="ghost"
                    asChild
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === route.href ? "text-primary" : "text-muted-foreground",
                    )}
                >
                    <Link href={route.href}>{route.label}</Link>
                </Button>
            ))}
            <div className="ml-auto">
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    )
}

