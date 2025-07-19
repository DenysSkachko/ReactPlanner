import { useState } from 'react';
import { isSameDay, startOfToday } from 'date-fns';
import clsx from 'clsx';
import DayTabs from '../components/DayTabs';
import { generateWeek } from '../utils/date';
import { useLessons } from '../hooks/useLessons';
import type { Student } from '../types/Student';
import AddStudentModal from '../components/AddStudentModal';
import AddLessonModal from '../components/AddLessonModal';
import type { Lesson } from '../types/Lesson';
import { useStudents } from '../hooks/useStudents';
import { formatDateKey } from '../utils/date';
import StudentsStatsModal from '../components/StudentsStatsModal';
import GeneralStatsModal from '../components/GeneralStatsModal';
import AllStudentsModal from '../components/AllStudentsModal';

const Planner = () => {
  const today = startOfToday();
  const [centerDate, setCenterDate] = useState(today);
  const [activeDate, setActiveDate] = useState(today);
  const [days, setDays] = useState(generateWeek(today));
  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const [studentsStatsOpen, setStudentsStatsOpen] = useState(false);
  const [generalStatsOpen, setGeneralStatsOpen] = useState(false);
  const [isStudentsModalOpen, setStudentsModalOpen] = useState(false);

  const { lessons, addLesson, updateLesson, deleteLesson, allLessons } =
    useLessons(activeDate);

  const handleDayClick = (clicked: Date) => {
    setCenterDate(clicked);
    setActiveDate(clicked);
    setDays(generateWeek(clicked));
  };

  const handleAddLesson = (lesson: Omit<Lesson, 'id'>) => {
    addLesson(lesson);
    setAddLessonOpen(false);
  };

  const handleAddStudent = (student: Student) => {
    addStudent(student);
    setAddStudentOpen(false);
  };

  return (
    <div className="min-h-screen text-white px-4 py-20">
      <div className="mx-auto max-w-[1400px] flex gap-1 transition-all ">
        {days.map((day) => {
          const isActive = isSameDay(day.date, activeDate);
          const key = formatDateKey(day.date);
          const dayLessons = allLessons[key] || [];

          return (
            <div
              key={day.id}
              onClick={() => handleDayClick(day.date)}
              className={clsx(
                'cursor-pointer transition-all rounded-xl duration-300 ease-in-out flex flex-col justify-between outline outline-1 outline-transparent hover:outline-[var(--color-accent)] hover:scale-[1.01]',
                isActive
                  ? 'flex-[2] scale-100'
                  : 'flex-1 scale-95 grayscale-80 hover:grayscale-0'
              )}
            >
              <DayTabs
                date={day.date}
                lessons={dayLessons}
                isActive={isActive}
                onDelete={deleteLesson}
                onUpdateLesson={updateLesson}
                students={students}
              />
            </div>
          );
        })}
      </div>
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <button
          onClick={() => setAddLessonOpen(true)}
          className="bg-[var(--color-colt)] hover:bg-[var(--hover-colt)] text-black px-4 py-2 rounded"
        >
          + Урок
        </button>
        <button
          onClick={() => setAddStudentOpen(true)}
          className="bg-[var(--color-colt)] hover:bg-[var(--hover-colt)] text-black px-4 py-2 rounded"
        >
          + Ученик
        </button>
        <button
          onClick={() => setStudentsStatsOpen(true)}
          className="bg-[var(--color-accent)] hover:bg-[var(--hover-accent)] text-white px-4 py-2 rounded"
          title="Статистика по ученикам"
        >
          Статистика учеников
        </button>
        <button
          onClick={() => setGeneralStatsOpen(true)}
          className="bg-[var(--color-alt)] hover:bg-[var(--color-accent)] text-[var(--hover-text)] hover:text-[var(--color-light)] px-4 py-2 rounded"
          title="Общая статистика"
        >
          Общая статистика
        </button>
        <button
          onClick={() => setStudentsModalOpen(true)}
          className="bg-[var(--color-accent)] hover:bg-[var(--hover-accent)] text-white px-4 py-2 rounded"
          title="Список учеников"
        >
          Список учеников
        </button>
      </div>
      <AddLessonModal
        open={addLessonOpen}
        onClose={() => setAddLessonOpen(false)}
        students={students}
        onAdd={handleAddLesson}
      />

      <AddStudentModal
        open={addStudentOpen}
        onClose={() => setAddStudentOpen(false)}
        onAdd={handleAddStudent}
      />

      <StudentsStatsModal
        open={studentsStatsOpen}
        onClose={() => setStudentsStatsOpen(false)}
        students={students}
        allLessons={allLessons}
      />

      <GeneralStatsModal
        open={generalStatsOpen}
        onClose={() => setGeneralStatsOpen(false)}
        students={students}
        allLessons={allLessons}
      />

      <AllStudentsModal
        open={isStudentsModalOpen}
        onClose={() => setStudentsModalOpen(false)}
        students={students}
        onUpdateStudent={updateStudent}
        onDeleteStudent={deleteStudent}
      />
    </div>
  );
};

export default Planner;
