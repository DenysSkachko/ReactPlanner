const DAY_START_HOUR = 8;
const DAY_END_HOUR = 22;
const HOUR_HEIGHT = 40;

export function timeToPx(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const totalHours = hours + minutes / 60;
  return (totalHours - DAY_START_HOUR) * HOUR_HEIGHT;
}

export function durationToPx(start: string, end: string): number {
  const [startHours, startMins] = start.split(':').map(Number);
  const [endHours, endMins] = end.split(':').map(Number);
  const durationHours = endHours + endMins / 60 - (startHours + startMins / 60);
  return durationHours * HOUR_HEIGHT;
}

export { DAY_START_HOUR, HOUR_HEIGHT, DAY_END_HOUR };
