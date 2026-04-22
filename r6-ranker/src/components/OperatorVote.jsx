// The voting system doesn't accurately work yet


import { useState, useEffect, useRef } from 'react'
import './OpVote.css'
import r6Logo from '../assets/simple-r6-logo.png'
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

// map display overrides (slug used for URL)
const mapDisplayOverrides = {
  nighthaven: 'nighthavenlabs',
  kafe: 'kafedostoyevsky',
  emerald: 'emeraldplains',
}

// human-friendly display names for maps (used in UI)
const mapDisplayNames = {
  nighthaven: 'Nighthaven Labs',
  kafe: 'Kafe Dostoyevsky',
  emerald: 'Emerald Plains',
}

function capitalizeWords(str) {
  return String(str || '')
    .split(' ')
    .filter(Boolean)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

// load all operator portraits as URLs (Vite import.meta.glob) - support multiple extensions
const portraitModules = import.meta.glob('../assets/operator-portraits/*.{avif,png,jpg,jpeg,webp}', { eager: true, as: 'url' })
const portraitMap = {}
for (const p in portraitModules) {
  const file = p.split('/').pop()
  const key = file.replace(/\.[^.]+$/, '').toLowerCase()
  portraitMap[key] = portraitModules[p]
}

function normalizeName(name) {
  if (!name) return ''
  // normalize, strip combining marks, remove non-alphanumerics, collapse spaces, lowercase
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // transliterate common special letters
    .replace(/ø/gi, 'o')
    .replace(/æ/gi, 'ae')
    .replace(/œ/gi, 'oe')
    .replace(/ł/gi, 'l')
    .replace(/ß/gi, 'ss')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase()
}

function getPortraitUrl(name) {
  const key = normalizeName(name)
  return portraitMap[key] || portraitMap['solidsnake'] || ''
}

function makeUrlName(name) {
  if (!name) return ''
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ø/gi, 'o')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
}

function getOperatorUrl(name) {
  const slug = makeUrlName(name)
  if (!slug) return '#'
  return `https://www.ubisoft.com/en-us/game/rainbow-six/siege/game-info/operators/${encodeURIComponent(slug)}`
}

function getMapUrl(name) {
  if (!name) return '#'
  const slug = makeUrlName(name)
  return `https://www.ubisoft.com/en-us/game/rainbow-six/siege/game-info/maps/${encodeURIComponent(slug)}`
}

function getRandomSite(map) {
  // console.log("map", map)
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
  const nameARef = useRef(null)
  const nameBRef = useRef(null)
  const attackers = attackersIDs.map(op => op.name)
  const defenders = defendersIDs.map(op => op.name)
  const [situation, setSituation] = useState('Choose your Team')
  const [imageCaption, setImageCaption] = useState('“Tactical combat at its finest.”')
  const [currentMapImage, setCurrentMapImage] = useState(placeholderCover)
  const [currentSituation, setCurrentSituation] = useState(null)
  const [recentPairs, setRecentPairs] = useState([])

  const scale = situationScale();

  const atk = 'attack'; const def = 'defense';



  // Add slight randomness to the delta values: ±1 to ±2 points (window) for variability
  const randomizedDelta = (val) => {
    if (!val || typeof val !== 'number') return val;
    // choose magnitude 1 or 2
    const mag = 1 + Math.floor(Math.random() * 2); // 1 or 2
    const sign = Math.random() < 0.5 ? -1 : 1;
    const randomized = val + (sign * mag);
    return Math.max(0, Math.round(randomized));
  };

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
          const rawValue = delta[key];
          const value = randomizedDelta(rawValue);
          if (isWinner) {
            op.scores[actualKey] += value;
          } else {
            op.scores[actualKey] -= Math.ceil(value / 5);
          }
        }
      }
    }
  };

  // Shrink-to-fit logic for operator names: reduce font-size until text fits its available space
  const fitName = (textEl) => {
    if (!textEl) return;
    const parent = textEl.parentElement;
    if (!parent) return;
    const icon = parent.querySelector('.operatorInfo');
    const iconStyle = icon ? getComputedStyle(icon) : null;
    const iconWidth = icon ? icon.offsetWidth + (parseFloat(iconStyle.marginLeft || 0)) : 0;
    const available = parent.clientWidth - iconWidth - 4; // small padding

    const maxSize = 20;
    const minSize = 12; // keep names readable
    let size = maxSize;
    textEl.style.whiteSpace = 'nowrap';
    textEl.style.display = 'inline-block';
    textEl.style.fontSize = `${size}px`;

    // If it already fits, nothing to do
    while (textEl.scrollWidth > available && size > minSize) {
      size -= 1;
      textEl.style.fontSize = `${size}px`;
    }
  };

  useEffect(() => {
    const run = () => {
      fitName(nameARef.current);
      fitName(nameBRef.current);
    };
    run();
    window.addEventListener('resize', run);
    return () => window.removeEventListener('resize', run);
  }, [operatorA, operatorB, selectedTeam]);

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

    // increment 'shown' counter for both operators so Results can compute possible totals
    const incrementShown = (teamArr, setTeamArr, names) => {
      setTeamArr(teamArr.map(op => names.includes(op.name) ? { ...op, shown: (op.shown || 0) + 1 } : op));
    };
    if (team === 'attack') {
      incrementShown(attackersIDs, setAttackersIDs, [firstOperator, secondOperator]);
    } else {
      incrementShown(defendersIDs, setDefendersIDs, [firstOperator, secondOperator]);
    }

    const isSite = Math.random() < 0.5;
    if (isSite) {
      const randMap = Math.floor(Math.random() * maps.length);
      const selectedMap = maps[randMap];
      // show a human-friendly display name (replace hyphens with spaces and capitalize)
      const displayName = mapDisplayNames[selectedMap] || capitalizeWords((selectedMap || '').replace(/-/g, ' '));
      setImageCaption(displayName);
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
          <h2>
            {imageCaption}
            {currentMapImage !== placeholderCover && imageCaption !== 'Situation' ? (
              <a
                className="operatorInfo mapInfo"
                href={getMapUrl(imageCaption)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => { if (!imageCaption) e.preventDefault() }}
                aria-label={`More info about ${imageCaption}`}
              >
                ?
              </a>
            ) : null}
          </h2>
        </div>
        <div className="userContainer">
          <h1>{situation}</h1>
          <div className="opButtons">
            <div className="operatorCard">
              <button className={`operatorButton ${!selectedTeam ? 'chooseTeam' : ''}`} onClick={() => {
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
                <img
                  src={selectedTeam ? getPortraitUrl(operatorA) : (portraitMap['attacker'] || portraitMap['ace'] || portraitMap['solidsnake'] || placeholderCover)}
                  alt={operatorA || 'Operator'}
                />
              </button>
              <p className="operatorName">
                <span ref={nameARef} className="operatorNameText">{operatorA}</span>
                <a
                  className="operatorInfo"
                  href={getOperatorUrl(operatorA)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => { if (!operatorA) e.preventDefault() }}
                  aria-label={`More info about ${operatorA}`}
                >
                  ?
                </a>
              </p>
            </div>
            <div className="operatorCard">
              <button className={`operatorButton ${!selectedTeam ? 'chooseTeam' : ''}`} onClick={() => {
                // console.log('Button B clicked, selectedTeam:', selectedTeam, 'defendersIDs.length:', defendersIDs.length);
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
                <img
                  src={selectedTeam ? getPortraitUrl(operatorB) : (portraitMap['defender'] || portraitMap['sentry'] || portraitMap['solidsnake'] || placeholderCover)}
                  alt={operatorB || 'Operator'}
                />
              </button>
              <p className="operatorName">
                <span ref={nameBRef} className="operatorNameText">{operatorB}</span>
                <a
                  className="operatorInfo"
                  href={getOperatorUrl(operatorB)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => { if (!operatorB) e.preventDefault() }}
                  aria-label={`More info about ${operatorB}`}
                >
                  ?
                </a>
              </p>
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
