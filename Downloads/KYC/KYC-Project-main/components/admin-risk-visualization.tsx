"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts"
import { mockSubmissions } from "@/lib/mock-data"

export function AdminRiskVisualization() {
  // Risk distribution data
  const riskDistribution = [
    {
      name: "Low Risk",
      value: mockSubmissions.filter((s) => s.riskLevel === "low").length,
      color: "#22c55e",
    },
    {
      name: "Medium Risk",
      value: mockSubmissions.filter((s) => s.riskLevel === "medium").length,
      color: "#eab308",
    },
    {
      name: "High Risk",
      value: mockSubmissions.filter((s) => s.riskLevel === "high").length,
      color: "#ef4444",
    },
  ]

  // Document type distribution
  const documentTypeData = [
    {
      name: "Aadhaar",
      count: mockSubmissions.filter((s) => s.documentType === "aadhaar").length,
    },
    {
      name: "PAN",
      count: mockSubmissions.filter((s) => s.documentType === "pan").length,
    },
    {
      name: "DL",
      count: mockSubmissions.filter((s) => s.documentType === "driving-license").length,
    },
  ]

  // Fraud scores over time (mock data)
  const fraudTrendData = [
    { month: "Jan", score: 45 },
    { month: "Feb", score: 52 },
    { month: "Mar", score: 48 },
    { month: "Apr", score: 61 },
    { month: "May", score: 55 },
    { month: "Jun", score: 67 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 3D Pie Chart - Risk Distribution */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle>Risk Distribution</CardTitle>
          <CardDescription>Document risk level breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="space-y-2 mt-4">
            {riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart - Document Types */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle>Document Types</CardTitle>
          <CardDescription>Submissions by document type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={documentTypeData}>
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart - Fraud Trend */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle>Fraud Score Trend</CardTitle>
          <CardDescription>Average fraud scores over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fraudTrendData}>
              <XAxis dataKey="month" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
