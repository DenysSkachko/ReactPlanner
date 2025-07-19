import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { IoCloseCircle } from 'react-icons/io5';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const modalRoot = document.getElementById('modal-root')!;

const Modal = ({ open, onClose, children }: ModalProps) => {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (open) {
      document.addEventListener('keydown', onEsc);
    }
    return () => {
      document.removeEventListener('keydown', onEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-[var(--color-alt)] rounded-xl p-6 w-full max-w-lg shadow-2xl">
        <button
          onClick={onClose}
          className="absolute -top-6 -right-4 text-[var(--color-accent)] text-5xl font-bold hover:text-[var(--hover-accent)] transition"
          aria-label="Закрыть модалку"
          type="button"
        >
          <IoCloseCircle />
        </button>

        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
