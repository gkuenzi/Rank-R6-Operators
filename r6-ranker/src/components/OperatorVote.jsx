// The voting system doesn't accurately work yet


import { useState } from 'react'
import './OpVote.css'
import r6Logo from '../assets/simple-r6-logo.png'
import solidsnake from '../assets/operator-portraits/solidsnake.avif'
import placeholderCover from '../assets/placeholder-cover-photo.jpg'
import bankCover from '../assets/bank-cover-photo.avif'
import borderCover from '../assets/border-cover-photo.avif'
import chaletCover from '../assets/chalet-cover-photo.avif'
import clubhouseCover from '../assets/clubhouse-cover-photo.avif'
import coastlineCover from '../assets/coastline-cover-photo.avif'
import consulateCover from '../assets/consulate-cover-photo.avif'
import emeraldCover from '../assets/emerald-cover-photo.avif'
import fortressCover from '../assets/fortress-cover-photo.avif'
import kafeCover from '../assets/kafe-cover-photo.avif'
import kanalCover from '../assets/kanal-cover-photo.avif'
import lairCover from '../assets/lair-cover-photo.avif'
import nighthavenCover from '../assets/nighthaven-cover-photo.avif'
import oregonCover from '../assets/oregon-cover-photo.avif'
import outbackCover from '../assets/outback-cover-photo.avif'
import skyscraperCover from '../assets/skyscraper-cover-photo.avif'
import themeparkCover from '../assets/themepark-cover-photo.avif'
import villaCover from '../assets/villa-cover-photo.avif'
import { situationScale } from './situationScale'

const maps = [
  'bank',
  'border',
  'chalet',
  'clubhouse',
  'coastline',
  'consulate',
  'emerald',
  'fortress',
  'kafe',
  'lair',
  'nighthaven',
  'oregon',
  'outback',
  'skyscraper',
  'themepark',
  'villa',
];

const mapImages = {
  bank: bankCover,
  border: borderCover,
  chalet: chaletCover,
  clubhouse: clubhouseCover,
  coastline: coastlineCover,
  consulate: consulateCover,
  emerald: emeraldCover,
  fortress: fortressCover,
  kafe: kafeCover,
  kanal: kanalCover,
  lair: lairCover,
  nighthaven: nighthavenCover,
  oregon: oregonCover,
  outback: outbackCover,
  skyscraper: skyscraperCover,
  themepark: themeparkCover,
  villa: villaCover,
};

function getRandomSite(map) {
  console.log("map", map)
  if (!map || !map.sites || map.sites.length === 0) {
    return 'ERROR'; // or throw an error if you prefer
  }
  const randomIndex = Math.floor(Math.random() * map.sites.length);
  return map.sites[randomIndex];
}

function getTieGroups(operators) {
  const grouped = operators.reduce((acc, op) => {
    const score = op.scores.general;
    acc[score] = acc[score] || [];
    acc[score].push(op);
    return acc;
  }, {});

  return Object.values(grouped).filter(group => group.length > 1);
}

function calculateConfidence(operators) {
  if (!operators || operators.length === 0) return 0;

  // Count unique general scores - this is the only indicator of confidence
  const uniqueScores = new Set(operators.map(op => op.scores.general)).size;
  const uniquenessRatio = uniqueScores / operators.length;
  
  // Scale to 0-100% based purely on uniqueness of general scores
  return Math.round(uniquenessRatio * 100);
}

export default function OperatorVote({ attackersIDs, defendersIDs, mapDictionary, selectedTeam, setSelectedTeam, setView, setAttackersIDs, setDefendersIDs }) {
  const [operatorA, setOperatorA] = useState('Attack')
  const [operatorB, setOperatorB] = useState('Defense')
  const attackers = attackersIDs.map(op => op.name)
  const defenders = defendersIDs.map(op => op.name)
  const [situation, setSituation] = useState('Choose your Team')
  const [imageCaption, setImageCaption] = useState('“Tactical combat at its finest.”')
  const [currentMapImage, setCurrentMapImage] = useState(placeholderCover)
  const [currentSituation, setCurrentSituation] = useState(null)
  const [recentPairs, setRecentPairs] = useState([])

  const scale = situationScale();

  const atk = 'attack'; const def = 'defense';

  const applyDelta = (op, delta, isWinner) => {
    if (!op || !op.scores) return;
    const isAttack = selectedTeam === 'attack';
    for (const key in delta) {
      if (delta[key] !== 0) {
        let actualKey = key;
        if (key === 'roam') {
          actualKey = isAttack ? 'roam_clear' : 'roaming';
        } else if (key === 'entry' && !isAttack) {
          continue;
        }
        if (op.scores[actualKey] !== undefined) {
          const value = delta[key];
          if (isWinner) {
            op.scores[actualKey] += value;
          } else {
            op.scores[actualKey] -= Math.ceil(value / 5);
          }
        }
      }
    }
  };

  const generateNewVote = (team) => {
    const operators = team === 'attack' ? attackers : defenders;
    if (!operators || operators.length < 2) return;

    const operatorsList = team === 'attack' ? attackersIDs : defendersIDs;
    const tiedGroups = getTieGroups(operatorsList);
    
    // Calculate current confidence to determine tie prioritization probability
    const currentConfidence = calculateConfidence(operatorsList) / 100;
    // As confidence increases (more differentiation), increase probability of prioritizing ties
    // Formula: 30% at 0% confidence, ramping up to 95% at 100% confidence
    const tiePrioritizationChance = 0.3 + (currentConfidence * 0.65);
    
    let firstOperator;
    let secondOperator;
    let attempts = 0;
    const maxAttempts = 50;

    // Function to check if a pair was recently used
    const isRecentPair = (op1, op2) => {
      const pair = [op1, op2].sort().join('-');
      return recentPairs.includes(pair);
    };

    // Function to get two random operators, avoiding recent pairs
    const getRandomPair = () => {
      let op1, op2;
      do {
        const idx1 = Math.floor(Math.random() * operators.length);
        let idx2;
        do {
          idx2 = Math.floor(Math.random() * operators.length);
        } while (idx2 === idx1);
        op1 = operators[idx1];
        op2 = operators[idx2];
        attempts++;
      } while (isRecentPair(op1, op2) && attempts < maxAttempts);
      return [op1, op2];
    };

    // Prioritize ties more as confidence increases
    const prioritizeTies = tiedGroups.length > 0 && Math.random() < tiePrioritizationChance;

    if (prioritizeTies) {
      // Pick from a random tie group and select two random operators from it
      const tieGroup = tiedGroups[Math.floor(Math.random() * tiedGroups.length)];
      
      // If tie group has only 2 operators, use them both
      if (tieGroup.length === 2) {
        firstOperator = tieGroup[0].name;
        secondOperator = tieGroup[1].name;
      } else {
        // Pick two random distinct operators from the tie group
        const idx1 = Math.floor(Math.random() * tieGroup.length);
        let idx2;
        do {
          idx2 = Math.floor(Math.random() * tieGroup.length);
        } while (idx2 === idx1);
        firstOperator = tieGroup[idx1].name;
        secondOperator = tieGroup[idx2].name;
      }

      // If this tie pair was recent, fall back to random
      if (isRecentPair(firstOperator, secondOperator)) {
        [firstOperator, secondOperator] = getRandomPair();
      }
    } else {
      // Pick two completely random operators, avoiding recent pairs
      [firstOperator, secondOperator] = getRandomPair();
    }

    setOperatorA(firstOperator);
    setOperatorB(secondOperator);

    const isSite = Math.random() < 0.5;
    if (isSite) {
      const randMap = Math.floor(Math.random() * maps.length);
      const selectedMap = maps[randMap];
      setImageCaption(selectedMap.charAt(0).toUpperCase() + selectedMap.slice(1));
      setCurrentMapImage(mapImages[selectedMap]);
      const mapObj = mapDictionary.find(item => item.name === selectedMap);
      const site = getRandomSite(mapObj);
      setSituation(site);
      setCurrentSituation({ general: 10, support: 0, fragging: 0, intel: 0, entry: 0, roam: 0, vert: 0 });
    } else {
      const relevantSituations = scale.filter(s => s.type === 'all' || s.type === team);
      const randSit = Math.floor(Math.random() * relevantSituations.length);
      const sit = relevantSituations[randSit];
      setSituation(sit.situation);
      setImageCaption('Situation');
      setCurrentMapImage(placeholderCover);
      setCurrentSituation(sit);
    }
  };

  const vote = (chosenName) => {
    const isAttack = selectedTeam === 'attack';
    const ops = isAttack ? attackersIDs : defendersIDs;
    const setOps = isAttack ? setAttackersIDs : setDefendersIDs;
    const chosen = ops.find(o => o.name === chosenName);
    const otherName = chosenName === operatorA ? operatorB : operatorA;
    const other = ops.find(o => o.name === otherName);
    if (!chosen || !other || !currentSituation) return;
    applyDelta(chosen, currentSituation, true);
    applyDelta(other, currentSituation, false);
    setOps([...ops]);
    
    // Add current pair to recent pairs to avoid immediate repetition
    const currentPair = [operatorA, operatorB].sort().join('-');
    setRecentPairs(prev => {
      const newPairs = [currentPair, ...prev.filter(p => p !== currentPair)].slice(0, 10);
      return newPairs;
    });
    
    generateNewVote(selectedTeam);
  };

  return (
    <div className="operatorVote">
      <div className="titleConnector">
        <img src={r6Logo} alt="Chalet Basement Blueprint" className="titleLogo" />
        <h1>Operators-Ranked</h1>
      </div>
      <div className="mainContainer">
        <div className="imageContainer">
          <img src={currentMapImage} alt="Chalet Basement Blueprint" className="mapImage" />
          <h2>{imageCaption}</h2>
        </div>
        <div className="userContainer">
          <h1>{situation}</h1>
          <div className="opButtons">
            <div className="operatorCard">
              <button className="operatorButton" onClick={() => {
                if (selectedTeam === atk) {
                  vote(operatorA);
                } else if (selectedTeam === def) {
                  vote(operatorA);
                } else {
                  if (attackersIDs.length === 0) return;
                  setSelectedTeam(atk);
                  generateNewVote(atk);
                }
              }}>
                <img src={solidsnake} alt="Operator" />
              </button>
              <p className="operatorName">{operatorA}</p>
            </div>
            <div className="operatorCard">
              <button className="operatorButton" onClick={() => {
                console.log('Button B clicked, selectedTeam:', selectedTeam, 'defendersIDs.length:', defendersIDs.length);
                if (selectedTeam === atk) {
                  vote(operatorB);
                } else if (selectedTeam === def) {
                  vote(operatorB);
                } else {
                  if (defendersIDs.length === 0) return;
                  setSelectedTeam(def);
                  generateNewVote(def);
                }
              }}>
                <img src={solidsnake} alt="Operator" />
              </button>
              <p className="operatorName">{operatorB}</p>
            </div>
          </div>
        </div>
      </div>
      {selectedTeam ? (
        <>
          <div className="confidence-container">
            <div className="confidence-label">Confidence: {calculateConfidence(selectedTeam === 'attack' ? attackersIDs : defendersIDs)}%</div>
            <div className="confidence-bar">
              <div className="confidence-fill" style={{ width: `${calculateConfidence(selectedTeam === 'attack' ? attackersIDs : defendersIDs)}%` }} />
            </div>
          </div>
          <div style={{ textAlign: 'center', margin: '20px' }}>
            <button className="nav-button" onClick={() => setView('results')}>See Results</button>
          </div>
        </>
      ) : null}
    </div>
  )
}
