import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Lesson } from '../types/Lesson';
import { timeToPx, durationToPx, DAY_START_HOUR } from '../utils/time';
import LessonModal from './LessonModal';
import type { Student } from '../types/Student';
import BreakBlock from './BreakBlock';
import { calculateBreaks } from '../utils/break';

type DayTabsProps = {
  date: Date;
  lessons: Lesson[];
  onDelete: (id: number) => void;
  onUpdateLesson: (lesson: Lesson) => void;
  students: Student[];
  isActive: boolean;
};

const DayTabs = ({
  date,
  lessons,
  onDelete,
  onUpdateLesson,
  students,
  isActive,
}: DayTabsProps) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [editData, setEditData] = useState<Lesson | null>(null);

  useEffect(() => {
    if (selectedLesson) {
      setEditData(selectedLesson);
    }
  }, [selectedLesson]);

  const handleChange = (field: keyof Lesson, value: any) => {
    if (!editData) return;
    setEditData({ ...editData, [field]: value });
  };

  const handleSave = () => {
    if (editData) {
      onUpdateLesson(editData);
      setSelectedLesson(null);
    }
  };

  const breaks = calculateBreaks(lessons);

  return (
    <div className="relative w-full h-full max-w-6xl mx-auto pt-4 bg-[var(--color-alt)] flex flex-col gap-4 rounded-xl ">
      <div className="font-bold text-2xl text-center bg-[var(--color-accent)] py-2">
        <h2 className={` ${
          !isActive ? '' : 'animate-god-mode text-3xl ' }`}>
        {format(date, 'dd MMMM', { locale: ru })}
      </h2>
      </div>
        <h3 className="absolute -top-5 right-1 shadow-2xl font-extrabold text-xl">
          {format(date, 'EEEE', { locale: ru })}
        </h3>
      <div
        className={`flex flex-grow overflow-y-auto bg-[var(--color-alt)] rounded-xl relative h-[600px] ${
          !isActive ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <div className="w-16 border-r border-white/30 flex flex-col select-none">
          {[...Array(15)].map((_, i) => {
            const hour = i + DAY_START_HOUR;
            return (
              <div
                key={hour}
                className="relative flex items-center justify-center text-sm last:border-b-0"
                style={{ padding: 0, margin: 0, height: 40 }}
              >
                {hour}:00
                {i !== 14 && (
                  <div className="absolute bottom-0 left-0 w-full border-b border-white/30" />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-white/5"></div>
          {isActive &&
            breaks.map((br, index) => <BreakBlock key={index} {...br} />)}

          {lessons.map((lesson) => {
            const top = timeToPx(lesson.start);
            const height = durationToPx(lesson.start, lesson.end);

            let bgColorClass = 'bg-blue-600';
            if (lesson.isCancelled) {
              bgColorClass = 'bg-[#D84040]';
            } else if (lesson.isPaid) {
              bgColorClass = 'bg-green-600';
            }

            return (
              <div
                key={lesson.id}
                className={`${bgColorClass} absolute left-4 right-4 overflow-hidden flex justify-between items-center text-white rounded px-5 cursor-pointer`}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                }}
                onClick={isActive ? () => setSelectedLesson(lesson) : undefined}
              >
                <div
                  className={
                    isActive
                      ? 'text-[18px] font-extrabold'
                      : 'mx-auto font-medium'
                  }
                >
                  {lesson.studentName}
                </div>

                {isActive && (
                  <div className="text-xs opacity-80">
                    {lesson.start} - {lesson.end}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedLesson && editData && (
        <LessonModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onUpdate={handleSave}
          onDelete={onDelete}
          onChange={handleChange}
          editData={editData}
          students={students}
        />
      )}
    </div>
  );
};

export default DayTabs;
