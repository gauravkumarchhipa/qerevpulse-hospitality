"use client";

import { Card } from "@/components/ui/card";

const screenLayoutData = {
  leftCards: [
    {
      text: `Forecasts show <strong class="text-green-700">deluxe room</strong> bookings are expected to <span class="text-green-700 font-semibold">rise by 35%</span> during event seasons, driven by demand from international delegates.`,
    },
    {
      text: `Forecast: <span class="text-blue-700 font-semibold">Suite prices</span> should be reviewed every Friday, as high-end travelers typically confirm bookings for the upcoming week between Friday and Saturday.`,
    },
  ],
  rightCard: {
    text: `Insight: Predictive analytics indicate a <span class="text-green-700 font-semibold">22% surge</span> in double room bookings in urban hotels, aligning with increased travel by families and small groups.`,
  },
};

export default function ForCastEvents() {
  return (
    <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[200px]">
      {/* Left Column with 2 stacked cards */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        {screenLayoutData.leftCards.map((card, idx) => (
          <Card key={idx} className="border p-4 h-full overflow-auto">
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: card.text }}
            />
          </Card>
        ))}
      </div>

      {/* Right Column single tall card */}
      <div className="w-full md:w-1/2 h-full">
        <Card className={`h-full border p-4 overflow-auto`}>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: screenLayoutData.rightCard.text,
            }}
          />
        </Card>
      </div>
    </div>
  );
}
