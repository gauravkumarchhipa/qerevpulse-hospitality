// utils/createMultiSelectHandler.ts

export function createMultiSelectHandler<T extends string>(
  selected: T[],
  allOptions: { value: T }[],
  onChange: (updated: T[]) => void
) {
  return (value: T | "all") => {
    const allValues = allOptions.map((o) => o.value);
    const allSelected = allValues.every((v) => selected.includes(v));

    let updated: T[];

    if (value === "all") {
      updated = allSelected ? [] : allValues;
    } else {
      const withoutAll = selected.filter(
        (v) => v !== "all" && v !== value
      ) as T[];
      updated = selected.includes(value) ? withoutAll : [...withoutAll, value];
    }

    onChange(updated);
  };
}
