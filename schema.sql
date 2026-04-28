

CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'user',
    friend_ids  INTEGER[] DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activities (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        TEXT NOT NULL,
    title       TEXT NOT NULL,
    duration    INTEGER NOT NULL,
    distance    REAL,
    calories    INTEGER,
    date        TEXT NOT NULL,
    notes       TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exercise_types (
    id                  SERIAL PRIMARY KEY,
    name                TEXT UNIQUE NOT NULL,
    category            TEXT NOT NULL,
    calories_per_minute REAL NOT NULL DEFAULT 5,
    icon                TEXT NOT NULL DEFAULT '🎯',
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_types DISABLE ROW LEVEL SECURITY;
