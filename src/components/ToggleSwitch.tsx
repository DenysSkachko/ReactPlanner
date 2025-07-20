import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, handleChange }) => {
  return (
    <label className="relative inline-block w-14 h-8 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="peer sr-only"
      />
      <span className="absolute inset-0 bg-gray-400 rounded-full transition-colors peer-checked:bg-[var(--color-accent)]"></span>
      <span
        className="absolute left-1 top-1 w-6 h-6 bg-[var(--color-text)] rounded-full shadow transform transition-transform peer-checked:translate-x-6"
      ></span>
    </label>
  );
};

export default ToggleSwitch;
