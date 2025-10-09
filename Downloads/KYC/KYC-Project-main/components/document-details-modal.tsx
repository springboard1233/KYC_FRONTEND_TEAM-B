"use client"

import type React from "react"

import { useState } from "react"
import {
  X,
  FileText,
  User,
  Calendar,
  MapPin,
  CreditCard,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { DocumentSubmission, AadhaarData, PANData, DrivingLicenseData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface DocumentDetailsModalProps {
  submission: DocumentSubmission
  isOpen: boolean
  onClose: () => void
}

export function DocumentDetailsModal({ submission, isOpen, onClose }: DocumentDetailsModalProps) {
  const { toast } = useToast()
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "high":
        return "text-red-500"
      default:
        return "text-muted-foreground"
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

  const handleApprove = async () => {
    setIsApproving(true)

    // Simulate API call
    setTimeout(() => {
      setIsApproving(false)
      toast({
        title: "Document Approved",
        description: `Document #${submission.id} has been approved successfully.`,
      })
      onClose()
    }, 1000)
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      })
      return
    }

    setIsRejecting(true)

    // Simulate API call
    setTimeout(() => {
      setIsRejecting(false)
      toast({
        title: "Document Rejected",
        description: `Document #${submission.id} has been rejected.`,
        variant: "destructive",
      })
      onClose()
    }, 1000)
  }

  const renderExtractedData = () => {
    const data = submission.extractedData

    if ("aadhaarNumber" in data) {
      const aadhaarData = data as AadhaarData
      return (
        <>
          <DataField icon={<User className="w-4 h-4" />} label="Name" value={aadhaarData.name} />
          <DataField icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={aadhaarData.dob} />
          <DataField icon={<User className="w-4 h-4" />} label="Gender" value={aadhaarData.gender} />
          <DataField
            icon={<CreditCard className="w-4 h-4" />}
            label="Aadhaar Number"
            value={aadhaarData.aadhaarNumber}
          />
          <DataField icon={<MapPin className="w-4 h-4" />} label="Address" value={aadhaarData.address} fullWidth />
        </>
      )
    }

    if ("panNumber" in data) {
      const panData = data as PANData
      return (
        <>
          <DataField icon={<User className="w-4 h-4" />} label="Name" value={panData.name} />
          <DataField icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={panData.dob} />
          <DataField icon={<CreditCard className="w-4 h-4" />} label="PAN Number" value={panData.panNumber} />
          <DataField icon={<User className="w-4 h-4" />} label="Father's Name" value={panData.fatherName} />
        </>
      )
    }

    if ("licenseNumber" in data) {
      const dlData = data as DrivingLicenseData
      return (
        <>
          <DataField icon={<User className="w-4 h-4" />} label="Name" value={dlData.name} />
          <DataField icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={dlData.dob} />
          <DataField icon={<CreditCard className="w-4 h-4" />} label="License Number" value={dlData.licenseNumber} />
          <DataField icon={<Calendar className="w-4 h-4" />} label="Valid Until" value={dlData.validity} />
          <DataField icon={<MapPin className="w-4 h-4" />} label="Address" value={dlData.address} fullWidth />
        </>
      )
    }

    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl glass border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Document Details - #{submission.id}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Document Info */}
          <div className="glass p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-medium">{getDocumentTypeLabel(submission.documentType)}</span>
              </div>
              <Badge variant="outline" className="glass">
                {submission.fileName}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">User Email:</span>
                <p className="font-medium">{submission.userEmail}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Upload Time:</span>
                <p className="font-medium">
                  {submission.uploadedAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Risk Score */}
          <div className="glass p-6 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className={`w-5 h-5 ${getRiskColor(submission.riskLevel)}`} />
                <span className="font-medium">Fraud Risk Analysis</span>
              </div>
              <Badge
                className={
                  submission.riskLevel === "low"
                    ? "bg-green-500/20 text-green-500 border-green-500/50"
                    : submission.riskLevel === "medium"
                      ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                      : "bg-red-500/20 text-red-500 border-red-500/50"
                }
              >
                {submission.riskLevel.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className={`text-5xl font-bold ${getRiskColor(submission.riskLevel)}`}>
                  {submission.riskScore}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">Risk Score</div>
              </div>
            </div>
          </div>

          {/* Fraud Alerts */}
          {submission.fraudAlerts.length > 0 && (
            <div className="glass p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="font-medium">Fraud Alerts</span>
              </div>
              <div className="space-y-2">
                {submission.fraudAlerts.map((alert, index) => (
                  <div key={index} className="glass p-3 rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{alert.type}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50">
                        {alert.confidence}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Data */}
          <div className="glass p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-medium">Extracted Data</span>
            </div>
            <div className="grid grid-cols-2 gap-4">{renderExtractedData()}</div>
          </div>

          {/* Admin Actions */}
          {submission.status === "pending" && (
            <div className="glass p-4 rounded-lg space-y-4">
              <h4 className="font-medium">Admin Actions</h4>

              {!showRejectForm ? (
                <div className="flex gap-3">
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {isApproving ? "Approving..." : "Approve Document"}
                  </Button>
                  <Button onClick={() => setShowRejectForm(true)} variant="destructive" className="flex-1">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Document
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rejection-reason">Rejection Reason</Label>
                    <Textarea
                      id="rejection-reason"
                      placeholder="Provide a detailed reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="bg-input min-h-[100px]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleReject} disabled={isRejecting} variant="destructive" className="flex-1">
                      {isRejecting ? "Rejecting..." : "Confirm Rejection"}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowRejectForm(false)
                        setRejectionReason("")
                      }}
                      variant="outline"
                      className="flex-1 glass bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Display for Reviewed Documents */}
          {submission.status !== "pending" && (
            <div className="glass p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {submission.status === "approved" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="font-medium">
                  Document {submission.status === "approved" ? "Approved" : "Rejected"}
                </span>
              </div>
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">
                  Reviewed by: <span className="font-medium text-foreground">{submission.reviewedBy}</span>
                </p>
                <p className="text-muted-foreground">
                  Reviewed at:{" "}
                  <span className="font-medium text-foreground">
                    {submission.reviewedAt?.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
                {submission.rejectionReason && (
                  <p className="text-muted-foreground">
                    Reason: <span className="font-medium text-foreground">{submission.rejectionReason}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface DataFieldProps {
  icon: React.ReactNode
  label: string
  value: string
  fullWidth?: boolean
}

function DataField({ icon, label, value, fullWidth }: DataFieldProps) {
  return (
    <div className={`glass p-3 rounded-lg ${fullWidth ? "col-span-2" : ""}`}>
      <div className="flex items-start gap-2">
        <div className="text-muted-foreground mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-sm font-medium break-words">{value}</p>
        </div>
      </div>
    </div>
  )
}
