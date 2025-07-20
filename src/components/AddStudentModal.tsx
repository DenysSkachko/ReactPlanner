import Modal from './Modal';
import { useState } from 'react';
import type { Student } from '../types/Student';

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (student: Student) => void;
};

export default function AddStudentModal({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [defaultPrice, setDefaultPrice] = useState<number>(0);
  const [defaultNotes, setDefaultNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      id: Date.now(),
      name,
      defaultPrice,
      defaultNotes,
    });
    setName('');
    setDefaultPrice(0);
    setDefaultNotes('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-full max-w-md"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Имя ученика"
          className="w-full p-2 rounded bg-[var(--color-main)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
          required
          autoFocus
        />
        <input
          type="number"
          min={0}
          value={defaultPrice === 0 ? '' : defaultPrice}
          onChange={(e) => {
            const val = e.target.value;
            setDefaultPrice(val === '' ? 0 : Number(val));
          }}
          placeholder="Цена урока"
          className="w-full p-2 rounded bg-[var(--color-main)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
        <textarea
          value={defaultNotes}
          onChange={(e) => setDefaultNotes(e.target.value)}
          placeholder="Заметки"
          className="w-full p-2 rounded bg-[var(--color-main)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
          rows={3}
        />
        <button
          type="submit"
          className="btn bg-[var(--color-accent)] hover:bg-[var(--hover-accent)] text-[var(--color-text)] py-2 rounded mt-2"
        >
          Добавить ученика
        </button>
      </form>
    </Modal>
  );
}
