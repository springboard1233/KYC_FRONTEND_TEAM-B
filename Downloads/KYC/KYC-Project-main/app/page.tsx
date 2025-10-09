import Link from "next/link"
import { Shield, Lock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8 max-w-4xl">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl glass neon-glow">
              <Shield className="w-16 h-16 text-primary" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-balance">
              AI-Powered <span className="neon-text text-primary">KYC Fraud</span> Detection
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance">
              Advanced document verification and fraud risk analysis powered by artificial intelligence
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto neon-glow">
                <Users className="mr-2 h-5 w-5" />
                User Portal
              </Button>
            </Link>
            <Link href="/admin-login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto glass bg-transparent">
                <Lock className="mr-2 h-5 w-5" />
                Admin Portal
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <div className="glass p-6 rounded-xl space-y-2">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">OCR Extraction</h3>
              <p className="text-sm text-muted-foreground">
                Automatically extract data from Aadhaar, PAN, and Driving License documents
              </p>
            </div>

            <div className="glass p-6 rounded-xl space-y-2">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold">Fraud Detection</h3>
              <p className="text-sm text-muted-foreground">
                Real-time fraud risk analysis with confidence scores and alerts
              </p>
            </div>

            <div className="glass p-6 rounded-xl space-y-2">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">Admin Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive review system with approval workflows and audit trails
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
