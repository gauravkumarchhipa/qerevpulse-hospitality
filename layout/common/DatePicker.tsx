// "use client";

// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { CalendarIcon } from "lucide-react";
// import { format } from "date-fns";

// interface DatePickerProps {
//   label: string;
//   date: Date | null;
//   onChange: (date: Date | undefined) => void;
//   placeholder?: string;
// }

// export default function DatePicker({ label, date, onChange, placeholder = "Pick a date" }: DatePickerProps) {
//   return (
//     <div className="space-y-2">
//       <label className="text-sm font-medium">{label}</label>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             className="w-full justify-start text-left font-normal"
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {date ? format(date, "PPP") : placeholder}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0">
//           <Calendar
//             mode="single"
//             selected={date as Date}
//             onSelect={onChange}
//             initialFocus
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }

// *****************************************


"use client";

import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";

/* ---------------------------------- Types ---------------------------------- */

interface DatePickerProps {
  label: string;
  date: Date | null;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  fromYear?: number;
  toYear?: number;
  /** Return true to disable that date */
  disabled?: (date: Date) => boolean;
}

/* --------------------------------- Helpers --------------------------------- */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const clampYear = (y: number, a: number, b: number) =>
  Math.min(b, Math.max(a, y));
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

/** Normalize (yy, mm) into a real year/month using Date rollover */
const normalizeYM = (yy: number, mm: number) => {
  const d = new Date(yy, mm, 1);
  return { y: d.getFullYear(), m: d.getMonth() };
};

/** First enabled day in month (or undefined if none) */
const firstEnabledInMonth = (
  yy: number,
  mm: number,
  fromYear: number,
  toYear: number,
  disabled?: (date: Date) => boolean
): Date | undefined => {
  const { y, m } = normalizeYM(yy, mm);
  if (y < fromYear || y > toYear) return undefined;

  const total = daysInMonth(y, m);
  for (let day = 1; day <= total; day++) {
    const d = new Date(y, m, day);
    if (!disabled || !disabled(d)) {
      return d;
    }
  }
  return undefined;
};

/** Keep same day if possible else pick the first enabled one */
const pickDayInMonth = (
  baseDay: number,
  yy: number,
  mm: number,
  fromYear: number,
  toYear: number,
  disabled?: (date: Date) => boolean
): Date | undefined => {
  const { y, m } = normalizeYM(yy, mm);
  if (y < fromYear || y > toYear) return undefined;

  const total = daysInMonth(y, m);
  const clamped = Math.min(baseDay, total);
  const candidate = new Date(y, m, clamped);
  if (!disabled || !disabled(candidate)) return candidate;

  return firstEnabledInMonth(y, m, fromYear, toYear, disabled);
};

/* --------------------------- Custom Caption factory ------------------------- */

function makeCaption(
  fromYear: number,
  toYear: number,
  selected: Date | null | undefined,
  onSelect: (d: Date | undefined) => void,
  disabled?: (date: Date) => boolean
) {
  return function CustomCaption(props: any) {
    const { displayMonth } = props;
    const [showMonth, setShowMonth] = React.useState(false);
    const [showYear, setShowYear] = React.useState(false);

    const y = displayMonth.getFullYear();
    const m = displayMonth.getMonth();

    const selectedYear = selected?.getFullYear();
    const selectedMonth = selected?.getMonth();
    const baseDay = (selected ?? new Date()).getDate();

    const monthHasAnyEnabled = (yy: number, mm: number) =>
      !!firstEnabledInMonth(yy, mm, fromYear, toYear, disabled);

    const setMonthYear = (yy: number, mm: number) => {
      const next = pickDayInMonth(baseDay, yy, mm, fromYear, toYear, disabled);
      if (!next) return; // whole month is disabled -> no-op
      const view = new Date(next.getFullYear(), next.getMonth(), 1);
      props.goToMonth?.(view);
      onSelect(next);
    };

    const canPrev = monthHasAnyEnabled(y, m - 1);
    const canNext = monthHasAnyEnabled(y, m + 1);

    // Build years (descending)
    const years: number[] = [];
    for (let yy = toYear; yy >= fromYear; yy--) years.push(yy);

    return (
      <div className="flex items-center justify-between px-3 pt-3">
        {/* Prev / Next */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => canPrev && setMonthYear(y, m - 1)}
            className={`h-8 w-8 rounded-md transition ${
              canPrev ? "hover:bg-muted/60" : "opacity-40 cursor-not-allowed"
            }`}
            aria-disabled={!canPrev}
            disabled={!canPrev}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => canNext && setMonthYear(y, m + 1)}
            className={`h-8 w-8 rounded-md transition ${
              canNext ? "hover:bg-muted/60" : "opacity-40 cursor-not-allowed"
            }`}
            aria-disabled={!canNext}
            disabled={!canNext}
          >
            ›
          </button>
        </div>

        {/* Month + Year */}
        <div className="flex items-center gap-3">
          {/* Month dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMonth((s) => !s);
                setShowYear(false);
              }}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-muted/60"
            >
              <span>{MONTHS[m]}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {showMonth && (
              <div
                className="absolute mt-1 w-44 !max-h-64 !overflow-auto rounded-md border bg-popover text-popover-foreground shadow"
                onClick={(e) => e.stopPropagation()}
                style={{ zIndex: 9999, maxHeight: "250px", overflow: "auto" }}
              >
                {MONTHS.map((label, idx) => {
                  const isDisplayedMonth = idx === m;
                  const isSelectedThisYear =
                    selectedYear === y && selectedMonth === idx;
                  const selectable = monthHasAnyEnabled(y, idx);

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectable) setMonthYear(y, idx);
                        setShowMonth(false);
                      }}
                      aria-disabled={!selectable}
                      disabled={!selectable}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground ${
                        !selectable
                          ? "opacity-40 cursor-not-allowed"
                          : isSelectedThisYear
                          ? "bg-primary text-primary-foreground"
                          : isDisplayedMonth
                          ? "bg-accent/60"
                          : ""
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Year dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowYear((s) => !s);
                setShowMonth(false);
              }}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-muted/60"
            >
              <span>{y}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {showYear && (
              <div
                className="absolute mt-1 max-h-64 w-28 overflow-auto rounded-md border bg-popover text-popover-foreground shadow"
                onClick={(e) => e.stopPropagation()}
                style={{ zIndex: 9999, maxHeight: "250px", overflow: "auto" }}
              >
                {years.map((yy) => {
                  const isDisplayedYear = yy === y;
                  const isSelectedYear = selectedYear === yy;
                  const selectable = monthHasAnyEnabled(
                    clampYear(yy, fromYear, toYear),
                    m
                  );

                  return (
                    <button
                      key={yy}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectable)
                          setMonthYear(clampYear(yy, fromYear, toYear), m);
                        setShowYear(false);
                      }}
                      aria-disabled={!selectable}
                      disabled={!selectable}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground ${
                        !selectable
                          ? "opacity-40 cursor-not-allowed"
                          : isSelectedYear
                          ? "bg-primary text-primary-foreground"
                          : isDisplayedYear
                          ? "bg-accent/60"
                          : ""
                      }`}
                    >
                      {yy}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="w-[56px]" />
      </div>
    );
  };
}

/* ------------------------------ Main component ----------------------------- */

export default function DatePicker({
  label,
  date,
  onChange,
  placeholder = "Pick a date",
  fromYear = 2021,
  toYear = new Date().getFullYear() + 1,
  disabled,
}: DatePickerProps) {
  const initialMonth = React.useMemo(() => date ?? new Date(), []);
  const [month, setMonth] = React.useState<Date>(initialMonth);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (date) setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  }, [date]);

  const Caption = React.useMemo(
    () => makeCaption(fromYear, toYear, date, onChange, disabled),
    [fromYear, toYear, date, onChange, disabled]
  );

   const handleSelect = (d?: Date) => {
    onChange(d);
    if (d) setOpen(false);              // close only when a date is actually chosen
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
       <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="z-[9998] w-auto p-0 border bg-popover text-popover-foreground"
        >
          <Calendar
            mode="single"
            selected={date ?? undefined}
            onSelect={handleSelect}   
            month={month}
            onMonthChange={setMonth}
            showOutsideDays
            fromYear={fromYear}
            toYear={toYear}
            components={{ Caption }}
            disabled={disabled}
            classNames={{
              caption: "px-0 pt-0",
              head_cell: "w-9 font-normal text-muted-foreground text-[0.8rem]",
              day: "h-9 w-9 p-0 aria-selected:opacity-100",
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              nav_button: "h-8 w-8",
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
