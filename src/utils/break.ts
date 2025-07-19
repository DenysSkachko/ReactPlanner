import type { Break } from '../types/Break';
import type { Lesson } from '../types/Lesson';

export function calculateBreaks(lessons: Lesson[]): Break[] {
  if (lessons.length < 2) return [];

  const sortedLessons = [...lessons].sort((a, b) =>
    a.start.localeCompare(b.start)
  );

  const breaks: Break[] = [];

  for (let i = 0; i < sortedLessons.length - 1; i++) {
    const currentEnd = sortedLessons[i].end;
    const nextStart = sortedLessons[i + 1].start;

    // конвертим в минуты
    const [curH, curM] = currentEnd.split(':').map(Number);
    const [nextH, nextM] = nextStart.split(':').map(Number);

    const curTotal = curH * 60 + curM;
    const nextTotal = nextH * 60 + nextM;

    const diff = nextTotal - curTotal;
    if (diff > 0) {
      breaks.push({
        start: currentEnd,
        end: nextStart,
        durationMinutes: diff,
      });
    }
  }

  return breaks;
}