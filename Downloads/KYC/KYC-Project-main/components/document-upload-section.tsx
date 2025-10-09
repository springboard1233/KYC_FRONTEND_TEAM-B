"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { DocumentType, ExtractedData } from "@/lib/types"
import { ExtractedDataDisplay } from "@/components/extracted-data-display"
import { simulateOCR } from "@/lib/ocr-simulator"

export function DocumentUploadSection() {
  const [documentType, setDocumentType] = useState<DocumentType | "">("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [riskScore, setRiskScore] = useState<number>(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setUploadSuccess(false)
      setExtractedData(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !documentType) return

    setIsUploading(true)

    // Simulate upload and OCR processing
    setTimeout(() => {
      // Simulate OCR extraction
      const { data, risk } = simulateOCR(documentType)
      setExtractedData(data)
      setRiskScore(risk)

      setIsUploading(false)
      setUploadSuccess(true)
    }, 2500)
  }

  const handleNewUpload = () => {
    setSelectedFile(null)
    setDocumentType("")
    setExtractedData(null)
    setUploadSuccess(false)
    setRiskScore(0)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upload form */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>Select document type and upload your file for verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select
              value={documentType}
              onValueChange={(value) => setDocumentType(value as DocumentType)}
              disabled={isUploading || uploadSuccess}
            >
              <SelectTrigger id="document-type" className="bg-input">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                <SelectItem value="pan">PAN Card</SelectItem>
                <SelectItem value="driving-license">Driving License</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload File</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-input/50">
              <input
                id="file-upload"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading || uploadSuccess}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">JPG, PNG or PDF (max. 10MB)</p>
              </label>
            </div>
          </div>

          {uploadSuccess && (
            <Alert className="bg-green-500/10 border-green-500/50">
              <AlertCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">
                Document processed successfully! OCR extraction complete.
              </AlertDescription>
            </Alert>
          )}

          {!uploadSuccess ? (
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !documentType || isUploading}
              className="w-full neon-glow"
            >
              {isUploading ? "Processing OCR..." : "Upload & Verify"}
            </Button>
          ) : (
            <Button onClick={handleNewUpload} variant="outline" className="w-full glass bg-transparent">
              Upload Another Document
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Instructions or Extracted Data */}
      {!extractedData ? (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Upload Guidelines</CardTitle>
            <CardDescription>Follow these guidelines for best results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Clear Image Quality</h4>
                <p className="text-sm text-muted-foreground">
                  Ensure the document is well-lit and all text is clearly visible
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Complete Document</h4>
                <p className="text-sm text-muted-foreground">
                  Upload the full document with all corners visible in the frame
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Supported Formats</h4>
                <p className="text-sm text-muted-foreground">JPG, PNG, or PDF files up to 10MB in size</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Processing Time</h4>
                <p className="text-sm text-muted-foreground">
                  OCR extraction typically takes 5-10 seconds per document
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ExtractedDataDisplay data={extractedData} documentType={documentType as DocumentType} riskScore={riskScore} />
      )}
    </div>
  )
}
