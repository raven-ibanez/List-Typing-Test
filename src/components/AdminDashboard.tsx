import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, Trophy, Users, Lock, Zap, Target } from 'lucide-react';
import { Player, PlayerInput } from '../types';
import { useLeaderboard } from '../hooks/useLeaderboard';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('typing_test_admin_auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const { players, loading, addPlayer, updatePlayer, deletePlayer } = useLeaderboard();
  const [currentView, setCurrentView] = useState<'dashboard' | 'players' | 'add' | 'edit'>('dashboard');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<PlayerInput>({
    name: '',
    wpm: 0,
    accuracy: 0
  });

  const handleAddPlayer = () => {
    setCurrentView('add');
    setFormData({
      name: '',
      wpm: 0,
      accuracy: 0
    });
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      wpm: player.wpm,
      accuracy: player.accuracy
    });
    setCurrentView('edit');
  };

  const handleDeletePlayer = async (id: string) => {
    if (confirm('Are you sure you want to delete this player? This action cannot be undone.')) {
      try {
        setIsProcessing(true);
        await deletePlayer(id);
      } catch (error) {
        alert('Failed to delete player. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSavePlayer = async () => {
    if (!formData.name || formData.wpm < 0 || formData.accuracy < 0 || formData.accuracy > 100) {
      alert('Please fill in all required fields correctly. Accuracy must be between 0 and 100.');
      return;
    }

    try {
      setIsProcessing(true);
      if (editingPlayer) {
        await updatePlayer(editingPlayer.id, formData);
      } else {
        await addPlayer(formData);
      }
      setCurrentView('players');
      setEditingPlayer(null);
      setFormData({ name: '', wpm: 0, accuracy: 0 });
    } catch (error) {
      alert('Failed to save player');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setCurrentView(currentView === 'add' || currentView === 'edit' ? 'players' : 'dashboard');
    setEditingPlayer(null);
    setFormData({ name: '', wpm: 0, accuracy: 0 });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'STInumber1@novalicbes') {
      setIsAuthenticated(true);
      localStorage.setItem('typing_test_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('typing_test_admin_auth');
    setPassword('');
    setCurrentView('dashboard');
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-purple-900 flex items-center justify-center">
        <div className="bg-gradient-to-br from-navy-800/90 to-purple-800/90 rounded-xl shadow-2xl p-8 w-full max-w-md border border-purple-500/30 glow-effect">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-navy-500 rounded-full flex items-center justify-center mb-4 glow-effect">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-navy-300">Admin Access</h1>
            <p className="text-purple-300 mt-2">Enter password to access the admin dashboard</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-purple-200 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-navy-700/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-400"
                placeholder="Enter admin password"
                required
              />
              {loginError && (
                <p className="text-red-400 text-sm mt-2">{loginError}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-navy-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-navy-700 transition-all duration-200 font-medium glow-effect-hover"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Form View (Add/Edit)
  if (currentView === 'add' || currentView === 'edit') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-purple-900">
        <div className="bg-gradient-to-r from-navy-800/90 to-purple-800/90 shadow-lg border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 text-purple-300 hover:text-purple-100 transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back</span>
                </button>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-navy-300">
                  {currentView === 'add' ? 'Add New Player' : 'Edit Player'}
                </h1>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-colors duration-200 flex items-center space-x-2 text-purple-200"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSavePlayer}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-navy-600 text-white rounded-lg hover:from-purple-700 hover:to-navy-700 transition-all duration-200 flex items-center space-x-2 glow-effect-hover disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isProcessing ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-navy-800/90 to-purple-800/90 rounded-xl shadow-2xl p-8 border border-purple-500/30 glow-effect">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-purple-200 mb-2">Player Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-700/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-400"
                  placeholder="Enter player name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>Words Per Minute (WPM) *</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.wpm}
                  onChange={(e) => setFormData({ ...formData, wpm: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-navy-700/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-400"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>Accuracy (%) *</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.accuracy}
                  onChange={(e) => setFormData({ ...formData, accuracy: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-navy-700/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-400"
                  placeholder="0"
                />
                <p className="text-xs text-purple-400 mt-1">Must be between 0 and 100</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Players List View
  if (currentView === 'players') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-purple-900">
        <div className="bg-gradient-to-r from-navy-800/90 to-purple-800/90 shadow-lg border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center space-x-2 text-purple-300 hover:text-purple-100 transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-navy-300">Players</h1>
              </div>
              <button
                onClick={handleAddPlayer}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-navy-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-navy-700 transition-all duration-200 glow-effect-hover"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Player</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-navy-800/90 to-purple-800/90 rounded-xl shadow-2xl overflow-hidden border border-purple-500/30 glow-effect">
            {players.length === 0 ? (
              <div className="p-12 text-center">
                <Trophy className="h-16 w-16 text-purple-500 mx-auto mb-4 opacity-50" />
                <p className="text-purple-300 text-xl mb-2">No players yet</p>
                <p className="text-purple-400 text-sm mb-4">Add your first player to get started!</p>
                <button
                  onClick={handleAddPlayer}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-navy-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-navy-700 transition-all duration-200 glow-effect-hover"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Player</span>
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto custom-scrollbar">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-600/30 to-navy-600/30">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-purple-300 uppercase tracking-wider">WPM</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-purple-300 uppercase tracking-wider">Accuracy</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-500/10">
                      {players.map((player) => (
                        <tr key={player.id} className="hover:bg-purple-500/10 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-navy-500 text-white">
                              {player.rank || '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-white font-semibold">{player.name}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-purple-300 font-bold">{player.wpm}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-purple-300 font-semibold">{player.accuracy.toFixed(1)}%</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditPlayer(player)}
                                disabled={isProcessing}
                                className="p-2 text-purple-400 hover:text-purple-200 hover:bg-purple-500/20 rounded transition-colors duration-200"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePlayer(player.id)}
                                disabled={isProcessing}
                                className="p-2 text-red-400 hover:text-red-200 hover:bg-red-500/20 rounded transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden">
                  {players.map((player) => (
                    <div key={player.id} className="p-4 border-b border-purple-500/10 last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-navy-500 text-white">
                          Rank {player.rank || '—'}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditPlayer(player)}
                            disabled={isProcessing}
                            className="p-2 text-purple-400 hover:text-purple-200 hover:bg-purple-500/20 rounded transition-colors duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(player.id)}
                            disabled={isProcessing}
                            className="p-2 text-red-400 hover:text-red-200 hover:bg-red-500/20 rounded transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-white text-lg mb-2">{player.name}</h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-purple-400">WPM:</span>
                          <span className="ml-2 text-purple-200 font-bold">{player.wpm}</span>
                        </div>
                        <div>
                          <span className="text-purple-400">Accuracy:</span>
                          <span className="ml-2 text-purple-200 font-semibold">{player.accuracy.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-purple-900">
      <div className="bg-gradient-to-r from-navy-800/90 to-purple-800/90 shadow-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Trophy className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-navy-300">Typing Test Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="text-purple-300 hover:text-purple-100 transition-colors duration-200"
              >
                View Leaderboard
              </a>
              <button
                onClick={handleLogout}
                className="text-purple-300 hover:text-purple-100 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-navy-800/90 to-purple-800/90 rounded-xl shadow-lg p-6 border border-purple-500/30 glow-effect">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-navy-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-300">Total Players</p>
                <p className="text-2xl font-bold text-white">{players.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-navy-800/90 to-purple-800/90 rounded-xl shadow-lg p-6 border border-purple-500/30 glow-effect">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-navy-600 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-300">Average WPM</p>
                <p className="text-2xl font-bold text-white">
                  {players.length > 0 
                    ? (players.reduce((sum, p) => sum + p.wpm, 0) / players.length).toFixed(1)
                    : '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-navy-800/90 to-purple-800/90 rounded-xl shadow-lg p-6 border border-purple-500/30 glow-effect">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-navy-600 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-300">Average Accuracy</p>
                <p className="text-2xl font-bold text-white">
                  {players.length > 0 
                    ? (players.reduce((sum, p) => sum + p.accuracy, 0) / players.length).toFixed(1)
                    : '0'}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-navy-800/90 to-purple-800/90 rounded-xl shadow-lg p-6 border border-purple-500/30 glow-effect">
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-navy-300 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={handleAddPlayer}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-purple-500/20 rounded-lg transition-colors duration-200 text-purple-200"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add New Player</span>
            </button>
            <button
              onClick={() => setCurrentView('players')}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-purple-500/20 rounded-lg transition-colors duration-200 text-purple-200"
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Manage Players</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
