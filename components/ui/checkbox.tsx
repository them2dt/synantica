"use client";

import { Check } from "lucide-react";

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ checked, onChange, disabled, className }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`
        h-4 w-4 rounded border border-primary
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-primary
        disabled:opacity-50 disabled:cursor-not-allowed
        ${checked ? 'bg-primary text-white' : 'bg-white'}
        ${className}
      `}
    >
      {checked && <Check className="h-3 w-3" />}
    </button>
  );
}