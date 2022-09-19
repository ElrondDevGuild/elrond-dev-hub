CREATE TABLE IF NOT EXISTS public.users
(
    id          uuid NOT NULL            DEFAULT uuid_generate_v4() PRIMARY KEY,
    wallet      text NOT NULL UNIQUE,
    avatar_url  text NULL,
    name        text NULL,
    description text NULL,
    created_at  timestamp with time zone DEFAULT now() NOT NULL
);