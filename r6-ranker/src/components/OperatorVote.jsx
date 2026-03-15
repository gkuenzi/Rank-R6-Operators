import { useState, useEffect } from 'react'
import './OpVote.css'
import attackersData from '../../../Attackers.txt'
import defendersData from '../../../Defenders.txt'
import mapImage from '../assets/placeholder-cover-photo.jpg'
import r6Logo from '../assets/simple-r6-logo.png'

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

function opButton(operatorSide, setA, setB) {
  const randomIndexA = Math.floor(Math.random() * operatorSide.length)
  setA(operatorSide[randomIndexA])

  while (true) {
    const randomIndexB = Math.floor(Math.random() * operatorSide.length)
    if (randomIndexB !== randomIndexA) {
      setB(operatorSide[randomIndexB])
      break;
    }
  }
}

export default function operatorVote() {
  const [operatorA, setOperatorA] = useState('Attack')
  const [operatorB, setOperatorB] = useState('Defense')
  const [attackers, setAttackers] = useState([])
  const [defenders, setDefenders] = useState([])

  const atk = true; const def = false;
  const [team, setTeam] = useState();

  useEffect(() => {
    fetch(attackersData)
      .then(response => response.text())
      .then(text => {
        const attackersList = text.split('\n').filter(line => line.trim() !== '')
        setAttackers(attackersList)
      })

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
        <img src={mapImage} alt="Chalet Basement Blueprint" className="mapImage" />
        <div className="userContainer">
          <h1>Choose a Side</h1>
          <div className="opButtons">
            <button onClick={() => {
              if (team === atk) opButton(attackers, setOperatorA, setOperatorB)
              else if (team === def) opButton(defenders, setOperatorA, setOperatorB)
              else {
                setTeam(atk)
                opButton(attackers, setOperatorA, setOperatorB)
              }

            }}
            >{operatorA}
            </button>
            <button onClick={() => {
              if (team === atk) opButton(attackers, setOperatorA, setOperatorB)
              else if (team === def) opButton(defenders, setOperatorA, setOperatorB)
              else {
                setTeam(def)
                opButton(defenders, setOperatorA, setOperatorB)
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
