import React from 'react';
import { Trophy, Zap, Target, Medal, Facebook } from 'lucide-react';
import { Player } from '../types';

interface LeaderboardProps {
  players: Player[];
  loading: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, loading }) => {
  const getRankIcon = (rank: number | null) => {
    if (rank === null) return null;
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-300" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return null;
  };

  const getRankBadgeColor = (rank: number | null) => {
    if (rank === null) return 'bg-gray-700 text-gray-300';
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
    if (rank <= 10) return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
    return 'bg-navy-700 text-gray-200';
  };

  const HeaderBar = () => (
    <div className="w-full bg-gradient-to-r from-navy-800/95 to-purple-800/95 border-b border-purple-500/30 py-2 md:py-3 px-3 md:px-4 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-purple-300 text-[10px] sm:text-xs md:text-sm text-center md:text-left leading-tight">
            Website of League of Innovative Students of Technology Organization
          </p>
          <a
            href="https://www.facebook.com/profile.php?id=61568713765317"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 md:space-x-2 text-purple-300 hover:text-purple-100 transition-colors duration-200 group shrink-0"
          >
            <Facebook className="h-3.5 w-3.5 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-[10px] sm:text-xs md:text-sm">Follow us on Facebook</span>
          </a>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <HeaderBar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <p className="text-purple-300 text-base md:text-lg">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <HeaderBar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <Trophy className="h-12 w-12 md:h-16 md:w-16 text-purple-500 mx-auto mb-4 opacity-50" />
            <p className="text-purple-300 text-lg md:text-xl mb-2">No players yet</p>
            <p className="text-purple-400 text-sm md:text-base">Be the first to join the leaderboard!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeaderBar />
      <div className="py-4 md:py-8 px-3 md:px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-navy-300 mb-2 md:mb-4 px-2">
              List Typing Test Leaderboard
            </h1>
            <p className="text-purple-300 text-sm md:text-lg px-2">Live rankings updated in real-time</p>
          </div>

        {/* Top 3 Podium */}
        {players.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* 2nd Place */}
            {players[1] && (
              <div className="order-2 md:order-1 transform hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-navy-700 to-navy-900 rounded-xl p-4 md:p-6 glow-effect border-2 border-purple-500/30">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 mb-3 md:mb-4">
                      <span className="text-xl md:text-2xl font-bold text-gray-900">2</span>
                    </div>
                    <h3 className="text-base md:text-xl font-bold text-white mb-2 truncate px-2">{players[1].name}</h3>
                    <div className="space-y-1.5 md:space-y-2">
                      <div className="flex items-center justify-center space-x-1.5 md:space-x-2">
                        <Zap className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
                        <span className="text-xl md:text-2xl font-bold text-yellow-400">{players[1].wpm}</span>
                        <span className="text-gray-400 text-xs md:text-sm">WPM</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1.5 md:space-x-2">
                        <Target className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
                        <span className="text-lg md:text-xl font-semibold text-purple-300">{players[1].accuracy.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {players[0] && (
              <div className="order-1 md:order-2 transform hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-5 md:p-8 glow-effect border-2 border-yellow-400/50 relative">
                  <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
                    <Trophy className="h-6 w-6 md:h-8 md:w-8 text-yellow-400" />
                  </div>
                  <div className="text-center mt-3 md:mt-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mb-3 md:mb-4">
                      <span className="text-2xl md:text-3xl font-bold text-yellow-900">1</span>
                    </div>
                    <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 truncate px-2">{players[0].name}</h3>
                    <div className="space-y-1.5 md:space-y-2">
                      <div className="flex items-center justify-center space-x-1.5 md:space-x-2">
                        <Zap className="h-5 w-5 md:h-6 md:w-6 text-yellow-300" />
                        <span className="text-2xl md:text-3xl font-bold text-yellow-300">{players[0].wpm}</span>
                        <span className="text-purple-200 text-xs md:text-sm">WPM</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1.5 md:space-x-2">
                        <Target className="h-5 w-5 md:h-6 md:w-6 text-yellow-300" />
                        <span className="text-lg md:text-2xl font-semibold text-yellow-200">{players[0].accuracy.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {players[2] && (
              <div className="order-3 transform hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-navy-700 to-navy-900 rounded-xl p-4 md:p-6 glow-effect border-2 border-purple-500/30">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 mb-3 md:mb-4">
                      <span className="text-xl md:text-2xl font-bold text-white">3</span>
                    </div>
                    <h3 className="text-base md:text-xl font-bold text-white mb-2 truncate px-2">{players[2].name}</h3>
                    <div className="space-y-1.5 md:space-y-2">
                      <div className="flex items-center justify-center space-x-1.5 md:space-x-2">
                        <Zap className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
                        <span className="text-xl md:text-2xl font-bold text-yellow-400">{players[2].wpm}</span>
                        <span className="text-gray-400 text-xs md:text-sm">WPM</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1.5 md:space-x-2">
                        <Target className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
                        <span className="text-lg md:text-xl font-semibold text-purple-300">{players[2].accuracy.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full Leaderboard Table - Desktop */}
        <div className="hidden md:block bg-gradient-to-br from-navy-800/90 to-navy-900/90 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600/30 to-navy-600/30 border-b border-purple-500/30">
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-purple-300 uppercase tracking-wider">Rank</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-purple-300 uppercase tracking-wider">Player</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm font-bold text-purple-300 uppercase tracking-wider">
                    <div className="flex items-center justify-center space-x-1 lg:space-x-2">
                      <Zap className="h-3 w-3 lg:h-4 lg:w-4" />
                      <span>WPM</span>
                    </div>
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm font-bold text-purple-300 uppercase tracking-wider">
                    <div className="flex items-center justify-center space-x-1 lg:space-x-2">
                      <Target className="h-3 w-3 lg:h-4 lg:w-4" />
                      <span>Accuracy</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {players.map((player, index) => (
                  <tr
                    key={player.id}
                    className="hover:bg-purple-500/10 transition-colors duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 lg:space-x-3">
                        {getRankIcon(player.rank)}
                        <span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-bold ${getRankBadgeColor(player.rank)}`}>
                          {player.rank || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="text-white font-semibold text-sm lg:text-lg truncate max-w-[200px]">{player.name}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-center">
                      <span className="text-purple-300 font-bold text-base lg:text-xl">{player.wpm}</span>
                      <span className="text-gray-400 text-xs lg:text-sm ml-1">WPM</span>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-center">
                      <span className="text-purple-300 font-semibold text-sm lg:text-lg">{player.accuracy.toFixed(1)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="bg-gradient-to-br from-navy-800/90 to-navy-900/90 rounded-xl p-4 border border-purple-500/20 glow-effect animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getRankIcon(player.rank)}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getRankBadgeColor(player.rank)}`}>
                    Rank {player.rank || '—'}
                  </span>
                </div>
              </div>
              <h3 className="text-white font-semibold text-base mb-3 truncate">{player.name}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <div>
                    <div className="text-purple-300 font-bold text-lg">{player.wpm}</div>
                    <div className="text-gray-400 text-xs">WPM</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-purple-400" />
                  <div>
                    <div className="text-purple-300 font-semibold text-lg">{player.accuracy.toFixed(1)}%</div>
                    <div className="text-gray-400 text-xs">Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

