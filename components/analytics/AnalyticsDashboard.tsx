"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, Users, Mail, MousePointer } from "lucide-react";

const campaignMetrics = [
  { name: "Email", sent: 1200, opened: 480, clicked: 96, converted: 24 },
  { name: "SMS", sent: 800, opened: 720, clicked: 144, converted: 32 },
  { name: "WhatsApp", sent: 600, opened: 540, clicked: 108, converted: 28 },
  { name: "Ads", sent: 2000, opened: 1400, clicked: 280, converted: 45 },
];

const performanceData = [
  { day: "Mon", ctr: 8.2, conversion: 2.1 },
  { day: "Tue", ctr: 9.1, conversion: 2.4 },
  { day: "Wed", ctr: 7.8, conversion: 1.9 },
  { day: "Thu", ctr: 10.3, conversion: 2.8 },
  { day: "Fri", ctr: 12.1, conversion: 3.2 },
  { day: "Sat", ctr: 8.9, conversion: 2.3 },
  { day: "Sun", ctr: 7.2, conversion: 1.8 },
];

export function AnalyticsDashboard() {
  const totalSent = campaignMetrics.reduce(
    (sum, metric) => sum + metric.sent,
    0,
  );
  const totalOpened = campaignMetrics.reduce(
    (sum, metric) => sum + metric.opened,
    0,
  );
  const totalClicked = campaignMetrics.reduce(
    (sum, metric) => sum + metric.clicked,
    0,
  );
  const totalConverted = campaignMetrics.reduce(
    (sum, metric) => sum + metric.converted,
    0,
  );

  const openRate = ((totalOpened / totalSent) * 100).toFixed(1);
  const ctr = ((totalClicked / totalOpened) * 100).toFixed(1);
  const conversionRate = ((totalConverted / totalClicked) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Campaign Analytics
        </h2>
        <p className="text-gray-600">
          Real-time performance metrics for your active campaigns
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {openRate}%
              </div>
              <div className="text-sm text-gray-600">Open Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{ctr}%</div>
              <div className="text-sm text-gray-600">Click Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {conversionRate}%
              </div>
              <div className="text-sm text-gray-600">Conversion</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {totalSent.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Reach</div>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Channel Performance
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={campaignMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sent" fill="#e5e7eb" name="Sent" />
            <Bar dataKey="opened" fill="#3b82f6" name="Opened" />
            <Bar dataKey="clicked" fill="#10b981" name="Clicked" />
            <Bar dataKey="converted" fill="#8b5cf6" name="Converted" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Trends */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Weekly Performance Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="ctr"
              stroke="#3b82f6"
              strokeWidth={2}
              name="CTR %"
            />
            <Line
              type="monotone"
              dataKey="conversion"
              stroke="#10b981"
              strokeWidth={2}
              name="Conversion %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
