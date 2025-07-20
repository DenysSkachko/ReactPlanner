import { addDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const generateWeek = (centerDate: Date, count: number = 5) => {

  const offsetBase = count >= 3 ? 1 : 0;
  return Array.from({ length: count }, (_, i) => {
    const offset = i - offsetBase;
    const date = addDays(centerDate, offset);
    return {
      id: date.toISOString(),
      date,
      label: format(date, 'd MMMM, EEEE', { locale: ru }),
    };
  });
};

export const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd');
