import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PetitionList from "./components/PetitionList";
import PetitionObject from "./components/PetitionObject";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
              <Route path="/petitions" element={<PetitionList />}/>
              <Route path="/petitions/:id" element={<PetitionObject />}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
