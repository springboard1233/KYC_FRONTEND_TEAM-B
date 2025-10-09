"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, User, Calendar, MapPin, CreditCard, FileText } from "lucide-react"
import type { DocumentType, ExtractedData, AadhaarData, PANData, DrivingLicenseData } from "@/lib/types"

interface ExtractedDataDisplayProps {
  data: ExtractedData
  documentType: DocumentType
  riskScore: number
}

export function ExtractedDataDisplay({ data, documentType, riskScore }: ExtractedDataDisplayProps) {
  const getRiskLevel = (score: number) => {
    if (score < 30)
      return { level: "LOW", color: "text-green-500", bgColor: "bg-green-500/20", borderColor: "border-green-500/50" }
    if (score < 70)
      return {
        level: "MEDIUM",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/50",
      }
    return { level: "HIGH", color: "text-red-500", bgColor: "bg-red-500/20", borderColor: "border-red-500/50" }
  }

  const risk = getRiskLevel(riskScore)

  const renderAadhaarData = (aadhaarData: AadhaarData) => (
    <>
      <DataField icon={<User className="w-4 h-4" />} label="Name" value={aadhaarData.name} />
      <DataField icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={aadhaarData.dob} />
      <DataField icon={<User className="w-4 h-4" />} label="Gender" value={aadhaarData.gender} />
      <DataField icon={<CreditCard className="w-4 h-4" />} label="Aadhaar Number" value={aadhaarData.aadhaarNumber} />
      <DataField icon={<MapPin className="w-4 h-4" />} label="Address" value={aadhaarData.address} fullWidth />
    </>
  )

  const renderPANData = (panData: PANData) => (
    <>
      <DataField icon={<User className="w-4 h-4" />} label="Name" value={panData.name} />
      <DataField icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={panData.dob} />
      <DataField icon={<CreditCard className="w-4 h-4" />} label="PAN Number" value={panData.panNumber} />
      <DataField icon={<User className="w-4 h-4" />} label="Father's Name" value={panData.fatherName} />
    </>
  )

  const renderDLData = (dlData: DrivingLicenseData) => (
    <>
      <DataField icon={<User className="w-4 h-4" />} label="Name" value={dlData.name} />
      <DataField icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={dlData.dob} />
      <DataField icon={<CreditCard className="w-4 h-4" />} label="License Number" value={dlData.licenseNumber} />
      <DataField icon={<Calendar className="w-4 h-4" />} label="Valid Until" value={dlData.validity} />
      <DataField icon={<MapPin className="w-4 h-4" />} label="Address" value={dlData.address} fullWidth />
    </>
  )

  return (
    <Card className="glass neon-glow animate-in fade-in slide-in-from-right duration-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Extracted Data</CardTitle>
            <CardDescription>OCR extraction results from your document</CardDescription>
          </div>
          <FileText className="w-8 h-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Score Display */}
        <div className="glass p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${risk.color}`} />
              <span className="font-medium">Fraud Risk Score</span>
            </div>
            <Badge className={`${risk.bgColor} ${risk.color} ${risk.borderColor}`}>{risk.level}</Badge>
          </div>

          {/* Circular progress bar */}
          <div className="relative">
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                {/* Background circle */}
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - riskScore / 100)}`}
                    className={`${risk.color} transition-all duration-1000 ease-out`}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${risk.color}`}>{riskScore}%</div>
                    <div className="text-xs text-muted-foreground">Risk</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extracted Fields */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Document Details
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {documentType === "aadhaar" && renderAadhaarData(data as AadhaarData)}
            {documentType === "pan" && renderPANData(data as PANData)}
            {documentType === "driving-license" && renderDLData(data as DrivingLicenseData)}
          </div>
        </div>
      </CardContent>
    </Card>
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
    <div className={`glass p-3 rounded-lg ${fullWidth ? "col-span-full" : ""}`}>
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
