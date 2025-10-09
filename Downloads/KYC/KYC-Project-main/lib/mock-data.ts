import type { DocumentSubmission, AdminStats } from "./types"

// Mock data for demonstration
export const mockSubmissions: DocumentSubmission[] = [
  {
    id: "1",
    userId: "user1",
    userEmail: "john.doe@example.com",
    documentType: "aadhaar",
    fileName: "aadhaar_scan.jpg",
    fileUrl: "/aadhaar-card.jpg",
    extractedData: {
      name: "John Doe",
      dob: "15/08/1990",
      gender: "Male",
      address: "123 Main Street, Mumbai, Maharashtra 400001",
      aadhaarNumber: "1234 5678 9012",
    },
    riskScore: 15,
    riskLevel: "low",
    status: "approved",
    uploadedAt: new Date("2025-09-28T10:30:00"),
    reviewedAt: new Date("2025-09-28T11:00:00"),
    reviewedBy: "admin@example.com",
    fraudAlerts: [],
  },
  {
    id: "2",
    userId: "user2",
    userEmail: "jane.smith@example.com",
    documentType: "pan",
    fileName: "pan_card.jpg",
    fileUrl: "/pan-card.png",
    extractedData: {
      name: "Jane Smith",
      dob: "22/03/1985",
      panNumber: "ABCDE1234F",
      fatherName: "Robert Smith",
    },
    riskScore: 92,
    riskLevel: "high",
    status: "pending",
    uploadedAt: new Date("2025-09-29T14:20:00"),
    fraudAlerts: [
      {
        type: "Document Manipulation",
        confidence: 92,
        description: "Potential tampering detected in document image",
      },
      {
        type: "Data Inconsistency",
        confidence: 78,
        description: "Name format does not match standard PAN card format",
      },
    ],
  },
  {
    id: "3",
    userId: "user3",
    userEmail: "mike.johnson@example.com",
    documentType: "driving-license",
    fileName: "dl_scan.pdf",
    fileUrl: "/driving-license-documents.png",
    extractedData: {
      name: "Mike Johnson",
      dob: "10/12/1992",
      licenseNumber: "DL-1234567890",
      validity: "10/12/2030",
      address: "456 Park Avenue, Delhi 110001",
    },
    riskScore: 45,
    riskLevel: "medium",
    status: "pending",
    uploadedAt: new Date("2025-09-30T09:15:00"),
    fraudAlerts: [
      {
        type: "Image Quality",
        confidence: 45,
        description: "Low image quality may affect verification accuracy",
      },
    ],
  },
]

export const mockAdminStats: AdminStats = {
  totalRecords: 156,
  highRiskFlags: 23,
  averageConfidence: 76.5,
  pendingReviews: 12,
}
