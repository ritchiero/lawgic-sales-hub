import { Flame, Sun, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

type Temperatura = "hot" | "warm" | "cold";

const tempConfig: Record<Temperatura, { icon: React.ElementType; label: string; className: string }> = {
  hot: {
    icon: Flame,
    label: "Hot",
    className: "text-temp-hot",
  },
  warm: {
    icon: Sun,
    label: "Warm",
    className: "text-temp-warm",
  },
  cold: {
    icon: Snowflake,
    label: "Cold",
    className: "text-temp-cold",
  },
};

interface TemperatureBadgeProps {
  temperatura: Temperatura;
  showLabel?: boolean;
  className?: string;
}

export function TemperatureBadge({ temperatura, showLabel = false, className }: TemperatureBadgeProps) {
  const config = tempConfig[temperatura];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Icon className={cn("h-4 w-4", config.className)} />
      {showLabel && <span className={cn("text-sm", config.className)}>{config.label}</span>}
    </div>
  );
}
