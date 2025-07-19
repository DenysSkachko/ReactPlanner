import { timeToPx, durationToPx } from '../utils/time';

type BreakBlockProps = {
  start: string;
  end: string;
  durationMinutes: number;
};

const BreakBlock = ({ start, end, durationMinutes }: BreakBlockProps) => {
  const top = timeToPx(start);
  const height = durationToPx(start, end);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} мин`;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
      return `${hours} ${hours === 1 ? 'час' : 'часа'}`;
    }

    return `${hours} ${hours === 1 ? 'час' : 'часа'} ${mins} мин`;
  };

  return (
    <div
      className="absolute left-4 right-4 bg-white/10 rounded flex items-center justify-center text-xs text-white font-light italic"
      style={{ top: `${top}px`, height: `${height}px` }}
    >
      Перерыв: {formatDuration(durationMinutes)}
    </div>
  );
};

export default BreakBlock;
