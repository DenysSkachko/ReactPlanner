import React from 'react';

interface TimePickerProps {
  value: string; 
  onChange: (newTime: string) => void;
  minHour?: number; 
  maxHour?: number; 
  stepMinutes?: number; 
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  minHour = 0,
  maxHour = 23,
  stepMinutes = 5,
}) => {
  const [hoursStr, minutesStr] = value.split(':');
  const hours = parseInt(hoursStr, 10) || minHour;
  const minutes = parseInt(minutesStr, 10) || 0;

  const hoursOptions = [];
  for (let h = minHour; h <= maxHour; h++) {
    hoursOptions.push(h);
  }

  const minutesOptions = [];
  for (let m = 0; m < 60; m += stepMinutes) {
    minutesOptions.push(m);
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHours = e.target.value.padStart(2, '0');
    const newTime = `${newHours}:${minutes.toString().padStart(2, '0')}`;
    onChange(newTime);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = e.target.value.padStart(2, '0');
    const newTime = `${hours.toString().padStart(2, '0')}:${newMinutes}`;
    onChange(newTime);
  };

  return (
    <div className="flex gap-2 items-center">
      <select
        className="bg-[var(--color-main)] text-white rounded p-2"
        value={hours}
        onChange={handleHoursChange}
      >
        {hoursOptions.map((h) => (
          <option key={h} value={h}>
            {h.toString().padStart(2, '0')}
          </option>
        ))}
      </select>

      <span className="text-white select-none ">:</span>

      <select
        className="bg-[var(--color-main)] text-[var(--color-light)] rounded p-2"
        value={minutes}
        onChange={handleMinutesChange}
      >
        {minutesOptions.map((m) => (
          <option key={m} value={m}>
            {m.toString().padStart(2, '0')}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimePicker;
