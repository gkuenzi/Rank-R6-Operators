import { useState, useEffect } from 'react'
import './OpVote.css'
import attackersData from '../../../Attackers.txt'
import defendersData from '../../../Defenders.txt'

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

  return (
    <div>
      <div className="mainContainer">
        <h1>Situation/Site</h1>
        <div className="opButtons">
          <button onClick={() => {
            const randomIndexA = Math.floor(Math.random() * attackers.length)
            setOperatorA(attackers[randomIndexA])

            const randomIndexB = Math.floor(Math.random() * attackers.length)
            setOperatorB(attackers[randomIndexB])
          }}
          >{operatorA}
          </button>
          <button onClick={() => {
            const randomIndexA = Math.floor(Math.random() * attackers.length)
            setOperatorA(attackers[randomIndexA])

            const randomIndexB = Math.floor(Math.random() * attackers.length)
            setOperatorB(attackers[randomIndexB])
          }}
          >{operatorB}
          </button>
        </div>
      </div>
    </div>
  )
}

export default operatorVote
