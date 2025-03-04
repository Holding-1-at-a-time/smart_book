"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, DollarSign } from "lucide-react"

export default function ServicesPage() {
    const services = useQuery(api.services.getAllServices) || []

    // Group services by category
    const servicesByCategory = services.reduce(
        (acc, service) => {
            if (!acc[service.category]) {
                acc[service.category] = []
            }
            acc[service.category].push(service)
            return acc
        },
        {} as Record<string, typeof services>,
    )

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Our Services</h1>
                <p className="text-muted-foreground mt-2">Explore our range of professional auto detailing services</p>
            </div>

            {Object.entries(servicesByCategory).map(([category, services]) => (
                <div key={category} className="space-y-4">
                    <h2 className="text-2xl font-semibold capitalize">{category} Detailing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((service) => (
                            <Card key={service._id} className="overflow-hidden">
                                {service.imageUrl && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={service.imageUrl || "/placeholder.svg"}
                                            alt={service.name}
                                            className="w-full h-full object-cover transition-transform hover:scale-105"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle>{service.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />${service.price}
                                        <span className="mx-2">•</span>
                                        <Clock className="h-4 w-4" />
                                        {service.duration} min
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{service.description}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href="/book">Book Now</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

