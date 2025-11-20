/*
  # Create Typing Test Leaderboard

  1. New Tables
    - `players`
      - `id` (uuid, primary key)
      - `name` (text) - player name
      - `wpm` (decimal) - words per minute
      - `accuracy` (decimal) - accuracy percentage
      - `rank` (integer) - calculated rank based on WPM and accuracy
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on players table
    - Add policies for public read access
    - Add policies for authenticated admin access (insert, update, delete)
*/

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  wpm decimal(10,2) NOT NULL CHECK (wpm >= 0),
  accuracy decimal(5,2) NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
  rank integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for better performance on leaderboard queries
CREATE INDEX IF NOT EXISTS idx_players_rank ON players(rank DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_players_wpm ON players(wpm DESC);
CREATE INDEX IF NOT EXISTS idx_players_accuracy ON players(accuracy DESC);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read players"
  ON players
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated admin access
CREATE POLICY "Authenticated users can manage players"
  ON players
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger for players
CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate and update ranks
CREATE OR REPLACE FUNCTION update_player_ranks()
RETURNS void AS $$
BEGIN
  -- Update ranks based on WPM (primary) and accuracy (secondary) descending
  WITH ranked_players AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        ORDER BY wpm DESC, accuracy DESC, created_at ASC
      ) as new_rank
    FROM players
  )
  UPDATE players
  SET rank = ranked_players.new_rank
  FROM ranked_players
  WHERE players.id = ranked_players.id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update ranks when players are inserted or updated
CREATE OR REPLACE FUNCTION trigger_update_ranks()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_player_ranks();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for insert
CREATE TRIGGER update_ranks_on_insert
  AFTER INSERT ON players
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_ranks();

-- Create trigger for update
CREATE TRIGGER update_ranks_on_update
  AFTER UPDATE OF wpm, accuracy ON players
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_ranks();

-- Initial rank update for any existing players
SELECT update_player_ranks();

