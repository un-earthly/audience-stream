import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const TrendIcon = ({ trend }: { trend: "up" | "down" | "neutral" }) => {
    const iconProps = { className: "h-3 w-3" };
    switch (trend) {
        case "up": return <TrendingUp {...iconProps} />;
        case "down": return <TrendingDown {...iconProps} />;
        default: return <Minus {...iconProps} />;
    }
};