CREATE TABLE IF NOT EXISTS public.user_social_links
(
    id         uuid NOT NULL            DEFAULT uuid_generate_v4() PRIMARY KEY,
    platform   text NOT NULL,
    username   text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);