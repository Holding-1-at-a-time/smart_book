import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
    return (
        <SignUp
            appearance={{
                elements: {
                    rootBox: "mx-auto",
                    card: "bg-background border-border",
                    headerTitle: "text-foreground",
                    headerSubtitle: "text-muted-foreground",
                    socialButtonsBlockButton: "bg-muted text-foreground border-border",
                    socialButtonsBlockButtonText: "text-foreground",
                    dividerLine: "bg-border",
                    dividerText: "text-muted-foreground",
                    formFieldLabel: "text-foreground",
                    formFieldInput: "bg-background border-input text-foreground",
                    footerActionLink: "text-primary hover:text-primary",
                    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                },
            }}
        />
    )
}

