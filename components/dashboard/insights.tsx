"use client";

import { Card } from "@/components/ui/card";
import {
  aiInsights,
  aiInsightsYTD,
} from "@/lib/dashboard/overview/AI-GeneratedInsights";
import { RootState } from "@/store/store";
import { BrainCircuit } from "lucide-react";
import { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";

export default function Insights() {
  const view = useSelector(
    (state: RootState) => state.filters.appliedFilters?.view,
    shallowEqual
  );
  const [aiInsightsData] = useMemo(() => {
    const isMonth = view === "month";
    return [isMonth ? aiInsights : aiInsightsYTD];
  }, [view]);
  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-center gap-2 mb-2">
        <BrainCircuit className="h-5 w-5 text-amber-500" />
        <h3 className="text-base font-medium">AI-Generated Insights</h3>
      </div>
      <div className="overflow-y-auto max-h-[350px] pr-2">
        <ul className="space-y-3 text-sm">
          {aiInsightsData?.map((insight, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="h-2 w-2 mt-2 rounded-full bg-amber-500 shrink-0" />
              <span>{insight.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
