import { useState } from 'react';
import { isSameDay, startOfToday } from 'date-fns';
import clsx from 'clsx';
import DayTabs from '../components/DayTabs';
import { generateWeek, formatDateKey } from '../utils/date';
import { useLessons } from '../hooks/useLessons';
import { useStudents } from '../hooks/useStudents';
import AddLessonModal from '../components/AddLessonModal';
import AddStudentModal from '../components/AddStudentModal';
import StudentsStatsModal from '../components/StudentsStatsModal';
import GeneralStatsModal from '../components/GeneralStatsModal';
import AllStudentsModal from '../components/AllStudentsModal';
import type { Student } from '../types/Student';
import type { Lesson } from '../types/Lesson';
import Alex from '../assets/alex.png';
import { AnimatePresence, motion } from 'framer-motion';

const Planner = () => {
  const today = startOfToday();
  const [_centerDate, setCenterDate] = useState(today);
  const [activeDate, setActiveDate] = useState(today);
  const [days, setDays] = useState(generateWeek(today));
  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [studentsStatsOpen, setStudentsStatsOpen] = useState(false);
  const [generalStatsOpen, setGeneralStatsOpen] = useState(false);
  const [isStudentsModalOpen, setStudentsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const { addLesson, updateLesson, deleteLesson, allLessons } =
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
    <div className="h-screen text-white px-4 py-7 relative">
      <div className="mx-auto max-w-[1100px] flex gap-1 transition-all">
        {days.map((day) => {
          const isActive = isSameDay(day.date, activeDate);
          const key = formatDateKey(day.date);
          const dayLessons = allLessons[key] || [];

          return (
            <div
              key={day.id}
              onClick={() => handleDayClick(day.date)}
              className={clsx(
                'cursor-pointer transition-all rounded-xl duration-300 ease-in-out flex flex-col justify-between',
                isActive
                  ? 'flex-[2] hover:scale-[1.02] z-10'
                  : 'flex-1 scale-95 grayscale-80 hover:grayscale-0 hover:scale-85'
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

      <div className="absolute bottom-1/3 right-4 z-50 ">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-3 rounded text-6xl"
        >
          <img src={Alex} width="60" height="40"/>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="absolute bottom-6 right-6 z-50 flex flex-col gap-3"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <button
                onClick={() => {
                  setAddLessonOpen(true);
                  setMenuOpen(false);
                }}
                className="bg-[var(--color-text)] hover:bg-[var(--hover-colt)] text-black px-4 py-2 rounded"
              >
                + Урок
              </button>
              <button
                onClick={() => {
                  setAddStudentOpen(true);
                  setMenuOpen(false);
                }}
                className="bg-[var(--color-text)] hover:bg-[var(--hover-colt)] text-black px-4 py-2 rounded"
              >
                + Ученик
              </button>
              <button
                onClick={() => {
                  setStudentsStatsOpen(true);
                  setMenuOpen(false);
                }}
                className="bg-[var(--color-accent)] hover:bg-[var(--hover-accent)] text-white px-4 py-2 rounded"
                title="Статистика по ученикам"
              >
                Статистика учеников
              </button>
              <button
                onClick={() => {
                  setGeneralStatsOpen(true);
                  setMenuOpen(false);
                }}
                className="bg-[var(--color-alt)] hover:bg-[var(--color-accent)] text-[var(--hover-text)] hover:text-[var(--color-light)] px-4 py-2 rounded"
                title="Общая статистика"
              >
                Общая статистика
              </button>
              <button
                onClick={() => {
                  setStudentsModalOpen(true);
                  setMenuOpen(false);
                }}
                className="bg-[var(--color-accent)] hover:bg-[var(--hover-accent)] text-white px-4 py-2 rounded"
                title="Список учеников"
              >
                Список учеников
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
