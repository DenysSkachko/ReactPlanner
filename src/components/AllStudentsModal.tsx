import { useState, useEffect } from 'react';
import Modal from './Modal';
import type { Student } from '../types/Student';

interface AllStudentsModalProps {
  open: boolean;
  students: Student[];
  onClose: () => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: number) => void;
}

const AllStudentsModal = ({
  open,
  students,
  onClose,
  onUpdateStudent,
  onDeleteStudent,
}: AllStudentsModalProps) => {
  const [editedStudents, setEditedStudents] = useState<Student[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setEditedStudents(students.map((s) => ({ ...s })));
    setActiveId(students[0]?.id || null);
  }, [students]);

  const handleChange = (id: number, field: keyof Student, value: string) => {
    setEditedStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = (id: number) => {
    const student = editedStudents.find((s) => s.id === id);
    if (student) {
      onUpdateStudent({
        ...student,
        defaultPrice: Number(student.defaultPrice),
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const student = editedStudents.find((s) => s.id === activeId);
  if (!student) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-semibold text-white mb-10 text-center">
        Все ученики
      </h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {editedStudents.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            className={`flex-1 text-center justify-center items-center px-5 py-3 rounded text-lg transition ${
              s.id === activeId
                ? 'bg-[var(--color-accent)] text-[var(--color-text)] font-semibold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {s.name || 'Без имени'}
          </button>
        ))}
      </div>

      <div className="bg-white/10 p-4 rounded-lg flex flex-col gap-3">
        <input
          value={student.name}
          onChange={(e) => handleChange(student.id, 'name', e.target.value)}
          className="rounded px-3 py-2  placeholder-white/40 bg-[var(--color-main)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="Имя"
        />
        <input
          value={student.defaultPrice}
          onChange={(e) =>
            handleChange(student.id, 'defaultPrice', e.target.value)
          }
          className="rounded px-3 py-2 placeholder-white/40 bg-[var(--color-main)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="Цена"
        />
        <input
          value={student.phone || ''}
          onChange={(e) => handleChange(student.id, 'phone', e.target.value)}
          placeholder="Телефон"
          className="rounded px-3 py-2 placeholder-white/40 bg-[var(--color-main)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
        <input
          type="text"
          value={student.birthday || ''}
          onChange={(e) => handleChange(student.id, 'birthday', e.target.value)}
          placeholder="Дата рождения"
          className="bg-[var(--color-main)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] rounded px-3 py-2 placeholder-white/40"
        />

        <textarea
          value={student.defaultNotes || ''}
          onChange={(e) =>
            handleChange(student.id, 'defaultNotes', e.target.value)
          }
          className="rounded px-3 py-2  placeholder-white/40 bg-[var(--color-main)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
          placeholder="Заметка"
          rows={3}
        />
        <div className="flex justify-between">
          <button
            onClick={() => handleSave(student.id)}
            className="bg-green-600 hover:bg-green-700 text-[var(--color-text)] px-4 py-2 rounded transition"
          >
            Сохранить
          </button>
          <button
            onClick={() => onDeleteStudent(student.id)}
            className="bg-red-600 hover:bg-red-700 text-[var(--color-text)] px-4 py-2 rounded transition"
          >
            Удалить
          </button>
        </div>
        {showSuccess && (
          <div className="text-green-600 text-sm mt-2">
            Данные успешно обновлены!
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AllStudentsModal;
