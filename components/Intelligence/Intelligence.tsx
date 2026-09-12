"use client";
import { useState, useEffect } from "react";
import { BarChart3, Sparkles } from "lucide-react";
import RevenueDashboard from "./components/RevenueDashboard";
import CostDashboard from "./components/CostDashboard";
import ProfitDashboard from "./components/ProfitDashboard";
import StrategyBotPage from "./components/StrategyBotPage";
import { supabase } from "@/lib/supabase";

interface RevenueData {
  period: string;
  room_revenue: number;
  food_beverage: number;
  events_conferences: number;
  other_revenue: number;
}

interface ExpenseData {
  period: string;
  labor_costs: number;
  food_costs: number;
  utilities: number;
  maintenance: number;
  marketing: number;
  administrative: number;
}

function Intelligence() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<"dashboard" | "strategy">(
    "dashboard"
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: revenue } = await supabase
        .from("revenue_streams")
        .select("*")
        .order("period", { ascending: true });

      const { data: expenses } = await supabase
        .from("operating_expenses")
        .select("*")
        .order("period", { ascending: true });

      if (revenue) setRevenueData(revenue);
      if (expenses) setExpenseData(expenses);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">
            Loading Financial Data...
          </p>
        </div>
      </div>
    );
  }

  if (currentPage === "strategy") {
    return <StrategyBotPage onBack={() => setCurrentPage("dashboard")} />;
  }

  return (
    <StrategyBotPage onBack={() => setCurrentPage("dashboard")} />
    // <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-8">
    //   <div className="max-w-[1800px] mx-auto space-y-8">
    //     <header className="text-center mb-12">
    //       <div className="flex items-center justify-center gap-4 mb-4">
    //         <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-4 rounded-2xl shadow-lg">
    //           <BarChart3 className="w-12 h-12 text-white" />
    //         </div>
    //         <div className="text-left">
    //           <h1 className="text-5xl font-bold text-gray-800">
    //             Hospitality Intelligence Hub
    //           </h1>
    //           <p className="text-xl text-gray-600 mt-2">
    //             Strategic P&L Analysis & AI-Powered Insights
    //           </p>
    //         </div>
    //       </div>

    //       <div className="flex justify-center gap-3 mt-6">
    //         <button
    //           onClick={() => setCurrentPage("strategy")}
    //           className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-600 hover:via-fuchsia-600 hover:to-pink-600 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
    //         >
    //           <Sparkles className="w-6 h-6" />
    //           Open Strategic AI Bot
    //         </button>
    //       </div>
    //     </header>

    //     <div className="space-y-8">
    //       <RevenueDashboard data={revenueData} />
    //       <CostDashboard data={expenseData} />
    //       <ProfitDashboard
    //         revenueData={revenueData}
    //         expenseData={expenseData}
    //       />
    //     </div>

    //     <footer className="text-center text-gray-500 text-sm mt-12 pb-8">
    //       <p>
    //         Powered by AI-driven strategic analysis • Real-time P&L monitoring
    //       </p>
    //     </footer>
    //   </div>
    // </div>
  );
}

export default Intelligence;
