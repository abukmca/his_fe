import React from 'react';
import Login from './Login';
import Landing from './Landing';
import CreateMember from './components/member/create-member'
import CreateDependent  from './components/dependent/create-dpnd'


import { Routes, Route } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/member" element={<CreateMember />} />
        <Route path="/dpnd" element={<CreateDependent />} />
      </Routes>
    </Router>
  );
}

export default App;
