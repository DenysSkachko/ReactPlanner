import type { Lesson } from '../types/Lesson';
import type { Student } from '../types/Student';

const STUDENTS_KEY = 'students';

export const loadStudents = (): Student[] => {
  const raw = localStorage.getItem(STUDENTS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveStudents = (students: Student[]) => {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};
const LESSONS_KEY = 'lessonsByDate';

export const loadLessons = () => {
  const raw = localStorage.getItem(LESSONS_KEY);
  return raw ? JSON.parse(raw) : {};
};

export const saveLessons = (lessons: Record<string, Lesson[]>) => {
  localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
};
