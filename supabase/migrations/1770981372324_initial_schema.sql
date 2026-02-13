-- Create table: users
CREATE TABLE IF NOT EXISTS users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    email text UNIQUE NOT NULL,
    username text UNIQUE NOT NULL,
    display_name text,
    password text NOT NULL,
    avatar_url text,
    handle text,
    role text DEFAULT 'member' NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users (username);
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Create table: communities
CREATE TABLE IF NOT EXISTS communities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    name text NOT NULL,
    description text,
    category text NOT NULL,
    avatar_url text,
    banner_url text,
    member_count integer DEFAULT 0 NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE  INDEX IF NOT EXISTS idx_communities_category ON communities (category);
CREATE  INDEX IF NOT EXISTS idx_communities_featured ON communities (is_featured);
ALTER TABLE communities DISABLE ROW LEVEL SECURITY;

-- Create table: community_members
CREATE TABLE IF NOT EXISTS community_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    community_id uuid NOT NULL,
    user_id uuid NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    role text DEFAULT 'member' NOT NULL
);
CREATE  INDEX IF NOT EXISTS idx_community_members_community ON community_members (community_id);
CREATE  INDEX IF NOT EXISTS idx_community_members_user ON community_members (user_id);
ALTER TABLE community_members DISABLE ROW LEVEL SECURITY;

-- Create table: activities
CREATE TABLE IF NOT EXISTS activities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    user_id uuid NOT NULL,
    activity_type text NOT NULL,
    target_user_id uuid,
    target_community_id uuid,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE  INDEX IF NOT EXISTS idx_activities_user ON activities (user_id);
CREATE  INDEX IF NOT EXISTS idx_activities_created ON activities (created_at);
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;

-- Create table: music_tracks
CREATE TABLE IF NOT EXISTS music_tracks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    title text NOT NULL,
    artist text NOT NULL,
    album text,
    duration integer NOT NULL,
    audio_url text NOT NULL,
    cover_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE  INDEX IF NOT EXISTS idx_tracks_artist ON music_tracks (artist);
ALTER TABLE music_tracks DISABLE ROW LEVEL SECURITY;

-- Create table: playlists
CREATE TABLE IF NOT EXISTS playlists (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    is_public boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE  INDEX IF NOT EXISTS idx_playlists_user ON playlists (user_id);
ALTER TABLE playlists DISABLE ROW LEVEL SECURITY;

-- Create table: playlist_tracks
CREATE TABLE IF NOT EXISTS playlist_tracks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    playlist_id uuid NOT NULL,
    track_id uuid NOT NULL,
    position integer NOT NULL,
    added_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE  INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON playlist_tracks (playlist_id);
CREATE  INDEX IF NOT EXISTS idx_playlist_tracks_position ON playlist_tracks (playlist_id, position);
ALTER TABLE playlist_tracks DISABLE ROW LEVEL SECURITY;
