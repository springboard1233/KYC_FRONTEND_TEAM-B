import type { DocumentType, ExtractedData, AadhaarData, PANData, DrivingLicenseData } from "./types"

// Simulate OCR extraction with mock data
export function simulateOCR(documentType: DocumentType): { data: ExtractedData; risk: number } {
  const mockData: Record<DocumentType, { data: ExtractedData; risk: number }> = {
    aadhaar: {
      data: {
        name: "Rajesh Kumar",
        dob: "15/03/1988",
        gender: "Male",
        address: "House No. 45, Sector 12, Noida, Uttar Pradesh 201301",
        aadhaarNumber: "2345 6789 0123",
      } as AadhaarData,
      risk: Math.floor(Math.random() * 30) + 10, // 10-40% risk
    },
    pan: {
      data: {
        name: "Priya Sharma",
        dob: "22/07/1992",
        panNumber: "BCDPK5678L",
        fatherName: "Vijay Sharma",
      } as PANData,
      risk: Math.floor(Math.random() * 40) + 30, // 30-70% risk
    },
    "driving-license": {
      data: {
        name: "Amit Patel",
        dob: "10/11/1985",
        licenseNumber: "MH-0120230045678",
        validity: "10/11/2035",
        address: "Flat 302, Green Valley Apartments, Pune, Maharashtra 411001",
      } as DrivingLicenseData,
      risk: Math.floor(Math.random() * 30) + 15, // 15-45% risk
    },
  }

  return mockData[documentType]
}
