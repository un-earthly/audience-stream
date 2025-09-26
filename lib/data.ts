import { Users, Target, DollarSign, MousePointer, Eye, Activity, Zap } from "lucide-react";

// Mock data with more variety
export const timeSeries = Array.from({ length: 24 }).map((_, i) => ({
    name: `${i}:00`,
    reach: 2800 + Math.round(Math.random() * 2200 + Math.sin(i * 0.3) * 800),
    impressions: 4500 + Math.round(Math.random() * 2800 + Math.sin(i * 0.3) * 1200),
    engagement: 250 + Math.round(Math.random() * 350 + Math.sin(i * 0.3) * 150),
    conversions: 15 + Math.round(Math.random() * 25 + Math.sin(i * 0.3) * 10),
}));

export const channelPerf = [
    { channel: "Email", clicks: 2420, conversions: 340, ctr: 8.2, spend: 1240 },
    { channel: "Social", clicks: 1890, conversions: 280, ctr: 6.8, spend: 980 },
    { channel: "Search", clicks: 2980, conversions: 420, ctr: 9.1, spend: 1680 },
    { channel: "Display", clicks: 1650, conversions: 190, ctr: 5.4, spend: 890 },
    { channel: "Video", clicks: 1120, conversions: 150, ctr: 7.3, spend: 650 },
];

export const audienceShare = [
    { name: "Millennials", value: 420, color: "#8B5CF6" },
    { name: "Gen Z", value: 380, color: "#06B6D4" },
    { name: "Gen X", value: 240, color: "#10B981" },
    { name: "Boomers", value: 160, color: "#F59E0B" },
];

export const radarData = [
    { metric: "Reach", current: 85, benchmark: 75, fullMark: 100 },
    { metric: "Engagement", current: 92, benchmark: 80, fullMark: 100 },
    { metric: "Conversion", current: 78, benchmark: 70, fullMark: 100 },
    { metric: "Retention", current: 88, benchmark: 75, fullMark: 100 },
    { metric: "ROI", current: 94, benchmark: 85, fullMark: 100 },
    { metric: "Quality", current: 90, benchmark: 80, fullMark: 100 },
];

export const statCards = [
    {
        label: "Total Revenue",
        value: "$47.2k",
        delta: "+12.4%",
        trend: "up",
        icon: DollarSign,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
        label: "Active Users",
        value: 18500,
        delta: "+8.2%",
        trend: "up",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
        label: "Conversion Rate",
        value: "3.4%",
        delta: "+0.8%",
        trend: "up",
        icon: Target,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950/50",
    },
    {
        label: "Click Rate",
        value: "7.8%",
        delta: "+0.4%",
        trend: "up",
        icon: MousePointer,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-950/50",
    },
    {
        label: "Impressions",
        value: 128000,
        delta: "+5.2%",
        trend: "up",
        icon: Eye,
        color: "text-cyan-600",
        bgColor: "bg-cyan-50 dark:bg-cyan-950/50",
    },
    {
        label: "Bounce Rate",
        value: "32%",
        delta: "-2.1%",
        trend: "down",
        icon: Activity,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950/50",
    },
    {
        label: "Avg. Session",
        value: "4m 32s",
        delta: "+18s",
        trend: "up",
        icon: Zap,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50 dark:bg-indigo-950/50",
    },
    {
        label: "Cost per Click",
        value: "$0.84",
        delta: "-$0.12",
        trend: "down",
        icon: Target,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950/50",
    },
];

export const topCampaigns = [
    { name: "Summer Flash Sale", reach: 24000, ctr: "9.2%", conv: "3.8%", revenue: "$8.4k", status: "active" },
    { name: "Brand Awareness Q3", reach: 18200, ctr: "7.8%", conv: "2.4%", revenue: "$4.9k", status: "active" },
    { name: "Product Launch Buzz", reach: 15800, ctr: "8.9%", conv: "4.1%", revenue: "$6.2k", status: "paused" },
    { name: "Customer Retention", reach: 12600, ctr: "6.4%", conv: "5.2%", revenue: "$5.8k", status: "active" },
    { name: "Holiday Preview", reach: 9400, ctr: "7.1%", conv: "2.9%", revenue: "$3.1k", status: "scheduled" },
];

export const recentConversions = [
    { id: "#C-45291", channel: "Search", value: "$299", time: "2m ago", type: "Purchase" },
    { id: "#C-45278", channel: "Email", value: "$149", time: "5m ago", type: "Signup" },
    { id: "#C-45267", channel: "Social", value: "$89", time: "8m ago", type: "Purchase" },
    { id: "#C-45251", channel: "Display", value: "$199", time: "12m ago", type: "Purchase" },
    { id: "#C-45243", channel: "Video", value: "$79", time: "15m ago", type: "Signup" },
];

export const liveAlerts = [
    { message: "Campaign 'Summer Sale' exceeded daily budget", severity: "warning", time: "3m ago" },
    { message: "Conversion spike detected on Mobile traffic", severity: "success", time: "7m ago" },
    { message: "Email CTR dropped 15% in last hour", severity: "error", time: "12m ago" },
    { message: "New high-value customer acquired", severity: "success", time: "18m ago" },
];
