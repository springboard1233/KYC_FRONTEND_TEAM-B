"use client"

import { CheckCircle, Clock, XCircle, FileText, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockSubmissions } from "@/lib/mock-data"
import { RiskVisualization } from "@/components/risk-visualization"

export function RecentActivityTimeline() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/50">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/50">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">Pending</Badge>
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "aadhaar":
        return "Aadhaar Card"
      case "pan":
        return "PAN Card"
      case "driving-license":
        return "Driving License"
      default:
        return type
    }
  }

  // Get user's submissions (filter by current user email in real app)
  const userSubmissions = mockSubmissions.slice(0, 2)

  return (
    <div className="space-y-6">
      {/* Risk Visualization */}
      <RiskVisualization submissions={userSubmissions} />

      {/* Timeline */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your document verification history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {userSubmissions.map((submission, index) => (
              <div key={submission.id} className="relative">
                {/* Timeline line */}
                {index < userSubmissions.length - 1 && (
                  <div className="absolute left-[18px] top-10 bottom-0 w-0.5 bg-border" />
                )}

                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0">{getStatusIcon(submission.status)}</div>

                  {/* Content */}
                  <div className="flex-1 space-y-3 pb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium">{getDocumentTypeLabel(submission.documentType)}</h4>
                        <p className="text-sm text-muted-foreground">
                          {submission.uploadedAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {getStatusBadge(submission.status)}
                    </div>

                    {/* Document details card */}
                    <div className="glass p-4 rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{submission.fileName}</span>
                      </div>

                      {/* Risk score */}
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Risk Score:</span>
                        <Badge
                          variant="outline"
                          className={
                            submission.riskLevel === "low"
                              ? "bg-green-500/20 text-green-500 border-green-500/50"
                              : submission.riskLevel === "medium"
                                ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                                : "bg-red-500/20 text-red-500 border-red-500/50"
                          }
                        >
                          {submission.riskScore}% - {submission.riskLevel.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Extracted data preview */}
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-2">Extracted Data:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {"name" in submission.extractedData && (
                            <div>
                              <span className="text-muted-foreground">Name:</span>{" "}
                              <span className="font-medium">{submission.extractedData.name}</span>
                            </div>
                          )}
                          {"dob" in submission.extractedData && (
                            <div>
                              <span className="text-muted-foreground">DOB:</span>{" "}
                              <span className="font-medium">{submission.extractedData.dob}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
