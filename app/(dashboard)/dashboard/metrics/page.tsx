"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartAreaInteractive } from "@/components/analytics/area-chart";

const kFormatter = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString());

// Mock data
const timeSeries = Array.from({ length: 12 }).map((_, i) => ({
    name: `W${i + 1}`,
    reach: 3200 + Math.round(Math.random() * 1800),
    impressions: 5200 + Math.round(Math.random() * 2400),
    engagement: 300 + Math.round(Math.random() * 400),
}));

const channelPerf = [
    { channel: "Email", clicks: 820, conversions: 110 },
    { channel: "SMS", clicks: 540, conversions: 90 },
    { channel: "WhatsApp", clicks: 610, conversions: 70 },
    { channel: "Ads", clicks: 980, conversions: 120 },
];

// Row types for stronger typing in computed helpers
interface CampaignRow { name: string; reach: number; ctr: string; conv: string; revenue: string }
interface ConversionRow { id: string; channel: string; value: string; time: string }

const audienceShare = [
    { name: "New Users", value: 400 },
    { name: "Returning", value: 300 },
    { name: "Loyal", value: 200 },
    { name: "Churn Risk", value: 120 },
];
const PIE_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"]; // tailwind-ish

const radarData = [
    { metric: "Open", A: 120, fullMark: 150 },
    { metric: "Click", A: 98, fullMark: 150 },
    { metric: "Conv.", A: 86, fullMark: 150 },
    { metric: "CTR", A: 99, fullMark: 150 },
    { metric: "ROI", A: 130, fullMark: 150 },
];

const statCards = [
    { label: "Total Reach", value: 46500, delta: "+2.4%" },
    { label: "Open Rate", value: "24.8%", delta: "+0.6%" },
    { label: "Click Rate", value: "8.1%", delta: "+0.3%" },
    { label: "Conversion", value: "2.2%", delta: "+0.2%" },
    { label: "Revenue", value: "$12.4k", delta: "+4.2%" },
    { label: "New Leads", value: 860, delta: "+3.1%" },
    { label: "Bounce Rate", value: "38%", delta: "-1.1%" },
    { label: "CPC", value: "$0.42", delta: "-0.05" },
    { label: "ROAS", value: "3.8x", delta: "+0.2x" },
    { label: "Active Campaigns", value: 7, delta: "+1" },
];

const topCampaigns = [
    { name: "Spring Promo", reach: 18000, ctr: "8.2%", conv: "2.5%", revenue: "$4.2k" },
    { name: "Loyalty Push", reach: 12200, ctr: "7.1%", conv: "2.0%", revenue: "$3.1k" },
    { name: "Product Launch", reach: 9800, ctr: "9.0%", conv: "2.8%", revenue: "$2.9k" },
    { name: "Winback", reach: 7600, ctr: "6.4%", conv: "1.6%", revenue: "$1.9k" },
    { name: "Holiday Tease", reach: 6400, ctr: "7.9%", conv: "2.1%", revenue: "$1.6k" },
];

const recentConversions = [
    { id: "#C-92341", channel: "Email", value: "$129", time: "2m ago" },
    { id: "#C-92312", channel: "Ads", value: "$299", time: "7m ago" },
    { id: "#C-92277", channel: "SMS", value: "$59", time: "12m ago" },
    { id: "#C-92265", channel: "WhatsApp", value: "$89", time: "18m ago" },
    { id: "#C-92241", channel: "Email", value: "$219", time: "25m ago" },
];

const sourcePerformance = [
    { source: "Shopify", users: 4100, conv: "2.1%", aov: "$62" },
    { source: "GA4", users: 3200, conv: "1.7%", aov: "$54" },
    { source: "Facebook", users: 2800, conv: "2.4%", aov: "$48" },
    { source: "TikTok", users: 2100, conv: "2.0%", aov: "$41" },
    { source: "Twitter", users: 900, conv: "1.1%", aov: "$36" },
];

const audienceSegments = [
    { segment: "New Visitors", size: 8200, growth: "+5.2%" },
    { segment: "Returning", size: 6400, growth: "+1.8%" },
    { segment: "High LTV", size: 2200, growth: "+0.7%" },
    { segment: "Dormant", size: 3100, growth: "-0.9%" },
    { segment: "Churn Risk", size: 1800, growth: "+0.2%" },
];

const anomalies = [
    { ts: "16:05", issue: "Drop in Email CTR", severity: "medium" },
    { ts: "15:42", issue: "Spike in CPC (Ads)", severity: "high" },
    { ts: "14:27", issue: "Conversion lag (SMS)", severity: "low" },
    { ts: "13:11", issue: "Bounce rate up", severity: "medium" },
    { ts: "12:56", issue: "Attribution mismatch", severity: "low" },
];

export default function MetricsPage() {
    const [refreshing, setRefreshing] = React.useState(false);
    const [campaignSearch, setCampaignSearch] = React.useState("");
    const [campaignMinReach, setCampaignMinReach] = React.useState<string>("0");
    const [convSearch, setConvSearch] = React.useState("");
    const [convChannel, setConvChannel] = React.useState<string>("all");
    const [sourceSearch, setSourceSearch] = React.useState("");
    const [segmentSearch, setSegmentSearch] = React.useState("");
    const [anomalySeverity, setAnomalySeverity] = React.useState<string>("all");
    const [anomalyQuery, setAnomalyQuery] = React.useState("");

    // Top Campaigns: sorting & pagination
    const [tcSortKey, setTcSortKey] = React.useState<"name" | "reach" | "ctr" | "conv" | "revenue">("reach");
    const [tcSortDir, setTcSortDir] = React.useState<"asc" | "desc">("desc");
    const [tcPage, setTcPage] = React.useState(0);
    const [tcPageSize, setTcPageSize] = React.useState(5);

    // Recent Conversions: sorting & pagination
    const [rcSortKey, setRcSortKey] = React.useState<"id" | "channel" | "value" | "time">("time");
    const [rcSortDir, setRcSortDir] = React.useState<"asc" | "desc">("desc");
    const [rcPage, setRcPage] = React.useState(0);
    const [rcPageSize, setRcPageSize] = React.useState(5);

    const exportCSV = (filename: string, rows: Record<string, any>[], columns: { key: string; label: string }[]) => {
        const header = columns.map(c => c.label).join(",");
        const body = rows
            .map(r => columns.map(c => JSON.stringify(r[c.key] ?? "")).join(","))
            .join("\n");
        const csv = header + "\n" + body;
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Helpers to coerce string metrics to numbers for sorting
    const pct = (s: string) => {
        const n = parseFloat(s.replace(/%/g, ""));
        return Number.isNaN(n) ? 0 : n;
    };
    const money = (s: string) => {
        // supports "$4.2k" or "$129"
        const isK = /k$/i.test(s);
        const n = parseFloat(s.replace(/[^0-9.]/g, ""));
        if (Number.isNaN(n)) return 0;
        return isK ? n * 1000 : n;
    };
    const minutesAgo = (s: string) => {
        // e.g. "2m ago" -> 2, fallback 0
        const m = /([0-9]+)m/.exec(s);
        return m ? parseInt(m[1], 10) : 0;
    };

    // Top Campaigns derived data (filter -> sort -> paginate)
    const filteredTopCampaigns: CampaignRow[] = (topCampaigns as CampaignRow[])
        .filter((c) => c.name.toLowerCase().includes(campaignSearch.toLowerCase()))
        .filter((c) => c.reach >= Number(campaignMinReach));
    const sortedTopCampaigns = [...filteredTopCampaigns].sort((a, b) => {
        const dir = tcSortDir === "asc" ? 1 : -1;
        const val = (row: CampaignRow) => {
            switch (tcSortKey) {
                case "name": return row.name.toLowerCase();
                case "reach": return row.reach;
                case "ctr": return pct(row.ctr);
                case "conv": return pct(row.conv);
                case "revenue": return money(row.revenue);
            }
        };
        const va = val(a);
        const vb = val(b);
        if (typeof va === "string" && typeof vb === "string") return va.localeCompare(vb) * dir;
        // numeric compare
        return ((va as number) - (vb as number)) * dir;
    });
    const tcStart = tcPage * tcPageSize;
    const pagedTopCampaigns: CampaignRow[] = sortedTopCampaigns.slice(tcStart, tcStart + tcPageSize);

    // Recent Conversions derived data (filter -> sort -> paginate)
    const filteredRecentConversions: ConversionRow[] = (recentConversions as ConversionRow[])
        .filter((r) => r.id.toLowerCase().includes(convSearch.toLowerCase()) || r.channel.toLowerCase().includes(convSearch.toLowerCase()))
        .filter((r) => (convChannel === "all" ? true : r.channel === convChannel));
    const sortedRecentConversions = [...filteredRecentConversions].sort((a, b) => {
        const dir = rcSortDir === "asc" ? 1 : -1;
        const val = (row: ConversionRow) => {
            switch (rcSortKey) {
                case "id": return row.id.toLowerCase();
                case "channel": return row.channel.toLowerCase();
                case "value": return money(row.value);
                case "time": return minutesAgo(row.time);
            }
        };
        const va = val(a);
        const vb = val(b);
        if (typeof va === "string" && typeof vb === "string") return va.localeCompare(vb) * dir;
        return ((va as number) - (vb as number)) * dir;
    });
    const rcStart = rcPage * rcPageSize;
    const pagedRecentConversions: ConversionRow[] = sortedRecentConversions.slice(rcStart, rcStart + rcPageSize);

    const handleRefresh = async () => {
        setRefreshing(true);
        await new Promise((r) => setTimeout(r, 800));
        setRefreshing(false);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header actions */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>Live Campaign Metrics</CardTitle>
                        <CardDescription>Real-time KPIs and insights across channels</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">Live</Badge>
                        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={refreshing}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Stat cards - 10 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {statCards.map((s, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <CardDescription>{s.label}</CardDescription>
                            <CardTitle className="text-2xl">
                                {typeof s.value === "number" ? kFormatter(s.value) : s.value}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="secondary">{s.delta}</Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts - 5 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Interactive Area chart */}
                <ChartAreaInteractive />

                {/* Channel performance (Bar) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Channel Performance</CardTitle>
                        <CardDescription>Clicks and conversions per channel</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={channelPerf}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="channel" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="clicks" fill="#10B981" />
                                <Bar dataKey="conversions" fill="#F59E0B" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Reach vs Impressions (Area) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reach vs Impressions</CardTitle>
                        <CardDescription>Comparative visibility metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timeSeries}>
                                <defs>
                                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="reach" stroke="#6366F1" fill="url(#colorReach)" />
                                <Area type="monotone" dataKey="impressions" stroke="#10B981" fill="url(#colorImp)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Audience mix (Pie) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Audience Mix</CardTitle>
                        <CardDescription>Distribution by segment</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip />
                                <Legend />
                                <Pie data={audienceShare} dataKey="value" nameKey="name" outerRadius={90} label>
                                    {audienceShare.map((_, idx) => (
                                        <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Metric distribution (Radar) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Metric Distribution</CardTitle>
                        <CardDescription>Relative performance</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="metric" />
                                <PolarRadiusAxis />
                                <Radar name="Performance" dataKey="A" stroke="#EF4444" fill="#EF4444" fillOpacity={0.4} />
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Tables - 5 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Top Campaigns */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <CardTitle>Top Campaigns</CardTitle>
                                <CardDescription>Best performing campaigns</CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    // Export currently filtered + sorted page
                                    const columns = [
                                        { key: "name", label: "Name" },
                                        { key: "reach", label: "Reach" },
                                        { key: "ctr", label: "CTR" },
                                        { key: "conv", label: "Conv" },
                                        { key: "revenue", label: "Revenue" },
                                    ];
                                    exportCSV("top-campaigns", pagedTopCampaigns, columns);
                                }}
                            >
                                Export CSV
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 overflow-x-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <Input
                                placeholder="Search campaigns..."
                                value={campaignSearch}
                                onChange={(e) => setCampaignSearch(e.target.value)}
                            />
                            <Select value={tcSortKey} onValueChange={(v) => setTcSortKey(v as any)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="reach">Reach</SelectItem>
                                    <SelectItem value="ctr">CTR</SelectItem>
                                    <SelectItem value="conv">Conv</SelectItem>
                                    <SelectItem value="revenue">Revenue</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={campaignMinReach} onValueChange={setCampaignMinReach}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Min reach" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Min reach: 0</SelectItem>
                                    <SelectItem value="5000">Min reach: 5k</SelectItem>
                                    <SelectItem value="10000">Min reach: 10k</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setTcSortDir(tcSortDir === "asc" ? "desc" : "asc")}>{tcSortDir === "asc" ? "Asc" : "Desc"}</Button>
                                <Select value={String(tcPageSize)} onValueChange={(v) => { setTcPageSize(Number(v)); setTcPage(0); }}>
                                    <SelectTrigger className="w-24">
                                        <SelectValue placeholder="Page size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setTcPage(Math.max(0, tcPage - 1))}>Prev</Button>
                                <span className="text-xs text-muted-foreground">Page {tcPage + 1}</span>
                                <Button variant="outline" size="sm" onClick={() => setTcPage(tcPage + 1)}>Next</Button>
                            </div>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="text-muted-foreground">
                                <tr>
                                    <th className="text-left py-2">Name</th>
                                    <th className="text-left py-2">Reach</th>
                                    <th className="text-left py-2">CTR</th>
                                    <th className="text-left py-2">Conv</th>
                                    <th className="text-left py-2">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagedTopCampaigns.map((c, i) => (
                                    <tr key={i} className="border-t">
                                        <td className="py-2">{c.name}</td>
                                        <td className="py-2">{kFormatter(c.reach)}</td>
                                        <td className="py-2">{c.ctr}</td>
                                        <td className="py-2">{c.conv}</td>
                                        <td className="py-2">{c.revenue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* Recent Conversions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <CardTitle>Recent Conversions</CardTitle>
                                <CardDescription>Latest conversion events</CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const columns = [
                                        { key: "id", label: "ID" },
                                        { key: "channel", label: "Channel" },
                                        { key: "value", label: "Value" },
                                        { key: "time", label: "Time" },
                                    ];
                                    exportCSV("recent-conversions", pagedRecentConversions, columns);
                                }}
                            >
                                Export CSV
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 overflow-x-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Input
                                placeholder="Search by ID or channel..."
                                value={convSearch}
                                onChange={(e) => setConvSearch(e.target.value)}
                            />
                            <Select value={convChannel} onValueChange={setConvChannel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Channel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="Email">Email</SelectItem>
                                    <SelectItem value="SMS">SMS</SelectItem>
                                    <SelectItem value="Ads">Ads</SelectItem>
                                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Select value={rcSortKey} onValueChange={(v) => setRcSortKey(v as any)}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="id">ID</SelectItem>
                                        <SelectItem value="channel">Channel</SelectItem>
                                        <SelectItem value="value">Value</SelectItem>
                                        <SelectItem value="time">Time</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="sm" onClick={() => setRcSortDir(rcSortDir === "asc" ? "desc" : "asc")}>{rcSortDir === "asc" ? "Asc" : "Desc"}</Button>
                                <Select value={String(rcPageSize)} onValueChange={(v) => { setRcPageSize(Number(v)); setRcPage(0); }}>
                                    <SelectTrigger className="w-24">
                                        <SelectValue placeholder="Page size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setRcPage(Math.max(0, rcPage - 1))}>Prev</Button>
                                <span className="text-xs text-muted-foreground">Page {rcPage + 1}</span>
                                <Button variant="outline" size="sm" onClick={() => setRcPage(rcPage + 1)}>Next</Button>
                            </div>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="text-muted-foreground">
                                <tr>
                                    <th className="text-left py-2">ID</th>
                                    <th className="text-left py-2">Channel</th>
                                    <th className="text-left py-2">Value</th>
                                    <th className="text-left py-2">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagedRecentConversions.map((r, i) => (
                                    <tr key={i} className="border-t">
                                        <td className="py-2">{r.id}</td>
                                        <td className="py-2">{r.channel}</td>
                                        <td className="py-2">{r.value}</td>
                                        <td className="py-2">{r.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* Source Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Source Performance</CardTitle>
                        <CardDescription>Users, conversion, AOV</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-muted-foreground">
                                <tr>
                                    <th className="text-left py-2">Source</th>
                                    <th className="text-left py-2">Users</th>
                                    <th className="text-left py-2">Conv</th>
                                    <th className="text-left py-2">AOV</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sourcePerformance
                                    .filter((r) => r.source.toLowerCase().includes(sourceSearch.toLowerCase()))
                                    .map((r, i) => (
                                    <tr key={i} className="border-t">
                                        <td className="py-2">{r.source}</td>
                                        <td className="py-2">{kFormatter(r.users)}</td>
                                        <td className="py-2">{r.conv}</td>
                                        <td className="py-2">{r.aov}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* Audience Segments */}
                <Card>
                    <CardHeader>
                        <CardTitle>Audience Segments</CardTitle>
                        <CardDescription>Sizes and growth</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 overflow-x-auto">
                        <div className="grid grid-cols-1">
                            <Input
                                placeholder="Search segments..."
                                value={segmentSearch}
                                onChange={(e) => setSegmentSearch(e.target.value)}
                            />
                        </div>
                        <table className="w-full text-sm">
                            <thead className="text-muted-foreground">
                                <tr>
                                    <th className="text-left py-2">Segment</th>
                                    <th className="text-left py-2">Size</th>
                                    <th className="text-left py-2">Growth</th>
                                </tr>
                            </thead>
                            <tbody>
                                {audienceSegments
                                    .filter((a) => a.segment.toLowerCase().includes(segmentSearch.toLowerCase()))
                                    .map((a, i) => (
                                    <tr key={i} className="border-t">
                                        <td className="py-2">{a.segment}</td>
                                        <td className="py-2">{kFormatter(a.size)}</td>
                                        <td className="py-2">{a.growth}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* Anomalies & Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle>Anomalies & Alerts</CardTitle>
                        <CardDescription>Auto-detected insights</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 overflow-x-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Select value={anomalySeverity} onValueChange={setAnomalySeverity}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Search issues..."
                                value={anomalyQuery}
                                onChange={(e) => setAnomalyQuery(e.target.value)}
                            />
                        </div>
                        <table className="w-full text-sm">
                            <thead className="text-muted-foreground">
                                <tr>
                                    <th className="text-left py-2">Time</th>
                                    <th className="text-left py-2">Issue</th>
                                    <th className="text-left py-2">Severity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {anomalies
                                    .filter((a) => (anomalySeverity === "all" ? true : a.severity === anomalySeverity))
                                    .filter((a) => a.issue.toLowerCase().includes(anomalyQuery.toLowerCase()))
                                    .map((a, i) => (
                                    <tr key={i} className="border-t">
                                        <td className="py-2">{a.ts}</td>
                                        <td className="py-2">{a.issue}</td>
                                        <td className="py-2">
                                            <Badge variant={a.severity === "high" ? "default" : a.severity === "medium" ? "secondary" : "outline"}>
                                                {a.severity}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
