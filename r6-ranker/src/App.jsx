import { useState, useEffect } from 'react'
import './App.css'
import OperatorVote from './components/OperatorVote'
import Results from './components/Results'

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

function App() {
  const [view, setView] = useState('vote'); // 'vote' or 'results'
  const [attackersIDs, setAttackersIDs] = useState([])
  const [defendersIDs, setDefendersIDs] = useState([])
  const [mapDictionary, setMapDictionary] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null); // 'attack' or 'defense' or null

  useEffect(() => {
    const loadData = async () => {
      const attackersResponse = await fetch('/Attackers.txt');
      const attackersText = await attackersResponse.text();
      const attackersList = attackersText.split('\n').filter(line => line.trim() !== '');
      setAttackersIDs(generateIDs(attackersList, 'attack'));

      const defendersResponse = await fetch('/Defenders.txt');
      const defendersText = await defendersResponse.text();
      const defendersList = defendersText.split('\n').filter(line => line.trim() !== '');
      setDefendersIDs(generateIDs(defendersList, 'defense'));

      const mapResponse = await fetch('/Map_sites.txt');
      const mapText = await mapResponse.text();
      const lines = mapText.split("\n");
      setMapDictionary(parseMaps(lines));
    };

    loadData();
  }, []);

  function parseMaps(lines, index = 0, maps = [], currentMap = null) {
    if (index >= lines.length) return maps;
    const line = lines[index];
    if (!line || line[0] === " ") {
      return parseMaps(lines, index + 1, maps, currentMap);
    }
    if (line[0] === "#") {
      const newMap = {
        name: line.slice(1).trim(),
        sites: []
      };
      maps.push(newMap);
      return parseMaps(lines, index + 1, maps, newMap);
    }
    if (currentMap) {
      currentMap.sites.push(line.trim());
    }
    return parseMaps(lines, index + 1, maps, currentMap);
  }

  return (
    <div>
      {view === 'vote' ? <OperatorVote attackersIDs={attackersIDs} defendersIDs={defendersIDs} mapDictionary={mapDictionary} selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} view={view} setView={setView} /> : <Results attackersIDs={attackersIDs} defendersIDs={defendersIDs} selectedTeam={selectedTeam} view={view} setView={setView} setSelectedTeam={setSelectedTeam} />}
    </div>
  )
}

export default App
