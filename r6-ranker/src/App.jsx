import { useState } from 'react'
import './App.css'
import OperatorVote from './components/OperatorVote'
import Results from './components/Results'

function App() {
  const [view, setView] = useState('vote'); // 'vote' or 'results'

  return (
    <div>
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <button onClick={() => setView('vote')} style={{ margin: '0 10px' }}>Vote</button>
        <button onClick={() => setView('results')} style={{ margin: '0 10px' }}>Results</button>
      </div>
      {view === 'vote' ? <OperatorVote /> : <Results />}
    </div>
  )
}

export default App
