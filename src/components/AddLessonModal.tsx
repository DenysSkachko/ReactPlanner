import { useState, useEffect } from 'react';
import Modal from './Modal';
import type { Student } from '../types/Student';
import type { Lesson } from '../types/Lesson';
import { DAY_START_HOUR, DAY_END_HOUR } from '../utils/time';
import TimePicker from './TimePicker';

type Props = {
  open: boolean;
  onClose: () => void;
  students: Student[];
  onAdd: (lesson: Lesson) => void;
};

export default function AddLessonModal({
  open,
  onClose,
  students,
  onAdd,
}: Props) {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('08:00');
  const [end, setEnd] = useState('09:00');
  const [error, setError] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (selectedStudentId === '') {
      setPrice(undefined);
      setNotes(undefined);
      setTitle('');
      return;
    }
    const student = students.find((s) => s.id === selectedStudentId);
    if (student) {
      setPrice(student.defaultPrice);
      setNotes(student.defaultNotes);
      setTitle('');
    }
  }, [selectedStudentId, students]);

  const isTimeInRange = (time: string, isStart: boolean) => {
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return false;
    if (m < 0 || m > 59) return false;

    if (isStart) {
      return h >= DAY_START_HOUR && h <= DAY_END_HOUR;
    } else {
      if (h < DAY_START_HOUR || h > DAY_END_HOUR) return false;
      return !(h === DAY_END_HOUR && m > 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedStudentId === '') {
      setError('Пожалуйста, выберите ученика');
      return;
    }
    if (start >= end) {
      setError('Время начала должно быть раньше времени окончания');
      return;
    }
    if (!isTimeInRange(start, true)) {
      setError('Время начала занятия должно быть с 08:00');
      return;
    }
    if (!isTimeInRange(end, false)) {
      setError('Время окончания занятия должно быть до 22:00');
      return;
    }

    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) {
      setError('Выбран неверный ученик');
      return;
    }

    onAdd({
      id: Date.now(),
      title,
      start,
      end,
      studentName: student.name,
      price,
      isPaid: false,
      isCancelled: false,
      studentId: student.id,
      notes,
    });

    setSelectedStudentId('');
    setTitle('');
    setStart('08:00');
    setEnd('09:00');
    setPrice(undefined);
    setNotes(undefined);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-full max-w-md text-[var(--color-text)]"
      >
        <select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(Number(e.target.value))}
          className="input bg-[var(--color-main)] text-[var(--color-text)] p-2 rounded"
          required
        >
          <option value="" disabled>
            Выберите ученика
          </option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>

        <div>
          <label className="text-sm block mb-1 select-none text-[var(--color-text)]">Время начала</label>
          <TimePicker
            value={start}
            onChange={(val) => setStart(val)}
            minHour={DAY_START_HOUR}
            maxHour={DAY_END_HOUR}
            stepMinutes={5}
          />
        </div>

        <div>
          <label className="text-sm block mb-1 select-none text-[var(--color-text)]">
            Время окончания
          </label>
          <TimePicker
            value={end}
            onChange={(val) => setEnd(val)}
            minHour={DAY_START_HOUR}
            maxHour={DAY_END_HOUR}
            stepMinutes={5}
          />
        </div>

        <button
          type="submit"
          className="btn bg-[var(--color-accent)] hover:bg-[var(--hover-accent)] text-[var(--color-text)] py-2 rounded"
        >
          Добавить урок
        </button>

        {error && <div className="bg-red-600 rounded py-3 text-center mt-2">{error}</div>}
      </form>
    </Modal>
  );
}
