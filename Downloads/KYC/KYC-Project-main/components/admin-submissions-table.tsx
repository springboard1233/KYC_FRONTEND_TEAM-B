"use client"

import { useState } from "react"
import { FileText, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockSubmissions } from "@/lib/mock-data"
import { DocumentDetailsModal } from "@/components/document-details-modal"
import type { DocumentSubmission } from "@/lib/types"

interface AdminSubmissionsTableProps {
  limit?: number
}

export function AdminSubmissionsTable({ limit }: AdminSubmissionsTableProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<DocumentSubmission | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const submissions = limit ? mockSubmissions.slice(0, limit) : mockSubmissions

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500/50">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  const getRiskBadge = (riskLevel: string, riskScore: number) => {
    const className =
      riskLevel === "low"
        ? "bg-green-500/20 text-green-500 border-green-500/50"
        : riskLevel === "medium"
          ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
          : "bg-red-500/20 text-red-500 border-red-500/50"

    return (
      <Badge variant="outline" className={className}>
        {riskScore}% {riskLevel.toUpperCase()}
      </Badge>
    )
  }

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "aadhaar":
        return "Aadhaar"
      case "pan":
        return "PAN"
      case "driving-license":
        return "DL"
      default:
        return type
    }
  }

  const handleViewDetails = (submission: DocumentSubmission) => {
    setSelectedSubmission(submission)
    setIsModalOpen(true)
  }

  return (
    <>
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>Review and manage document verification requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Document ID</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload Time</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">#{submission.id}</TableCell>
                    <TableCell>{submission.userEmail}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="glass">
                        <FileText className="mr-1 h-3 w-3" />
                        {getDocumentTypeLabel(submission.documentType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {submission.uploadedAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>{getRiskBadge(submission.riskLevel, submission.riskScore)}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(submission)} className="glass">
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedSubmission && (
        <DocumentDetailsModal
          submission={selectedSubmission}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}
