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
]

function operatorVote() {
  const [operatorA, setOperatorA] = useState('operator A')
  const [operatorB, setOperatorB] = useState('operator B')
  const [attackers, setAttackers] = useState([])
  const [defenders, setDefenders] = useState([])

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
          <h1>Situation/Site</h1>
          <div className="opButtons">
            <button onClick={() => {
              const randomIndexA = Math.floor(Math.random() * attackers.length)
              setOperatorA(attackers[randomIndexA])

              while (true) {
                const randomIndexB = Math.floor(Math.random() * attackers.length)
                if (randomIndexB !== randomIndexA) {
                  setOperatorB(attackers[randomIndexB])
                  break;
                }
              }
            }}
            >{operatorA}
            </button>
            <button onClick={() => {
              const randomIndexA = Math.floor(Math.random() * attackers.length)
              setOperatorA(attackers[randomIndexA])

              while (true) {
                const randomIndexB = Math.floor(Math.random() * attackers.length)
                if (randomIndexB !== randomIndexA) {
                  setOperatorB(attackers[randomIndexB])
                  break;
                }
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

export default operatorVote
