import React, { useState } from 'react';

interface LinksEditorProps {
  links: string[];
  onChange: (newLinks: string[]) => void;
}

function shortenLink(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '');
}

const LinksEditor: React.FC<LinksEditorProps> = ({ links, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddLink = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !links.includes(trimmed)) {
      onChange([...links, trimmed]);
      setInputValue('');
    }
  };

  const handleRemoveLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  return (
    <div>
      <ul className="mb-2 list-disc list-inside max-h-32 overflow-auto">
        {links.map((link, i) => (
          <li key={i} className="flex justify-between items-center mb-2">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline break-all"
            >
              {shortenLink(link)}
            </a>
            <button
              type="button"
              onClick={() => handleRemoveLink(i)}
              className="bg-red-500 text-[var(--color-text)] text-sm  px-3 rounded hover:bg-red-600"
            >
              delete
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Добавить ссылку"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow rounded px-3 py-1 bg-[var(--color-main)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
        <button
          type="button"
          onClick={handleAddLink}
          className="bg-[var(--color-accent)] text-white px-3 rounded hover:bg-[var(--hover-accent)]"
        >
          Добавить
        </button>
      </div>
    </div>
  );
};

export default LinksEditor;
