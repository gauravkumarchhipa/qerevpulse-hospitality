import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
  User,
  Activity,
  LineChart as LineChartIcon,
  UtensilsCrossed,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import KpiCard from "../kpi-card";
import { Card } from "@/components/ui/card";
import TableView from "../TableView";
import ChartWithInsights from "../charts/ChartWithInsights";
import LineChart from "../charts/line-chart";
import PieChart from "../charts/pie-chart";
import PerformanceVarianceCard from "../charts/PerformanceVariance";
import WaterfallChart from "../charts/waterfall-chart";
import {
  getKpiCards2,
  getKpiCards2YTD,
} from "@/lib/dashboard/overview/OverViewCards";
import {
  getExpenseCategories,
  getExpenseCategoriesYTD,
} from "@/lib/dashboard/overview/ExpenseCategories";
import {
  getWaterfallDataDetailed,
  getWaterfallDataDetailedYTD,
} from "@/lib/dashboard/overview/ProfitandLossWaterfall";
import {
  getYearlyTrendData,
  getYearlyTrendDataYTD,
} from "@/lib/dashboard/overview/ProfitTrend";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CashPayIcon from "@/icons/CashPayIcon";

const OverView = () => {
  const view = useSelector(
    (state: RootState) => state.filters.appliedFilters?.view,
    shallowEqual
  );
  const [activeNopTab, setActiveNopTab] = useState<0 | 1>(1);
  const [kpiCards2, expenseCategories, waterfallData, yearlyTrendData] =
    useMemo(() => {
      const isMonth = view === "month";
      return [
        isMonth ? getKpiCards2() : getKpiCards2YTD(),
        isMonth ? getExpenseCategories() : getExpenseCategoriesYTD(),
        isMonth ? getWaterfallDataDetailed() : getWaterfallDataDetailedYTD(),
        isMonth ? getYearlyTrendData() : getYearlyTrendDataYTD(),
      ];
    }, [view]);

  const { otherCards, activeNop } = useMemo(() => {
    const nop = kpiCards2.filter((card) => card.title === "NOP");
    const others = kpiCards2.filter((card) => card.title !== "NOP");
    const selectedNop = nop.find((card) => card.isAfter === activeNopTab);

    return {
      otherCards: others,
      activeNop: selectedNop,
    };
  }, [kpiCards2, activeNopTab]);
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {otherCards?.map((card, index) => (
          <KpiCard
            key={index}
            data={card}
            icon={
              index === 0 ? (
                <User className="h-5 w-5 text-blue-500" />
              ) : index === 1 ? (
                <BarChartIcon className="h-5 w-5 text-green-500" />
              ) : index === 2 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : index === 3 ? (
                <CashPayIcon color={"#f6ad55"} className="h-5 w-5" />
              ) : index === 4 ? (
                <UtensilsCrossed className="h-5 w-5 text-orange-400" />
              ) : index === 5 ? (
                <Activity className="h-5 w-5 text-orange-400" />
              ) : index === 6 ? (
                <PieChartIcon className="h-5 w-5 text-orange-400" />
              ) : index === 7 ? (
                <LineChartIcon className="h-5 w-5 text-orange-400" />
              ) : (
                <Activity className="h-5 w-5 text-gray-400" />
              )
            }
          />
        ))}
        {activeNop && (
          <KpiCard
            data={activeNop}
            icon={<LineChartIcon className="h-5 w-5 text-orange-400" />}
            buttonShow={true}
            setActiveNopTab={setActiveNopTab}
            activeNopTab={activeNopTab}
          />
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <WaterfallChart data={waterfallData} height={350} />
        </Card>

        <PerformanceVarianceCard />
      </div>
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <LineChart
            data={yearlyTrendData}
            title="Profit Trend"
            height={350}
            showGrid={false}
            ReferenceAreaShow={true}
          />
        </Card>
        <Card className="p-6">
          <PieChart
            data={expenseCategories}
            title="Expense Categories"
            height={350}
          />
        </Card>
      </div>
      {/* AI Insights */}
      <ChartWithInsights />
      <TableView />
    </div>
  );
};

export default OverView;
