import { TrendingUp, DollarSign } from 'lucide-react';

interface RevenueData {
  period: string;
  room_revenue: number;
  food_beverage: number;
  events_conferences: number;
  other_revenue: number;
}

interface Props {
  data: RevenueData[];
}

export default function RevenueDashboard({ data }: Props) {
  const totalRevenue = data.reduce((sum, month) =>
    sum + month.room_revenue + month.food_beverage + month.events_conferences + month.other_revenue, 0
  );

  const revenueBySource = {
    rooms: data.reduce((sum, m) => sum + m.room_revenue, 0),
    fb: data.reduce((sum, m) => sum + m.food_beverage, 0),
    events: data.reduce((sum, m) => sum + m.events_conferences, 0),
    other: data.reduce((sum, m) => sum + m.other_revenue, 0),
  };

  const maxRevenue = Math.max(...data.map(m =>
    m.room_revenue + m.food_beverage + m.events_conferences + m.other_revenue
  ));

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-xl border border-emerald-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Revenue Analysis</h2>
          <p className="text-gray-600">12-Month Performance Overview</p>
        </div>
        <div className="bg-emerald-500 p-4 rounded-xl">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Room Revenue</span>
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">${(revenueBySource.rooms / 1000).toFixed(0)}K</p>
          <p className="text-sm text-emerald-600 mt-1">{(revenueBySource.rooms / totalRevenue * 100).toFixed(1)}% of total</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">F&B Revenue</span>
            <DollarSign className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">${(revenueBySource.fb / 1000).toFixed(0)}K</p>
          <p className="text-sm text-emerald-600 mt-1">{(revenueBySource.fb / totalRevenue * 100).toFixed(1)}% of total</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Events</span>
            <DollarSign className="w-5 h-5 text-pink-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">${(revenueBySource.events / 1000).toFixed(0)}K</p>
          <p className="text-sm text-emerald-600 mt-1">{(revenueBySource.events / totalRevenue * 100).toFixed(1)}% of total</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Revenue</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">${(totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-sm text-emerald-600 mt-1">Annual Performance</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Monthly Revenue Trend</h3>
        <div className="space-y-3">
          {data.map((month) => {
            const total = month.room_revenue + month.food_beverage + month.events_conferences + month.other_revenue;
            const percentage = (total / maxRevenue) * 100;
            const date = new Date(month.period);
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

            return (
              <div key={month.period} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 w-16">{monthName}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden relative">
                  <div className="absolute inset-0 flex">
                    <div
                      className="bg-blue-500 h-full transition-all duration-500"
                      style={{ width: `${(month.room_revenue / total) * percentage}%` }}
                    />
                    <div
                      className="bg-orange-500 h-full transition-all duration-500"
                      style={{ width: `${(month.food_beverage / total) * percentage}%` }}
                    />
                    <div
                      className="bg-pink-500 h-full transition-all duration-500"
                      style={{ width: `${(month.events_conferences / total) * percentage}%` }}
                    />
                    <div
                      className="bg-teal-500 h-full transition-all duration-500"
                      style={{ width: `${(month.other_revenue / total) * percentage}%` }}
                    />
                  </div>
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
        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Rooms</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-600">F&B</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-500 rounded"></div>
            <span className="text-sm text-gray-600">Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-teal-500 rounded"></div>
            <span className="text-sm text-gray-600">Other</span>
          </div>
        </div>
      </div>
    </div>
  );
}
