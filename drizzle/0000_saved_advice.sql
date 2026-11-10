CREATE TABLE IF NOT EXISTS saved_advice (
  id TEXT PRIMARY KEY NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('owl', 'kanye')),
  text TEXT NOT NULL CHECK (length(text) BETWEEN 1 AND 4000)
);
