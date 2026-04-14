import { useState, useEffect } from 'react';
import attackersData from '../../../Attackers.txt';
import defendersData from '../../../Defenders.txt';

function generateIDs(operatorList, team) {
  let operatorIDs = [];
  for (let i = 0; i < operatorList.length; i++) {
    const id = {
      name: operatorList[i],
      team: team,
      scores: team === 'attack' ? {
        general: 1000,
        support: 1000,
        fragging: 1000,
        intel: 1000,
        entry: 1000,
        roam_clear: 1000,
        vert: 1000
      } : {
        general: 1000,
        support: 1000,
        fragging: 1000,
        intel: 1000,
        sight_control: 1000,
        roaming: 1000,
        vert: 1000
      }
    };
    operatorIDs.push(id);
  }
  return operatorIDs;
}

export default function Results() {
  const [operators, setOperators] = useState([]);
  const [activeTab, setActiveTab] = useState('General');

  useEffect(() => {
    const loadOperators = async () => {
      const attackersResponse = await fetch(attackersData);
      const attackersText = await attackersResponse.text();
      const attackersList = attackersText.split('\n').filter(line => line.trim() !== '');

      const defendersResponse = await fetch(defendersData);
      const defendersText = await defendersResponse.text();
      const defendersList = defendersText.split('\n').filter(line => line.trim() !== '');

      const attackersIDs = generateIDs(attackersList, 'attack');
      const defendersIDs = generateIDs(defendersList, 'defense');

      setOperators([...attackersIDs, ...defendersIDs]);
    };

    loadOperators();
  }, []);

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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        display: 'flex',
        marginBottom: '20px'
      }}>
        {['General', 'Frag', 'Support', 'Intel'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              margin: '0 5px',
              backgroundColor: activeTab === tab ? '#007bff' : '#fff',
              color: activeTab === tab ? '#fff' : '#000',
              border: '1px solid #007bff',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{
        width: '400px',
        height: '400px',
        border: '2px solid #007bff',
        borderRadius: '10px',
        overflowY: 'scroll',
        backgroundColor: '#fff',
        padding: '10px'
      }}>
        {sortedOperators.map((op, index) => (
          <div key={op.name} style={{
            padding: '10px',
            borderBottom: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>{index + 1}. {op.name} ({op.team})</span>
            <span>{op.scores[getScoreKey(activeTab)]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}