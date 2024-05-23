import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PetitionList from "./components/PetitionList";
import ViewPetition from "./components/ViewPetition";
import Layout from "./components/Layout";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  return (
    <div className="App">

          <Router>
              <Layout>
            <div>
              <Routes>
                  <Route path="/petitions" element={<PetitionList />}/>
                  <Route path="/petitions/:id" element={<ViewPetition />}/>
                  <Route path="/register" element={<Register />}/>
                  <Route path="/login" element={<Login />}/>

              </Routes>
            </div>
              </Layout>
          </Router>

    </div>
  );
}

export default App;
