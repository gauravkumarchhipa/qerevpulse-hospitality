// import { useState, useEffect } from "react";
// import {
//   Send,
//   Bot,
//   User,
//   Sparkles,
//   TrendingUp,
//   DollarSign,
//   Percent,
//   Filter,
//   X,
//   Zap,
// } from "lucide-react";
// import { BotFilters, EnhancedStrategicBot } from "@/lib/enhancedBot";

// interface Message {
//   role: "user" | "assistant";
//   content: string;
//   filters?: BotFilters;
//   timestamp: Date;
// }

// interface SuggestedQuestion {
//   text: string;
//   icon: any;
//   filters: BotFilters;
//   color: string;
//   description: string;
// }

// interface Props {
//   onBack: () => void;
// }

// export default function StrategyBotPage({ onBack }: Props) {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       role: "assistant",
//       content:
//         "Welcome to your Strategic Finance Command Center! 🎯\n\nI'm your AI-powered financial strategist, ready to provide deep insights into your hospitality P&L performance.\n\nCustomize your analysis using the filters below, or select one of the suggested strategic questions to get started. I can analyze revenue trends, cost optimization opportunities, profit margins, growth patterns, and provide actionable recommendations.",
//       timestamp: new Date(),
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [bot] = useState(() => new EnhancedStrategicBot());
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [filters, setFilters] = useState<BotFilters>({
//     timeRange: "all",
//     revenueCategory: "all",
//     expenseCategory: "all",
//     metric: "profit",
//   });
//   const [showFilters, setShowFilters] = useState(true);

//   useEffect(() => {
//     initializeBot();
//   }, []);

//   const initializeBot = async () => {
//     await bot.initialize();
//     setIsInitialized(true);
//   };

//   const suggestedQuestions: SuggestedQuestion[] = [
//     {
//       text: "What should my Q1 2025 budget be?",
//       description:
//         "Get AI-powered budget projections based on historical trends",
//       icon: DollarSign,
//       filters: { timeRange: "q4", metric: "growth" },
//       color: "from-emerald-500 to-teal-500",
//     },
//     {
//       text: "Analyze Q3 summer season performance",
//       description: "Deep dive into peak season revenue and profitability",
//       icon: TrendingUp,
//       filters: { timeRange: "q3", metric: "profit" },
//       color: "from-blue-500 to-cyan-500",
//     },
//     {
//       text: "Show me cost optimization opportunities",
//       description: "Identify areas where expenses can be reduced",
//       icon: Zap,
//       filters: { timeRange: "all", metric: "expenses" },
//       color: "from-orange-500 to-red-500",
//     },
//     {
//       text: "Compare room revenue across quarters",
//       description: "Seasonal analysis of your primary revenue driver",
//       icon: DollarSign,
//       filters: {
//         timeRange: "all",
//         revenueCategory: "rooms",
//         metric: "revenue",
//       },
//       color: "from-purple-500 to-pink-500",
//     },
//     {
//       text: "How are my profit margins trending?",
//       description: "Track profitability health and industry comparison",
//       icon: Percent,
//       filters: { timeRange: "last6", metric: "margin" },
//       color: "from-indigo-500 to-purple-500",
//     },
//     {
//       text: "Analyze labor cost efficiency",
//       description: "Review your largest cost center for optimization",
//       icon: DollarSign,
//       filters: {
//         timeRange: "all",
//         expenseCategory: "labor",
//         metric: "expenses",
//       },
//       color: "from-rose-500 to-pink-500",
//     },
//     {
//       text: "F&B revenue growth opportunities",
//       description: "Explore ways to maximize food & beverage revenue",
//       icon: TrendingUp,
//       filters: { timeRange: "all", revenueCategory: "fb", metric: "growth" },
//       color: "from-teal-500 to-cyan-500",
//     },
//     {
//       text: "Last quarter performance review",
//       description: "Comprehensive analysis of recent performance",
//       icon: Sparkles,
//       filters: { timeRange: "q4", metric: "profit" },
//       color: "from-violet-500 to-fuchsia-500",
//     },
//   ];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await sendMessage(input, filters);
//   };

//   const handleSuggestedQuestion = async (question: SuggestedQuestion) => {
//     setFilters(question.filters);
//     await sendMessage(question.text, question.filters);
//   };

//   const sendMessage = async (
//     messageText: string,
//     currentFilters: BotFilters
//   ) => {
//     if (!messageText.trim() || isLoading || !isInitialized) return;

//     const userMessage = messageText.trim();
//     setInput("");
//     setMessages((prev) => [
//       ...prev,
//       {
//         role: "user",
//         content: userMessage,
//         filters: currentFilters,
//         timestamp: new Date(),
//       },
//     ]);
//     setIsLoading(true);

//     try {
//       const response = await bot.analyzeWithFilters(
//         userMessage,
//         currentFilters
//       );
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: response,
//           filters: currentFilters,
//           timestamp: new Date(),
//         },
//       ]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content:
//             "I apologize, but I encountered an error processing your request. Please try again.",
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatMessage = (content: string) => {
//     return content.split("\n").map((line, idx) => {
//       if (line.startsWith("**") && line.endsWith(":**")) {
//         return (
//           <h4 key={idx} className="font-bold text-xl text-gray-800 mt-5 mb-3">
//             {line.replace(/\*\*/g, "")}
//           </h4>
//         );
//       }
//       if (line.startsWith("**") && line.endsWith("**")) {
//         return (
//           <p
//             key={idx}
//             className="font-semibold text-gray-800 mt-4 mb-2 text-base"
//           >
//             {line.replace(/\*\*/g, "")}
//           </p>
//         );
//       }
//       if (line.startsWith("•") || line.startsWith("-")) {
//         return (
//           <li key={idx} className="ml-6 text-gray-700 leading-relaxed mb-1">
//             {line.substring(1).trim()}
//           </li>
//         );
//       }
//       if (line.match(/^[0-9]+\./)) {
//         return (
//           <li key={idx} className="ml-6 text-gray-700 leading-relaxed mb-1">
//             {line.substring(line.indexOf(".") + 1).trim()}
//           </li>
//         );
//       }
//       if (line.trim() === "") {
//         return <div key={idx} className="h-2" />;
//       }
//       return (
//         <p key={idx} className="text-gray-700 leading-relaxed mb-2">
//           {line}
//         </p>
//       );
//     });
//   };

//   const getFilterLabel = (key: string, value: string): string => {
//     const labels: Record<string, Record<string, string>> = {
//       timeRange: {
//         all: "Full Year",
//         q1: "Q1",
//         q2: "Q2",
//         q3: "Q3",
//         q4: "Q4",
//         last3: "Last 3M",
//         last6: "Last 6M",
//       },
//       revenueCategory: {
//         all: "All Revenue",
//         rooms: "Rooms",
//         fb: "F&B",
//         events: "Events",
//         other: "Other",
//       },
//       expenseCategory: {
//         all: "All Expenses",
//         labor: "Labor",
//         food: "F&B Cost",
//         utilities: "Utilities",
//         maintenance: "Maintenance",
//         marketing: "Marketing",
//         admin: "Admin",
//       },
//       metric: {
//         revenue: "Revenue",
//         expenses: "Expenses",
//         profit: "Profit",
//         margin: "Margins",
//         growth: "Growth",
//       },
//     };
//     return labels[key]?.[value] || value;
//   };

//   if (!isInitialized) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg font-semibold">
//             Initializing Strategic AI...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100">
//       <div className="max-w-[1600px] mx-auto p-8">

//         <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
//           <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white p-8">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
//                   <Sparkles className="w-10 h-10" />
//                 </div>
//                 <div>
//                   <h1 className="text-4xl font-bold mb-2">
//                     Strategic Finance Bot
//                   </h1>
//                   <p className="text-purple-100 text-lg">
//                     AI-Powered P&L Analysis & Actionable Insights
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all backdrop-blur-sm"
//               >
//                 <Filter className="w-6 h-6" />
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8 bg-gradient-to-r from-purple-50 to-fuchsia-50">
//             {showFilters && (
//               <div className="lg:col-span-3">
//                 <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
//                   <div className="flex items-center justify-between mb-5">
//                     <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
//                       <Filter className="w-5 h-5 text-purple-600" />
//                       Analysis Filters
//                     </h3>
//                     <button
//                       onClick={() =>
//                         setFilters({
//                           timeRange: "all",
//                           revenueCategory: "all",
//                           expenseCategory: "all",
//                           metric: "profit",
//                         })
//                       }
//                       className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 font-medium"
//                     >
//                       <X className="w-4 h-4" />
//                       Reset All
//                     </button>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Time Period
//                       </label>
//                       <select
//                         value={filters.timeRange}
//                         onChange={(e) =>
//                           setFilters({
//                             ...filters,
//                             timeRange: e.target.value as any,
//                           })
//                         }
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                       >
//                         <option value="all">Full Year (12 Months)</option>
//                         <option value="q1">Q1 (Jan-Mar)</option>
//                         <option value="q2">Q2 (Apr-Jun)</option>
//                         <option value="q3">Q3 (Jul-Sep)</option>
//                         <option value="q4">Q4 (Oct-Dec)</option>
//                         <option value="last3">Last 3 Months</option>
//                         <option value="last6">Last 6 Months</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Metric Focus
//                       </label>
//                       <select
//                         value={filters.metric}
//                         onChange={(e) =>
//                           setFilters({
//                             ...filters,
//                             metric: e.target.value as any,
//                           })
//                         }
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                       >
//                         <option value="revenue">Revenue Analysis</option>
//                         <option value="expenses">Expense Analysis</option>
//                         <option value="profit">Profit Analysis</option>
//                         <option value="margin">Margin Analysis</option>
//                         <option value="growth">Growth Analysis</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Revenue Category
//                       </label>
//                       <select
//                         value={filters.revenueCategory}
//                         onChange={(e) =>
//                           setFilters({
//                             ...filters,
//                             revenueCategory: e.target.value as any,
//                           })
//                         }
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                       >
//                         <option value="all">All Revenue Streams</option>
//                         <option value="rooms">Rooms Only</option>
//                         <option value="fb">F&B Only</option>
//                         <option value="events">Events Only</option>
//                         <option value="other">Other Revenue</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Expense Category
//                       </label>
//                       <select
//                         value={filters.expenseCategory}
//                         onChange={(e) =>
//                           setFilters({
//                             ...filters,
//                             expenseCategory: e.target.value as any,
//                           })
//                         }
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                       >
//                         <option value="all">All Expenses</option>
//                         <option value="labor">Labor Only</option>
//                         <option value="food">F&B Costs Only</option>
//                         <option value="utilities">Utilities Only</option>
//                         <option value="maintenance">Maintenance Only</option>
//                         <option value="marketing">Marketing Only</option>
//                         <option value="admin">Administrative Only</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2 mt-4">
//                     {Object.entries(filters).map(
//                       ([key, value]) =>
//                         value !== "all" && (
//                           <span
//                             key={key}
//                             className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-sm font-medium rounded-full shadow-md"
//                           >
//                             {getFilterLabel(key, value)}
//                           </span>
//                         )
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="lg:col-span-3">
//               <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
//                 <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                   <Sparkles className="w-5 h-5 text-purple-600" />
//                   Suggested Strategic Questions
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                   {suggestedQuestions.map((question, idx) => {
//                     const Icon = question.icon;
//                     return (
//                       <button
//                         key={idx}
//                         onClick={() => handleSuggestedQuestion(question)}
//                         disabled={isLoading}
//                         className={`bg-gradient-to-br ${question.color} text-white p-5 rounded-2xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left group`}
//                       >
//                         <Icon className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform" />
//                         <p className="font-semibold mb-2 text-sm leading-tight">
//                           {question.text}
//                         </p>
//                         <p className="text-xs opacity-90 leading-snug">
//                           {question.description}
//                         </p>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="h-[600px] overflow-y-auto p-8 space-y-6 bg-white">
//             {messages.map((message, idx) => (
//               <div
//                 key={idx}
//                 className={`flex gap-4 ${
//                   message.role === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {message.role === "assistant" && (
//                   <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 p-3 rounded-2xl h-fit shadow-lg">
//                     <Bot className="w-6 h-6 text-white" />
//                   </div>
//                 )}
//                 <div
//                   className={`max-w-[75%] rounded-2xl p-6 shadow-lg ${
//                     message.role === "user"
//                       ? "bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white"
//                       : "bg-gray-50 border-2 border-gray-200"
//                   }`}
//                 >
//                   {message.role === "user" ? (
//                     <>
//                       <p className="text-white font-semibold text-lg mb-2">
//                         {message.content}
//                       </p>
//                       {message.filters && (
//                         <div className="flex flex-wrap gap-2 mt-3">
//                           {Object.entries(message.filters).map(
//                             ([key, value]) =>
//                               value !== "all" && (
//                                 <span
//                                   key={key}
//                                   className="inline-flex items-center px-3 py-1 bg-white/25 text-white text-xs rounded-full font-medium backdrop-blur-sm"
//                                 >
//                                   {getFilterLabel(key, value)}
//                                 </span>
//                               )
//                           )}
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <div className="prose prose-sm max-w-none">
//                       {formatMessage(message.content)}
//                     </div>
//                   )}
//                   <p
//                     className={`text-xs mt-3 ${
//                       message.role === "user"
//                         ? "text-white/70"
//                         : "text-gray-400"
//                     }`}
//                   >
//                     {message.timestamp.toLocaleTimeString()}
//                   </p>
//                 </div>
//                 {message.role === "user" && (
//                   <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 p-3 rounded-2xl h-fit shadow-lg">
//                     <User className="w-6 h-6 text-white" />
//                   </div>
//                 )}
//               </div>
//             ))}
//             {isLoading && (
//               <div className="flex gap-4 justify-start">
//                 <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 p-3 rounded-2xl h-fit shadow-lg">
//                   <Bot className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
//                   <div className="flex gap-2">
//                     <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
//                     <div
//                       className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.1s" }}
//                     ></div>
//                     <div
//                       className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.2s" }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="p-8 border-t-2 border-gray-200 bg-gradient-to-r from-purple-50 to-fuchsia-50"
//           >
//             <div className="flex gap-4">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Ask any strategic financial question..."
//                 disabled={isLoading}
//                 className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
//               />
//               <button
//                 type="submit"
//                 disabled={!input.trim() || isLoading}
//                 className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-purple-600 hover:to-fuchsia-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-xl hover:shadow-2xl text-base"
//               >
//                 <Send className="w-6 h-6" />
//                 Send
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
























import { useState, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  DollarSign,
  Percent,
  Filter,
  X,
  Zap,
} from "lucide-react";
import { BotFilters, EnhancedStrategicBot } from "@/lib/enhancedBot";

interface Message {
  role: "user" | "assistant";
  content: string;
  filters?: BotFilters;
  timestamp: Date;
}

interface SuggestedQuestion {
  text: string;
  icon: any;
  filters: BotFilters;
  color: string;
  description: string;
}

interface Props {
  onBack: () => void;
}

export default function StrategyBotPage({ onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to your Strategic Finance Command Center! 🎯\n\nI'm your AI-powered financial strategist, ready to provide deep insights into your hospitality P&L performance.\n\nCustomize your analysis using the filters below, or select one of the suggested strategic questions to get started. I can analyze revenue trends, cost optimization opportunities, profit margins, growth patterns, and provide actionable recommendations.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bot] = useState(() => new EnhancedStrategicBot());
  const [isInitialized, setIsInitialized] = useState(false);
  const [filters, setFilters] = useState<BotFilters>({
    timeRange: "all",
    revenueCategory: "all",
    expenseCategory: "all",
    metric: "profit",
  });
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    initializeBot();
  }, []);

  const initializeBot = async () => {
    await bot.initialize();
    setIsInitialized(true);
  };

  const suggestedQuestions: SuggestedQuestion[] = [
    {
      text: "What should my Q1 2025 budget be?",
      description:
        "Get AI-powered budget projections based on historical trends",
      icon: DollarSign,
      filters: { timeRange: "q4", metric: "growth" },
      color: "from-emerald-500 to-teal-500",
    },
    {
      text: "Analyze Q3 summer season performance",
      description: "Deep dive into peak season revenue and profitability",
      icon: TrendingUp,
      filters: { timeRange: "q3", metric: "profit" },
      color: "from-blue-500 to-cyan-500",
    },
    {
      text: "Show me cost optimization opportunities",
      description: "Identify areas where expenses can be reduced",
      icon: Zap,
      filters: { timeRange: "all", metric: "expenses" },
      color: "from-orange-500 to-red-500",
    },
    {
      text: "Compare room revenue across quarters",
      description: "Seasonal analysis of your primary revenue driver",
      icon: DollarSign,
      filters: {
        timeRange: "all",
        revenueCategory: "rooms",
        metric: "revenue",
      },
      color: "from-purple-500 to-pink-500",
    },
    {
      text: "How are my profit margins trending?",
      description: "Track profitability health and industry comparison",
      icon: Percent,
      filters: { timeRange: "last6", metric: "margin" },
      color: "from-indigo-500 to-purple-500",
    },
    {
      text: "Analyze labor cost efficiency",
      description: "Review your largest cost center for optimization",
      icon: DollarSign,
      filters: {
        timeRange: "all",
        expenseCategory: "labor",
        metric: "expenses",
      },
      color: "from-rose-500 to-pink-500",
    },
    {
      text: "F&B revenue growth opportunities",
      description: "Explore ways to maximize food & beverage revenue",
      icon: TrendingUp,
      filters: { timeRange: "all", revenueCategory: "fb", metric: "growth" },
      color: "from-teal-500 to-cyan-500",
    },
    {
      text: "Last quarter performance review",
      description: "Comprehensive analysis of recent performance",
      icon: Sparkles,
      filters: { timeRange: "q4", metric: "profit" },
      color: "from-violet-500 to-fuchsia-500",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input, filters);
  };

  const handleSuggestedQuestion = async (question: SuggestedQuestion) => {
    setFilters(question.filters);
    await sendMessage(question.text, question.filters);
  };

  const sendMessage = async (
    messageText: string,
    currentFilters: BotFilters
  ) => {
    if (!messageText.trim() || isLoading || !isInitialized) return;

    const userMessage = messageText.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        filters: currentFilters,
        timestamp: new Date(),
      },
    ]);
    setIsLoading(true);

    try {
      const response = await bot.analyzeWithFilters(
        userMessage,
        currentFilters
      );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
          filters: currentFilters,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, idx) => {
      if (line.startsWith("**") && line.endsWith(":**")) {
        return (
          <h4 key={idx} className="font-bold text-xl text-gray-800 mt-5 mb-3">
            {line.replace(/\*\*/g, "")}
          </h4>
        );
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p
            key={idx}
            className="font-semibold text-gray-800 mt-4 mb-2 text-base"
          >
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (line.startsWith("•") || line.startsWith("-")) {
        return (
          <li key={idx} className="ml-6 text-gray-700 leading-relaxed mb-1">
            {line.substring(1).trim()}
          </li>
        );
      }
      if (line.match(/^[0-9]+\./)) {
        return (
          <li key={idx} className="ml-6 text-gray-700 leading-relaxed mb-1">
            {line.substring(line.indexOf(".") + 1).trim()}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-gray-700 leading-relaxed mb-2">
          {line}
        </p>
      );
    });
  };

  const getFilterLabel = (key: string, value: string): string => {
    const labels: Record<string, Record<string, string>> = {
      timeRange: {
        all: "Full Year",
        q1: "Q1",
        q2: "Q2",
        q3: "Q3",
        q4: "Q4",
        last3: "Last 3M",
        last6: "Last 6M",
      },
      revenueCategory: {
        all: "All Revenue",
        rooms: "Rooms",
        fb: "F&B",
        events: "Events",
        other: "Other",
      },
      expenseCategory: {
        all: "All Expenses",
        labor: "Labor",
        food: "F&B Cost",
        utilities: "Utilities",
        maintenance: "Maintenance",
        marketing: "Marketing",
        admin: "Admin",
      },
      metric: {
        revenue: "Revenue",
        expenses: "Expenses",
        profit: "Profit",
        margin: "Margins",
        growth: "Growth",
      },
    };
    return labels[key]?.[value] || value;
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">
            Initializing Strategic AI...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-[1600px] mx-auto p-8">

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <Sparkles className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    Strategic Finance Bot
                  </h1>
                  <p className="text-purple-100 text-lg">
                    AI-Powered P&L Analysis & Actionable Insights
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all backdrop-blur-sm"
              >
                <Filter className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8 bg-gradient-to-r from-purple-50 to-fuchsia-50">
            {showFilters && (
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                      <Filter className="w-5 h-5 text-purple-600" />
                      Analysis Filters
                    </h3>
                    <button
                      onClick={() =>
                        setFilters({
                          timeRange: "all",
                          revenueCategory: "all",
                          expenseCategory: "all",
                          metric: "profit",
                        })
                      }
                      className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 font-medium"
                    >
                      <X className="w-4 h-4" />
                      Reset All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Time Period
                      </label>
                      <select
                        value={filters.timeRange}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            timeRange: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="all">Full Year (12 Months)</option>
                        <option value="q1">Q1 (Jan-Mar)</option>
                        <option value="q2">Q2 (Apr-Jun)</option>
                        <option value="q3">Q3 (Jul-Sep)</option>
                        <option value="q4">Q4 (Oct-Dec)</option>
                        <option value="last3">Last 3 Months</option>
                        <option value="last6">Last 6 Months</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Metric Focus
                      </label>
                      <select
                        value={filters.metric}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            metric: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="revenue">Revenue Analysis</option>
                        <option value="expenses">Expense Analysis</option>
                        <option value="profit">Profit Analysis</option>
                        <option value="margin">Margin Analysis</option>
                        <option value="growth">Growth Analysis</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Revenue Category
                      </label>
                      <select
                        value={filters.revenueCategory}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            revenueCategory: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="all">All Revenue Streams</option>
                        <option value="rooms">Rooms Only</option>
                        <option value="fb">F&B Only</option>
                        <option value="events">Events Only</option>
                        <option value="other">Other Revenue</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expense Category
                      </label>
                      <select
                        value={filters.expenseCategory}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            expenseCategory: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="all">All Expenses</option>
                        <option value="labor">Labor Only</option>
                        <option value="food">F&B Costs Only</option>
                        <option value="utilities">Utilities Only</option>
                        <option value="maintenance">Maintenance Only</option>
                        <option value="marketing">Marketing Only</option>
                        <option value="admin">Administrative Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {Object.entries(filters).map(
                      ([key, value]) =>
                        value !== "all" && (
                          <span
                            key={key}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-sm font-medium rounded-full shadow-md"
                          >
                            {getFilterLabel(key, value)}
                          </span>
                        )
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Suggested Strategic Questions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {suggestedQuestions.map((question, idx) => {
                    const Icon = question.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedQuestion(question)}
                        disabled={isLoading}
                        className={`bg-gradient-to-br ${question.color} text-white p-5 rounded-2xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left group`}
                      >
                        <Icon className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform" />
                        <p className="font-semibold mb-2 text-sm leading-tight">
                          {question.text}
                        </p>
                        <p className="text-xs opacity-90 leading-snug">
                          {question.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="h-[600px] overflow-y-auto p-8 space-y-6 bg-white">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex gap-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 p-3 rounded-2xl h-fit shadow-lg">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl p-6 shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white"
                      : "bg-gray-50 border-2 border-gray-200"
                  }`}
                >
                  {message.role === "user" ? (
                    <>
                      <p className="text-white font-semibold text-lg mb-2">
                        {message.content}
                      </p>
                      {message.filters && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {Object.entries(message.filters).map(
                            ([key, value]) =>
                              value !== "all" && (
                                <span
                                  key={key}
                                  className="inline-flex items-center px-3 py-1 bg-white/25 text-white text-xs rounded-full font-medium backdrop-blur-sm"
                                >
                                  {getFilterLabel(key, value)}
                                </span>
                              )
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      {formatMessage(message.content)}
                    </div>
                  )}
                  <p
                    className={`text-xs mt-3 ${
                      message.role === "user"
                        ? "text-white/70"
                        : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 p-3 rounded-2xl h-fit shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 p-3 rounded-2xl h-fit shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 border-t-2 border-gray-200 bg-gradient-to-r from-purple-50 to-fuchsia-50"
          >
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask any strategic financial question..."
                disabled={isLoading}
                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-purple-600 hover:to-fuchsia-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-xl hover:shadow-2xl text-base"
              >
                <Send className="w-6 h-6" />
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
