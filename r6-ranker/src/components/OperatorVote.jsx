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

function createOperatorIndex(operatorNames, role) {
  return operatorNames.reduce((acc, name, index) => {
    const id = `${role}-${index + 1}`
    acc[name] = {
      id,
      name,
      role,
      score: 0,
    }
    return acc
  }, {})
}

function opButton(operatorSideArray, setA, setB, setSit, setMapImage) {
  if (!Array.isArray(operatorSideArray) || operatorSideArray.length < 2) {
    return
  }

  const randomIndexA = Math.floor(Math.random() * operatorSideArray.length)
  const randomIndexB = Math.floor(Math.random() * (operatorSideArray.length - 1))
  const indexB = randomIndexB >= randomIndexA ? randomIndexB + 1 : randomIndexB

  setA(operatorSideArray[randomIndexA])
  setB(operatorSideArray[indexB])

  const randMap = Math.floor(Math.random() * maps.length)
  const selectedMap = maps[randMap]
  setSit(selectedMap)
  setMapImage(mapImages[selectedMap])
}

export default function operatorVote() {
  const [operatorA, setOperatorA] = useState({ id: '', name: 'Attack', role: '', score: 0 })
  const [operatorB, setOperatorB] = useState({ id: '', name: 'Defense', role: '', score: 0 })
  const [attackers, setAttackers] = useState({})
  const [defenders, setDefenders] = useState({})
  const [attackerList, setAttackerList] = useState([])
  const [defenderList, setDefenderList] = useState([])
  const [situation, setSituation] = useState('Choose your Team')
  const [currentMapImage, setCurrentMapImage] = useState(placeholderCover)

  const atk = true; const def = false;
  const [team, setTeam] = useState();

  useEffect(() => {
    fetch(attackersData)
      .then(response => response.text())
      .then(text => {
        const attackersListFromFile = text.split('\n').filter(line => line.trim() !== '')
        const attackersMap = createOperatorIndex(attackersListFromFile, 'attacker')
        const attackersValues = Object.values(attackersMap)
        setAttackers(attackersMap)
        setAttackerList(attackersValues)
      })

    fetch(defendersData)
      .then(response => response.text())
      .then(text => {
        const defendersListFromFile = text.split('\n').filter(line => line.trim() !== '')
        const defendersMap = createOperatorIndex(defendersListFromFile, 'defender')
        const defendersValues = Object.values(defendersMap)
        setDefenders(defendersMap)
        setDefenderList(defendersValues)
      })

  }, [])

  return (
    <div className="operatorVote">
      <div className="titleConnector">
        <img src={r6Logo} alt="Rainbow Six Siege Logo" className="titleLogo" />
        <h1>Operators:Ranked</h1>
      </div>
      <div className="mainContainer">
        <img src={currentMapImage} alt="Chalet Basement Blueprint" className="mapImage" />
        <div className="userContainer">
          <h1>{situation}</h1>
          <div className="opButtons">
            <button onClick={() => {
              if (team === atk) opButton(attackerList, setOperatorA, setOperatorB, setSituation, setCurrentMapImage)
              else if (team === def) opButton(defenderList, setOperatorA, setOperatorB, setSituation, setCurrentMapImage)
              else {
                setTeam(atk)
                opButton(attackerList, setOperatorA, setOperatorB, setSituation, setCurrentMapImage)
              }
            }}
            >{operatorA?.name || operatorA}
            </button>
            <button onClick={() => {
              if (team === atk) opButton(attackerList, setOperatorA, setOperatorB, setSituation, setCurrentMapImage)
              else if (team === def) opButton(defenderList, setOperatorA, setOperatorB, setSituation, setCurrentMapImage)
              else {
                setTeam(def)
                opButton(defenderList, setOperatorA, setOperatorB, setSituation, setCurrentMapImage)
              }
            }}
            >{operatorB?.name || operatorB}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
