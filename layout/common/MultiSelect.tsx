"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Option {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  defaultSelectAll?: boolean;
}

export default function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = "Search…",
  defaultSelectAll = false,
}: MultiSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (defaultSelectAll && options.length && !allSelected) {
      onChange("all");
    }
  }, []);

  useEffect(() => {
    if (buttonRef.current) {
      setPopoverWidth(buttonRef.current.offsetWidth);
    }
  }, [buttonRef.current]);

  const allValues = options.map((o) => o.value);
  const allSelected = allValues.every((v) => selected.includes(v));

  const filteredCore = options.filter((o) =>
    o.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOptions =
    filteredCore.length > 0
      ? [
          {
            value: "all",
            label: allSelected ? "Unselect All" : "Select All",
          },
          ...filteredCore,
        ]
      : filteredCore;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            className="w-full justify-start flex-wrap gap-1 text-left"
          >
            <div className="flex gap-1 flex-wrap max-w-[220px]">
              {selected.length === 0 ? (
                <span className="text-sm">Select {label}</span>
              ) : allSelected ? (
                <span className="text-sm">All {label}</span>
              ) : selected.length <= 2 ? (
                selected
                  .filter((val) => val !== "all")
                  .map((val) => {
                    const opt = options.find((o) => o.value === val);
                    return (
                      <span
                        key={val}
                        className="bg-muted px-2 py-0.5 text-xs rounded-full text-muted-foreground"
                      >
                        {opt?.label}
                      </span>
                    );
                  })
              ) : (
                <span className="text-sm">{selected.length} selected</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 ml-auto" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0"
          align="start"
          style={{
            minWidth: popoverWidth || "auto",
            width: popoverWidth || "auto",
            maxWidth: 320,
          }}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={placeholder}
              onValueChange={setSearchTerm}
            />
            {filteredOptions.length === 0 && (
              <CommandEmpty>No match found.</CommandEmpty>
            )}
            {selected.length > 0 && (
              <div className="flex gap-1 px-3 pt-2 mt-2 overflow-x-auto whitespace-nowrap">
                {selected
                  .filter((val) => val !== "all")
                  .map((val) => {
                    const opt = options.find((o) => o.value === val);
                    return (
                      <div
                        key={val}
                        className="flex items-center gap-1 bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs mb-1"
                      >
                        {opt?.label}
                        <button
                          className="hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange(val);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* 🛠️ FIX: This makes the list scrollable */}
            <CommandList>
              <CommandGroup>
                {filteredOptions?.map((option) => {
                  const isAll = option.value === "all";
                  const isSelected = isAll
                    ? allSelected
                    : selected.includes(option.value);

                  return (
                    <div
                      key={option.value}
                      className="flex cursor-pointer select-none items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => {
                        if (filteredOptions?.length > 1) {
                          onChange(option.value);
                        }
                      }}
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "opacity-50"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
