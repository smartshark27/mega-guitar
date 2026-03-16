'use client';

import { useState, useRef, useEffect } from 'react';

interface Fingering {
  frets: number[];
  fingers: number[];
}

interface ChordInfoProps {
  name: string;
  fingering?: Fingering;
}

export default function ChordInfo({ name, fingering }: ChordInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const renderFingering = (fingering: Fingering) => {
    const strings = ['E', 'A', 'D', 'G', 'B', 'e'];
    return (
      <div className="chord-fingering-grid">
        {fingering.frets.map((fret, idx) => (
          <div key={idx} className="chord-fingering-row">
            <span className="string-name">{strings[idx]}</span>
            <span className="fret-number">
              {fret === -1 ? 'X' : fret === 0 ? 'O' : fret}
            </span>
            {fingering.fingers[idx] > 0 && (
              <span className="finger-number">({fingering.fingers[idx]})</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`chord-container ${isOpen ? 'is-active' : ''}`} ref={containerRef}>
      <button 
        className="chord-button" 
        onClick={() => setIsOpen(!isOpen)}
        title={`Show fingerings for ${name}`}
      >
        {name}
      </button>
      {isOpen && (
        <div className="chord-popover">
          <div className="chord-popover-header">
            <strong>{name}</strong>
            <button className="close-popover" onClick={() => setIsOpen(false)}>&times;</button>
          </div>
          <div className="chord-popover-content">
            {fingering ? (
              renderFingering(fingering)
            ) : (
              <p style={{ margin: 0, fontSize: '0.75rem' }}>No fingering available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
