import { Card } from "@/components/ui/card";

const eventData = {
  upcomingEvents: [
    {
      title: "Arabian Travel Market",
      highlight: "demand spikes by up to 42%",
      note: "(Suite and Deluxe room demand spikes by up to 42% starting from the Saturday before the event — adjust prices by Friday evening to maximize yield.)",
    },
    {
      title: "Dubai Esports and Games festival",
      highlight: "30–35%",
      note: "(Anticipated 30–35% occupancy growth especially on the weekends)",
    },
    {
      title: "Dubai Restaurant Week",
      highlight: "up to 40%",
      note: "(Projected rate hike up to 40% for tourists around the city)",
    },
  ],
  insights: [
    {
      text: "Booking patterns suggest a ",
      highlight: "32% surge in hotel room bookings",
      ending:
        " across central Dubai during the Arabian Travel Market, driven by international exhibitor influx reflecting a growing blend of business and leisure.",
      color: "text-green-600",
    },
  ],
  forCast: [
    {
      text: "Forecast: Data suggests single room reservations may ",
      highlight: "decline by 12%",
      ending:
        ", as couples and group travel continue to dominate post-restriction trends.",
      color: "text-red-600",
    },
  ],
};

export default function EventsInsights() {
  const { upcomingEvents, insights, forCast } = eventData;

  return (
    <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[260px]">
      {/* Left Column */}
      <div className="w-full md:w-1/2 h-full overflow-auto">
        <Card className="h-full border p-4">
          <h3 className="text-base font-medium mb-2 border-b pb-1">
            Upcoming Events:
          </h3>
          <ul className="space-y-3">
            {upcomingEvents.map((event, idx) => (
              <li key={idx}>
                <span className="font-medium text-base">{event.title}</span>
                <br />
                <span
                className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(
                      event.note,
                      event.highlight,
                      "text-green-700 text-sm"
                    ),
                  }}
                />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/2 h-full flex flex-col gap-4">
        {/* Insights Card */}
        <Card className="flex-1 min-h-0 border p-4 overflow-auto">
          {insights.map((item, idx) => (
            <p key={idx} className="text-sm">
              {item.text}
              <span className={`${item.color} font-semibold`}>
                {item.highlight}
              </span>
              {item.ending}
            </p>
          ))}
        </Card>

        {/* Forecast Card */}
        <Card className="flex-1 min-h-0 border p-4 overflow-auto">
          {forCast.map((item, idx) => (
            <p key={idx} className="text-sm">
              {item.text}
              <span className={`${item.color} font-semibold`}>
                {item.highlight}
              </span>
              {item.ending}
            </p>
          ))}
        </Card>
      </div>
    </div>
  );
}

// Highlight helper
function highlightText(text: string, phrase: string, cls: string) {
  const escaped = phrase.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(escaped, "g");
  return text.replace(regex, `<span class="${cls}">${phrase}</span>`);
}
