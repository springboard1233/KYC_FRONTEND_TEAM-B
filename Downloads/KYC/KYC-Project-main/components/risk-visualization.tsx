"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import type { DocumentSubmission } from "@/lib/types"

interface RiskVisualizationProps {
  submissions: DocumentSubmission[]
}

export function RiskVisualization({ submissions }: RiskVisualizationProps) {
  // Calculate risk distribution
  const riskDistribution = [
    {
      name: "Low Risk",
      value: submissions.filter((s) => s.riskLevel === "low").length,
      color: "#22c55e",
    },
    {
      name: "Medium Risk",
      value: submissions.filter((s) => s.riskLevel === "medium").length,
      color: "#eab308",
    },
    {
      name: "High Risk",
      value: submissions.filter((s) => s.riskLevel === "high").length,
      color: "#ef4444",
    },
  ]

  // Bar chart data
  const barData = submissions.map((s) => ({
    name: s.documentType.toUpperCase(),
    score: s.riskScore,
  }))

  // Calculate average risk score
  const avgRiskScore =
    submissions.length > 0 ? submissions.reduce((acc, s) => acc + s.riskScore, 0) / submissions.length : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Circular progress / Pie chart */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle>Risk Distribution</CardTitle>
          <CardDescription>Overview of your document risk levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            {/* Average risk score display */}
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full glass flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{avgRiskScore.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Avg Risk</div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse" />
            </div>

            {/* Pie chart */}
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
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
            <div className="flex gap-4 mt-4">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bar chart */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle>Risk Scores by Document</CardTitle>
          <CardDescription>Individual document risk analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
