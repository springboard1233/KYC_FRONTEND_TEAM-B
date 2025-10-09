"use client"

import { History, CheckCircle, XCircle, Clock, FileText, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockSubmissions } from "@/lib/mock-data"

export function AuditTrailPanel() {
  // Sort submissions by date (most recent first)
  const sortedSubmissions = [...mockSubmissions].sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
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

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Doc ID", "User Email", "Document Type", "Upload Time", "Risk Score", "Status", "Reviewed By"]
    const rows = sortedSubmissions.map((s) => [
      s.id,
      s.userEmail,
      s.documentType,
      s.uploadedAt.toISOString(),
      s.riskScore,
      s.status,
      s.reviewedBy || "N/A",
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-trail-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    alert("PDF export functionality would be implemented here using a library like jsPDF")
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="glass neon-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/20">
                <History className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>Complete verification history and timeline</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV} className="glass bg-transparent">
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF} className="glass bg-transparent">
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass p-4 rounded-lg">
              <div className="text-2xl font-bold">{sortedSubmissions.length}</div>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-500">
                {sortedSubmissions.filter((s) => s.status === "approved").length}
              </div>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-500">
                {sortedSubmissions.filter((s) => s.status === "rejected").length}
              </div>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-500">
                {sortedSubmissions.filter((s) => s.status === "pending").length}
              </div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle>Verification Timeline</CardTitle>
          <CardDescription>Chronological record of all verification activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sortedSubmissions.map((submission, index) => (
              <div key={submission.id} className="relative">
                {/* Timeline line */}
                {index < sortedSubmissions.length - 1 && (
                  <div className="absolute left-[18px] top-10 bottom-0 w-0.5 bg-border" />
                )}

                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0">{getStatusIcon(submission.status)}</div>

                  {/* Content */}
                  <div className="flex-1 glass p-4 rounded-lg">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h4 className="font-medium">Document Verification - #{submission.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {submission.uploadedAt.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {getStatusBadge(submission.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">User</p>
                          <p className="font-medium">{submission.userEmail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Document</p>
                          <p className="font-medium">{submission.documentType.toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Risk Score</p>
                          <p
                            className={`font-medium ${
                              submission.riskLevel === "low"
                                ? "text-green-500"
                                : submission.riskLevel === "medium"
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }`}
                          >
                            {submission.riskScore}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Reviewed By</p>
                          <p className="font-medium">{submission.reviewedBy || "Pending"}</p>
                        </div>
                      </div>
                    </div>

                    {submission.rejectionReason && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Rejection Reason:</p>
                        <p className="text-sm">{submission.rejectionReason}</p>
                      </div>
                    )}
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
