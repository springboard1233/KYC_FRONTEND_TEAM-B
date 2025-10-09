export type DocumentType = "aadhaar" | "pan" | "driving-license"

export type RiskLevel = "low" | "medium" | "high"

export type VerificationStatus = "pending" | "approved" | "rejected"

export interface AadhaarData {
  name: string
  dob: string
  gender: string
  address: string
  aadhaarNumber: string
}

export interface PANData {
  name: string
  dob: string
  panNumber: string
  fatherName: string
}

export interface DrivingLicenseData {
  name: string
  dob: string
  licenseNumber: string
  validity: string
  address: string
}

export type ExtractedData = AadhaarData | PANData | DrivingLicenseData

export interface DocumentSubmission {
  id: string
  userId: string
  userEmail: string
  documentType: DocumentType
  fileName: string
  fileUrl: string
  extractedData: ExtractedData
  riskScore: number
  riskLevel: RiskLevel
  status: VerificationStatus
  uploadedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  rejectionReason?: string
  fraudAlerts: FraudAlert[]
}

export interface FraudAlert {
  type: string
  confidence: number
  description: string
}

export interface AdminStats {
  totalRecords: number
  highRiskFlags: number
  averageConfidence: number
  pendingReviews: number
}
