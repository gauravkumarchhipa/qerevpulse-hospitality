"use client";

import { Card, CardContent } from "@/components/ui/card";

interface RevenueCardProps {
  value: string;
  label: string;
  color?: string;
  icon?: any;
  prefix?: string;
  suffix?: string;
}

export default function RevenueCard({
  value,
  label,
  color,
  icon,
  prefix,
  suffix,
}: RevenueCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="h-8 w-8 rounded-md flex items-center justify-center">
              {icon}
            </div>
          )}
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        <h3 className="text-2xl font-bold mt-4">
          {prefix}
          {value}
          {suffix}
        </h3>
        {/* <div className={`text-2xl font-bold text-center ${color}`}>{value}</div>
        <div className={`text-sm mt-1 text-center ${color}`}>{label}</div> */}
      </CardContent>
    </Card>
  );
}
