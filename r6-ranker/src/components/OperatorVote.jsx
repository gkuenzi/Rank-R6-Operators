import { useState, useEffect } from 'react'
import './OpVote.css'
import attackersData from '../../../Attackers.txt'
import defendersData from '../../../Defenders.txt'
import mapSites from '../../../Map_sites.txt'
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

function generateIDs(operatorList, team) {
  let operatorIDs = []
  for (let i = 0; i < operatorList.length; i++) {
    const id = {
      name: operatorList[i],
      team: team,
      scores: team === 'attack' ? {
        general: 1000, //Overall Score
        //Support
        support: 1000,  //help the team secure the victory or get a kill
        entry: 1000,  //Soft and Hard Breaching
        //Fragging
        fragging: 1000, //Getting kills and gain map control
        roam_clear: 1000, //taking out roamers
        //Intel
        intel: 1000,  //Gaining information
        vert: 1000 //Vertical play potential
      } : {
        general: 1000, //Overall Score
        //Support
        support: 1000,  //help the team secure the victory or get a kill
        sight_control: 1000,  //Holding down sight
        //Fragging
        fragging: 1000, //Getting kills and gain map control
        roaming: 1000, //Get kills off sight and waste time
        //Intel
        intel: 1000,  //Gaining information
        vert: 1000, //Vertical denial potential
      }
    }
    operatorIDs.push(id)
  }
  return operatorIDs;
}

function parseMaps(lines, index = 0, maps = [], currentMap = null) {  //Resursive Function to find all map sites from Map_sites.txt
  // base case
  if (index >= lines.length) return maps;
  const line = lines[index];
  // ignore empty or space-starting lines
  if (!line || line[0] === " ") {
    return parseMaps(lines, index + 1, maps, currentMap);
  }
  // new map
  if (line[0] === "#") {
    const newMap = {
      name: line.slice(1).trim(),
      sites: []
    };
    maps.push(newMap);
    return parseMaps(lines, index + 1, maps, newMap);
  }

  // otherwise it's a site
  if (currentMap) {
    currentMap.sites.push(line.trim());
    // console.log(currentMap)
  }
  return parseMaps(lines, index + 1, maps, currentMap);
}


function getRandomSite(map) {
  console.log("map", map)
  if (!map || !map.sites || map.sites.length === 0) {
    return 'ERROR'; // or throw an error if you prefer
  }
  const randomIndex = Math.floor(Math.random() * map.sites.length);
  return map.sites[randomIndex];
}



function opButton(operatorSide, setA, setB, setCaption, setMapImage, setSit, mapDict) {
  const randomIndexA = Math.floor(Math.random() * operatorSide.length)
  setA(operatorSide[randomIndexA])

  while (true) {
    const randomIndexB = Math.floor(Math.random() * operatorSide.length)
    if (randomIndexB !== randomIndexA) {
      setB(operatorSide[randomIndexB])
      break;
    }
  }
  const randMap = Math.floor(Math.random() * maps.length)
  const selectedMap = maps[randMap]
  setCaption(selectedMap.charAt(0).toUpperCase() + selectedMap.slice(1))
  setMapImage(mapImages[selectedMap])
  setSit(getRandomSite(mapDict.find(item => item.name === selectedMap)))
}

export default function operatorVote() {
  const [operatorA, setOperatorA] = useState('Attack')
  const [operatorB, setOperatorB] = useState('Defense')
  const [attackers, setAttackers] = useState([])
  const [defenders, setDefenders] = useState([])
  const [attackersIDs, setAttackersIDs] = useState([])
  const [defendersIDs, setDefendersIDs] = useState([])
  const [situation, setSituation] = useState('Choose your Team')
  const [imageCaption, setImageCaption] = useState('“Tactical combat at its finest.”')
  const [currentMapImage, setCurrentMapImage] = useState(placeholderCover)
  const [mapDictionary, setMapDictionary] = useState([])

  const atk = true; const def = false;
  const [team, setTeam] = useState();

  useEffect(() => {
    fetch(attackersData)
      .then(response => response.text())
      .then(text => {
        const attackersList = text.split('\n').filter(line => line.trim() !== '')
        setAttackers(attackersList)
        setAttackersIDs(generateIDs(attackersList, 'attack'))
      })

    fetch(defendersData)
      .then(response => response.text())
      .then(text => {
        const defendersList = text.split('\n').filter(line => line.trim() !== '')
        setDefenders(defendersList)
        setDefendersIDs(generateIDs(defendersList, 'defense'))
      })

    fetch(mapSites)
      .then(res => res.text())
      .then(text => {
        const lines = text.split("\n");
        setMapDictionary(parseMaps(lines));
      });

  }, [])

  useEffect(() => {

  },)

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
            <button onClick={() => {
              if (team === atk) opButton(attackers, setOperatorA, setOperatorB, setImageCaption, setCurrentMapImage, setSituation, mapDictionary)
              else if (team === def) opButton(defenders, setOperatorA, setOperatorB, setImageCaption, setCurrentMapImage, setSituation, mapDictionary )
              else {
                setTeam(atk)
                opButton(attackers, setOperatorA, setOperatorB, setImageCaption, setCurrentMapImage, setSituation, mapDictionary)
              }

            }}
            >{operatorA}
            </button>
            <button onClick={() => {
              if (team === atk) opButton(attackers, setOperatorA, setOperatorB, setImageCaption, setCurrentMapImage, setSituation, mapDictionary)
              else if (team === def) opButton(defenders, setOperatorA, setOperatorB, setImageCaption, setCurrentMapImage, setSituation, mapDictionary)
              else {
                setTeam(def)
                opButton(defenders, setOperatorA, setOperatorB, setImageCaption, setCurrentMapImage, setSituation, mapDictionary)
              }
            }}
            >{operatorB}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
