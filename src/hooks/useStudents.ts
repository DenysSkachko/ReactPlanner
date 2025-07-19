import { useEffect, useState } from 'react';
import { loadStudents, saveStudents } from '../utils/storage';
import type { Student } from '../types/Student';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>(() => loadStudents());

  useEffect(() => {
    saveStudents(students);
  }, [students]);

  const addStudent = (student: Student) => {
    setStudents((prev) => [...prev, student]);
  };

  const updateStudent = (updated: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  const deleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
  };
};
