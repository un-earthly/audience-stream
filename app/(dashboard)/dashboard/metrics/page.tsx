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
import { RefreshCw, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Activity, Users, Target, Zap, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { timeSeries, channelPerf, audienceShare, radarData, statCards, topCampaigns, recentConversions, liveAlerts } from "@/lib/data";

const kFormatter = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString());

// data moved to @/lib/data

export default function EnhancedMetricsPage() {
    const [refreshing, setRefreshing] = React.useState(false);
    const [campaignSearch, setCampaignSearch] = React.useState("");
    const [convSearch, setConvSearch] = React.useState("");
    const [selectedMetric, setSelectedMetric] = React.useState("reach");
    const [dateRange, setDateRange] = React.useState("24h");

    // Enhanced carousel with smooth animations
    const statCarouselRef = React.useRef<HTMLDivElement | null>(null);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [itemsPerView, setItemsPerView] = React.useState(4);
    const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

    const updateLayout = React.useCallback(() => {
        const el = statCarouselRef.current;
        if (!el) return;
        const cardWidth = 280; // Fixed width for better control
        const ipv = Math.max(1, Math.floor((el.clientWidth - 32) / cardWidth));
        setItemsPerView(ipv);
    }, []);

    React.useEffect(() => {
        updateLayout();
        window.addEventListener("resize", updateLayout);
        return () => window.removeEventListener("resize", updateLayout);
    }, [updateLayout]);

    // Auto-advance carousel
    React.useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentPage(prev => (prev + 1) % Math.ceil(statCards.length / itemsPerView));
        }, 4000);
        return () => clearInterval(interval);
    }, [itemsPerView, isAutoPlaying]);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        const el = statCarouselRef.current;
        if (el) {
            const scrollLeft = page * (280 * itemsPerView + 16);
            el.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 1200));
        setRefreshing(false);
    };

    const filteredCampaigns = topCampaigns.filter(c =>
        c.name.toLowerCase().includes(campaignSearch.toLowerCase())
    );

    const filteredConversions = recentConversions.filter(c =>
        c.id.toLowerCase().includes(convSearch.toLowerCase()) ||
        c.channel.toLowerCase().includes(convSearch.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <Card className="border-none shadow-lg bg-gradient-to-r from-background via-background to-muted/20">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Activity className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-bold">
                                            Campaign Analytics
                                        </CardTitle>
                                        <CardDescription className="text-base">
                                            Real-time insights across all marketing channels
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    Live Data
                                </div>
                                <Select value={dateRange} onValueChange={setDateRange}>
                                    <SelectTrigger className="w-32">
                                        <Calendar className="size-4 mr-2" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1d">Today</SelectItem>
                                        <SelectItem value="7d">7 Days</SelectItem>
                                        <SelectItem value="30d">30 Days</SelectItem>
                                        <SelectItem value="90d">90 Days</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={handleRefresh}
                                    variant="outline"
                                    disabled={refreshing}
                                    className="gap-2"
                                >
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Live Alerts Banner */}
                <div className="rounded-xl bg-muted/30 border border-border/50 p-4">
                    <div className="flex items-center gap-3 overflow-x-auto">
                        <Activity className="h-5 w-5 text-primary animate-pulse flex-shrink-0" />
                        <div className="flex gap-6 animate-scroll">
                            {liveAlerts.map((alert, i) => (
                                <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                                    <div className={`w-2 h-2 rounded-full ${alert.severity === 'success' ? 'bg-primary' :
                                        alert.severity === 'warning' ? 'bg-muted-foreground' : 'bg-destructive'
                                        }`} />
                                    <span className="text-sm font-medium text-foreground">
                                        {alert.message}
                                    </span>
                                    <span className="text-xs text-muted-foreground">({alert.time})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enhanced Stats Carousel */}
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-foreground">Key Metrics</h2>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                className="text-muted-foreground"
                            >
                                {isAutoPlaying ? "Pause" : "Play"}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => goToPage(Math.max(0, currentPage - 1))}
                                className="h-8 w-8"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => goToPage(currentPage + 1)}
                                className="h-8 w-8"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div
                        ref={statCarouselRef}
                        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        {statCards.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <Card
                                    key={i}
                                    className="min-w-[260px] bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-xl bg-muted/50 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className={`h-6 w-6 text-primary`} />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {stat.trend === "up" ? (
                                                    <TrendingUp className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <TrendingDown className="h-4 w-4 text-destructive" />
                                                )}
                                                <span className={`text-sm font-semibold ${stat.trend === "up" ? "text-primary" : "text-destructive"
                                                    }`}>
                                                    {stat.delta}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground font-medium">
                                                {stat.label}
                                            </p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {typeof stat.value === "number" ? kFormatter(stat.value) : stat.value}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="flex justify-center mt-4 gap-2">
                        {Array.from({ length: Math.ceil(statCards.length / itemsPerView) }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToPage(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentPage
                                    ? 'w-8 bg-primary'
                                    : 'w-2 bg-muted hover:bg-muted/80'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Enhanced Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Time Series Chart - spans 8 columns */}
                    <Card className="lg:col-span-8 bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
                        <CardHeader className="border-b border-border/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl">Performance Timeline</CardTitle>
                                    <CardDescription>Hourly metrics over the past 24 hours</CardDescription>
                                </div>
                                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                                    <SelectTrigger className="w-36">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="reach">Reach</SelectItem>
                                        <SelectItem value="impressions">Impressions</SelectItem>
                                        <SelectItem value="engagement">Engagement</SelectItem>
                                        <SelectItem value="conversions">Conversions</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={timeSeries}>
                                        <defs>
                                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.24} />
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                                        <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                                        <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--card)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '12px',
                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey={selectedMetric}
                                            stroke="var(--primary)"
                                            fill="url(#colorGradient)"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Channel Performance - spans 4 columns */}
                    <Card className="lg:col-span-4 bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Channel Performance</CardTitle>
                            <CardDescription>Clicks vs conversions by channel</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={channelPerf} layout="horizontal">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="channel" type="category" width={60} />
                                        <Tooltip />
                                        <Bar dataKey="clicks" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                                        <Bar dataKey="conversions" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Audience Distribution */}
                    <Card className="lg:col-span-4 bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Audience Segments</CardTitle>
                            <CardDescription>Distribution by demographics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={audienceShare}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {audienceShare.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={`var(--chart-${index + 1})`} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Performance Radar */}
                    <Card className="lg:col-span-4 bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Performance vs Benchmark</CardTitle>
                            <CardDescription>Current vs industry average</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={radarData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="metric" />
                                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                                        <Radar name="Current" dataKey="current" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} strokeWidth={2} />
                                        <Radar name="Benchmark" dataKey="benchmark" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.15} strokeWidth={2} />
                                        <Legend />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Conversion Funnel */}
                    <Card className="lg:col-span-4 bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Conversion Funnel</CardTitle>
                            <CardDescription>Step-by-step conversion analysis</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { stage: "Impressions", value: 128000, percent: 100 },
                                    { stage: "Clicks", value: 9984, percent: 7.8 },
                                    { stage: "Landing Page", value: 7488, percent: 75 },
                                    { stage: "Add to Cart", value: 2996, percent: 40 },
                                    { stage: "Purchase", value: 449, percent: 15 }
                                ].map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">{item.stage}</span>
                                            <span className="text-muted-foreground">{kFormatter(item.value)}</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-primary to-primary/70 h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${item.percent}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Enhanced Tables Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Campaigns */}
                    <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Top Campaigns</CardTitle>
                                    <CardDescription>Best performing campaigns this period</CardDescription>
                                </div>
                                <Button variant="outline" size="sm">Export</Button>
                            </div>
                            <Input
                                placeholder="Search campaigns..."
                                value={campaignSearch}
                                onChange={(e) => setCampaignSearch(e.target.value)}
                                className="mt-4 bg-background/50"
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {filteredCampaigns.slice(0, 5).map((campaign, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/40 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-semibold text-foreground">{campaign.name}</h4>
                                                <Badge
                                                    variant={campaign.status === 'active' ? 'default' :
                                                        campaign.status === 'paused' ? 'secondary' : 'outline'}
                                                    className=""
                                                >
                                                    {campaign.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>Reach: {kFormatter(campaign.reach)}</span>
                                                <span>CTR: {campaign.ctr}</span>
                                                <span>Conv: {campaign.conv}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-foreground">{campaign.revenue}</div>
                                            <div className="text-xs text-muted-foreground">Revenue</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Conversions */}
                    <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Conversions</CardTitle>
                                    <CardDescription>Latest conversion events</CardDescription>
                                </div>
                                <Button variant="outline" size="sm">View All</Button>
                            </div>
                            <Input
                                placeholder="Search conversions..."
                                value={convSearch}
                                onChange={(e) => setConvSearch(e.target.value)}
                                className="mt-4 bg-background/50"
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {filteredConversions.slice(0, 5).map((conversion, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/40 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                                                {conversion.channel.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground">{conversion.id}</div>
                                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <span>{conversion.channel}</span>
                                                    <span>•</span>
                                                    <Badge variant="outline" className="text-xs py-0">{conversion.type}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-foreground">{conversion.value}</div>
                                            <div className="text-xs text-muted-foreground">{conversion.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Insights Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-card/80 text-foreground border border-border/50 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Activity className="h-8 w-8 text-primary opacity-90" />
                                <Badge variant="secondary">Today</Badge>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Active Sessions</p>
                                <p className="text-3xl font-bold">1,247</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3 text-primary" />
                                    +18% vs yesterday
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/80 text-foreground border border-border/50 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Target className="h-8 w-8 text-primary opacity-90" />
                                <Badge variant="secondary">Goal</Badge>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Monthly Target</p>
                                <p className="text-3xl font-bold">87%</p>
                                <div className="w-full bg-muted rounded-full h-2 mt-2">
                                    <div className="bg-primary rounded-full h-2" style={{ width: '87%' }} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/80 text-foreground border border-border/50 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Users className="h-8 w-8 text-primary opacity-90" />
                                <Badge variant="secondary">Growth</Badge>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">New Customers</p>
                                <p className="text-3xl font-bold">+2,134</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3 text-primary" />
                                    +24% this month
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/80 text-foreground border border-border/50 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Zap className="h-8 w-8 text-primary opacity-90" />
                                <Badge variant="secondary">ROI</Badge>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Return on Ad Spend</p>
                                <p className="text-3xl font-bold">4.2x</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3 text-primary" />
                                    +0.3x improvement
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer with additional actions */}
                <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                                    <Activity className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Need deeper insights?</h3>
                                    <p className="text-sm text-muted-foreground">Schedule a detailed report or set up custom alerts</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline">Set Alerts</Button>
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Generate Report
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}