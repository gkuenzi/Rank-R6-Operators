import { useState, useEffect } from 'react'
import './OpVote.css'
import attackersData from '../../../Attackers.txt'
import defendersData from '../../../Defenders.txt'
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
  lair: lairCover,
  nighthaven: nighthavenCover,
  oregon: oregonCover,
  outback: outbackCover,
  skyscraper: skyscraperCover,
  themepark: themeparkCover,
  villa: villaCover,
};

function opButton(operatorSide, setA, setB, setSit, setMapImage) {
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
  setSit(selectedMap)
  setMapImage(mapImages[selectedMap])
}

export default function operatorVote() {
  const [operatorA, setOperatorA] = useState('Attack')
  const [operatorB, setOperatorB] = useState('Defense')
  const [attackers, setAttackers] = useState([])
  const [defenders, setDefenders] = useState([])
  const [situation, setSituation] = useState('Choose your Team')
  const [currentMapImage, setCurrentMapImage] = useState(placeholderCover)

  const atk = true; const def = false;
  const [team, setTeam] = useState();

  const attackerIDs = []

  useEffect(() => {
    fetch(attackersData)
      .then(response => response.text())
      .then(text => {
        const attackersList = text.split('\n').filter(line => line.trim() !== '')
        setAttackers(attackersList)
      })

    for (i = 0; i < attackersList.length(); i++) {
      atkID = {
        name: attackersList[i],
        team: "attack",
        scores: {
          general: 1000, //Overall Score
          entry: 1000,  //Soft and Hard Breaching
          fragging: 1000, //Getting kills and gain map control
          vert: 1000, //Vertical Play potential
          intel: 1000,  //Gaining information
          roam_clear: 1000, //taking out roamers
          support: 1000  //help the team secure the victory or get a kill
        }
      }
    }

    fetch(defendersData)
      .then(response => response.text())
      .then(text => {
        const defendersList = text.split('\n').filter(line => line.trim() !== '')
        setDefenders(defendersList)
      })

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
        <img src={currentMapImage} alt="Chalet Basement Blueprint" className="mapImage" />
        <div className="userContainer">
          <h1>{situation}</h1>
          <div className="opButtons">
            <button onClick={() => {
              if (team === atk) opButton(attackers, setOperatorA, setOperatorB, setSituation, setCurrentMapImage)
              else if (team === def) opButton(defenders, setOperatorA, setOperatorB, setSituation, setCurrentMapImage)
              else {
                setTeam(atk)
                opButton(attackers, setOperatorA, setOperatorB, setSituation, setCurrentMapImage)
              }

            }}
            >{operatorA}
            </button>
            <button onClick={() => {
              if (team === atk) opButton(attackers, setOperatorA, setOperatorB, setSituation, setCurrentMapImage)
              else if (team === def) opButton(defenders, setOperatorA, setOperatorB, setSituation, setCurrentMapImage)
              else {
                setTeam(def)
                opButton(defenders, setOperatorA, setOperatorB, setSituation, setCurrentMapImage)
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
