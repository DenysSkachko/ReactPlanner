
import { useState, useEffect } from 'react';
import Modal from './Modal';

type Link = { id: number; url: string; title: string };
type Tab = 'adults' | 'kids';

const STORAGE_KEY = 'resources-storage-v1';

type StoredLinks = {
  adults: Link[];
  kids: Link[];
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const getInitialLinks = (): StoredLinks => {
  if (typeof window === 'undefined') {
    return { adults: [], kids: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    return { adults: [], kids: [] };
  } catch {
    return { adults: [], kids: [] };
  }
};

const AddResourcesModal: React.FC<Props> = ({ open, onClose }) => {
  const [tab, setTab] = useState<Tab>('adults');
  const [links, setLinks] = useState<StoredLinks>(getInitialLinks);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  }, [links]);

  const handleAdd = () => {
    if (!url.trim()) return;
    const newLink: Link = {
      id: Date.now(),
      url,
      title: title || url,
    };
    setLinks((prev) => ({
      ...prev,
      [tab]: [...prev[tab], newLink],
    }));
    setUrl('');
    setTitle('');
  };

  const handleDelete = (id: number) => {
    setLinks((prev) => ({
      ...prev,
      [tab]: prev[tab].filter((l) => l.id !== id),
    }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-white max-w-md w-full flex flex-col gap-6 max-h-[80vh] overflow-y-auto ">
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setTab('adults')}
            className={`px-4 py-2 rounded ${
              tab === 'adults'
                ? 'bg-[var(--color-accent)] text-black'
                : 'bg-white/10 text-white'
            }`}
          >
            Для взрослых
          </button>
          <button
            onClick={() => setTab('kids')}
            className={`px-4 py-2 rounded ${
              tab === 'kids'
                ? 'bg-[var(--color-accent)] text-black'
                : 'bg-white/10 text-white'
            }`}
          >
            Для детей
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Ссылка"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="px-4 py-2 rounded bg-white/10 text-white"
          />
          <input
            type="text"
            placeholder="Название (необязательно)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2 rounded bg-white/10 text-white"
          />
          <button
            onClick={handleAdd}
            className="mt-2 bg-[var(--color-accent)] text-black px-4 py-2 rounded hover:bg-[var(--hover-accent)]"
          >
            Добавить
          </button>
        </div>

        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {links[tab].length === 0 && (
            <p className="text-sm text-white/50 text-center">
              Пока нет добавленных ссылок
            </p>
          )}
          {links[tab].map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between bg-white/10 px-3 py-2 rounded"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 underline truncate"
              >
                {link.title}
              </a>
              <button
                onClick={() => handleDelete(link.id)}
                className="text-red-400 hover:text-red-600 ml-4"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AddResourcesModal;
