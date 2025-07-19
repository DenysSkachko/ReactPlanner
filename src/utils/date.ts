import { addDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const generateWeek = (centerDate: Date) => {
  return Array.from({ length: 4 }, (_, i) => {
    const offset = i - 1;
    const date = addDays(centerDate, offset);
    return {
      id: date.toISOString(),
      date,
      label: format(date, 'd MMMM, EEEE', { locale: ru }),
    };
  });
};

export const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd');
