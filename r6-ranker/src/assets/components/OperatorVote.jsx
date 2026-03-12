import { useState } from 'react'
import './OpVote.css'

function operatorVote() {

  return (
    <div>
      <div className="mainContainer">
        <h1>Situation/Site</h1>
        <div className="opButtons">
          <button>Operator A</button>
          <button>Operator B</button>
        </div>
      </div>
    </div>
  )
}

export default operatorVote
