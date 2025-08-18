"use client";
import * as React from "react";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };
  const selectedLabels = options
    .filter((o) => selected.includes(o.value))
    .map((o) => o.label);
  return (
    <div className='relative'>
      <button
        type='button'
        className={`w-full border rounded-md px-3 py-2 text-left bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 flex flex-wrap gap-1 min-h-[40px] ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
      >
        {selectedLabels.length > 0 ? (
          <div className='flex flex-wrap gap-1'>
            {selectedLabels.map((label) => (
              <span
                key={label}
                className='bg-primary/10 text-primary px-2 py-0.5 rounded text-xs'
              >
                {label}
              </span>
            ))}
          </div>
        ) : (
          <span className='text-muted-foreground text-sm'>{placeholder}</span>
        )}
      </button>
      {open && !disabled && (
        <div className='absolute z-10 mt-1 w-full bg-popover border rounded shadow-lg max-h-60 overflow-auto'>
          <ul className='py-1'>
            {options.length === 0 && (
              <li className='px-4 py-2 text-muted-foreground text-sm'>
                No options
              </li>
            )}
            {options.map((option) => (
              <li
                key={option.value}
                className='px-4 py-2 hover:bg-accent flex items-center gap-2 cursor-pointer'
                onClick={() => toggleOption(option.value)}
              >
                <input
                  type='checkbox'
                  checked={selected.includes(option.value)}
                  readOnly
                  className='accent-primary'
                />
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
