import { TrendingUp, DollarSign, Percent } from 'lucide-react';

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

interface Props {
  revenueData: RevenueData[];
  expenseData: ExpenseData[];
}

export default function ProfitDashboard({ revenueData, expenseData }: Props) {
  const monthlyData = revenueData.map((rev, idx) => {
    const exp = expenseData[idx];
    const revenue = rev.room_revenue + rev.food_beverage + rev.events_conferences + rev.other_revenue;
    const expenses = exp.labor_costs + exp.food_costs + exp.utilities + exp.maintenance + exp.marketing + exp.administrative;
    const profit = revenue - expenses;
    const margin = (profit / revenue) * 100;

    return {
      period: rev.period,
      revenue,
      expenses,
      profit,
      margin
    };
  });

  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const avgMargin = (totalProfit / totalRevenue) * 100;

  const maxValue = Math.max(...monthlyData.map(m => Math.max(m.revenue, m.expenses)));
  const bestMonth = monthlyData.reduce((best, current) => current.profit > best.profit ? current : best);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-xl border border-blue-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Profit & Performance</h2>
          <p className="text-gray-600">Financial Health Overview</p>
        </div>
        <div className="bg-blue-500 p-4 rounded-xl">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Net Profit</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">${(totalProfit / 1000).toFixed(0)}K</p>
          <p className="text-sm text-emerald-600 mt-1">Annual Performance</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Profit Margin</span>
            <Percent className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{avgMargin.toFixed(1)}%</p>
          <p className="text-sm text-blue-600 mt-1">Average Margin</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-cyan-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Revenue</span>
            <TrendingUp className="w-5 h-5 text-cyan-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">${(totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-sm text-cyan-600 mt-1">12 Month Total</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Best Month</span>
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {new Date(bestMonth.period).toLocaleDateString('en-US', { month: 'short' })}
          </p>
          <p className="text-sm text-orange-600 mt-1">${(bestMonth.profit / 1000).toFixed(0)}K profit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Revenue vs Expenses</h3>
          <div className="space-y-4">
            {monthlyData.map((month) => {
              const date = new Date(month.period);
              const monthName = date.toLocaleDateString('en-US', { month: 'short' });
              const revenuePercent = (month.revenue / maxValue) * 100;
              const expensePercent = (month.expenses / maxValue) * 100;

              return (
                <div key={month.period} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{monthName}</span>
                    <span className="text-xs text-gray-500">
                      Profit: ${(month.profit / 1000).toFixed(1)}K
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-16">Revenue</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                          style={{ width: `${revenuePercent}%` }}
                        >
                          <span className="text-xs font-semibold text-white">
                            ${(month.revenue / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-16">Expenses</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-red-400 to-red-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                          style={{ width: `${expensePercent}%` }}
                        >
                          <span className="text-xs font-semibold text-white">
                            ${(month.expenses / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Profit Margin Trend</h3>
          <div className="space-y-3">
            {monthlyData.map((month) => {
              const date = new Date(month.period);
              const monthName = date.toLocaleDateString('en-US', { month: 'short' });
              const isPositive = month.margin > avgMargin;

              return (
                <div key={month.period} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-12">{monthName}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-10 overflow-hidden relative">
                    <div
                      className={`${
                        isPositive ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-blue-500'
                      } h-full rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(month.margin * 4, 100)}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <span className="text-xs font-semibold text-gray-600">
                        {month.margin.toFixed(1)}%
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        ${(month.profit / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Average Margin</span>
              <span className="text-2xl font-bold text-blue-600">{avgMargin.toFixed(1)}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Industry benchmark: 15-25% • Your performance is {avgMargin >= 15 ? 'strong' : 'below target'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
