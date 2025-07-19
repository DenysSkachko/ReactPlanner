import React, { useMemo, useState } from 'react';
import Modal from './Modal';
import type { Lesson } from '../types/Lesson';
import type { Student } from '../types/Student';
import {
  format,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  parseISO,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

type Props = {
  open: boolean;
  onClose: () => void;
  students: Student[];
  allLessons: Record<string, Lesson[]>;
};

const GeneralStatsModal: React.FC<Props> = ({ open, onClose, students, allLessons }) => {
  const [mode, setMode] = useState<'week' | 'month'>('month');
  const [monthStart, setMonthStart] = useState(startOfMonth(new Date()));
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const allLessonsArray = useMemo(() => {
    return Object.entries(allLessons).flatMap(([date, lessons]) =>
      lessons.map((lesson) => ({ ...lesson, date }))
    );
  }, [allLessons]);

  const filteredLessons = useMemo(() => {
    return allLessonsArray.filter((lesson) => {
      if (!lesson.date) return false;
      const lessonDate = parseISO(lesson.date);
      return isWithinInterval(lessonDate, {
        start: mode === 'week' ? weekStart : monthStart,
        end:
          mode === 'week'
            ? endOfWeek(weekStart, { weekStartsOn: 1 })
            : endOfMonth(monthStart),
      });
    });
  }, [allLessonsArray, mode, weekStart, monthStart]);

  const totalLessons = filteredLessons.length;
  const cancelledLessons = filteredLessons.filter((l) => l.isCancelled).length;
  const paidLessons = filteredLessons.filter((l) => l.isPaid).length;
  const totalEarned = filteredLessons.reduce(
    (sum, l) => (l.isCancelled ? sum : sum + (l.price ?? 0)),
    0
  );
  const uniqueStudentsCount = new Set(filteredLessons.map((l) => l.studentId)).size;

  const handlePrevMonth = () => {
    const prev = new Date(monthStart);
    prev.setMonth(prev.getMonth() - 1);
    setMonthStart(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(monthStart);
    next.setMonth(next.getMonth() + 1);
    setMonthStart(next);
  };

  const handlePrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-white max-w-md w-full flex flex-col gap-8">
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setMode('week')}
            className={`px-4 py-2 rounded ${
              mode === 'week'
                ? 'bg-[var(--color-accent)] text-black'
                : 'bg-white/10 text-white'
            }`}
          >
            Неделя
          </button>
          <button
            onClick={() => setMode('month')}
            className={`px-4 py-2 rounded ${
              mode === 'month'
                ? 'bg-[var(--color-accent)] text-black'
                : 'bg-white/10 text-white'
            }`}
          >
            Месяц
          </button>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={mode === 'week' ? handlePrevWeek : handlePrevMonth}
            className="btn bg-[var(--color-accent)] hover:bg-[var(--hover-accent)] px-5 py-1 rounded"
          >
            Назад
          </button>
          <div className="flex items-center font-semibold text-lg">
            {mode === 'week'
              ? `${format(weekStart, 'dd MMM')} – ${format(
                  endOfWeek(weekStart, { weekStartsOn: 1 }),
                  'dd MMM yyyy'
                )}`
              : format(monthStart, 'MMMM yyyy')}
          </div>
          <button
            onClick={mode === 'week' ? handleNextWeek : handleNextMonth}
            className="btn bg-[var(--color-accent)] hover:bg-[var(--hover-accent)] px-5 py-1 rounded"
          >
            Вперёд
          </button>
        </div>

        <h2 className="text-xl font-semibold text-center">Общая статистика</h2>

        <ul className="space-y-3 text-lg">
          <li>
            Всего уроков: <strong>{totalLessons}</strong>
          </li>
          <li>
            Отменено уроков: <strong>{cancelledLessons}</strong>
          </li>
          <li>
            Оплачено уроков: <strong>{paidLessons}</strong>
          </li>
          <li>
            Всего заработано:{' '}
            <strong>{totalEarned.toFixed(2)} грн</strong>
          </li>
          <li>
            Уникальных учеников: <strong>{uniqueStudentsCount}</strong>
          </li>
        </ul>
      </div>
    </Modal>
  );
};

export default GeneralStatsModal;
