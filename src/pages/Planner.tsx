import { useState, useEffect, useCallback } from 'react';
import { isSameDay, startOfToday, addDays } from 'date-fns';
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
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const getResponsiveDayCount = () => {
  const width = window.innerWidth;
  if (width >= 1200) return 5;
  if (width >= 900) return 3;
  return 1;
};

const Planner = () => {
  const today = startOfToday();
  const [_centerDate, setCenterDate] = useState(today);
  const [activeDate, setActiveDate] = useState(today);
  const [days, setDays] = useState(
    generateWeek(today, getResponsiveDayCount())
  );
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [studentsStatsOpen, setStudentsStatsOpen] = useState(false);
  const [generalStatsOpen, setGeneralStatsOpen] = useState(false);
  const [isStudentsModalOpen, setStudentsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const { addLesson, updateLesson, deleteLesson, allLessons } =
    useLessons(activeDate);

  const swipeTo = useCallback(
    (delta: -1 | 1) => {
      const newDate = addDays(activeDate, delta);
      setDirection(delta > 0 ? 'right' : 'left');
      setActiveDate(newDate);
      setDays(generateWeek(newDate, getResponsiveDayCount()));
    },
    [activeDate]
  );

  useEffect(() => {
    const handleResize = () => {
      setDays(generateWeek(_centerDate, getResponsiveDayCount()));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [_centerDate]);

  const handleDayClick = (clicked: Date) => {
    setCenterDate(clicked);
    setActiveDate(clicked);
    setDays(generateWeek(clicked, getResponsiveDayCount()));
  };

  const handleAddLesson = (lesson: Omit<Lesson, 'id'>) => {
    addLesson(lesson);
    setAddLessonOpen(false);
  };

  const handleAddStudent = (student: Student) => {
    addStudent(student);
    setAddStudentOpen(false);
  };

  useEffect(() => {
    if (days.length > 1) return;
    const container = document.getElementById('day-container');
    if (!container) return;
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - startX;
      if (deltaX > 50) swipeTo(-1);
      if (deltaX < -50) swipeTo(1);
    };
    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchend', onTouchEnd);
    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [days, swipeTo]);

  return (
    <div className="text-white px-4 md:pr-25 py-4 relative">
      <div
        id="day-container"
        className="mx-auto max-w-[1250px] flex gap-1 transition-all relative"
      >
        {days.length === 1 && (
          <>
            <button
              onClick={() => swipeTo(-1)}
              className="absolute left-[-10px] top-10 -translate-y-1/2 bg-white/20 hover:bg-white/50 p-2 rounded-xl z-20"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={() => swipeTo(1)}
              className="absolute right-[-10px] top-10 -translate-y-1/2 bg-white/20 hover:bg-white/50 p-2 rounded-xl z-20"
            >
              <FaAngleRight />
            </button>
          </>
        )}
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {days.length === 1 ? (
            <motion.div
              key={formatDateKey(activeDate)}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              variants={{
                enter: (dir) => ({
                  x: dir === 'right' ? 300 : -300,
                  opacity: 0,
                }),
                center: { x: 0, opacity: 1 },
                exit: (dir) => ({
                  x: dir === 'right' ? -300 : 300,
                  opacity: 0,
                }),
              }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <DayTabs
                date={activeDate}
                lessons={allLessons[formatDateKey(activeDate)] || []}
                isActive
                onDelete={deleteLesson}
                onUpdateLesson={updateLesson}
                students={students}
              />
            </motion.div>
          ) : (
            <div className="mx-auto max-w-[1250px] w-full flex gap-1 transition-all relative">
              {days.map((day) => {
                const isActive = isSameDay(day.date, activeDate);
                const key = formatDateKey(day.date);
                return (
                  <motion.div
                    key={day.id}
                    onClick={() => handleDayClick(day.date)}
                    className={clsx(
                      'cursor-pointer transition-all rounded-xl duration-300 ease-in-out flex flex-col justify-between',
                      isActive
                        ? 'flex-[2] hover:scale-[1.02] z-10'
                        : 'flex-1 scale-95 grayscale-50 hover:grayscale-0 hover:scale-85 animate-pulse'
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DayTabs
                      date={day.date}
                      lessons={allLessons[key] || []}
                      isActive={isActive}
                      onDelete={deleteLesson}
                      onUpdateLesson={updateLesson}
                      students={students}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 sm:bottom-1/3 right-4 z-45  ">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-3 rounded text-6xl"
        >
          <img src={Alex} width="60" height="40" />
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
              className="absolute bottom-[20%] sm:bottom-6 right-6 z-50 flex flex-col gap-3"
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
              >
                Статистика учеников
              </button>
              <button
                onClick={() => {
                  setGeneralStatsOpen(true);
                  setMenuOpen(false);
                }}
                className="bg-[var(--color-alt)] hover:bg-[var(--color-accent)] text-[var(--hover-text)] hover:text-[var(--color-light)] px-4 py-2 rounded"
              >
                Общая статистика
              </button>
              <button
                onClick={() => {
                  setStudentsModalOpen(true);
                  setMenuOpen(false);
                }}
                className="bg-[var(--color-accent)] hover:bg-[var(--hover-accent)] text-white px-4 py-2 rounded"
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
