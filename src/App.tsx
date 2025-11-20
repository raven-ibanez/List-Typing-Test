import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Leaderboard from './components/Leaderboard';
import AdminDashboard from './components/AdminDashboard';
import { useLeaderboard } from './hooks/useLeaderboard';

function MainApp() {
  const { players, loading } = useLeaderboard();

  return (
    <div className="min-h-screen">
      <Leaderboard players={players} loading={loading} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
