import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import PetitionList from "./components/PetitionList";
import ViewPetition from "./components/ViewPetition";
import Layout from "./components/Layout";
import Register from "./components/Register";
import Login from "./components/Login";
import MyPetitions from "./components/MyPetitions";
import CreatePetition from "./components/CreatePetition";
import EditPetition from "./components/EditPetition";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";

function App() {
  return (
    <div className="App">

          <Router>
              <Layout>
            <div>
              <Routes>
                  <Route path="/" element={<Navigate to="/petitions" />} />
                  <Route path="/petitions" element={<PetitionList />}/>
                  <Route path="/petitions/:petitionId" element={<ViewPetition />}/>
                  <Route path="/register" element={<Register />}/>
                  <Route path="/login" element={<Login />}/>
                  <Route path="/mypetitions" element={<MyPetitions />}/>
                  <Route path="/createpetition" element={<CreatePetition />}/>
                  <Route path="/editpetition/:petitionId" element={<EditPetition />}/>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/editprofile" element={<EditProfile />} />

              </Routes>
            </div>
              </Layout>
          </Router>

    </div>
  );
}

export default App;
