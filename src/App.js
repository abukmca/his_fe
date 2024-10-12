import React from 'react';
import Login from './Login';
import Landing from './Landing';
import CreateMember from './components/member/create-member'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/member" element={<CreateMember />} />
      </Routes>
    </Router>
  );
}

export default App;
