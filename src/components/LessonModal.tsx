import React, { useState } from 'react';
import Modal from './Modal'; // твой общий компонент Modal
import ToggleSwitch from './ToggleSwitch';
import TimePicker from './TimePicker';
import type { Lesson } from '../types/Lesson';
import type { Student } from '../types/Student';

interface LessonModalProps {
  lesson: Lesson; // можно убрать, если не нужен
  editData: Lesson; // текущий редактируемый объект
  onChange: (field: keyof Lesson, value: any) => void;
  onClose: () => void;
  onUpdate: (updatedLesson: Lesson) => void;
  onDelete: (lessonId: number) => void;
  students: Student[];
}

const DAY_START_HOUR = 8;
const DAY_END_HOUR = 22;

const LessonModal: React.FC<LessonModalProps> = ({
  editData,
  onChange,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [error, setError] = useState('');

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

  const handleSave = () => {
    setError('');

    if (!editData.studentId) {
      setError('Пожалуйста, выберите ученика');
      return;
    }

    if (!editData.start || !editData.end) {
      setError('Укажите время начала и окончания занятия');
      return;
    }

    if (editData.start >= editData.end) {
      setError('Время начала должно быть раньше времени окончания');
      return;
    }

    if (!isTimeInRange(editData.start, true)) {
      setError(
        `Время начала занятия должно быть не раньше ${DAY_START_HOUR}:00`
      );
      return;
    }

    if (!isTimeInRange(editData.end, false)) {
      setError(
        `Время окончания занятия должно быть не позже ${DAY_END_HOUR}:00`
      );
      return;
    }

    onUpdate(editData);
    onClose();
  };

  const handleDelete = () => {
    onDelete(editData.id);
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="space-y-4 text-white ">
        <div>
          <div className="p-2 rounded bg-[#1e1e2e] text-white select-none text-center">
            {editData.studentName || 'Неизвестный ученик'}
          </div>
        </div>

        <div>
          <label className="text-sm block mb-1 select-none">Время начала</label>
          <TimePicker
            value={editData.start}
            onChange={(val) => onChange('start', val)}
            minHour={DAY_START_HOUR}
            maxHour={DAY_END_HOUR}
            stepMinutes={5}
          />
        </div>

        <div>
          <label className="text-sm block mb-1 select-none">
            Время окончания
          </label>
          <TimePicker
            value={editData.end}
            onChange={(val) => onChange('end', val)}
            minHour={DAY_START_HOUR}
            maxHour={DAY_END_HOUR}
            stepMinutes={5}
          />
        </div>

        <div>
          <label className="text-sm block mb-1 select-none">Сумма</label>
          <input
            type="number"
            min={0}
            value={editData.price ?? ''}
            onChange={(e) => onChange('price', +e.target.value)}
            className="w-full p-2 rounded bg-[#1e1e2e] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="select-none">Оплачено</span>
          <ToggleSwitch
            checked={editData.isPaid || false}
            handleChange={(e) => onChange('isPaid', e.target.checked)}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="select-none">Отменено</span>
          <ToggleSwitch
            checked={editData.isCancelled || false}
            handleChange={(e) => onChange('isCancelled', e.target.checked)}
          />
        </div>

        <div>
          <label className="text-sm block mb-1 select-none">Заметки</label>
          <textarea
            value={editData.notes || ''}
            onChange={(e) => onChange('notes', e.target.value)}
            className="w-full p-2 rounded bg-[#1e1e2e] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            rows={3}
            placeholder="Введите заметки"
          />
        </div>

        {error && (
          <div className="text-red-500 text-center font-semibold">{error}</div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
            type="button"
          >
            Сохранить
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
            type="button"
          >
            Удалить
          </button>

          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
            type="button"
          >
            Отмена
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LessonModal;
