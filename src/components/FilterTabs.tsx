import { FILTERS, type FilterValue } from "../lib/notifications";

interface FilterTabsProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-gray-200 bg-white px-2 py-1.5">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() => onChange(f.value)}
          className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            value === f.value
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
