import { useState } from 'react';
import './Results.css'

function makeUrlName(name) {
  if (!name) return '';
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ø/gi, 'o')
    .replace(/æ/gi, 'ae')
    .replace(/œ/gi, 'oe')
    .replace(/ł/gi, 'l')
    .replace(/ß/gi, 'ss')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function getOperatorUrl(name) {
  const slug = makeUrlName(name);
  if (!slug) return '#';
  return `https://www.ubisoft.com/en-us/game/rainbow-six/siege/game-info/operators/${encodeURIComponent(slug)}`;
}

export default function Results({ attackersIDs, defendersIDs, selectedTeam, setView, setSelectedTeam }) {
  const [activeTab, setActiveTab] = useState('General');

  const operators = selectedTeam === 'attack' ? attackersIDs : selectedTeam === 'defense' ? defendersIDs : [];

  const getScoreKey = (tab) => {
    switch (tab) {
      case 'General': return 'general';
      case 'Frag': return 'fragging';
      case 'Support': return 'support';
      case 'Intel': return 'intel';
      default: return 'general';
    }
  };

  const sortedOperators = [...operators].sort((a, b) => b.scores[getScoreKey(activeTab)] - a.scores[getScoreKey(activeTab)]);

  if (!selectedTeam) {
    return (
      <div className="results-container">
        <div className="no-results">Please select a team on the vote screen to view results.</div>
      </div>
    );
  }

  return (
    <>
      <div className="results-container">
        <div className="tabs">
          {['General', 'Frag', 'Support', 'Intel'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="scroll-box">
          {sortedOperators.map((op, index) => (
            <div key={op.name} className="operator-item">
              <span>
                {index + 1}. {op.name}
                <a
                  className="operatorInfo"
                  href={getOperatorUrl(op.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => { if (!op.name) e.preventDefault() }}
                  aria-label={`More info about ${op.name}`}
                >
                  ?
                </a>
              </span>
              <span>{op.scores[getScoreKey(activeTab)]}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <button className="nav-button" onClick={() => { setView('vote'); setSelectedTeam(null); }}>Return to Vote</button>
      </div>
    </>
  );
}