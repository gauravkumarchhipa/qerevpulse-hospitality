import SeasonalAnalysisDashboard from "@/components/seasonalAnalysis/SeasonalAnalysisDashboard";
import React from "react";

const page = () => {
  return (
    <div>
      <SeasonalAnalysisDashboard />
    </div>
  );
};

export default page;

// iframe
// "use client";
// import React from "react";

// const Page = () => {
//   return (
//     <div className="w-full max-w-[1500px] mx-auto p-2 md:p-6 h-screen overflow-hidden">
//       <iframe
//         title="hospitality-seasonal-analysis"
//         src="https://app.powerbi.com/view?r=eyJrIjoiODZmNzM0YjMtYzg3ZS00MjU4LTk2N2EtYzQ3YzU2MTlmYjI1IiwidCI6IjYwYzg2NjQ3LTljYTMtNDg3Yi1iYzM5LWI0ZTM1MTU5NDAxNSJ9"
//         className="w-full h-full border-0"
//         allowFullScreen
//       ></iframe>
//     </div>
//   );
// };

// export default Page;
