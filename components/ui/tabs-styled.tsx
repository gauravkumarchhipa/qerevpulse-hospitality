// "use client";

// import { cn } from "@/lib/utils";
// import * as React from "react";
// import { Button } from "./button";

// interface StyledTabsProps {
//   tabs: string[];
//   activeTab: string;
//   onChange: (tab: string) => void;
//   className?: string;
// }

// export function StyledTabs({
//   tabs,
//   activeTab,
//   onChange,
//   className,
// }: StyledTabsProps) {
//   return (
//     <div className={cn("overflow-x-auto", className)}>
//       <div className="flex flex-nowrap border-b min-w-full">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => onChange(tab)}
//             className={cn(
//               "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
//               activeTab === tab
//                 ? "text-primary border-b-2 border-primary"
//                 : "text-muted-foreground hover:text-foreground"
//             )}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>
//       <Button size="sm">Export</Button>
//     </div>
//   );
// }

"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { Button } from "./button";

interface StyledTabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  className?: string;
}

export function StyledTabs({
  tabs,
  activeTab,
  onChange,
  className,
}: StyledTabsProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="flex items-center justify-between min-w-full">
        {/* Tab List */}
        <div className="flex flex-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onChange(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
