"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import React from "react";

interface Option {
  value: string;
  label: string;
}

interface CommonSelectProps {
  label: string;
  placeholder?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

export default function CommonSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
}: CommonSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
