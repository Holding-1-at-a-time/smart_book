import type React from "react"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { MainNav } from "@/components/layouts/main-nav"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await currentUser()

    if (!user) {
        redirect("/sign-in")
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center">
                    <MainNav />
                </div>
            </header>
            <main className="flex-1 container py-6">{children}</main>
        </div>
    )
}

