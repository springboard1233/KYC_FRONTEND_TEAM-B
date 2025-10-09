"use client"

import { AlertTriangle, Shield, FileText, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockSubmissions } from "@/lib/mock-data"

export function FraudAlertsPanel() {
  // Get submissions with fraud alerts (high risk)
  const alertSubmissions = mockSubmissions.filter((s) => s.fraudAlerts.length > 0)

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-red-500"
    if (confidence >= 50) return "text-yellow-500"
    return "text-green-500"
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80)
      return <Badge className="bg-red-500/20 text-red-500 border-red-500/50">Critical - {confidence}%</Badge>
    if (confidence >= 50)
      return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">Warning - {confidence}%</Badge>
    return <Badge className="bg-green-500/20 text-green-500 border-green-500/50">Low - {confidence}%</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="glass neon-glow border-red-500/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <CardTitle>Fraud Alerts</CardTitle>
              <CardDescription>Real-time suspicious activity detection</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-500">{alertSubmissions.length}</div>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-500">
                {alertSubmissions.filter((s) => s.status === "pending").length}
              </div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-500">
                {alertSubmissions.filter((s) => s.status !== "pending").length}
              </div>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Cards */}
      <div className="space-y-4">
        {alertSubmissions.map((submission) => (
          <Card key={submission.id} className="glass neon-glow border-red-500/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <Shield className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Document #{submission.id}</h3>
                      <p className="text-sm text-muted-foreground">{submission.userEmail}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      submission.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                        : submission.status === "approved"
                          ? "bg-green-500/20 text-green-500 border-green-500/50"
                          : "bg-red-500/20 text-red-500 border-red-500/50"
                    }
                  >
                    {submission.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Document Info */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{submission.documentType.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {submission.uploadedAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Risk:</span>
                    <span className={`font-bold ${getConfidenceColor(submission.riskScore)}`}>
                      {submission.riskScore}%
                    </span>
                  </div>
                </div>

                {/* Fraud Alerts */}
                <div className="space-y-2">
                  {submission.fraudAlerts.map((alert, index) => (
                    <div key={index} className="glass p-4 rounded-lg border border-red-500/20">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <h4 className="font-medium text-sm">{alert.type}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                        </div>
                        {getConfidenceBadge(alert.confidence)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
