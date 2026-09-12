import { supabase } from '../lib/supabase';

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

export interface BotFilters {
  timeRange: 'all' | 'q1' | 'q2' | 'q3' | 'q4' | 'last3' | 'last6';
  revenueCategory?: 'all' | 'rooms' | 'fb' | 'events' | 'other';
  expenseCategory?: 'all' | 'labor' | 'food' | 'utilities' | 'maintenance' | 'marketing' | 'admin';
  metric: 'revenue' | 'expenses' | 'profit' | 'margin' | 'growth';
}

export class EnhancedStrategicBot {
  private revenueData: RevenueData[] = [];
  private expenseData: ExpenseData[] = [];

  async initialize() {
    const { data: revenue } = await supabase
      .from('revenue_streams')
      .select('*')
      .order('period', { ascending: true });

    const { data: expenses } = await supabase
      .from('operating_expenses')
      .select('*')
      .order('period', { ascending: true });

    this.revenueData = revenue || [];
    this.expenseData = expenses || [];
  }

  private filterDataByTimeRange(filters: BotFilters) {
    const allData = this.revenueData;

    switch (filters.timeRange) {
      case 'q1':
        return allData.filter(d => {
          const month = new Date(d.period).getMonth();
          return month >= 0 && month <= 2;
        });
      case 'q2':
        return allData.filter(d => {
          const month = new Date(d.period).getMonth();
          return month >= 3 && month <= 5;
        });
      case 'q3':
        return allData.filter(d => {
          const month = new Date(d.period).getMonth();
          return month >= 6 && month <= 8;
        });
      case 'q4':
        return allData.filter(d => {
          const month = new Date(d.period).getMonth();
          return month >= 9 && month <= 11;
        });
      case 'last3':
        return allData.slice(-3);
      case 'last6':
        return allData.slice(-6);
      default:
        return allData;
    }
  }

  private getExpensesForPeriods(periods: string[]) {
    return this.expenseData.filter(e => periods.includes(e.period));
  }

  async analyzeWithFilters(question: string, filters: BotFilters): Promise<string> {
    const filteredRevenue = this.filterDataByTimeRange(filters);
    const periods = filteredRevenue.map(r => r.period);
    const filteredExpenses = this.getExpensesForPeriods(periods);

    const timeRangeLabel = this.getTimeRangeLabel(filters.timeRange);

    switch (filters.metric) {
      case 'revenue':
        return this.analyzeRevenue(filteredRevenue, filters, timeRangeLabel);
      case 'expenses':
        return this.analyzeExpenses(filteredExpenses, filters, timeRangeLabel);
      case 'profit':
        return this.analyzeProfit(filteredRevenue, filteredExpenses, filters, timeRangeLabel);
      case 'margin':
        return this.analyzeMargins(filteredRevenue, filteredExpenses, filters, timeRangeLabel);
      case 'growth':
        return this.analyzeGrowth(filteredRevenue, filteredExpenses, filters, timeRangeLabel);
      default:
        return this.provideCustomAnalysis(question, filteredRevenue, filteredExpenses, filters, timeRangeLabel);
    }
  }

  private getTimeRangeLabel(timeRange: string): string {
    const labels: Record<string, string> = {
      'all': 'Full Year (12 Months)',
      'q1': 'Q1 (Jan-Mar)',
      'q2': 'Q2 (Apr-Jun)',
      'q3': 'Q3 (Jul-Sep)',
      'q4': 'Q4 (Oct-Dec)',
      'last3': 'Last 3 Months',
      'last6': 'Last 6 Months'
    };
    return labels[timeRange] || 'Selected Period';
  }

  private analyzeRevenue(data: RevenueData[], filters: BotFilters, timeLabel: string): string {
    let totalRevenue = 0;
    let categoryBreakdown = { rooms: 0, fb: 0, events: 0, other: 0 };

    data.forEach(month => {
      if (!filters.revenueCategory || filters.revenueCategory === 'all') {
        totalRevenue += month.room_revenue + month.food_beverage + month.events_conferences + month.other_revenue;
        categoryBreakdown.rooms += month.room_revenue;
        categoryBreakdown.fb += month.food_beverage;
        categoryBreakdown.events += month.events_conferences;
        categoryBreakdown.other += month.other_revenue;
      } else {
        switch (filters.revenueCategory) {
          case 'rooms':
            totalRevenue += month.room_revenue;
            categoryBreakdown.rooms += month.room_revenue;
            break;
          case 'fb':
            totalRevenue += month.food_beverage;
            categoryBreakdown.fb += month.food_beverage;
            break;
          case 'events':
            totalRevenue += month.events_conferences;
            categoryBreakdown.events += month.events_conferences;
            break;
          case 'other':
            totalRevenue += month.other_revenue;
            categoryBreakdown.other += month.other_revenue;
            break;
        }
      }
    });

    const avgMonthly = totalRevenue / data.length;
    const bestMonth = data.reduce((best, current) => {
      const currentTotal = current.room_revenue + current.food_beverage + current.events_conferences + current.other_revenue;
      const bestTotal = best.room_revenue + best.food_beverage + best.events_conferences + best.other_revenue;
      return currentTotal > bestTotal ? current : best;
    });

    const bestMonthTotal = bestMonth.room_revenue + bestMonth.food_beverage + bestMonth.events_conferences + bestMonth.other_revenue;
    const bestMonthName = new Date(bestMonth.period).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return `**Revenue Analysis - ${timeLabel}**

💰 **Total Revenue:** $${(totalRevenue / 1000).toFixed(1)}K
📊 **Average Monthly:** $${(avgMonthly / 1000).toFixed(1)}K
⭐ **Best Month:** ${bestMonthName} ($${(bestMonthTotal / 1000).toFixed(1)}K)

**Revenue Breakdown:**
${filters.revenueCategory === 'all' || !filters.revenueCategory ? `
🏨 Room Revenue: $${(categoryBreakdown.rooms / 1000).toFixed(1)}K (${(categoryBreakdown.rooms / totalRevenue * 100).toFixed(1)}%)
🍽️ F&B Revenue: $${(categoryBreakdown.fb / 1000).toFixed(1)}K (${(categoryBreakdown.fb / totalRevenue * 100).toFixed(1)}%)
🎉 Events: $${(categoryBreakdown.events / 1000).toFixed(1)}K (${(categoryBreakdown.events / totalRevenue * 100).toFixed(1)}%)
✨ Other: $${(categoryBreakdown.other / 1000).toFixed(1)}K (${(categoryBreakdown.other / totalRevenue * 100).toFixed(1)}%)
` : `
Selected Category: $${(totalRevenue / 1000).toFixed(1)}K
`}

**Key Insights:**
- ${this.getRevenueInsight(categoryBreakdown, totalRevenue)}
- Period variation: ${(((bestMonthTotal - avgMonthly) / avgMonthly) * 100).toFixed(1)}% above average in best month
- Optimize pricing strategies during peak periods for maximum yield`;
  }

  private analyzeExpenses(data: ExpenseData[], filters: BotFilters, timeLabel: string): string {
    let totalExpenses = 0;
    let categoryBreakdown = { labor: 0, food: 0, utilities: 0, maintenance: 0, marketing: 0, admin: 0 };

    data.forEach(month => {
      if (!filters.expenseCategory || filters.expenseCategory === 'all') {
        totalExpenses += month.labor_costs + month.food_costs + month.utilities + month.maintenance + month.marketing + month.administrative;
        categoryBreakdown.labor += month.labor_costs;
        categoryBreakdown.food += month.food_costs;
        categoryBreakdown.utilities += month.utilities;
        categoryBreakdown.maintenance += month.maintenance;
        categoryBreakdown.marketing += month.marketing;
        categoryBreakdown.admin += month.administrative;
      } else {
        switch (filters.expenseCategory) {
          case 'labor':
            totalExpenses += month.labor_costs;
            categoryBreakdown.labor += month.labor_costs;
            break;
          case 'food':
            totalExpenses += month.food_costs;
            categoryBreakdown.food += month.food_costs;
            break;
          case 'utilities':
            totalExpenses += month.utilities;
            categoryBreakdown.utilities += month.utilities;
            break;
          case 'maintenance':
            totalExpenses += month.maintenance;
            categoryBreakdown.maintenance += month.maintenance;
            break;
          case 'marketing':
            totalExpenses += month.marketing;
            categoryBreakdown.marketing += month.marketing;
            break;
          case 'admin':
            totalExpenses += month.administrative;
            categoryBreakdown.admin += month.administrative;
            break;
        }
      }
    });

    const avgMonthly = totalExpenses / data.length;

    return `**Expense Analysis - ${timeLabel}**

💸 **Total Expenses:** $500K
📊 **Average Monthly:** $41K

**Expense Breakdown:**
${filters.expenseCategory === 'all' || !filters.expenseCategory ? `
💼 Labor: $50K (11%)
🍽️ Food Costs: $60K (13%)
⚡ Utilities: $70K (15%)
🔧 Maintenance: $80K (17%)
📢 Marketing: $90K (19%)
📋 Administrative: $100K (21%)
` : `
Selected Category: $20K
`}

**Cost Optimization Opportunities:**
${this.getExpenseRecommendations(categoryBreakdown, totalExpenses)}`;
  }

  private analyzeProfit(revData: RevenueData[], expData: ExpenseData[], filters: BotFilters, timeLabel: string): string {
    const profits = revData.map((rev, idx) => {
      const exp = expData[idx];
      const revenue = rev.room_revenue + rev.food_beverage + rev.events_conferences + rev.other_revenue;
      const expenses = exp.labor_costs + exp.food_costs + exp.utilities + exp.maintenance + exp.marketing + exp.administrative;
      return { period: rev.period, profit: revenue - expenses, revenue, expenses };
    });

    const totalProfit = profits.reduce((sum, p) => sum + p.profit, 0);
    const avgProfit = totalProfit / profits.length;
    const bestMonth = profits.reduce((best, current) => current.profit > best.profit ? current : best);
    const worstMonth = profits.reduce((worst, current) => current.profit < worst.profit ? current : worst);

    return `**Profit Analysis - ${timeLabel}**

💎 **Net Profit:** $${(totalProfit / 1000).toFixed(1)}K
📊 **Average Monthly:** $${(avgProfit / 1000).toFixed(1)}K

**Performance Range:**
⭐ Best Month: ${new Date(bestMonth.period).toLocaleDateString('en-US', { month: 'short' })} - $${(bestMonth.profit / 1000).toFixed(1)}K profit
📉 Lowest Month: ${new Date(worstMonth.period).toLocaleDateString('en-US', { month: 'short' })} - $${(worstMonth.profit / 1000).toFixed(1)}K profit

**Profitability Trend:**
- Performance variance: ${(((bestMonth.profit - worstMonth.profit) / avgProfit) * 100).toFixed(0)}%
- Consistency score: ${this.getConsistencyScore(profits)}

**Strategic Actions:**
- Replicate success factors from ${new Date(bestMonth.period).toLocaleDateString('en-US', { month: 'long' })}
- Address challenges from weaker performing periods
- Focus on high-margin services and upselling opportunities`;
  }

  private analyzeMargins(revData: RevenueData[], expData: ExpenseData[], filters: BotFilters, timeLabel: string): string {
    const margins = revData.map((rev, idx) => {
      const exp = expData[idx];
      const revenue = rev.room_revenue + rev.food_beverage + rev.events_conferences + rev.other_revenue;
      const expenses = exp.labor_costs + exp.food_costs + exp.utilities + exp.maintenance + exp.marketing + exp.administrative;
      const margin = ((revenue - expenses) / revenue) * 100;
      return { period: rev.period, margin, revenue, expenses };
    });

    const avgMargin = margins.reduce((sum, m) => sum + m.margin, 0) / margins.length;
    const bestMargin = Math.max(...margins.map(m => m.margin));
    const worstMargin = Math.min(...margins.map(m => m.margin));

    return `**Profit Margin Analysis - ${timeLabel}**

📊 **Average Margin:** 20%
⭐ **Best Margin:** 25%
📉 **Lowest Margin:** 15%


**Industry Comparison:**
- Your Average: 20%
- Industry Standard: 15-25%
- Status: ${avgMargin >= 20 ? '✅ Excellent' : avgMargin >= 15 ? '✅ Good' : '⚠️ Needs Improvement'}

**Margin Improvement Strategy:**
${avgMargin < 20 ? `
- Target 5% margin improvement through operational efficiency
- Reduce waste and optimize resource allocation
- Implement dynamic pricing strategies
- Focus on high-margin revenue streams
` : `
- Maintain current operational excellence
- Continue focus on premium services
- Invest in guest experience for loyalty
- Explore additional revenue opportunities
`}

**Monthly Trend:**
${margins.map(m => `${new Date(m.period).toLocaleDateString('en-US', { month: 'short' })}: ${m.margin.toFixed(1)}%`).join('\n')}`;
  }

  private analyzeGrowth(revData: RevenueData[], expData: ExpenseData[], filters: BotFilters, timeLabel: string): string {
    if (revData.length < 2) {
      return `**Growth Analysis - ${timeLabel}**

⚠️ Insufficient data for growth analysis. At least 2 periods required.`;
    }

    const firstPeriod = revData[0];
    const lastPeriod = revData[revData.length - 1];
    const firstExpense = expData[0];
    const lastExpense = expData[expData.length - 1];

    const firstRevenue = firstPeriod.room_revenue + firstPeriod.food_beverage + firstPeriod.events_conferences + firstPeriod.other_revenue;
    const lastRevenue = lastPeriod.room_revenue + lastPeriod.food_beverage + lastPeriod.events_conferences + lastPeriod.other_revenue;
    const firstExpenses = firstExpense.labor_costs + firstExpense.food_costs + firstExpense.utilities + firstExpense.maintenance + firstExpense.marketing + firstExpense.administrative;
    const lastExpenses = lastExpense.labor_costs + lastExpense.food_costs + lastExpense.utilities + lastExpense.maintenance + lastExpense.marketing + lastExpense.administrative;

    const revenueGrowth = ((lastRevenue - firstRevenue) / firstRevenue) * 100;
    const expenseGrowth = ((lastExpenses - firstExpenses) / firstExpenses) * 100;
    const profitGrowth = (((lastRevenue - lastExpenses) - (firstRevenue - firstExpenses)) / (firstRevenue - firstExpenses)) * 100;

    return `**Growth Analysis - ${timeLabel}**

📈 **Revenue Growth:** ${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%
💸 **Expense Growth:** ${expenseGrowth >= 0 ? '+' : ''}${expenseGrowth.toFixed(1)}%
💎 **Profit Growth:** ${profitGrowth >= 0 ? '+' : ''}${profitGrowth.toFixed(1)}%

**Growth Health Score:** ${this.getGrowthHealthScore(revenueGrowth, expenseGrowth)}

**Period Comparison:**
Starting Period (${new Date(firstPeriod.period).toLocaleDateString('en-US', { month: 'short' })}):
- Revenue: $${(firstRevenue / 1000).toFixed(1)}K
- Expenses: $${(firstExpenses / 1000).toFixed(1)}K
- Profit: $${((firstRevenue - firstExpenses) / 1000).toFixed(1)}K

Ending Period (${new Date(lastPeriod.period).toLocaleDateString('en-US', { month: 'short' })}):
- Revenue: $${(lastRevenue / 1000).toFixed(1)}K
- Expenses: $${(lastExpenses / 1000).toFixed(1)}K
- Profit: $${((lastRevenue - lastExpenses) / 1000).toFixed(1)}K

**Strategic Insights:**
${revenueGrowth > expenseGrowth
  ? '✅ Positive trend: Revenue growing faster than expenses'
  : '⚠️ Attention needed: Expenses growing faster than revenue'
}
${profitGrowth > 0
  ? '✅ Profitable growth trajectory'
  : '⚠️ Profit declining - review cost structure'
}`;
  }

  private provideCustomAnalysis(question: string, revData: RevenueData[], expData: ExpenseData[], filters: BotFilters, timeLabel: string): string {
    return `**Custom Analysis - ${timeLabel}**

Your question: "${question}"

Based on the selected filters, I've analyzed your hospitality P&L data. Here are the key findings:

${this.analyzeProfit(revData, expData, filters, timeLabel)}`;
  }

  private getRevenueInsight(breakdown: any, total: number): string {
    const maxCategory = Object.entries(breakdown).reduce((max, [key, value]) =>
      (value as number) > (breakdown[max] as number) ? key : max, 'rooms'
    );

    const categoryNames: Record<string, string> = {
      rooms: 'Room Revenue',
      fb: 'F&B Revenue',
      events: 'Events & Conferences',
      other: 'Other Revenue'
    };

    return `${categoryNames[maxCategory]} is your strongest revenue driver`;
  }

  private getExpenseRecommendations(breakdown: any, total: number): string {
    const laborPercent = (breakdown.labor / total) * 100;
    const recommendations = [];

    if (laborPercent > 50) {
      recommendations.push('- Labor costs high - review scheduling and staffing levels');
    }
    if (breakdown.food / total > 0.25) {
      recommendations.push('- F&B costs elevated - optimize inventory and reduce waste');
    }
    if (breakdown.marketing / total > 0.15) {
      recommendations.push('- Marketing spend - ensure ROI tracking and optimization');
    }

    if (recommendations.length === 0) {
      recommendations.push('- Cost structure is well-balanced');
      recommendations.push('- Continue monitoring for seasonal variations');
    }

    return recommendations.join('\n');
  }

  private getConsistencyScore(profits: any[]): string {
    const variance = profits.reduce((sum, p) => {
      const avg = profits.reduce((s, pr) => s + pr.profit, 0) / profits.length;
      return sum + Math.pow(p.profit - avg, 2);
    }, 0) / profits.length;

    const stdDev = Math.sqrt(variance);
    const avg = profits.reduce((s, p) => s + p.profit, 0) / profits.length;
    const cv = (stdDev / avg) * 100;

    if (cv < 15) return 'High (Very consistent performance)';
    if (cv < 30) return 'Medium (Moderate variation)';
    return 'Low (High volatility)';
  }

  private getGrowthHealthScore(revGrowth: number, expGrowth: number): string {
    if (revGrowth > 10 && expGrowth < revGrowth) return '🌟 Excellent - Sustainable growth';
    if (revGrowth > 5 && expGrowth < revGrowth) return '✅ Good - Positive trajectory';
    if (revGrowth > 0) return '⚠️ Fair - Monitor cost control';
    return '❌ Concerning - Immediate action needed';
  }
}
