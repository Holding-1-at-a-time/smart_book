
import { CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Car, Calendar, MessageSquare, Shield } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-4 lg:px-6 h-16 flex items-center">
                <Link href="/" className="flex items-center justify-center">
                    <Car className="h-6 w-6 text-primary" />
                    <span className="ml-2 text-xl font-bold">AutoDetailPro</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
                        Features
                    </Link>
                    <Link href="#services" className="text-sm font-medium hover:underline underline-offset-4">
                        Services
                    </Link>
                    <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
                        Testimonials
                    </Link>
                    <Link href="/sign-in" className="text-sm font-medium hover:underline underline-offset-4">
                        Sign In
                    </Link>
                </nav>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-primary/10">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        Professional Auto Detailing Made Simple
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Book your appointment online, get AI-powered recommendations, and enjoy a spotless vehicle. Our
                                        advanced scheduling system makes car care effortless.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Button asChild size="lg" className="gap-1">
                                        <Link href="/sign-up">
                                            Get Started
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link href="#services">View Services</Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <Image
                                    src="/placeholder.svg?height=550&width=550"
                                    alt="Car Detailing"
                                    className="rounded-lg object-cover"
                                    width={550}
                                    height={550}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                                    Features
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">AI-Powered Auto Detailing</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                    Our platform combines cutting-edge AI with professional detailing services to give you the best
                                    experience
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
                            <Card>
                                <CardHeader>
                                    <Calendar className="h-6 w-6 text-primary mb-2" />
                                    <CardTitle>Smart Scheduling</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Book appointments with our intelligent calendar system that recommends the best times based on your
                                        preferences.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <MessageSquare className="h-6 w-6 text-primary mb-2" />
                                    <CardTitle>AI Assistant</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Get personalized service recommendations and answers to your questions from our Llama 3.2-powered AI
                                        assistant.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Shield className="h-6 w-6 text-primary mb-2" />
                                    <CardTitle>Secure & Reliable</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Your data is protected with enterprise-grade security, and our real-time updates ensure you&apos;re
                                        always informed.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                                    Services
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Detailing Packages</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                    Professional auto detailing services tailored to your vehicle&apos;s needs
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Wash & Vacuum</CardTitle>
                                    <CardDescription>$50 • 1 hour</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Exterior hand wash</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Interior vacuum</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Tire and wheel cleaning</span>
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href="/sign-up">Book Now</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                            <Card className="border-primary">
                                <CardHeader>
                                    <CardTitle>Full Detail</CardTitle>
                                    <CardDescription>$250 • 3 hours</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Complete interior detailing</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Exterior wash and wax</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Engine bay cleaning</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Leather conditioning</span>
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href="/sign-up">Book Now</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ceramic Coating</CardTitle>
                                    <CardDescription>$500 • 5 hours</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Paint correction</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Professional ceramic coating</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Interior protection</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>12-month warranty</span>
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href="/sign-up">Book Now</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>

                <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-background">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                                    Testimonials
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">What Our Customers Say</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                    Don&apos;t just take our word for it - hear from our satisfied customers
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <Image
                                                src="/placeholder.svg?height=40&width=40"
                                                alt="Avatar"
                                                className="rounded-full"
                                                width={40}
                                                height={40}
                                            />
                                            <div>
                                                <p className="text-sm font-medium">Sarah Johnson</p>
                                                <p className="text-xs text-muted-foreground">Tesla Model 3 Owner</p>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground">
                                            &quot;The AI assistant recommended the perfect detailing package for my car. The scheduling was
                                            seamless, and my car looks amazing!&quot;
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <Image                                                src="/placeholder.svg?height=40&width=40"
                                                alt="Avatar"
                                                className="rounded-full"
                                                width={40}
                                                height={40}
                                            />
                                            <div>
                                                <p className="text-sm font-medium">Michael Chen</p>
                                                <p className="text-xs text-muted-foreground">BMW X5 Owner</p>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground">
                                            &quot;I love how easy it is to book appointments and manage my schedule. The ceramic coating service
                                            was top-notch and worth every penny.&quot;
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <Image
                                                src="/placeholder.svg?height=40&width=40"
                                                alt="Avatar"
                                                className="rounded-full"
                                                width={40}
                                                height={40}
                                            />
                                            <div>
                                                <p className="text-sm font-medium">Jessica Martinez</p>
                                                <p className="text-xs text-muted-foreground">Honda Accord Owner</p>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground">
                                            &quot;The DetailBot AI assistant answered all my questions and helped me choose the right service. My
                                            car hasn&apos;t looked this good since I bought it!&quot;
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Transform Your Vehicle?</h2>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                    Join thousands of satisfied customers who trust our AI-powered detailing services
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Button asChild size="lg" className="gap-1">
                                    <Link href="/sign-up">
                                        Get Started Today
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} AutoDetailPro. All rights reserved.
                </p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link href="#" className="text-xs hover:underline underline-offset-4">
                        Terms of Service
                    </Link>
                    <Link href="#" className="text-xs hover:underline underline-offset-4">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    )
}

