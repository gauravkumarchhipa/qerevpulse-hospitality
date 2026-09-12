import { AlertCircle, TrendingDown } from 'lucide-react';

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
  data: ExpenseData[];
}

export default function CostDashboard({ data }: Props) {
  const totalExpenses = data.reduce((sum, month) =>
    sum + month.labor_costs + month.food_costs + month.utilities +
    month.maintenance + month.marketing + month.administrative, 0
  );

  const expensesByCategory = {
    labor: data.reduce((sum, m) => sum + m.labor_costs, 0),
    food: data.reduce((sum, m) => sum + m.food_costs, 0),
    utilities: data.reduce((sum, m) => sum + m.utilities, 0),
    maintenance: data.reduce((sum, m) => sum + m.maintenance, 0),
    marketing: data.reduce((sum, m) => sum + m.marketing, 0),
    administrative: data.reduce((sum, m) => sum + m.administrative, 0),
  };

  const categories = [
    { name: 'Labor Costs', value: expensesByCategory.labor, color: 'bg-red-500', lightColor: 'bg-red-100' },
    { name: 'Food Costs', value: expensesByCategory.food, color: 'bg-orange-500', lightColor: 'bg-orange-100' },
    { name: 'Marketing', value: expensesByCategory.marketing, color: 'bg-blue-500', lightColor: 'bg-blue-100' },
    { name: 'Administrative', value: expensesByCategory.administrative, color: 'bg-slate-500', lightColor: 'bg-slate-100' },
    { name: 'Utilities', value: expensesByCategory.utilities, color: 'bg-yellow-500', lightColor: 'bg-yellow-100' },
    { name: 'Maintenance', value: expensesByCategory.maintenance, color: 'bg-green-500', lightColor: 'bg-green-100' },
  ].sort((a, b) => b.value - a.value);

  const maxExpense = Math.max(...data.map(m =>
    m.labor_costs + m.food_costs + m.utilities + m.maintenance + m.marketing + m.administrative
  ));

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-xl border border-orange-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Cost Breakdown</h2>
          <p className="text-gray-600">Operating Expense Analysis</p>
        </div>
        <div className="bg-orange-500 p-4 rounded-xl">
          <AlertCircle className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Expense Categories</h3>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm font-bold text-gray-800">
                    ${(category.value / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${category.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${(category.value / totalExpenses) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {(category.value / totalExpenses * 100).toFixed(1)}% of total expenses
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Cost Distribution</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {(() => {
                  let currentAngle = 0;
                  return categories.map((category, index) => {
                    const percentage = (category.value / totalExpenses) * 100;
                    const angle = (percentage / 100) * 360;
                    const startAngle = currentAngle;
                    currentAngle += angle;

                    const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                    const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                    const endX = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
                    const endY = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
                    const largeArc = angle > 180 ? 1 : 0;

                    const colors = ['#ef4444', '#f97316', '#3b82f6', '#64748b', '#eab308', '#22c55e'];

                    return (
                      <path
                        key={category.name}
                        d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`}
                        fill={colors[index]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    );
                  });
                })()}
                <circle cx="50" cy="50" r="25" fill="white" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800">${(totalExpenses / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-gray-600">Total Cost</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {categories.map((category, index) => {
              const colors = ['bg-red-500', 'bg-orange-500', 'bg-blue-500', 'bg-slate-500', 'bg-yellow-500', 'bg-green-500'];
              return (
                <div key={category.name} className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${colors[index]} rounded-full`}></div>
                  <span className="text-xs text-gray-600">{category.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Monthly Expense Trend</h3>
        <div className="space-y-3">
          {data.map((month) => {
            const total = month.labor_costs + month.food_costs + month.utilities +
                         month.maintenance + month.marketing + month.administrative;
            const percentage = (total / maxExpense) * 100;
            const date = new Date(month.period);
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

            return (
              <div key={month.period} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 w-16">{monthName}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden relative">
                  <div
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-end pr-3">
                    <span className="text-xs font-semibold text-white drop-shadow-md">
                      ${(total / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
