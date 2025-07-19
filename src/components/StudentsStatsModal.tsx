import React, { useMemo } from 'react';
import Modal from './Modal';
import type { Student } from '../types/Student';
import type { Lesson } from '../types/Lesson';

type Props = {
  open: boolean;
  onClose: () => void;
  students: Student[];
  allLessons: Record<string, Lesson[]>;
};

type Stats = {
  lessonsCount: number;
  cancelledCount: number;
  totalEarned: number;
};

const StudentsStatsModal: React.FC<Props> = ({
  open,
  onClose,
  students,
  allLessons,
}) => {

  const statsByStudentId = useMemo(() => {
    const statsMap: Record<number, Stats> = {};

    students.forEach((student) => {
      statsMap[student.id] = {
        lessonsCount: 0,
        cancelledCount: 0,
        totalEarned: 0,
      };
    });

    Object.values(allLessons).forEach((lessons) => {
      lessons.forEach((lesson) => {
        if (!lesson.studentId) return;
        const stat = statsMap[lesson.studentId];
        if (!stat) return;

        stat.lessonsCount++;
        if (lesson.isCancelled) {
          stat.cancelledCount++;
        } else {
          stat.totalEarned += lesson.price ?? 0;
        }
      });
    });

    return statsMap;
  }, [students, allLessons]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-white max-w-lg w-full flex flex-col gap-10">
        <h2 className="text-xl font-semibold text-center">Статистика по ученикам</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b border-gray-600 pb-2">Имя</th>
              <th className="border-b border-gray-600 pb-2">Всего уроков</th>
              <th className="border-b border-gray-600 pb-2">Отменено</th>
              <th className="border-b border-gray-600 pb-2">Заработано</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const stat = statsByStudentId[student.id];
              return (
                <tr
                  key={student.id}
                  className="border-b border-gray-700"
                >
                  <td className="py-2">{student.name}</td>
                  <td className="text-center">{stat?.lessonsCount ?? 0}</td>
                  <td className="text-center">{stat?.cancelledCount ?? 0}</td>
                  <td className="text-center">{stat?.totalEarned.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default StudentsStatsModal;
