import { StatCard } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { TrendIcon } from "./trend-icon";
import { kFormatter } from "@/lib/utils";

export const StatCardComponent = ({ stat }: { stat: StatCard }) => {
    const isPositive = stat.trend === "up";
    const isNegative = stat.trend === "down";

    return (
        <Card className="group hover:shadow-md transition-all duration-200 border-muted/40">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardDescription className="text-xs font-medium text-muted-foreground/80">
                        {stat.label}
                    </CardDescription>
                    <div className={`p-1.5 rounded-full transition-colors ${isPositive ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' :
                        isNegative ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400' :
                            'bg-muted text-muted-foreground'
                        }`}>
                        <TrendIcon trend={stat.trend} />
                    </div>
                </div>
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        {typeof stat.value === "number" ? kFormatter(stat.value) : stat.value}
                    </CardTitle>
                    <Badge
                        variant="secondary"
                        className={`text-xs h-5 ${isPositive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' :
                            isNegative ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400' :
                                ''
                            }`}
                    >
                        {stat.delta}
                    </Badge>
                </div>
            </CardHeader>
        </Card>
    );
};