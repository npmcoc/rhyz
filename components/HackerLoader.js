import { useEffect, useState } from 'react';

export default function HackerLoader({ text = 'LOADING' }) {
  const [dots, setDots] = useState('');
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);

    const hackLines = [
      '> Initializing connection...',
      '> Establishing secure tunnel...',
      '> Authenticating credentials...',
      '> Fetching clan data from server...',
      '> Decrypting response...',
      '> Parsing JSON payload...',
      '> Loading complete...',
    ];

    let currentIndex = 0;
    const linesInterval = setInterval(() => {
      if (currentIndex < hackLines.length) {
        setLines(prev => [...prev, hackLines[currentIndex]]);
        currentIndex++;
      }
    }, 300);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(linesInterval);
    };
  }, []);

  return (
    <div className="hacker-loader-overlay">
      <div className="hacker-loader-container">
        <div className="hacker-loader-header">
          <span className="hacker-blink">█</span>
          {' GENERATE SYSTEMS '}
          <span className="hacker-blink">█</span>
        </div>
        
        <div className="hacker-loader-terminal">
          {lines.map((line, index) => (
            <div key={index} className="hacker-line">
              {line}
            </div>
          ))}
          <div className="hacker-status">
            {text}{dots}
            <span className="hacker-cursor">_</span>
          </div>
        </div>

        <div className="hacker-progress-bar">
          <div className="hacker-progress-fill"></div>
        </div>

        <div className="hacker-loader-footer">
          <span className="hacker-label">ACCESS LEVEL:</span>
          <span className="hacker-value">CLAN LEADER</span>
          <span className="hacker-separator">|</span>
          <span className="hacker-label">STATUS:</span>
          <span className="hacker-value hacker-blink">LOADING</span>
        </div>
      </div>
    </div>
  );
}
