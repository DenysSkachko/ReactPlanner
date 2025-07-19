import { useEffect, useState } from 'react';
import { formatDateKey } from '../utils/date';
import { loadLessons, saveLessons } from '../utils/storage';
import type { Lesson } from '../types/Lesson';

export const useLessons = (activeDate: Date) => {
  const [lessonsByDate, setLessonsByDate] = useState<Record<string, Lesson[]>>(
    () => loadLessons()
  );

  const dateKey = formatDateKey(activeDate);

  const addLesson = (lesson: Omit<Lesson, 'id'>) => {
    setLessonsByDate((prev) => {
      const newLesson = { ...lesson, id: Date.now() };
      return {
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newLesson],
      };
    });
  };

  const updateLesson = (updated: Lesson) => {
    setLessonsByDate((prev) => ({
      ...prev,
      [dateKey]:
        prev[dateKey]?.map((l) => (l.id === updated.id ? updated : l)) || [],
    }));
  };

  const deleteLesson = (id: number) => {
    setLessonsByDate((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter((l) => l.id !== id) || [],
    }));
  };

  useEffect(() => {
    saveLessons(lessonsByDate);
  }, [lessonsByDate]);

  return {
    lessons: lessonsByDate[dateKey] || [],
    addLesson,
    updateLesson,
    deleteLesson,
    allLessons: lessonsByDate,
  };
};
