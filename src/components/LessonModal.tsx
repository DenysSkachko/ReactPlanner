import React, { useState } from 'react';
import Modal from './Modal';
import TimePicker from './TimePicker';
import ToggleSwitch from './ToggleSwitch';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lesson } from '../types/Lesson';
import type { Student } from '../types/Student';
import LinksEditor from './LinksEditor';

interface LessonModalProps {
  lesson: Lesson;
  editData: Lesson;
  onChange: (field: keyof Lesson, value: any) => void;
  onClose: () => void;
  onUpdate: (updatedLesson: Lesson) => void;
  onDelete: (lessonId: number) => void;
  students: Student[];
}

const DAY_START_HOUR = 8;
const DAY_END_HOUR = 22;

const tabs = ['Main', 'Materials', 'Homework'];

const tabContentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const LessonModal: React.FC<LessonModalProps> = ({
  editData,
  onChange,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Main');

  const isTimeInRange = (time: string, isStart: boolean) => {
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return false;
    if (m < 0 || m > 59) return false;
    if (isStart) return h >= DAY_START_HOUR && h <= DAY_END_HOUR;
    if (h < DAY_START_HOUR || h > DAY_END_HOUR) return false;
    return !(h === DAY_END_HOUR && m > 0);
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
      <div className="text-white space-y-4">
        <div className="relative grid grid-cols-3 mb-6 border-b border-gray-600">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full px-6 py-2 font-medium transition-colors text-center ${
                activeTab === tab
                  ? 'text-[var(--color-text)]'
                  : 'text-gray-400 hover:text-[var(--color-accent)]'
              }`}
              type="button"
            >
              {tab}
            </button>
          ))}

          <motion.div
            layoutId="underline"
            className="absolute bottom-0 h-1 bg-[var(--color-accent)] rounded"
            style={{
              width: 'calc(100% / 3)',
              left: `${tabs.indexOf(activeTab) * (100 / 3)}%`,
              transition: 'left 0.3s ease',
            }}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {activeTab === 'Main' && (
            <motion.div
              key="info"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4 flex flex-col gap-5"
            >
              <div className="p-2 rounded bg-[var(--color-accent)] text-[var(--color-text)] font-extrabold select-none text-center">
                {editData.studentName || 'Неизвестный ученик'}
              </div>

              <div className="flex justify-center gap-10">
                <div>
                  <label className="text-sm text-center block mb-1 select-none">
                    Время начала
                  </label>
                  <TimePicker
                    value={editData.start}
                    onChange={(val) => onChange('start', val)}
                    minHour={DAY_START_HOUR}
                    maxHour={DAY_END_HOUR}
                    stepMinutes={5}
                  />
                </div>

                <div>
                  <label className="text-sm text-center block mb-1 select-none">
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
              </div>

              <div className="flex justify-between">
                <div>
                  <label className="text-sm text-center block mb-1 select-none">
                    Сумма
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editData.price ?? ''}
                    onChange={(e) => onChange('price', +e.target.value)}
                    className="w-full p-2 rounded bg-[var(--color-main)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="flex flex-col gap-3">
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
                      handleChange={(e) =>
                        onChange('isCancelled', e.target.checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Materials' && (
            <motion.div
              key="materials"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm block mb-1 select-none">Тема урока</label>
                <input
                  value={editData.topic || ''}
                  onChange={(e) => onChange('topic', e.target.value)}
                  className="w-full p-2 rounded bg-[var(--color-main)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="text-sm block mb-1 select-none">
                  Заметки к уроку
                </label>
                <textarea
                  value={editData.workNotes || ''}
                  onChange={(e) => onChange('workNotes', e.target.value)}
                  rows={3}
                  className="w-full p-2 rounded bg-[var(--color-main)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
                />
              </div>

              <div>
                <label className="text-sm block mb-1 select-none">Ссылки</label>
                <LinksEditor
                  links={editData.links || []}
                  onChange={(newLinks) => onChange('links', newLinks)}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'Homework' && (
            <motion.div
              key="homework"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm block mb-1 select-none">
                  Домашка
                </label>
                <textarea
                  value={editData.homework || ''}
                  onChange={(e) => onChange('homework', e.target.value)}
                  rows={3}
                  className="w-full p-2 rounded bg-[var(--color-main)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
                />
              </div>

              <div>
                <label className="text-sm block mb-1 select-none">
                  Ссылки на материалы
                </label>
                <LinksEditor
                  links={editData.linksHome || []}
                  onChange={(newLinks) => onChange('linksHome', newLinks)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="text-red-500 text-center font-semibold">{error}</div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded transition"
          >
            Сохранить
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded transition"
          >
            Удалить
          </button>

          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
          >
            Отмена
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LessonModal;
