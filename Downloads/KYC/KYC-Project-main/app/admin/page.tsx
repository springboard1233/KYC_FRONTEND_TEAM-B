"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, FileText, AlertTriangle, TrendingUp, LogOut, Users, Clock, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminSubmissionsTable } from "@/components/admin-submissions-table"
import { AdminRiskVisualization } from "@/components/admin-risk-visualization"
import { FraudAlertsPanel } from "@/components/fraud-alerts-panel"
import { AuditTrailPanel } from "@/components/audit-trail-panel"
import { mockAdminStats } from "@/lib/mock-data"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [adminEmail, setAdminEmail] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    const email = localStorage.getItem("adminEmail")

    if (!auth) {
      router.push("/admin-login")
      return
    }

    if (email) {
      setAdminEmail(email)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminEmail")
    router.push("/admin-login")
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 glass">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/20">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">{adminEmail}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="glass bg-transparent">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass neon-glow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAdminStats.totalRecords}</div>
                  <p className="text-xs text-muted-foreground">All time submissions</p>
                </CardContent>
              </Card>

              <Card className="glass neon-glow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk Flags</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{mockAdminStats.highRiskFlags}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card className="glass neon-glow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{mockAdminStats.averageConfidence}%</div>
                  <p className="text-xs text-muted-foreground">Detection accuracy</p>
                </CardContent>
              </Card>

              <Card className="glass neon-glow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">{mockAdminStats.pendingReviews}</div>
                  <p className="text-xs text-muted-foreground">Awaiting decision</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="glass">
                <TabsTrigger value="overview">
                  <Users className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="submissions">
                  <FileText className="mr-2 h-4 w-4" />
                  Submissions
                </TabsTrigger>
                <TabsTrigger value="alerts">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Fraud Alerts
                </TabsTrigger>
                <TabsTrigger value="audit">
                  <History className="mr-2 h-4 w-4" />
                  Audit Trail
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <AdminRiskVisualization />
                <AdminSubmissionsTable limit={5} />
              </TabsContent>

              <TabsContent value="submissions" className="space-y-6">
                <AdminSubmissionsTable />
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6">
                <FraudAlertsPanel />
              </TabsContent>

              <TabsContent value="audit" className="space-y-6">
                <AuditTrailPanel />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <AdminRiskVisualization />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
