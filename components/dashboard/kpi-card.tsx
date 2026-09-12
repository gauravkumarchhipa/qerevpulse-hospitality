"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, HelpCircle } from "lucide-react";
import { KpiCard as KpiCardType } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";

interface KpiCardProps {
  data: KpiCardType;
  icon?: React.ReactNode;
  buttonShow?: boolean;
  activeNopTab?: any;
  setActiveNopTab?: any;
}

export default function KpiCard({
  data,
  icon,
  buttonShow = false,
  activeNopTab,
  setActiveNopTab,
}: KpiCardProps) {
  const {
    title,
    value,
    previousValue,
    change,
    changeType,
    prefix,
    suffix,
    tooltip,
  } = data;

  const isPositive = changeType === "increase";
  const Arrow = isPositive ? ArrowUpIcon : ArrowDownIcon;
  const colorClass = isPositive ? "text-green-500" : "text-red-500";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* Top Row: Title, Buttons, Tooltip */}
        <div className="flex items-start justify-between mb-2 gap-2">
          {/* Left: Title with Icon */}
          <div className="flex items-center gap-2">
            {icon && (
              <div className="h-8 w-8 rounded-md flex items-center justify-center">
                {icon}
              </div>
            )}
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
          <div className="flex items-center justify-end gap-2">
            {buttonShow && (
              <div className="overflow-x-auto scrollbar-hide max-w-[130px] xl:max-w-[150px]">
                <div className="flex gap-2 min-w-[180px]">
                  <Button
                    variant={activeNopTab === 1 ? "default" : "outline"}
                    onClick={() => setActiveNopTab(1)}
                    size="sm"
                  >
                    After
                  </Button>
                  <Button
                    variant={activeNopTab === 0 ? "default" : "outline"}
                    onClick={() => setActiveNopTab(0)}
                    size="sm"
                  >
                    Before
                  </Button>
                </div>
              </div>
            )}
          </div>
          {/* Right: Buttons + Tooltip */}
          <div className="flex items-center justify-end gap-2">
            {/* Tooltip Icon */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`h-8 w-8 rounded-md flex items-center justify-center ${
                      tooltip && "cursor-pointer"
                    }`}
                  >
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                {tooltip && tooltip.length > 0 && (
                  <TooltipContent className="max-w-[300px] whitespace-normal break-words">
                    <p>{tooltip}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Value */}
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">
            {prefix}
            {value}
            {suffix}
          </h3>

          {previousValue && (
            <p className="text-xs text-muted-foreground">
              Last period: {prefix}
              {previousValue}
              {suffix}
            </p>
          )}
        </div>

        {/* Change */}
        <div className="flex items-center mt-4">
          <div
            className={cn("flex items-center text-xs font-medium", colorClass)}
          >
            <Arrow className="h-3 w-3 mr-1" />
            <span>
              {Math.abs(change)}% {isPositive ? "Above" : "Below"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
