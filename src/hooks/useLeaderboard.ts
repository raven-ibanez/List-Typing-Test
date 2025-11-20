import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Player, PlayerInput } from '../types';

export const useLeaderboard = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      
      // Fetch players ordered by rank (WPM desc, accuracy desc)
      const { data, error: fetchError } = await supabase
        .from('players')
        .select('*')
        .order('rank', { ascending: true, nullsLast: true });

      if (fetchError) throw fetchError;

      const formattedPlayers: Player[] = (data || []).map(player => ({
        id: player.id,
        name: player.name,
        wpm: parseFloat(player.wpm),
        accuracy: parseFloat(player.accuracy),
        rank: player.rank,
        created_at: player.created_at,
        updated_at: player.updated_at
      }));

      setPlayers(formattedPlayers);
      setError(null);
    } catch (err) {
      console.error('Error fetching players:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch players');
    } finally {
      setLoading(false);
    }
  };

  const addPlayer = async (player: PlayerInput) => {
    try {
      const { data, error: insertError } = await supabase
        .from('players')
        .insert({
          name: player.name,
          wpm: player.wpm,
          accuracy: player.accuracy
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Ranks are automatically updated by database trigger
      await fetchPlayers();
      return data;
    } catch (err) {
      console.error('Error adding player:', err);
      throw err;
    }
  };

  const updatePlayer = async (id: string, updates: Partial<PlayerInput>) => {
    try {
      const { error: updateError } = await supabase
        .from('players')
        .update({
          name: updates.name,
          wpm: updates.wpm,
          accuracy: updates.accuracy
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // Ranks are automatically updated by database trigger
      await fetchPlayers();
    } catch (err) {
      console.error('Error updating player:', err);
      throw err;
    }
  };

  const deletePlayer = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Ranks are automatically updated by database trigger
      await fetchPlayers();
    } catch (err) {
      console.error('Error deleting player:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPlayers();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('players-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players'
        },
        () => {
          fetchPlayers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    players,
    loading,
    error,
    addPlayer,
    updatePlayer,
    deletePlayer,
    refetch: fetchPlayers
  };
};

